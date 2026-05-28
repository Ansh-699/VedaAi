import { spawn } from "node:child_process";
import { env } from "../config/env.js";

export interface AIProvider {
  name: string;
  generate(input: { system: string; user: string }): Promise<string>;
}

const KIRO_TIMEOUT_MS = 60_000;

/**
 * Kiro provider — invokes `kiro-cli chat --no-interactive` in headless mode.
 *
 * The CLI emits chrome (warning lines, "> " prompt prefix, ANSI escapes,
 * trailing "▸ Credits: ... " telemetry). We strip all of that before
 * returning, so the parser sees a clean JSON blob.
 */
class KiroProvider implements AIProvider {
  name = "kiro";

  async generate({ system, user }: { system: string; user: string }) {
    // Wrap the user prompt so Kiro returns ONLY a JSON object.
    const prompt = [
      system,
      "",
      user,
      "",
      "Respond with ONLY the JSON object. No markdown fences, no explanations, no prose before or after.",
    ].join("\n");

    const args = ["chat", "--no-interactive", "--trust-tools="];
    if (env.KIRO_MODEL) args.push("--model", env.KIRO_MODEL);
    args.push(prompt);

    const stdout = await runKiroCli(args, {
      KIRO_API_KEY: env.KIRO_API_KEY,
      NO_COLOR: "1",
      TERM: "dumb",
    });

    const cleaned = cleanCliOutput(stdout);
    if (!cleaned) {
      throw new Error("Kiro returned empty response after cleaning");
    }
    return cleaned;
  }
}

function runKiroCli(
  args: string[],
  extraEnv: Record<string, string>,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("kiro-cli", args, {
      env: { ...process.env, ...extraEnv },
      stdio: ["ignore", "pipe", "pipe"],
    });

    const out: Buffer[] = [];
    const err: Buffer[] = [];
    let settled = false;

    child.stdout.on("data", (d: Buffer) => out.push(d));
    child.stderr.on("data", (d: Buffer) => err.push(d));

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      reject(new Error(`kiro-cli timed out after ${KIRO_TIMEOUT_MS / 1000}s`));
    }, KIRO_TIMEOUT_MS);

    child.on("error", (e) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(e);
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (code !== 0) {
        const stderr = Buffer.concat(err).toString("utf8");
        reject(new Error(`kiro-cli exited ${code}: ${stderr || "no stderr"}`));
        return;
      }
      resolve(Buffer.concat(out).toString("utf8"));
    });
  });
}

/**
 * Strip Kiro CLI's chrome:
 *   - ANSI escape sequences
 *   - "⚠️ WARNING: ..." / "WARNING: ..." lines
 *   - leading "> " prompt prefix and any language hint
 *   - trailing " ▸ Credits: 0.02 • Time: 3s " telemetry
 *   - markdown fences if Kiro decides to add them
 */
function cleanCliOutput(raw: string): string {
  // eslint-disable-next-line no-control-regex
  let text = raw.replace(/\x1B\[[0-9;]*[A-Za-z]/g, "");

  text = text
    .split(/\r?\n/)
    .filter(
      (line) =>
        !/^\s*(?:⚠️\s*)?WARNING:/i.test(line) &&
        !line.includes("Credits:") &&
        !line.includes("MCP "),
    )
    .join("\n");

  // Drop any leading "> json" / "> " prompt indicator the CLI prepends.
  text = text
    .replace(/^\s*>\s*\S+\s*\n/, "")
    .replace(/^\s*>\s*\n/, "");

  // Drop markdown fences if the model added them anyway.
  text = text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "");

  return text.trim();
}

class MockProvider implements AIProvider {
  name = "mock";

  async generate(_input: { system: string; user: string }) {
    return JSON.stringify({
      intro:
        "Here is your customized question paper based on the provided inputs.",
      school: "Delhi Public School, Sector-4, Bokaro",
      subject: "Science",
      class: "5th",
      timeAllowed: "45 minutes",
      maxMarks: 20,
      instructions: "All questions are compulsory unless stated otherwise.",
      sections: [
        {
          id: "A",
          title: "Section A",
          subtitle: "Short Answer Questions",
          instruction:
            "Attempt all questions. Each question carries 2 marks",
          questions: [
            { text: "Define electroplating. Explain its purpose.", difficulty: "Easy", marks: 2 },
            { text: "What is the role of a conductor in electrolysis?", difficulty: "Moderate", marks: 2 },
            { text: "Why does copper sulfate solution conduct electricity?", difficulty: "Easy", marks: 2 },
            { text: "Describe one chemical effect of electric current in daily life.", difficulty: "Moderate", marks: 2 },
            { text: "Explain why electric current is said to have chemical effects.", difficulty: "Moderate", marks: 2 },
          ],
        },
      ],
      answerKey: [
        "Electroplating is depositing a thin layer of metal on another metal using electric current.",
        "A conductor allows current flow, enabling ions to move and react at electrodes.",
        "Free copper and sulfate ions in the solution carry electric charge.",
        "Electroplating of silver on jewelry to prevent tarnishing.",
        "Current causes ion movement leading to chemical changes at electrodes.",
      ],
    });
  }
}

class ResilientKiroProvider implements AIProvider {
  name = "kiro+fallback";
  private kiro = new KiroProvider();
  private mock = new MockProvider();

  async generate(input: { system: string; user: string }) {
    try {
      return await this.kiro.generate(input);
    } catch (err) {
      console.error(
        "[ai] Kiro failed, falling back to mock:",
        (err as Error).message,
      );
      return this.mock.generate(input);
    }
  }
}

export function getProvider(): AIProvider {
  if (env.AI_PROVIDER === "mock") {
    console.log("[ai] using MockProvider");
    return new MockProvider();
  }
  if (env.AI_PROVIDER === "kiro" && !env.KIRO_API_KEY) {
    console.warn(
      "[ai] AI_PROVIDER=kiro but KIRO_API_KEY is empty — using mock",
    );
    return new MockProvider();
  }
  console.log(
    `[ai] using KiroProvider (kiro-cli headless${
      env.KIRO_MODEL ? `, model=${env.KIRO_MODEL}` : ""
    }) with mock fallback`,
  );
  return new ResilientKiroProvider();
}

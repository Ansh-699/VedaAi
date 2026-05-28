import { Plus } from "lucide-react";
import Link from "next/link";
import { EmptyAssignmentsArt } from "./EmptyAssignmentsArt";

export function EmptyAssignments() {
  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="flex w-[486px] max-w-full flex-col items-center gap-7">
        <div className="flex flex-col items-center gap-2">
          <EmptyAssignmentsArt className="h-[300px] w-[300px]" />

          <div className="flex w-full flex-col items-center gap-0.5 px-2">
            <h2
              className="text-[20px] font-bold leading-[140%] text-ink"
              style={{ letterSpacing: "-0.04em" }}
            >
              No assignments yet
            </h2>
            <p
              className="text-center text-[16px] font-normal leading-[140%]"
              style={{
                color: "rgba(94,94,94,0.8)",
                letterSpacing: "-0.04em",
              }}
            >
              Create your first assignment to start collecting and grading
              student submissions. You can set up rubrics, define marking
              criteria, and let AI assist with grading.
            </p>
          </div>
        </div>

        <Link
          href="/assignments/new"
          className="inline-flex h-[46px] items-center gap-1 rounded-full px-6 text-[16px] font-medium text-white transition hover:opacity-90"
          style={{
            background: "#181818",
            letterSpacing: "-0.04em",
          }}
        >
          <Plus className="h-5 w-5" strokeWidth={2} />
          Create Your First Assignment
        </Link>
      </div>
    </div>
  );
}

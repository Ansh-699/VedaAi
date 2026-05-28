"use client";

import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobilePageHeader } from "@/components/layout/MobilePageHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { useSettings } from "@/lib/store/settingsStore";
import { toast } from "@/components/ui/Toaster";

export default function SettingsPage() {
  const s = useSettings();

  function save() {
    toast("Settings saved", "success");
  }

  const body = (
    <div className="mx-auto flex max-w-[640px] flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1
          className="text-[22px] font-bold leading-[140%] text-ink"
          style={{ letterSpacing: "-0.04em" }}
        >
          Settings
        </h1>
        <p
          className="text-[14px] text-ink-muted"
          style={{ letterSpacing: "-0.02em" }}
        >
          Personalize VedaAI to match how you teach.
        </p>
      </header>

      <Section
        title="Defaults"
        subtitle="Pre-fill these whenever you create a new assignment"
      >
        <Field label="School name">
          <input
            value={s.schoolName}
            onChange={(e) => s.setField("schoolName", e.target.value)}
            className="h-11 w-full rounded-full bg-white px-5 text-[14px] text-ink focus:outline-none"
            style={{
              letterSpacing: "-0.02em",
              boxShadow:
                "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
            }}
          />
        </Field>
        <Field label="Default subject">
          <input
            value={s.defaultSubject}
            onChange={(e) => s.setField("defaultSubject", e.target.value)}
            placeholder="e.g., Science"
            className="h-11 w-full rounded-full bg-white px-5 text-[14px] text-ink placeholder:text-ink-muted focus:outline-none"
            style={{
              letterSpacing: "-0.02em",
              boxShadow:
                "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
            }}
          />
        </Field>
        <Field label="Default class / grade">
          <input
            value={s.defaultGrade}
            onChange={(e) => s.setField("defaultGrade", e.target.value)}
            placeholder="e.g., 5th"
            className="h-11 w-full rounded-full bg-white px-5 text-[14px] text-ink placeholder:text-ink-muted focus:outline-none"
            style={{
              letterSpacing: "-0.02em",
              boxShadow:
                "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
            }}
          />
        </Field>
      </Section>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            s.reset();
            toast("Reset to defaults", "info");
          }}
          className="text-[14px] font-medium text-ink-muted hover:text-ink"
          style={{ letterSpacing: "-0.02em" }}
        >
          Reset to defaults
        </button>
        <button
          type="button"
          onClick={save}
          className="inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[14px] font-medium text-white"
          style={{ background: "#181818", letterSpacing: "-0.02em" }}
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    <>
      <AppShell topbarTitle="Settings">
        <section className="flex-1 overflow-y-auto rounded-[16px] bg-white/30">
          {body}
        </section>
      </AppShell>

      <div className="relative flex min-h-screen flex-col gap-3 p-3 pb-28 md:hidden">
        <MobileTopBar />
        <MobilePageHeader title="Settings" />
        {body}
        <div className="fixed inset-x-3 bottom-3 z-20">
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-white p-5">
      <div className="flex flex-col gap-0.5">
        <h2
          className="text-[16px] font-bold text-ink"
          style={{ letterSpacing: "-0.04em" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-[13px] text-ink-muted"
            style={{ letterSpacing: "-0.02em" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-[13px] font-medium text-ink"
        style={{ letterSpacing: "-0.02em" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

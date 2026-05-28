import { EmptyAssignments } from "@/components/assignments/EmptyAssignments";
import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobileFab } from "@/components/layout/MobileFab";
import { MobileTopBar } from "@/components/layout/MobileTopBar";

export default function HomePage() {
  return (
    <>
      {/* Desktop */}
      <AppShell topbarTitle="Assignment">
        <section
          className="flex flex-1 items-center justify-center overflow-hidden rounded-[16px]"
          style={{ background: "transparent" }}
        >
          <EmptyAssignments />
        </section>
      </AppShell>

      {/* Mobile */}
      <div className="relative flex min-h-screen flex-col gap-6 p-3 pb-28 md:hidden">
        <MobileTopBar />

        <section className="flex flex-1 items-center justify-center">
          <EmptyAssignments />
        </section>

        <div className="pointer-events-none fixed bottom-[104px] right-5 z-20">
          <div className="pointer-events-auto">
            <MobileFab />
          </div>
        </div>

        <div className="fixed inset-x-3 bottom-3 z-10">
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}

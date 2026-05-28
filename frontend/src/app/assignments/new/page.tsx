import { CreateAssignmentForm } from "@/components/create/CreateAssignmentForm";
import { PageTitle } from "@/components/create/PageTitle";
import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobilePageHeader } from "@/components/layout/MobilePageHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";

export default function CreateAssignmentPage() {
  return (
    <>
      {/* Desktop */}
      <AppShell topbarTitle="Assignment">
        <section className="flex-1 overflow-y-auto rounded-[16px] bg-white/30">
          <div className="flex flex-col gap-6 p-6">
            <PageTitle
              title="Create Assignment"
              subtitle="Set up a new assignment for your students"
            />
            <div className="mx-auto w-full max-w-[720px]">
              <CreateAssignmentForm />
            </div>
          </div>
        </section>
      </AppShell>

      {/* Mobile */}
      <div className="relative flex min-h-screen flex-col gap-3 p-3 pb-28 md:hidden">
        <MobileTopBar />
        <MobilePageHeader title="Create Assignment" />
        <CreateAssignmentForm />
        <div className="h-24" />
        <div className="fixed inset-x-3 bottom-3 z-20">
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Assignment, AssignmentCard } from "@/components/assignments/AssignmentCard";
import { AssignmentsHeader } from "@/components/assignments/AssignmentsHeader";
import { BottomBlurFade } from "@/components/assignments/BottomBlurFade";
import { CreateAssignmentPill } from "@/components/assignments/CreateAssignmentPill";
import { EmptyAssignments } from "@/components/assignments/EmptyAssignments";
import { FilterSearchBar } from "@/components/assignments/FilterSearchBar";
import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobileFab } from "@/components/layout/MobileFab";
import { MobilePageHeader } from "@/components/layout/MobilePageHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { api } from "@/lib/api/client";
import { useAssignments } from "@/lib/store/assignmentsStore";

function fmtDate(s: string) {
  try {
    const d = new Date(s);
    return d.toLocaleDateString("en-GB").replace(/\//g, "-");
  } catch {
    return s;
  }
}

export default function AssignmentsListPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const setSidebarCount = useAssignments((s) => s.setCount);

  async function refresh() {
    try {
      const res = await api.listAssignments();
      setAssignments(
        res.items.map((a) => ({
          id: a._id,
          title: a.title,
          assignedOn: fmtDate(a.createdAt),
          due: fmtDate(a.dueDate),
        })),
      );
      setSidebarCount(res.items.length);
    } catch {
      // Backend offline — show empty state.
      setAssignments([]);
      setSidebarCount(0);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleDeleted(id: string) {
    setAssignments((list) => {
      const next = list.filter((a) => a.id !== id);
      setSidebarCount(next.length);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assignments;
    return assignments.filter((a) => a.title.toLowerCase().includes(q));
  }, [assignments, query]);

  return (
    <>
      {/* Desktop */}
      <AppShell topbarTitle="Assignment">
        <section className="relative flex flex-1 flex-col overflow-hidden rounded-[16px] bg-white/40">
          {loaded && assignments.length === 0 ? (
            <EmptyAssignments />
          ) : (
            <>
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 pb-32">
                <AssignmentsHeader />
                <FilterSearchBar query={query} onQueryChange={setQuery} />
                {filtered.length === 0 ? (
                  <p
                    className="px-2 py-8 text-center text-[14px] text-ink-muted"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    No assignments match &quot;{query}&quot;.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {filtered.map((a) => (
                      <AssignmentCard
                        key={a.id}
                        assignment={a}
                        onDeleted={handleDeleted}
                      />
                    ))}
                  </div>
                )}
              </div>

              <BottomBlurFade height={180} />

              <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center">
                <div className="pointer-events-auto">
                  <CreateAssignmentPill />
                </div>
              </div>
            </>
          )}
        </section>
      </AppShell>

      {/* Mobile */}
      <div className="relative flex min-h-screen flex-col gap-3 p-3 pb-28 md:hidden">
        <MobileTopBar />
        <MobilePageHeader title="Assignments" />
        {loaded && assignments.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyAssignments />
          </div>
        ) : (
          <>
            <FilterSearchBar
              variant="mobile"
              query={query}
              onQueryChange={setQuery}
            />
            <div className="flex flex-col gap-3">
              {filtered.map((a) => (
                <AssignmentCard
                  key={a.id}
                  assignment={a}
                  onDeleted={handleDeleted}
                />
              ))}
            </div>
            <div className="h-24" />

            <BottomBlurFade height={180} position="fixed" />
          </>
        )}

        <div className="pointer-events-none fixed bottom-[104px] right-5 z-30">
          <div className="pointer-events-auto">
            <MobileFab />
          </div>
        </div>

        <div className="fixed inset-x-3 bottom-3 z-20">
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}

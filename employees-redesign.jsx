import React, { useState, useMemo } from "react";
import { Search, Plus, Eye, SquarePen, Trash2, X, ShieldCheck, IdCard } from "lucide-react";

/* ---------- design tokens ---------------------------------------------
   surface   #F6F6F3  paper-grey background, not marketing cream
   panel     #FFFFFF
   ink       #16212E  deep navy-charcoal text
   steel     #24405E  structural navy — authority / uniform
   brass     #B8912E  credential-gold accent — badge / insignia, used sparingly
   danger    #A63A32  muted red, delete / expiring docs
   ok        #2F6F52  muted green, active status
   line      #E4E2DC  hairline borders
   rank colors (mirrors real badge/uniform colour-coding):
     GUARD       steel   #24405E
     SUPERVISOR  brass   #B8912E
     MANAGER     plum    #5B4B8A
     HR          teal    #2C6E6B
------------------------------------------------------------------------ */

const RANK = {
  GUARD: { color: "#24405E", label: "Guard" },
  SUPERVISOR: { color: "#B8912E", label: "Supervisor" },
  MANAGER: { color: "#5B4B8A", label: "Manager" },
  HR: { color: "#2C6E6B", label: "HR" },
};

const MOCK_EMPLOYEES = [
  { id: 1, name: "Ahmed Al Marri", type: "GUARD", fileNumber: "FN-1042", salary: 3200, emaratesId: "784-1990-1234567-1", psbdId: "PSBD-88214", nsiCert: true, passport: true, docsOk: true },
  { id: 2, name: "Yusuf Al Kaabi", type: "GUARD", fileNumber: "FN-1043", salary: 3200, emaratesId: "784-1988-7765432-2", psbdId: "PSBD-88215", nsiCert: true, passport: false, docsOk: false },
  { id: 3, name: "Fatima Al Nuaimi", type: "SUPERVISOR", fileNumber: "FN-0512", salary: 5400, emaratesId: "784-1985-1122334-5", psbdId: "PSBD-77012", nsiCert: true, passport: true, docsOk: true },
  { id: 4, name: "Omar Al Suwaidi", type: "MANAGER", fileNumber: "FN-0110", salary: 9800, emaratesId: "784-1979-9988776-3", psbdId: "PSBD-51002", nsiCert: true, passport: true, docsOk: true },
  { id: 5, name: "Mariam Al Shamsi", type: "HR", fileNumber: "FN-0208", salary: 6100, emaratesId: "784-1991-4455667-9", psbdId: "PSBD-60044", nsiCert: false, passport: true, docsOk: false },
  { id: 6, name: "Khalid Al Zaabi", type: "GUARD", fileNumber: "FN-1044", salary: 3200, emaratesId: "784-1993-3344556-7", psbdId: "PSBD-88216", nsiCert: true, passport: true, docsOk: true },
];

function RankTag({ type }) {
  const r = RANK[type] ?? RANK.GUARD;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: `${r.color}1A`, color: r.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: r.color }} />
      {r.label}
    </span>
  );
}

function ConfirmDelete({ name, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "#16212E99" }}>
      <div className="w-full max-w-sm rounded-xl bg-white p-6" style={{ boxShadow: "0 20px 40px -12px rgba(22,33,46,0.35)" }}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#A63A321A" }}>
            <Trash2 size={18} style={{ color: "#A63A32" }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: "#16212E", fontFamily: "'IBM Plex Sans Condensed', sans-serif" }}>Remove employee</p>
          </div>
        </div>
        <p className="mb-6 text-sm leading-relaxed" style={{ color: "#5B6572" }}>
          This removes <span className="font-medium" style={{ color: "#16212E" }}>{name}</span> from the roster and their attendance/payroll history stays linked to the record. This can't be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: "#16212E", backgroundColor: "#F6F6F3" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#A63A32" }}
          >
            Remove employee
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmployeesRedesign() {
  const [query, setQuery] = useState("");
  const [rankFilter, setRankFilter] = useState("ALL");
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesQuery =
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.fileNumber.toLowerCase().includes(query.toLowerCase());
      const matchesRank = rankFilter === "ALL" || e.type === rankFilter;
      return matchesQuery && matchesRank;
    });
  }, [employees, query, rankFilter]);

  const missingDocsCount = employees.filter((e) => !e.docsOk).length;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F6F6F3" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      <div className="mx-auto max-w-6xl px-6 py-10" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider" style={{ color: "#B8912E" }}>
              <ShieldCheck size={14} />
              Roster · Security Personnel
            </div>
            <h1
              className="text-3xl font-semibold"
              style={{ color: "#16212E", fontFamily: "'IBM Plex Sans Condensed', sans-serif", letterSpacing: "-0.01em" }}
            >
              Employees
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#5B6572" }}>
              {employees.length} on record
              {missingDocsCount > 0 && (
                <>
                  {" · "}
                  <span style={{ color: "#A63A32" }}>{missingDocsCount} missing required documents</span>
                </>
              )}
            </p>
          </div>

          <button
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-transform active:scale-[0.98]"
            style={{ backgroundColor: "#24405E" }}
          >
            <Plus size={16} />
            Add employee
          </button>
        </div>

        {/* controls */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9AA2AC" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or file number"
              className="w-full rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none transition-shadow"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E4E2DC", color: "#16212E" }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["ALL", "GUARD", "SUPERVISOR", "MANAGER", "HR"].map((r) => {
              const active = rankFilter === r;
              const color = r === "ALL" ? "#16212E" : RANK[r].color;
              return (
                <button
                  key={r}
                  onClick={() => setRankFilter(r)}
                  className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                  style={
                    active
                      ? { backgroundColor: color, color: "#FFFFFF" }
                      : { backgroundColor: "#FFFFFF", color: "#5B6572", border: "1px solid #E4E2DC" }
                  }
                >
                  {r === "ALL" ? "All" : RANK[r].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* roster */}
        <div className="overflow-hidden rounded-xl" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E4E2DC" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <IdCard size={28} style={{ color: "#B9BEC5" }} />
              <p className="text-sm font-medium" style={{ color: "#16212E" }}>No matching employees</p>
              <p className="text-xs" style={{ color: "#9AA2AC" }}>Try a different name, file number, or clear the filter.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #E4E2DC" }}>
                  {["", "Employee", "File No.", "Emirates ID", "Salary", "Docs", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide"
                      style={{ color: "#9AA2AC" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const rank = RANK[e.type] ?? RANK.GUARD;
                  return (
                    <tr key={e.id} className="group" style={{ borderBottom: "1px solid #F0EFEA" }}>
                      <td className="w-1.5 p-0">
                        <div className="h-full w-1.5" style={{ backgroundColor: rank.color }} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: "#16212E" }}>{e.name}</p>
                        <div className="mt-0.5"><RankTag type={e.type} /></div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#5B6572", fontFamily: "'IBM Plex Mono', monospace" }}>
                        {e.fileNumber}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#5B6572", fontFamily: "'IBM Plex Mono', monospace" }}>
                        {e.emaratesId}
                      </td>
                      <td className="px-4 py-3" style={{ color: "#16212E" }}>
                        AED {e.salary.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                          style={
                            e.docsOk
                              ? { backgroundColor: "#2F6F521A", color: "#2F6F52" }
                              : { backgroundColor: "#A63A321A", color: "#A63A32" }
                          }
                        >
                          {e.docsOk ? "Complete" : "Missing"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button className="rounded-md p-1.5 transition-colors hover:bg-gray-50" style={{ color: "#5B6572" }}>
                            <Eye size={15} />
                          </button>
                          <button className="rounded-md p-1.5 transition-colors hover:bg-gray-50" style={{ color: "#5B6572" }}>
                            <SquarePen size={15} />
                          </button>
                          <button
                            onClick={() => setPendingDelete(e)}
                            className="rounded-md p-1.5 transition-colors hover:bg-gray-50"
                            style={{ color: "#A63A32" }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {pendingDelete && (
        <ConfirmDelete
          name={pendingDelete.name}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            setEmployees((prev) => prev.filter((e) => e.id !== pendingDelete.id));
            setPendingDelete(null);
          }}
        />
      )}
    </div>
  );
}

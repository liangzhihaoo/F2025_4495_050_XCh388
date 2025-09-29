import React, { useState, useRef, useEffect } from "react";
import { IcSearch, IcBell, IcChevronDown } from "./Icons";

export function Topbar() {
  const [open, setOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ddRef.current || ddRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4">
      {/* search box */}
      <div className="relative w-full max-w-xl">
        <IcSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search..."
          className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-sm outline-none focus:border-indigo-300 focus:bg-white"
        />
      </div>

      {/* alert icon and avatar */}
      <div className="ml-4 flex items-center gap-3">
        <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Alerts">
          <IcBell />
        </button>

        <div className="relative" ref={ddRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50"
          >
            <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-xs">A</span>
            <span className="text-sm text-slate-700">Admin</span>
            <IcChevronDown className="text-slate-400" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border bg-white shadow-lg">
              <button className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50">Profile</button>
              <button className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50">Settings</button>
              <div className="my-1 h-px bg-slate-100" />
              <button className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import React from "react";

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-white p-4">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="mt-3 h-8 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 lg:col-span-2">
          <div className="mb-3 h-4 w-32 rounded bg-slate-200" />
          <div className="h-48 rounded bg-slate-100" />
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-3 h-4 w-40 rounded bg-slate-200" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 w-full rounded bg-slate-100" />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="mb-3 h-4 w-28 rounded bg-slate-200" />
        <div className="grid grid-cols-6 items-end gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 rounded bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

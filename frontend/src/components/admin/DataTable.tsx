import React from "react";

type Column<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
};

/**
 * DataTable
 * Generic table renderer used across admin pages.
 * Keeps admin UI consistent.
 */
export default function DataTable<T>({ columns, rows, rowKey }: Props<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black/40">
            <tr className="text-left text-gray-300">
              {columns.map((c, idx) => (
                <th key={idx} className={`px-4 py-3 font-semibold ${c.className || ""}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((r, i) => (
              <tr key={rowKey(r, i)} className="hover:bg-white/5 transition">
                {columns.map((c, idx) => (
                  <td key={idx} className={`px-4 py-3 ${c.className || ""}`}>
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

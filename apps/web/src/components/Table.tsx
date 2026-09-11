import type { ReactNode } from "react";

type TableColumn<T> = {
  key: keyof T;
  label: string;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
};

export function Table<T extends Record<string, ReactNode>>({ columns, data }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="bg-surface-raised">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 font-semibold text-muted">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="transition-colors hover:bg-surface-raised">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3 text-foreground">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

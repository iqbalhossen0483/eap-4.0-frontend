"use client";
import { useState, type ReactNode } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  skeletonRows?: number;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  size?: "sm" | "md" | "lg";
  onRowClick?: (row: T) => void;
  onSort?: (key: string, dir: "asc" | "desc") => void;
  rowKey?: (row: T) => string;
  className?: string;
}

const sizeClasses = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-3 text-sm",
  lg: "px-6 py-4 text-base",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Table<T>({
  data,
  columns,
  isLoading,
  skeletonRows = 5,
  emptyMessage = "No data to display",
  striped,
  hoverable = true,
  size = "md",
  onRowClick,
  onSort,
  rowKey,
  className,
}: TableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(
    null,
  );

  function handleSort(key: string) {
    const dir = sort?.key === key && sort.dir === "asc" ? "desc" : "asc";
    setSort({ key, dir });
    onSort?.(key, dir);
  }

  const cellPad = sizeClasses[size];

  return (
    <table className={cn("w-full border-collapse text-left", className)}>
      <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={cn(
                "font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400",
                cellPad,
                col.width,
                col.align && alignClasses[col.align],
                col.sortable && "cursor-pointer select-none",
              )}
              onClick={col.sortable ? () => handleSort(col.key) : undefined}
            >
              <span className="inline-flex items-center gap-1">
                {col.header}
                {col.sortable &&
                  (sort?.key === col.key ? (
                    sort.dir === "asc" ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )
                  ) : (
                    <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                  ))}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          Array.from({ length: skeletonRows }).map((_, i) => (
            <tr
              key={i}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              {columns.map((col) => (
                <td key={col.key} className={cellPad}>
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </td>
              ))}
            </tr>
          ))
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>
              <EmptyState title={emptyMessage} />
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr
              key={rowKey ? rowKey(row) : i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-gray-100 transition-colors dark:border-gray-800",
                striped && i % 2 === 1 && "bg-gray-50/50 dark:bg-gray-800/30",
                hoverable && "hover:bg-primary-50 dark:hover:bg-gray-700/50",
                onRowClick && "cursor-pointer",
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "text-gray-800 dark:text-gray-200",
                    cellPad,
                    col.align && alignClasses[col.align],
                  )}
                >
                  {col.render
                    ? col.render(row)
                    : col.accessor
                      ? String(row[col.accessor] ?? "")
                      : null}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

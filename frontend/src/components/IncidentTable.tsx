import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import type { Incident } from "../types/incident";
import StatusBadge from "./StatusBadge";

type Props = {
  data: Incident[];
  onSortChange: (column: string) => void;
};

export default function IncidentTable({ data, onSortChange }: Props) {
  const columns: ColumnDef<Incident>[] = [
    {
      accessorKey: "title",
      header: () => (
        <button onClick={() => onSortChange("title")}>Title</button>
      ),
      cell: ({ row }) => (
        <Link
          to={`/incident/${row.original.id}`}
          className="incident-title-link"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "severity",
      header: () => (
        <button onClick={() => onSortChange("severity")}>Severity</button>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <button onClick={() => onSortChange("status")}>Status</button>
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "created_at",
      header: () => (
        <button onClick={() => onSortChange("created_at")}>
          Created At
        </button>
      ),
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: (info) => (info.getValue() as string) || "—",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="incident-table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

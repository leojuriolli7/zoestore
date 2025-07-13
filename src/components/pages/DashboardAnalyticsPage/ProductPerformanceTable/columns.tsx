"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Analytics } from "@/query/analytics/types";
import Image from "next/image";
import Link from "next/link";

export const columns: ColumnDef<Analytics.ProductPerformance>[] = [
  {
    accessorKey: "name",
    header: "Produto",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <Link
          href={`/products/${row.original.slug}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src={row.original.medias[0]?.url || ""}
            alt={row.original.name}
            width={40}
            height={40}
            className="rounded-md"
          />
        </Link>

        <p className="hidden sm:block">{row.original.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "views",
    header: "Visualizações",
  },
  {
    accessorKey: "addToBag",
    header: "Adicionados à Sacola",
  },
  {
    accessorKey: "whatsappClicks",
    header: "Cliques no WhatsApp",
  },
  {
    accessorKey: "conversionRate",
    header: "Taxa de Conversão",
    cell: ({ row }) => `${row.original.conversionRate.toFixed(2)}%`,
  },
];

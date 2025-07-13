"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Analytics } from "@/query/analytics/types";

export const columns: ColumnDef<Analytics.TagPerformance>[] = [
  {
    accessorKey: "name",
    header: "Categoria",
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

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ViewsAndConversionsChartProps {
  data: {
    date: string;
    views: number;
    conversions: number;
  }[];
}

export function ViewsAndConversionsChart({
  data,
}: ViewsAndConversionsChartProps) {
  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Visualizações e Conversões</CardTitle>

        <CardDescription>
          Total de visualizações e cliques para o WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                format(new Date(date), "dd/MM", { locale: ptBR })
              }
            />

            <YAxis />

            <Tooltip
              contentStyle={{
                background: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "var(--radius-md)",
              }}
              labelFormatter={(label) =>
                format(new Date(label), "dd/MM/yyyy", { locale: ptBR })
              }
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="views"
              stroke="var(--chart-1)"
              name="Visualizações"
            />
            <Line
              type="monotone"
              dataKey="conversions"
              stroke="var(--chart-2)"
              name="Conversões"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

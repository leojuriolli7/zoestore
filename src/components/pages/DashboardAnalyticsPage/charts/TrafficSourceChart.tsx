"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface TrafficSourceChartProps {
  data: {
    referrer: string;
    views: number;
    conversionRate: number;
  }[];
}

export function TrafficSourceChart({ data }: TrafficSourceChartProps) {
  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Origem do Tráfego</CardTitle>
        <CardDescription>
          Entenda as fontes que direcionam visitantes para sua página.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            views: {
              label: "Visualizações",
            },
          }}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="views"
              nameKey="referrer"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

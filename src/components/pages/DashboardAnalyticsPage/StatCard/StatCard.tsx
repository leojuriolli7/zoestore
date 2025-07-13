import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  previousValue,
  loading,
  tooltip,
  isPercent = false,
}: {
  title: string;
  isPercent?: boolean;
  value: number;
  previousValue: number;
  loading: boolean;
  tooltip?: string;
}) {
  const percentageChange =
    previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0;

  const isPositive = percentageChange >= 0;

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}

          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">
              {value.toFixed(2)}
              {isPercent ? "%" : ""}
            </p>
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-semibold",
                isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {isPositive ? <ArrowUp /> : <ArrowDown />}
              {percentageChange.toFixed(2)}%
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

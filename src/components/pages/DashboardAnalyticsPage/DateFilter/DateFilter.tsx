"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalyticsDateStore, DateFilterMode } from "../store";
import { DateRangePicker } from "./DateRangePicker";

export function DateFilter() {
  const { mode, setMode } = useAnalyticsDateStore();

  const handleModeChange = (value: DateFilterMode) => {
    setMode(value);
  };

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-2">
        <p className="font-medium pointer-events-none select-none leading-none text-sm">
          Filtrar por período
        </p>
        <Select value={mode} onValueChange={handleModeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-week">Última semana</SelectItem>
            <SelectItem value="last-month">Último mês</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {mode === "custom" && <DateRangePicker />}
    </div>
  );
}

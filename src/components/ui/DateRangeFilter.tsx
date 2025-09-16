import { Button } from "./button";
import { Label } from "./label";
import { DatePicker } from "./date-picker";

interface DateRangeFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onGenerate: () => void;
  loading?: boolean;
  buttonText?: string;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onGenerate,
  loading,
  buttonText = "Generate",
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-2">
        <Label htmlFor="start-date">Start date</Label>
        <DatePicker date={startDate} onDateChange={onStartDateChange} placeholder="Select start date" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end-date">End date</Label>
        <DatePicker date={endDate} onDateChange={onEndDateChange} placeholder="Select end date" />
      </div>
      <Button
        onClick={onGenerate}
        className="bg-primary h-10 text-primary-foreground"
        disabled={loading}
      >
        {loading ? "Generating..." : buttonText}
      </Button>
    </div>
  );
}

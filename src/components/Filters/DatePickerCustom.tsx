import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
} from "react-aria-components";
import type { ButtonProps, PopoverProps } from "react-aria-components";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  CalendarDate,
} from "@internationalized/date";

import type { SermonData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useNanostoreURLSync } from "@/lib/hooks/useNanostoreURLSync";

/* -------------------------------------------------------------------------- */
/*                                 Types                                       */
/* -------------------------------------------------------------------------- */
interface DatePickerCustomProps {
  data: SermonData[];
  type: "from" | "to";
}

/* -------------------------------------------------------------------------- */
/*                               DatePickerCustom                              */
/* -------------------------------------------------------------------------- */
const DatePickerCustom: React.FC<DatePickerCustomProps> = ({ type, data }) => {
  const min = getOldestSermonDate(data);
  const max = today(getLocalTimeZone());

  const label = type === "from" ? "From" : "To";

  const fromValue = useNanostoreURLSync<CalendarDate>("from");
  const toValue = useNanostoreURLSync<CalendarDate>("to");

  const value = type === "from" ? fromValue.value : toValue.value;
  const setValue = type === "from" ? fromValue.setValue : toValue.setValue;
  const otherValue = type === "from" ? toValue.value : fromValue.value;

  /* ------------------------------------------------------------------------ */
  /*                            Clamp date to valid range                       */
  /* ------------------------------------------------------------------------ */
  const clampValue = (val: CalendarDate | null) => {
    if (!val) return;

    let clamped = val;
    if (type === "from" && otherValue && val > otherValue) clamped = otherValue;
    if (type === "to" && otherValue && val < otherValue) clamped = otherValue;
    if (val < min) clamped = min;
    if (val > max) clamped = max;

    setValue(clamped);
  };

  return (
    <DatePicker
      className="flex"
      value={value}
      onChange={setValue}
      minValue={type === "from" ? min : (otherValue ?? min)}
      maxValue={type === "to" ? max : (otherValue ?? max)}
      onBlur={() => clampValue(value)}
    >
      <Label className="bg-muted border-muted-foreground/20 flex h-full min-w-24 flex-1/4 cursor-default items-center rounded-l-md border px-4 text-sm select-none sm:flex-1">
        {label}
      </Label>
      <Group
        className={cn(
          "bg-muted group-open:bg-secondary text-muted-foreground border-muted-foreground/20 ring-muted-foreground focus-visible:ring-primary flex flex-[65%] rounded-md rounded-l-none border pl-3 shadow-md transition focus-visible:ring-2",
          value && "text-foreground",
        )}
      >
        <DateInput className="flex flex-1 py-2">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="focus:ring-accent hover:bg-accent hover:text-accent-foreground rounded-xs px-0.5 text-sm tabular-nums caret-transparent outline-hidden placeholder-shown:italic focus:ring-2"
            />
          )}
        </DateInput>
        <Button
          className={cn(
            "pressed:bg-accent hover:bg-accent hover:text-accent-foreground border-l-muted-foreground/20 ring-primary text-muted-foreground flex items-center rounded-r-md border-0 bg-transparent px-3 outline-hidden transition focus-visible:ring-2",
            value && "text-foreground",
          )}
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </Group>
      <MyPopover>
        <Dialog className="text-foreground bg-muted p-6">
          <Calendar>
            <header className="flex w-full items-center gap-1 px-1 pb-4">
              <Heading className="ml-2 flex-1" />
              <RoundButton slot="previous">
                <ChevronLeft />
              </RoundButton>
              <RoundButton slot="next">
                <ChevronRight />
              </RoundButton>
            </header>
            <CalendarGrid className="border-separate border-spacing-1">
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell className="text-muted-foreground text-xs font-semibold">
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className="outside-month:text-muted-foreground/50 selected:bg-foreground selected:text-background hover:border-primary disabled:text-muted-foreground/50 flex h-9 w-9 cursor-default items-center justify-center text-sm hover:border-2"
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </MyPopover>
    </DatePicker>
  );
};

/* -------------------------------------------------------------------------- */
/*                             RoundButton Component                            */
/* -------------------------------------------------------------------------- */
function RoundButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className="pressed:bg-accent hover:bg-secondary hover:text-secondary-foreground text-muted-foreground ring-primary disabled:text-muted-foreground/50 flex h-9 w-9 cursor-default items-center justify-center rounded-full border-0 bg-transparent outline-hidden focus-visible:ring-1"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                               Popover Wrapper                               */
/* -------------------------------------------------------------------------- */
function MyPopover(props: PopoverProps) {
  return (
    <Popover
      {...props}
      className={({ isEntering, isExiting }) =>
        `overflow-auto rounded-md bg-transparent drop-shadow-lg ${
          isEntering
            ? "animate-in fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 duration-200 ease-out"
            : ""
        } ${
          isExiting
            ? "animate-out fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 duration-150 ease-in"
            : ""
        } `
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                         Utility: Oldest Sermon Date                         */
/* -------------------------------------------------------------------------- */
const getOldestSermonDate = (data: SermonData[]) => {
  const sorted = data.toSorted(
    (a, b) => a.data.date.valueOf() - b.data.date.valueOf(),
  );

  const oldest = sorted[0].data.date;

  const oldestWithOffset = new Date(
    oldest.valueOf() + oldest.getTimezoneOffset() * 60 * 1000,
  );

  const oldestParsed = parseAbsoluteToLocal(oldestWithOffset.toISOString());

  return new CalendarDate(
    oldestParsed.year,
    oldestParsed.month,
    oldestParsed.day,
  );
};

export default DatePickerCustom;

import { CalendarDate } from "@internationalized/date";

export const toCalendarDate = (input: Date | string | number): CalendarDate => {
  let date: Date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string" || typeof input === "number") {
    date = new Date(input);
  } else {
    throw new Error("Invalid input type for CalendarDate conversion");
  }

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
};

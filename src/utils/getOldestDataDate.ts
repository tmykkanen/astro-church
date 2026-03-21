import type { BlogData, SermonData } from "@/data/types";

const getOldestDataDate = (data: SermonData[] | BlogData[]): string => {
  if (!data) throw new Error("Data is undefined in getOldestDataDate");

  const oldestItem = data.toSorted(
    (a, b) => a.data.date.valueOf() - b.data.date.valueOf(),
  )[0];

  return new Date(
    oldestItem.data.date.valueOf() +
      oldestItem.data.date.getTimezoneOffset() * 60 * 1000,
  )
    .toISOString()
    .slice(0, 10);
};

export default getOldestDataDate;

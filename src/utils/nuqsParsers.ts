import { parseAsString } from "nuqs";

export const queryParsers = {
  searchInput: parseAsString.withDefault(""),
  seriesSelection: parseAsString.withDefault(""),
  preacherSelection: parseAsString.withDefault(""),
  tagSelection: parseAsString.withDefault(""),
  fromDate: parseAsString.withDefault(""),
  toDate: parseAsString.withDefault(""),
};

export const queryUrlKeys = {
  searchInput: "q",
  seriesSelection: "series",
  preacherSelection: "preacher",
  tagSelection: "tags",
  fromDate: "from",
  toDate: "to",
};

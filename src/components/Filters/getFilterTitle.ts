import type { BlogData, PreacherData, SeriesData } from "@/lib/types";

interface Params {
  blogSearchTerm?: string;
  sermonSearchTerm?: string;
  tag?: string;
  series?: string;
  preacher?: string;
  from?: Date;
  to?: Date;
  allWritings?: BlogData[];
  allSeriesData?: SeriesData[];
  allPreachersData?: PreacherData[];
}

export const getFilterTitle = ({
  blogSearchTerm,
  sermonSearchTerm,
  tag,
  series,
  preacher,
  from,
  to,
  allWritings,
  allSeriesData,
  allPreachersData,
}: Params) => {
  if (blogSearchTerm) return `Posts matching ${blogSearchTerm}`;
  if (tag) return `Posts tagged with ${tag}`;
  if (allWritings) return "All Posts";

  if (sermonSearchTerm) return `Sermons matching ${sermonSearchTerm}`;
  if (series && allSeriesData)
    return `Sermons from ${
      allSeriesData.find((i) => i.id === series)?.data.title
    }`;
  if (preacher && allPreachersData)
    return `Sermons by ${
      allPreachersData.find((i) => i.id === preacher)?.data.name
    }`;

  if (from && to)
    return `Sermons between ${from.toString()} and ${to.toString()}`;
  if (from) return `Sermons after ${from.toString()}`;
  if (to) return `Sermons before ${to.toString()}`;

  return "All Sermons";
};

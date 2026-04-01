import type { CollectionEntry as AstroCollectionEntry } from "astro:content";

// DATA
export type BlogData = AstroCollectionEntry<"blog">;
export type SeriesData = AstroCollectionEntry<"series">;
export type PreacherData = AstroCollectionEntry<"preachers">;
export interface SermonData extends AstroCollectionEntry<"sermons"> {
  series: SeriesData;
  preacher: PreacherData;
}

export const isSermonData = (
  data: SermonData | BlogData,
): data is SermonData => {
  return data.collection === "sermons";
};

export const isBlogData = (data: SermonData | BlogData): data is BlogData => {
  return data.collection === "blog";
};

// MENU
export interface MenuItem {
  path: string;
  label: string;
  order: number;
  type: string | null;
  submenu: MenuItem[];
}

// PATHS
export type DynamicPath = {
  label: string;
  path: string;
};

export type Paths = {
  blog: DynamicPath | undefined;
  sermons: DynamicPath | undefined;
  events: DynamicPath | undefined;
};

// SCRIPTURE
export type ParsedRef = {
  osis: string | null;
  text: string | null;
  error: string | null;
};

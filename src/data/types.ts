import type { DateValue } from "@internationalized/date";
import type { CollectionEntry as AstroCollectionEntry } from "astro:content";

export type BlogData = AstroCollectionEntry<"blog">;
export type SeriesData = AstroCollectionEntry<"series">;
export type PreacherData = AstroCollectionEntry<"preachers">;
export interface SermonData extends AstroCollectionEntry<"sermons"> {
  series: SeriesData;
  preacher: PreacherData;
}

type CollectionArray =
  | SeriesData[]
  | PreacherData[]
  | SermonData[]
  | BlogData[]
  | string[];

type CollectionEntry =
  | SeriesData
  | PreacherData
  | SermonData
  | BlogData
  | string;

// Helper functions for type narrowing
export const isSeriesCollection = (
  data: CollectionArray,
): data is SeriesData[] => {
  return data.length > 0 && (data[0] as SeriesData).collection === "series";
};

export const isPreacherCollection = (
  data: CollectionArray,
): data is PreacherData[] => {
  return (
    data.length > 0 && (data[0] as PreacherData).collection === "preachers"
  );
};

export function isSermonDataArray(data: unknown[]): data is SermonData[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every((item) => item.collection === "sermons")
  );
}

export const isSermonCollection = (
  data: CollectionArray,
): data is SermonData[] => {
  return data.length > 0 && (data[0] as SermonData).collection === "sermons";
};

export const isSermon = (data: CollectionEntry): data is SermonData => {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as SermonData).collection === "sermons"
  );
};

export const isBlogCollection = (data: CollectionArray): data is BlogData[] => {
  return data.length > 0 && (data[0] as BlogData).collection === "blog";
};

export const isBlog = (data: CollectionEntry): data is BlogData => {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as BlogData).collection === "blog"
  );
};

export const isStringArray = (data: CollectionArray): data is string[] => {
  return data.length > 0 && typeof data[0] === "string";
};

// Spotify Types
export interface SpotifyPlaybackEvent {
  data: {
    position: number;
    duration: number;
    isBuffering: boolean;
    isPaused: boolean;
    playingURI: string;
  };
}

export interface SpotifyEmbedController {
  addListener: (
    event: string,
    callback: (event: SpotifyPlaybackEvent) => void,
  ) => void;
  removeListener: (event: string) => void;
  play?: () => void;
  pause?: () => void;
  loadUri?: (uri: string) => void;
}

export interface SpotifyIframeApi {
  createController: (
    element: HTMLElement | null,
    options: {
      width: string;
      height: string;
      uri: string;
    },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void;
}

export const isDateValue = (value: unknown): value is DateValue => {
  return (
    typeof value === "object" &&
    value !== null &&
    "calendar" in value &&
    "year" in value &&
    "month" in value &&
    "day" in value
  );
};

export type DynamicPath = {
  label: string;
  path: string;
};

export type Paths = {
  blog: DynamicPath | undefined;
  sermons: DynamicPath | undefined;
  events: DynamicPath | undefined;
};

export type QueryProps = {
  q: string;
  series: string;
  preacher: string;
  from: string;
  to: string;
  tag: string;
};

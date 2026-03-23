import type { CollectionEntry as AstroCollectionEntry } from "astro:content";

export type BlogData = AstroCollectionEntry<"blog">;
export type SeriesData = AstroCollectionEntry<"series">;
export type PreacherData = AstroCollectionEntry<"preachers">;
export interface SermonData extends AstroCollectionEntry<"sermons"> {
  series: SeriesData;
  preacher: PreacherData;
}

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

export type DynamicPath = {
  label: string;
  path: string;
};

export type Paths = {
  blog: DynamicPath | undefined;
  sermons: DynamicPath | undefined;
  events: DynamicPath | undefined;
};

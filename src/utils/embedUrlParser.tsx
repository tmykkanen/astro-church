import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

type Provider<T extends string = string> = {
  name: T;
  match: (url: string) => boolean;
  parse: (url: string) => string | null;
  Component: React.FC<{
    uri: string;
    isCompact: boolean;
  }>;
};

const YouTubeEmbed: React.FC<{
  uri: string;
  isCompact: boolean;
}> = ({ uri }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnail = `https://i.ytimg.com/vi/${uri}/hqdefault.jpg`;

  return (
    <div className="relative aspect-video h-full overflow-hidden rounded-sm bg-black">
      {/* Thumbnail */}
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="group absolute inset-0"
        >
          <img
            src={thumbnail}
            alt="YouTube thumbnail"
            className="h-full w-full object-cover"
          />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/70 p-4 transition group-hover:bg-black/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="h-8 w-8"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}

      {/* Iframe */}
      {isPlaying && (
        <iframe
          className="animate-fade-in absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${uri}?autoplay=1`}
          title="YouTube video"
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

const SpotifyEmbed: React.FC<{
  uri: string;
  isCompact: boolean;
}> = ({ uri, isCompact }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full" />
        </div>
      )}

      <iframe
        src={`https://open.spotify.com/embed/episode/${uri}${isCompact ? "" : "/video"}`}
        className={`h-full w-full transition-opacity duration-200 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        allow="encrypted-media"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

const providers: Provider[] = [
  {
    name: "youtube",
    match: (url) => url.includes("youtube.com") || url.includes("youtu.be"),
    parse: (url) => {
      const match = url.match(/(?:v=|youtu\.be\/|live\/)([a-zA-Z0-9_-]{11})/);
      return match?.[1] ?? null;
    },
    Component: YouTubeEmbed,
  },
  {
    name: "spotify",
    match: (url) => url.includes("spotify.com"),
    parse: (url) => {
      const match = url.match(
        /(?:track|album|playlist|episode)\/([a-zA-Z0-9]{22})/,
      );
      return match?.[1] ?? null;
    },
    Component: SpotifyEmbed,
  },
];

type ParsedEmbed = { provider: Provider; uri: string } | { error: string };

export const parseEmbed = (url: string): ParsedEmbed => {
  for (const provider of providers) {
    if (!provider.match(url)) continue;

    const uri = provider.parse(url);

    if (!uri) {
      return {
        error: `Invalid ${provider.name} URL`,
      };
    }

    return {
      provider,
      uri,
    };
  }
  return { error: `Unsupported URL: ${url}` };
};

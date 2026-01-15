import type { FC } from "react";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ButtonLink";
import { StyledText } from "@/components/StyledText";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  SpotifyEmbedController,
  SpotifyIframeApi,
  SpotifyPlaybackEvent,
} from "@/lib/types";

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
  }
}

interface SpotifyEmbedProps {
  type: "audio" | "video";
  spotifyURL?: string;
  query?: string;
  youtubeURL?: string;
}

const SpotifyEmbed: FC<SpotifyEmbedProps> = ({
  type,
  spotifyURL,
  query = "",
  youtubeURL,
}) => {
  const isVideo = type === "video";
  const isAudio = type === "audio";

  const match = spotifyURL?.match(/(?<=episode\/).+?(?=\?)/);
  const spotifyURI = match ? match[0] : null;
  const videoSrc = spotifyURI
    ? `https://open.spotify.com/embed/episode/${spotifyURI}/video?utm_source=generator`
    : "";

  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [hasError, setHasError] = useState(!spotifyURL || !spotifyURI);

  const audioRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const [iFrameAPI, setIFrameAPI] = useState<SpotifyIframeApi | null>(null);

  const LOAD_TIMEOUT_MS = 5000;

  // Load Spotify API
  useEffect(() => {
    if (hasError) return; // skip if no valid URL

    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;

    script.onerror = () => {
      setHasError(true);
      console.log("script.onerror!");
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Wait for API
  useEffect(() => {
    if (iFrameAPI || hasError) return;

    window.onSpotifyIframeApiReady = (SpotifyIframeApi) => {
      setIFrameAPI(SpotifyIframeApi);
    };
  }, [iFrameAPI, hasError]);

  // Create Player
  useEffect(() => {
    if (
      !iFrameAPI ||
      !audioRef.current ||
      !spotifyURI ||
      playerLoaded ||
      hasError
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (!playerLoaded) {
        setHasError(true);
      }
    }, LOAD_TIMEOUT_MS);

    iFrameAPI.createController(
      audioRef.current,
      {
        width: type === "audio" ? "100%" : "0",
        height: type === "audio" ? "152" : "0",
        uri: `spotify:episode:${spotifyURI}`,
      },
      (spotifyEmbedController) => {
        spotifyEmbedController.addListener("ready", () => {
          clearTimeout(timeout);
          setPlayerLoaded(true);
        });

        const handlePlaybackUpdate = (e: SpotifyPlaybackEvent) => {
          const { position, duration, isBuffering, isPaused, playingURI } =
            e.data;
          console.log(
            `Playback State updates:
                position - ${position},
                duration - ${duration},
                isBuffering - ${isBuffering},
                isPaused - ${isPaused},
                playingURI - ${playingURI},
                duration - ${duration}`,
          );
        };

        spotifyEmbedController.addListener(
          "playback_update",
          handlePlaybackUpdate,
        );

        spotifyEmbedController.addListener("playback_started", (e) => {
          console.log(`Playback started: ${e.data.playingURI}`);
        });

        controllerRef.current = spotifyEmbedController;
      },
    );

    return () => {
      clearTimeout(timeout);
      controllerRef.current?.removeListener("playback_update");
    };
  }, [iFrameAPI, spotifyURI, playerLoaded, hasError]);

  return (
    <div className={`relative ${isAudio ? "h-38" : "h-60 sm:h-80 md:h-100"}`}>
      {/* VIDEO FRAME */}
      {isVideo && spotifyURI && (
        <iframe
          title="Spotify Video Episode"
          src={videoSrc}
          className={`h-full w-full ${playerLoaded ? "opacity-100" : "opacity-0"}`}
          style={{ borderRadius: "12px" }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      )}

      {/* AUDIO FRAME */}
      {spotifyURI && (
        <div ref={audioRef} className={`${isVideo && "hidden"}`} />
      )}

      {/* SKELETON */}
      {!playerLoaded && !hasError && (
        <Skeleton
          className={`bg-muted absolute top-0 left-0 w-full ${isAudio ? "h-38" : "h-60 sm:h-80 md:h-100"}`}
        />
      )}

      {hasError && (
        <div
          className={`text-muted-foreground bg-background absolute top-0 left-0 flex w-full flex-col items-center justify-center rounded-md border text-sm ${isAudio ? "h-38" : "h-60 sm:h-80 md:h-100"}`}
        >
          {spotifyURL ? (
            <StyledText
              as="h3"
              variant={"subheading"}
              className="px-8 text-center"
            >
              Sorry. Spotify link not available. Refresh to try again.
            </StyledText>
          ) : (
            <StyledText as="h3" variant={"subheading"}>
              Sorry. No Spotify link available for this sermon.
            </StyledText>
          )}

          {youtubeURL && (
            <ButtonLink
              variant="link"
              href={`${youtubeURL}/search?query=${query}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="link to search youtube channel"
            >
              Click here to search our YouTube channel.
            </ButtonLink>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotifyEmbed;

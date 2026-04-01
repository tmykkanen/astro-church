import { format as datefnsFormat } from "date-fns";
import { CircleX } from "lucide-react";
import { type FC } from "react";

import config from "@/content-collections/site.config.json";
import type { SermonData } from "@/data/types";
import { cn } from "@/lib/utils";
import { useEmbed } from "@/utils/useEmbed";

import StyledText from "./StyledText";
import { buttonVariants } from "./ui/button";

interface MediaEmbedProps {
  data: SermonData;
  isCompact: boolean;
}

const MediaEmbed: FC<MediaEmbedProps> = ({ data, isCompact }) => {
  const {
    data: { date, mediaURL: url },
  } = data;

  if (!url) {
    console.warn("No media URL was provided.");
    return <FallbackComponent date={date} />;
  }

  const result = useEmbed(url);

  if ("error" in result) {
    console.warn(result.error);
    return <FallbackComponent date={date} />;
  }

  const { Component, uri } = result;

  return (
    <>
      <Component uri={uri} isCompact={isCompact} />
    </>
  );
};

const FallbackComponent = ({ date }: { date: Date }) => {
  const youtube = config?.general?.youtube ?? null;

  return (
    <div className="border-muted flex h-full flex-col items-center justify-center rounded-sm border-2">
      <StyledText
        as="h3"
        variant={"heading"}
        className="text-primary flex items-center gap-2"
      >
        <CircleX className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
        Sermon media not found.
      </StyledText>

      {youtube && (
        <StyledText
          as={"a"}
          href={`${youtube}/search?query=${datefnsFormat(date, "LLL dd, yyyy")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="link to search youtube channel"
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-foreground w-fit pl-0",
          )}
        >
          Click here to search our YouTube channel.
        </StyledText>
      )}
    </div>
  );
};

export default MediaEmbed;

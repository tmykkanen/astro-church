import { CircleX } from "lucide-react";
import type { FC } from "react";

import StyledText from "@/components/StyledText";
import { cn } from "@/lib/utils";

import { buttonVariants } from "./ui/button";

interface EmptyEmbedProps {
  isCompact: boolean;
  youtubeFallbackSearch: string | null;
}

const EmptyEmbed: FC<EmptyEmbedProps> = ({
  isCompact,
  youtubeFallbackSearch,
}) => {
  return (
    // <div className={`relative ${isCompact ? "h-38" : "h-60 sm:h-80 md:h-100"}`}>
    // <div
    //   className={`text-muted-foreground bg-background absolute top-0 left-0 flex w-full flex-col items-center justify-center rounded-md border text-sm ${isCompact ? "h-38" : "h-60 sm:h-80 md:h-100"}`}
    // >
    <div>
      <StyledText
        as="h3"
        variant={"heading"}
        className="text-primary flex items-center gap-2"
      >
        <CircleX className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
        Sermon media not found.
      </StyledText>

      {youtubeFallbackSearch && (
        <StyledText
          as={"a"}
          href={youtubeFallbackSearch}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="link to search youtube channel"
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-foreground pl-0",
          )}
        >
          Click here to search our YouTube channel.
        </StyledText>
      )}
    </div>

    // </div>
    // </div>
  );
};

export default EmptyEmbed;

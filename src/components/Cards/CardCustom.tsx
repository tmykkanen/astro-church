import * as React from "react";

import Meta from "@/components/Meta";
import { StyledText } from "@/components/StyledText";
import { Card, CardContent } from "@/components/ui/card";
import {
  type BlogData,
  type SermonData,
  isBlog as isBlogTypeGuard,
  isSermon as isSermonTypeGuard,
} from "@/lib/types";
import type { Paths } from "@/lib/types";

interface CardCustomProps {
  data: SermonData | BlogData;
  paths: Paths;
}

const CardCustom: React.FC<CardCustomProps> = ({ data: inputData, paths }) => {
  const {
    id,
    data: { title, date },
  } = inputData;

  const isSermon = isSermonTypeGuard(inputData);
  const isBlog = isBlogTypeGuard(inputData);

  const baseUrl = isSermon
    ? paths["sermons"]?.path
    : isBlog
      ? paths["blog"]?.path
      : "";

  return (
    <Card className="bg-muted rounded-sm border-none py-0 shadow-sm">
      <CardContent className="flex flex-row p-0">
        <a href={`/${baseUrl}/${id}`} className="flex max-h-48 w-full flex-row">
          {isSermon && (
            <img
              src={inputData.series.data.imageSquare}
              alt="series"
              className="my-4 ml-4 h-20 self-center rounded-sm md:m-0 md:h-full md:rounded-none md:rounded-l-sm"
            />
          )}
          <div className="flex flex-2/3 flex-col justify-center gap-2 p-4 md:p-8">
            <StyledText as="h3" variant="subheading">
              {title}
            </StyledText>
            <Meta
              date={date}
              scripture={
                isSermon && inputData.data.scripture
                  ? inputData.data.scripture
                  : undefined
              }
              preacher={
                isSermon && inputData.preacher.data.name
                  ? inputData.preacher.data.name
                  : undefined
              }
              tags={
                isBlog && inputData.data.tags ? inputData.data.tags : undefined
              }
              variant="outline"
              paths={paths}
            />
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export { CardCustom };

import * as React from "react";

import Meta from "@/components/Meta";
import { Card, CardContent } from "@/components/ui/card";
import {
  type BlogData,
  type SermonData,
  isSermon,
  isWriting,
} from "@/lib/types";

import { StyledText } from "../StyledText";

interface CardCustomProps {
  baseUrl: string;
  data: SermonData | BlogData;
}

const CardCustom: React.FC<CardCustomProps> = ({
  baseUrl,
  data: inputData,
}) => {
  const {
    id,
    data: { title, date },
  } = inputData;

  return (
    <Card className="bg-muted rounded-sm border-none py-0 shadow-sm">
      <CardContent className="flex flex-row p-0">
        <a href={`${baseUrl}/${id}`} className="flex max-h-48 w-full flex-row">
          {isSermon(inputData) && (
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
                isSermon(inputData) && inputData.data.scripture
                  ? inputData.data.scripture
                  : undefined
              }
              preacher={
                isSermon(inputData) && inputData.preacher.data.name
                  ? inputData.preacher.data.name
                  : undefined
              }
              tags={
                isWriting(inputData) && inputData.data.tags
                  ? inputData.data.tags
                  : undefined
              }
              variant="outline"
            />
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export { CardCustom };

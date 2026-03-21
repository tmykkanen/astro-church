import type { FC } from "react";

import Meta from "@/components/Meta";
import StyledText from "@/components/StyledText";
import { CardContent, Card as CardRoot } from "@/components/ui/card";
import type { BlogData, Paths, SermonData } from "@/data/types";

interface CardProps {
  paths: Paths;
  data: SermonData | BlogData;
}

const Card: FC<CardProps> = ({ paths, data: itemData }) => {
  return (
    <CardRoot className="bg-muted rounded-sm border-none py-0 shadow-sm outline-none">
      <CardContent className="flex flex-row p-0">
        <a
          href={`/${itemData.collection === "sermons" ? paths.sermons?.path : paths.blog?.path}/${itemData.id}`}
          className="flex max-h-48 w-full flex-row rounded-sm"
        >
          {itemData.collection === "sermons" && itemData.series.data.image && (
            <img
              src={itemData.series.data.image}
              alt="Sermon Series Image"
              className="my-4 ml-4 h-20 w-20 self-center rounded-sm object-cover object-center md:m-0 md:h-48 md:w-48 md:rounded-none md:rounded-l-sm"
            />
          )}
          <div className="flex flex-2/3 flex-col justify-center gap-2 p-4 md:p-8">
            <StyledText as="h3" variant="subheading">
              {itemData.data.title}
            </StyledText>
            <Meta
              date={itemData.data.date}
              scripture={
                itemData.collection === "sermons" && itemData.data.scripture
                  ? itemData.data.scripture
                  : undefined
              }
              preacher={
                itemData.collection === "sermons" && itemData.preacher.data.name
                  ? itemData.preacher.data.name
                  : undefined
              }
              tags={
                itemData.collection === "blog" && itemData.data.tags
                  ? itemData.data.tags
                  : undefined
              }
              variant="outline"
              paths={paths}
            />
          </div>
        </a>
      </CardContent>
    </CardRoot>
  );
};

export default Card;

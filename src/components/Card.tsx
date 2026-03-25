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
  const isSermon = itemData.collection === "sermons";
  const href = `/${isSermon ? paths.sermons?.path : paths.blog?.path}/${itemData.id}`;
  const image = isSermon ? itemData.series.data.image : undefined;
  const scripture = isSermon ? itemData.data.scripture : undefined;
  const preacher = isSermon ? itemData.preacher.data.name : undefined;
  const tags = !isSermon ? itemData.data.tags : undefined;
  const { title, date } = itemData.data;

  return (
    <CardRoot className="bg-muted rounded-sm border-none py-0 shadow-sm outline-none">
      <CardContent className="flex flex-row p-0">
        <a href={href} className="flex max-h-48 w-full flex-row rounded-sm">
          {image && (
            <img
              src={image}
              alt="Sermon Series Image"
              className="my-4 ml-4 h-20 w-20 self-center rounded-sm object-cover object-center md:m-0 md:h-48 md:w-48 md:rounded-none md:rounded-l-sm"
            />
          )}
          <div className="flex flex-2/3 flex-col justify-center gap-2 p-4 md:p-8">
            <StyledText as="h3" variant="subheading">
              {title}
            </StyledText>
            <Meta
              date={date}
              scripture={scripture}
              preacher={preacher}
              tags={tags}
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

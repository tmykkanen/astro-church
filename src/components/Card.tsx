import type { FC } from "react";

import Meta from "@/components/Meta";
import StyledText from "@/components/StyledText";
import { CardContent, Card as CardRoot } from "@/components/ui/card";
import {
  type BlogData,
  type Paths,
  type SermonData,
  isSermonData,
} from "@/data/types";

interface CardProps {
  paths: Paths;
  data: SermonData | BlogData;
}

const Card: FC<CardProps> = ({ paths, data: itemData }) => {
  const isSermon = isSermonData(itemData);
  const href = `/${isSermon ? paths.sermons?.path : paths.blog?.path}/${itemData.id}`;
  const image = isSermon ? itemData.series.data.image : undefined;
  const { title } = itemData.data;

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
          <div className="flex min-w-0 flex-2/3 flex-col justify-center gap-2 p-4 md:p-8">
            <StyledText as="h3" variant="subheading">
              {title}
            </StyledText>
            <Meta data={itemData} variant="outline" paths={paths} />
          </div>
        </a>
      </CardContent>
    </CardRoot>
  );
};

export default Card;

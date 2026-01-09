import { useStore } from "@nanostores/react";
import * as React from "react";

import { $allBlogData, $filteredBlog } from "@/lib/nanostoreBlog";
import { $allSermonData, $filteredSermons } from "@/lib/nanostoreSermons";
import {
  type BlogData,
  type SermonData,
  isSermonCollection,
  isWritingsCollection,
} from "@/lib/types";

import { CardCustom } from "./CardCustom";

interface CardDisplayProps {
  data: SermonData[] | BlogData[];
  baseUrl: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ data, baseUrl }) => {
  let filteredPosts;

  if (isSermonCollection(data)) {
    $allSermonData.set(data);
    filteredPosts = useStore($filteredSermons);
  }

  if (isWritingsCollection(data)) {
    $allBlogData.set(data);
    filteredPosts = useStore($filteredBlog);
  }

  return (
    <div className="flex flex-col gap-8 pt-8 lg:grid lg:grid-cols-2">
      {filteredPosts?.map((item) => (
        <CardCustom key={item.id} baseUrl={baseUrl} data={item} />
      ))}
    </div>
  );
};

export { CardDisplay };

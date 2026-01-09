import { useStore } from "@nanostores/react";
import * as React from "react";

import config from "@/_site-config.json";
import { $allSermonData, $filteredSermons } from "@/lib/nanostoreSermons";
import { $allWritingsData, $filteredWritings } from "@/lib/nanostoreWritings";
import {
  type SermonData,
  type WritingsData,
  isSermonCollection,
  isWritingsCollection,
} from "@/lib/types";

import { CardCustom } from "./CardCustom";

interface CardDisplayProps {
  data: SermonData[] | WritingsData[];
  baseUrl: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ data, baseUrl }) => {
  let filteredPosts;

  if (isSermonCollection(data)) {
    $allSermonData.set(data);
    filteredPosts = useStore($filteredSermons);
  }

  if (isWritingsCollection(data)) {
    $allWritingsData.set(data);
    filteredPosts = useStore($filteredWritings);
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

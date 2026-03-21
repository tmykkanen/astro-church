import type { CollectionEntry } from "astro:content";
import { SearchIcon } from "lucide-react";
import { type FC, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { SermonData } from "@/data/types";
import type { Paths } from "@/utils/findPathByType";

import LatestSermon from "./LatestSermon";

interface SermonIndexProps {
  paths: Paths;
  allSermonData: SermonData[];
  siteConfig?: CollectionEntry<"config">;
}

const SermonIndex: FC<SermonIndexProps> = ({
  paths,
  allSermonData,
  siteConfig,
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <main className="layout-base gap-8 py-8">
      <h1 className="sr-only">Sermons</h1>
      <section className="flex flex-col gap-4">
        <LatestSermon
          latestSermon={allSermonData[0]}
          paths={paths}
          siteConfig={siteConfig}
        />
      </section>
      <section className="flex flex-col gap-2">
        <h2>Sermon Filters</h2>
        <p>Input Value: {inputValue}</p>
        <InputGroup className="bg-muted text-muted-foreground">
          <InputGroupInput
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            placeholder={"Search sermons..."}
            className="placeholder:text-muted-foreground text-foreground placeholder:italic"
            // ref={inputRef}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </section>
    </main>
  );
};

export default SermonIndex;

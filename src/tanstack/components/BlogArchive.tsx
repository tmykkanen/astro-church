import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useRouteContext } from "@tanstack/react-router";
import { Settings2, Undo2 } from "lucide-react";
import { type FC, useState } from "react";

import StyledText from "@/components/StyledText";
import { Button } from "@/components/ui/button";

import { useFilters } from "../hooks/useFilters";
import getOldestDataDate from "../utils/getOldestDataDate";
import Card from "./Card";
import Combobox from "./Combobox";
import DatePicker from "./DatePicker";
import Search from "./Search";

const BlogArchive: FC = () => {
  const context = useRouteContext({ from: "/$all" });
  const { allBlogData, paths } = context;
  if (!allBlogData) throw new Error("Missing data");

  const [showFilters, setShowFilters] = useState(false);

  const { state, setters, hasFilters, resetFilters, filteredData } =
    useFilters(allBlogData);

  const handleReset = () => {
    resetFilters();
    setShowFilters(false);
  };

  const getTags = () => {
    const postsWithTags = allBlogData.filter((i) => i.data.tags);
    const tagSet = new Set<string>();

    if (postsWithTags.length > 0) {
      postsWithTags.forEach((post) =>
        post.data.tags?.forEach((t) => tagSet.add(t)),
      );
    }

    return tagSet.size === 0 ? null : [...tagSet].sort();
  };

  const allTags = getTags();

  return (
    <>
      <div className="flex flex-col gap-4">
        <StyledText as="h2" variant="heading">
          All Blog Entries
        </StyledText>
        <div className="flex flex-col gap-4 md:flex-row">
          <Search
            placeholder={"Search posts..."}
            value={state.searchInput}
            setValue={setters.setSearchInput}
          />
          <div className="flex content-between justify-between self-end">
            <Button
              variant="link"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "" : "text-muted-foreground"}
            >
              <Settings2 />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            {hasFilters && (
              <Button
                variant="link"
                className="flex w-fit cursor-pointer items-center gap-1 px-0 py-0"
                onClick={handleReset}
              >
                Reset Filters
                <Undo2 />
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-col gap-x-8 gap-y-4 lg:grid lg:grid-cols-2">
            {allTags && (
              <Combobox
                data={allTags}
                type="tag"
                value={state.tagSelection}
                setValue={setters.setTagSelection}
              />
            )}

            <DatePicker
              data={allBlogData}
              type="from"
              value={state.fromDate}
              setValue={setters.setFromDate}
              min={parseDate(getOldestDataDate(allBlogData))}
              max={
                state.toDate
                  ? parseDate(state.toDate)
                  : today(getLocalTimeZone())
              }
            />

            <DatePicker
              data={allBlogData}
              type="to"
              value={state.toDate}
              setValue={setters.setToDate}
              min={
                state.fromDate
                  ? parseDate(state.fromDate)
                  : parseDate(getOldestDataDate(allBlogData))
              }
              max={today(getLocalTimeZone())}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-8 pt-8 lg:grid lg:grid-cols-2">
        {filteredData?.map((item) => (
          <Card key={item.id} data={item} paths={paths} />
        ))}
      </div>
    </>
  );
};

export default BlogArchive;

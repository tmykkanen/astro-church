import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Settings2, Undo2 } from "lucide-react";
import { useQueryStates } from "nuqs";
import { type FC, useEffect, useState } from "react";

import Card from "@/components/Card";
import Combobox from "@/components/Combobox";
import DatePicker from "@/components/DatePicker";
import Search from "@/components/Search";
import StyledText from "@/components/StyledText";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogData, Paths } from "@/data/types";
import getOldestDataDate from "@/utils/getOldestDataDate";
import { queryParsers, queryUrlKeys } from "@/utils/nuqsParsers";
import { useFilteredData } from "@/utils/useFilteredData";

interface FilteredBlogProps {
  allBlogData: BlogData[];
  paths: Paths;
}

const FilteredBlog: FC<FilteredBlogProps> = ({ allBlogData, paths }) => {
  const [queryState, setQueryState] = useQueryStates(queryParsers, {
    urlKeys: queryUrlKeys,
  });

  const [isMounted, setIsMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hasFilters, setHasFilters] = useState(false);
  const filteredData = useFilteredData(allBlogData);

  const getTags = () => {
    const postsWithTags = allBlogData.filter((i) => i.data.tags);
    const tagSet = new Set<string>();

    if (postsWithTags.length > 0) {
      postsWithTags.forEach((post) =>
        post.data.tags?.forEach((t) => tagSet.add(t)),
      );
    }

    return tagSet.size === 0 ? [] : [...tagSet].sort();
  };

  const handleReset = () => {
    setQueryState(null);
    setShowFilters(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setHasFilters(Object.values(queryState).filter((v) => v !== "").length > 0);
  }, [queryState]);

  if (!isMounted) return <BlogSkeleton />;

  return (
    <>
      <div className="flex flex-col gap-4">
        <StyledText as="h2" variant="heading">
          All Posts
        </StyledText>
        <div className="flex flex-col gap-4 md:flex-row">
          <Search
            value={queryState.searchInput}
            setValue={(v) => setQueryState({ searchInput: v })}
            placeholder="Search posts..."
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
            <Combobox
              data={getTags()}
              type="tag"
              value={queryState.tagSelection}
              setValue={(v) => setQueryState({ tagSelection: v })}
            />

            <DatePicker
              data={allBlogData}
              type="from"
              value={queryState.fromDate}
              setValue={(v) => setQueryState({ fromDate: v })}
              min={parseDate(getOldestDataDate(allBlogData))}
              max={
                queryState.toDate
                  ? parseDate(queryState.toDate)
                  : today(getLocalTimeZone())
              }
            />

            <DatePicker
              data={allBlogData}
              type="to"
              value={queryState.toDate}
              setValue={(v) => setQueryState({ toDate: v })}
              min={
                queryState.fromDate
                  ? parseDate(queryState.fromDate)
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

const BlogSkeleton = () => (
  <>
    <div className="flex flex-col gap-4">
      <Skeleton className="bg-background h-8 w-30" />
      <div className="flex flex-col gap-4 md:flex-row">
        <Skeleton className="bg-muted h-9 w-full" />
        <Skeleton className="bg-background h-9 w-38" />
      </div>
    </div>
    <div className="flex flex-col gap-8 pt-8 lg:grid lg:grid-cols-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="bg-muted h-[150px] rounded-sm" />
      ))}
    </div>
  </>
);

export default FilteredBlog;

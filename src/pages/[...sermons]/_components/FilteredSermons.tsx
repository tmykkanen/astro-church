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
import type { Paths, PreacherData, SeriesData, SermonData } from "@/data/types";
import getOldestDataDate from "@/utils/getOldestDataDate";
import { queryParsers, queryUrlKeys } from "@/utils/nuqsParsers";
import { useFilteredData } from "@/utils/useFilteredData";
import { wait } from "@/utils/wait";

interface FilteredSermonsProps {
  allSermonData: SermonData[];
  allSeriesData: SeriesData[];
  allPreachersData: PreacherData[];
  paths: Paths;
}

const FilteredSermons: FC<FilteredSermonsProps> = ({
  allSermonData,
  allSeriesData,
  allPreachersData,
  paths,
}) => {
  const [queryState, setQueryState] = useQueryStates(queryParsers, {
    urlKeys: queryUrlKeys,
  });

  const [isMounted, setIsMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hasFilters, setHasFilters] = useState(false);
  const filteredData = useFilteredData(allSermonData);

  const handleReset = () => {
    setQueryState(null);
    setShowFilters(false);
  };

  useEffect(() => {
    wait(500).then(() => setIsMounted(true));
    // setIsMounted(true);
  }, []);

  useEffect(() => {
    setHasFilters(Object.values(queryState).filter((v) => v !== "").length > 0);
  }, [queryState]);

  if (!isMounted) return <SermonsSkeleton />;

  return (
    <>
      <div className="flex flex-col gap-4">
        <StyledText as="h2" variant="heading">
          All Sermons
        </StyledText>
        <div className="flex flex-col gap-4 md:flex-row">
          <Search
            value={queryState.searchInput}
            setValue={(v) => setQueryState({ searchInput: v })}
            placeholder="Search sermons..."
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
              data={allSeriesData}
              type="series"
              value={queryState.seriesSelection}
              setValue={(v) => setQueryState({ seriesSelection: v })}
            />

            <Combobox
              data={allPreachersData}
              type="preacher"
              value={queryState.preacherSelection}
              setValue={(v) => setQueryState({ preacherSelection: v })}
            />

            <DatePicker
              data={allSermonData}
              type="from"
              value={queryState.fromDate}
              setValue={(v) => setQueryState({ fromDate: v })}
              min={parseDate(getOldestDataDate(allSermonData))}
              max={
                queryState.toDate
                  ? parseDate(queryState.toDate)
                  : today(getLocalTimeZone())
              }
            />

            <DatePicker
              data={allSermonData}
              type="to"
              value={queryState.toDate}
              setValue={(v) => setQueryState({ toDate: v })}
              min={
                queryState.fromDate
                  ? parseDate(queryState.fromDate)
                  : parseDate(getOldestDataDate(allSermonData))
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

const SermonsSkeleton = () => (
  <>
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-30" />
      <div className="flex flex-col gap-4 md:flex-row">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-38" />
      </div>
    </div>
    <div className="flex flex-col gap-8 pt-8 lg:grid lg:grid-cols-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[150px] rounded-sm" />
      ))}
    </div>
  </>
);

export default FilteredSermons;

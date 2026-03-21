import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Settings2, Undo2 } from "lucide-react";
import { type FC, useState } from "react";

import StyledText from "@/components/StyledText";
import { Button } from "@/components/ui/button";
import type { Paths, PreacherData, SeriesData, SermonData } from "@/data/types";
import getOldestDataDate from "@/utils/getOldestDataDate";
import { useFiltersNative } from "@/utils/useFiltersNative";

import Card from "./Card";
import Combobox from "./Combobox";
import DatePicker from "./DatePicker";
import Search from "./Search";

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
  const [showFilters, setShowFilters] = useState(false);

  const { state, setters, hasFilters, resetFilters, filteredData } =
    useFiltersNative(allSermonData);

  const handleReset = () => {
    resetFilters();
    setShowFilters(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <StyledText as="h2" variant="heading">
          All Sermons
        </StyledText>
        <div className="flex flex-col gap-4 md:flex-row">
          <Search
            placeholder={"Search sermons..."}
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
            <Combobox
              data={allSeriesData}
              type="series"
              value={state.seriesSelection}
              setValue={setters.setSeriesSelection}
            />

            <Combobox
              data={allPreachersData}
              type="preacher"
              value={state.preacherSelection}
              setValue={setters.setPreacherSelection}
            />

            <DatePicker
              data={allSermonData}
              type="from"
              value={state.fromDate}
              setValue={setters.setFromDate}
              min={parseDate(getOldestDataDate(allSermonData))}
              max={
                state.toDate
                  ? parseDate(state.toDate)
                  : today(getLocalTimeZone())
              }
            />

            <DatePicker
              data={allSermonData}
              type="to"
              value={state.toDate}
              setValue={setters.setToDate}
              min={
                state.fromDate
                  ? parseDate(state.fromDate)
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

export default FilteredSermons;

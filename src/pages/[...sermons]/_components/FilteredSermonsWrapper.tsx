import { NuqsAdapter } from "nuqs/adapters/react";
import type { FC } from "react";

import type { Paths, PreacherData, SeriesData, SermonData } from "@/data/types";

import FilteredSermons from "./FilteredSermons";

interface FilteredSermonsWrapperProps {
  allSermonData: SermonData[];
  allSeriesData: SeriesData[];
  allPreachersData: PreacherData[];
  paths: Paths;
}

const FilteredSermonsWrapper: FC<FilteredSermonsWrapperProps> = ({
  allSermonData,
  allSeriesData,
  allPreachersData,
  paths,
}) => {
  return (
    <NuqsAdapter>
      <FilteredSermons
        allSermonData={allSermonData}
        allPreachersData={allPreachersData}
        allSeriesData={allSeriesData}
        paths={paths}
      />
    </NuqsAdapter>
  );
};

export default FilteredSermonsWrapper;

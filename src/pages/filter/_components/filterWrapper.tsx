import { NuqsAdapter } from "nuqs/adapters/react";
import type { FC } from "react";

import FilterTest from "./filterTest";

interface FilterWrapperProps {}

const FilterWrapper: FC<FilterWrapperProps> = () => {
  return (
    <NuqsAdapter>
      <FilterTest />
    </NuqsAdapter>
  );
};

export default FilterWrapper;

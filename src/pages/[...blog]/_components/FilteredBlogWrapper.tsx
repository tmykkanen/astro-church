import { NuqsAdapter } from "nuqs/adapters/react";
import type { FC } from "react";

import type { BlogData, Paths } from "@/data/types";

import FilteredBlog from "./FilteredBlog";

interface FilteredBlogWrapperProps {
  allBlogData: BlogData[];
  paths: Paths;
}

const FilteredBlogWrapper: FC<FilteredBlogWrapperProps> = ({
  allBlogData,
  paths,
}) => {
  return (
    <NuqsAdapter>
      <FilteredBlog allBlogData={allBlogData} paths={paths} />
    </NuqsAdapter>
  );
};

export default FilteredBlogWrapper;

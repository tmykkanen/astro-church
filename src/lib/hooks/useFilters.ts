import { useEffect, useState } from "react";
import { useNanostoreURLSync } from "@/lib/hooks/useNanostoreURLSync";

interface FilterEntry<T> {
  value: T | null | undefined;
  setValue: (value: T | null | undefined) => void;
}

interface Filters {
  series: FilterEntry<string>;
  preacher: FilterEntry<string>;
  tag: FilterEntry<string>;
  from: FilterEntry<Date>;
  to: FilterEntry<Date>;
  sermonSearchTerm: FilterEntry<string>;
  writingsSearchTerm: FilterEntry<string>;
}

export const useFilters = () => {
  const filters: Filters = {
    series: useNanostoreURLSync<string>("series"),
    preacher: useNanostoreURLSync<string>("preacher"),
    tag: useNanostoreURLSync<string>("tag"),
    from: useNanostoreURLSync<Date>("from"),
    to: useNanostoreURLSync<Date>("to"),
    sermonSearchTerm: useNanostoreURLSync<string>("sermonSearchTerm"),
    writingsSearchTerm: useNanostoreURLSync<string>("writingsSearchTerm"),
  };

  const hasActiveFilters = Object.values(filters).some(
    ({ value }) => value !== undefined && value !== null && value !== "",
  );

  const [isShowFilters, setIsShowFilters] = useState(false);

  useEffect(() => {
    if (hasActiveFilters) setIsShowFilters(true);
  }, [hasActiveFilters]);

  const resetFilters = () => {
    Object.values(filters).forEach(({ setValue }) => setValue(undefined));
    setIsShowFilters(false);
  };

  return {
    filters,
    hasActiveFilters,
    isShowFilters,
    setIsShowFilters,
    resetFilters,
  };
};

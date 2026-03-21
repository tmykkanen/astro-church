import { type FC, useEffect, useState } from "react";

import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";

import Search from "./[...sermons]/_components/Search";

interface FilterProps {}

const Filter: FC<FilterProps> = ({}) => {
  const searchParams = useUrlSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    console.log("search pinged");
    const timeoutId = setTimeout(() => {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      console.log(searchInput);

      if (!searchInput) {
        params.delete("q");
      } else {
        params.set("q", searchInput);
      }

      window.history.replaceState({}, "", url.href);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  return (
    <div>
      <h1>Filter Tests</h1>
      <p>q = {searchParams.get("q")}</p>
      <Search
        placeholder="search"
        value={searchInput}
        setValue={setSearchInput}
      />
    </div>
  );
};

export default Filter;

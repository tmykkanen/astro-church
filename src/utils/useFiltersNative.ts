// import { useNavigate, useSearch } from "@tanstack/react-router";
import { bcv_parser } from "bible-passage-reference-parser/esm/bcv_parser";
import * as lang from "bible-passage-reference-parser/esm/lang/en.js";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";

import { type BlogData, type SermonData } from "@/data/types";

// import { defaultSearchValues } from "../routes/$all";

const bcv = new bcv_parser(lang);
bcv.set_options({
  book_alone_strategy: "full",
});

export const useFiltersNative = (data: SermonData[] | BlogData[]) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("q = ", searchParams.get("q"));
  }, [searchParams]);

  // Set up search and navigate
  // const navigate = useNavigate({ from: "/$all" });
  // const search = useSearch({ from: "/$all" });
  // const { q, series, preacher, from, to, tag } = useSearch({ from: "/$all" });

  // const url = new URL(window.location.href);
  // const params = url.searchParams;
  // const series = params.get("series");
  // const series_native = params.get("series");
  // const [seriesNativeState, setSeriesNativeState] = useState(series_native);
  // console.log(seriesNativeState);

  // useEffect(() => {
  //   console.log("UPDATE Local State");
  //   setSeriesNativeState(series_native);
  // }, [series_native]);
  //
  const url = new URL(window.location.href);
  const params = url.searchParams;

  // Local state for UI components
  const [searchInput, setSearchInput] = useState(params.get("q") ?? "");
  const [seriesSelection, setSeriesSelection] = useState(
    params.get("series") ?? "",
  );
  const [preacherSelection, setPreacherSelection] = useState(
    params.get("preacher") ?? "",
  );
  const [fromDate, setFromDate] = useState(params.get("from") ?? "");
  const [toDate, setToDate] = useState(params.get("to") ?? "");
  const [tagSelection, setTagSelection] = useState(params.get("tag") ?? "");

  // Sync local state when URL changes
  // useEffect(() => {
  //   setSearchInput(q);
  //   setSeriesSelection(series);
  //   setPreacherSelection(preacher);
  //   setFromDate(from);
  //   setToDate(to);
  //   setTagSelection(tag);
  // }, [q, series, preacher, from, to, tag]);

  // Sync URL when local state changes w/debounce
  useEffect(() => {
    console.log("search pinged");
    const timeoutId = setTimeout(() => {
      // navigate({
      //   search: (prev) => ({ ...prev, q: searchInput }),
      //   replace: true,
      // });
      //
      //
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

  // Sync URL when local state changes instantly
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (seriesSelection) {
      params.set("series", seriesSelection);
    } else {
      params.delete("series");
    }

    if (preacherSelection) {
      params.set("preacher", preacherSelection);
    } else {
      params.delete("preacher");
    }

    if (fromDate) {
      params.set("from", fromDate);
    } else {
      params.delete("from");
    }

    if (toDate) {
      params.set("to", toDate);
    } else {
      params.delete("to");
    }

    if (tagSelection) {
      params.set("tag", tagSelection);
    } else {
      params.delete("tag");
    }
    // params.set("series", seriesSelection ?? "");
    // params.set("preacher", preacherSelection ?? "");
    // params.set("from", fromDate ?? "");
    // params.set("to", toDate ?? "");
    // params.set("tag", tagSelection ?? "");

    // Delete empty keys
    // for (const [key, value] of params) {
    //   console.log(key, value);
    //   if (!value) params.delete(key);
    // }

    window.history.replaceState({}, "", url.href);

    // navigate({
    //   search: (prev) => ({
    //     ...prev,
    //     // series: seriesSelection,
    //     preacher: preacherSelection,
    //     from: fromDate,
    //     to: toDate,
    //     tag: tagSelection,
    //   }),
    //   replace: true,
    // });
  }, [
    seriesSelection,
    preacherSelection,
    fromDate,
    toDate,
    tagSelection,
    // navigate,
  ]);

  // Data filtering
  const filteredData = useMemo(() => {
    let tempData = data;

    // SERMON FILTERING
    if (data[0].collection === "sermons") {
      tempData = tempData.filter(
        (item): item is SermonData => item.collection === "sermons",
      );

      if (seriesSelection)
        tempData = tempData.filter(
          (item) => item.series.id === seriesSelection,
        );

      if (preacherSelection)
        tempData = tempData.filter(
          (item) => item.preacher.id === preacherSelection,
        );

      if (fromDate)
        tempData = tempData.filter(
          (item) => item.data.date >= new Date(fromDate),
        );

      if (toDate)
        tempData = tempData.filter(
          (item) => item.data.date <= new Date(toDate),
        );

      if (searchInput) {
        const osis = bcv.parse(searchInput).osis();
        if (osis) {
          const refRegExp = getRegExpFromOsis(osis);

          // Find sermons where scripture ref in .md file matches regex version of search term
          tempData = tempData.filter((s) =>
            s.data.scripture?.some((ref) =>
              refRegExp.some((regExp) => regExp.test(ref)),
            ),
          );

          tempData = sortByScriptureRef(tempData, refRegExp);
        } else {
          const sermonSearchOptions = {
            includeScore: true,
            keys: [
              { name: "data.title", weight: 0.7 },
              { name: "preacher.data.name", weight: 0.3 },
            ],
          };

          const fuse = new Fuse(tempData, sermonSearchOptions);
          const result = fuse.search(searchInput);

          tempData = result.map((hit) => hit.item);
        }
      }
    }

    // BLOG FILTERING
    if (data[0].collection === "blog") {
      console.log("BLOG DETECTED");

      tempData = tempData.filter(
        (item): item is BlogData => item.collection === "blog",
      );

      if (tagSelection) {
        tempData = tempData.filter((item) =>
          item.data.tags?.includes(tagSelection),
        );
      }

      if (fromDate)
        tempData = tempData.filter(
          (item) => item.data.date >= new Date(fromDate),
        );

      if (toDate)
        tempData = tempData.filter(
          (item) => item.data.date <= new Date(toDate),
        );

      if (searchInput) {
        const blogSearchOptions = {
          includeScore: true,
          ignoreLocation: true,
          includeMatches: true,
          keys: [
            { name: "data.title", weight: 0.7 },
            {
              name: "body",
              weight: 0.5,
            },
            { name: "data.tags", weight: 0.2 },
          ],
        };

        const fuse = new Fuse(tempData, blogSearchOptions);
        const result = fuse.search(searchInput);

        tempData = result.map((hit) => hit.item);
      }
    }

    return tempData;
  }, [
    data,
    searchInput,
    seriesSelection,
    preacherSelection,
    fromDate,
    toDate,
    tagSelection,
  ]);

  const hasFilters = useMemo(() => {
    return new URL(window.location.href).searchParams.size > 0;
  }, [
    data,
    searchInput,
    seriesSelection,
    preacherSelection,
    fromDate,
    toDate,
    tagSelection,
  ]);

  const resetFilters = () => {
    const url = new URL(window.location.href);

    for (const p of params) {
      params.delete(p[0]);
    }

    window.history.replaceState({}, "", url.href);
  };

  return {
    state: {
      searchInput,
      seriesSelection,
      preacherSelection,
      fromDate,
      toDate,
      tagSelection,
    },
    setters: {
      setSearchInput,
      setSeriesSelection,
      setPreacherSelection,
      setFromDate,
      setToDate,
      setTagSelection,
    },
    filteredData,
    hasFilters,
    resetFilters,
  };
};

/** ------------------------ Helper Functions ------------------------ */

const getRegExpFromOsis = (osis: string) => {
  const split = osis
    // e.g. osis input: "Luke.2.1-Luke.2.4,John.3"
    // split multi-reference into array of single references
    // Result: ['Luke.2.1-Luke.2.4', 'John.3']
    .split(",")
    // split ranges into single references + flatten array
    // Result: ['Luke.2.1', 'Luke.2.4', 'John.3']
    .map((ref) => ref.split("-"))
    // Explicitly expand array to include each chapter in range
    .map((refArray) => {
      if (refArray.length < 2) return refArray;
      const startChapter = parseInt(refArray[0].split(".")[1]);
      const endChapter = parseInt(refArray[1].split(".")[1]);
      const expandedArray = [...refArray];
      for (let i = startChapter + 1; i < endChapter; i++) {
        expandedArray.push(refArray[0].split(".")[0] + "." + i);
      }
      return expandedArray;
    })
    .flat();

  // clean up array to include only unique values
  const refs = [...new Set(split)];

  return refs.map((ref) => {
    const [book, chapter] = ref.split(".");

    return chapter
      ? new RegExp(`\\b${book}\\.${chapter}(?=[.\\s]|$)`)
      : new RegExp(`\\b${book}(?=[.\\s])`);
  });
};

const sortByScriptureRef = (data: SermonData[], refRegExp: RegExp[]) => {
  // Sort sermon data in ascending scripture order
  return data.sort((a, b) => {
    // Find ref matching search term
    const aMatch = a.data.scripture?.find((ref) =>
      refRegExp.some((regExp) => regExp.test(ref)),
    );
    const bMatch = b.data.scripture?.find((ref) =>
      refRegExp.some((regExp) => regExp.test(ref)),
    );

    // Handle no refs found; shouldn't ever trigger b/c of prior filter function
    if (!aMatch && !bMatch) return 0;
    if (!aMatch) return 1;
    if (!bMatch) return -1;

    // split into BCV array
    const aRef = aMatch.split("-")[0].split(".");
    const bRef = bMatch.split("-")[0].split(".");

    const aChapter = parseInt(aRef[1]) || 0;
    const aVerse = parseInt(aRef[2]) || 0;

    const bChapter = parseInt(bRef[1]) || 0;
    const bVerse = parseInt(bRef[2]) || 0;

    // sort by chapter for different chapters
    if (aChapter !== bChapter) {
      return aChapter - bChapter;
    }

    // Sort by verse if same chapter
    return aVerse - bVerse;
  });
};

const useSearchParams = () => {
  const [search, setSearch] = useState(() => window.location.search);

  useEffect(() => {
    const update = () => {
      const next = window.location.search;
      setSearch((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("popstate", update);

    const wrap = (method: "pushState" | "replaceState") => {
      const original = history[method];

      history[method] = function (...args: any[]) {
        const result = original.apply(this, args);
        update();
        return result;
      };

      return original;
    };

    const originalPush = wrap("pushState");
    const originalReplace = wrap("replaceState");

    return () => {
      window.removeEventListener("popstate", update);
      history.pushState = originalPush;
      history.replaceState = originalReplace;
    };
  }, []);

  return useMemo(() => new URLSearchParams(search), [search]);
};

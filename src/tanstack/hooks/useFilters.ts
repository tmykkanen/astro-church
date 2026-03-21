import { useNavigate, useSearch } from "@tanstack/react-router";
import { bcv_parser } from "bible-passage-reference-parser/esm/bcv_parser";
import * as lang from "bible-passage-reference-parser/esm/lang/en.js";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";

import { type BlogData, type SermonData } from "@/data/types";

import { defaultSearchValues } from "../routes/$all";

const bcv = new bcv_parser(lang);
bcv.set_options({
  book_alone_strategy: "full",
});

export const useFilters = (data: SermonData[] | BlogData[]) => {
  // Set up search and navigate
  const navigate = useNavigate({ from: "/$all" });
  const search = useSearch({ from: "/$all" });
  const { q, series, preacher, from, to, tag } = useSearch({ from: "/$all" });

  // Local state for UI components
  const [searchInput, setSearchInput] = useState(q);
  const [seriesSelection, setSeriesSelection] = useState(series);
  const [preacherSelection, setPreacherSelection] = useState(preacher);
  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [tagSelection, setTagSelection] = useState(tag);

  // Sync local state when URL changes
  useEffect(() => {
    setSearchInput(q);
    setSeriesSelection(series);
    setPreacherSelection(preacher);
    setFromDate(from);
    setToDate(to);
    setTagSelection(tag);
  }, [q, series, preacher, from, to, tag]);

  // Sync URL when local state changes w/debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate({
        search: (prev) => ({ ...prev, q: searchInput }),
        replace: true,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Sync URL when local state changes instantly
  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        series: seriesSelection,
        preacher: preacherSelection,
        from: fromDate,
        to: toDate,
        tag: tagSelection,
      }),
      replace: true,
    });
  }, [
    seriesSelection,
    preacherSelection,
    fromDate,
    toDate,
    tagSelection,
    navigate,
  ]);

  // Data filtering
  const filteredData = useMemo(() => {
    let tempData = data;

    // SERMON FILTERING
    if (data[0].collection === "sermons") {
      tempData = tempData.filter(
        (item): item is SermonData => item.collection === "sermons",
      );

      if (series)
        tempData = tempData.filter((item) => item.series.id === series);

      if (preacher)
        tempData = tempData.filter((item) => item.preacher.id === preacher);

      if (from)
        tempData = tempData.filter((item) => item.data.date >= new Date(from));

      if (to)
        tempData = tempData.filter((item) => item.data.date <= new Date(to));

      if (q) {
        const osis = bcv.parse(q).osis();
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
          const result = fuse.search(q);

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

      if (tag) {
        console.log(tag);
        tempData = tempData.filter((item) => item.data.tags?.includes(tag));
      }

      if (from)
        tempData = tempData.filter((item) => item.data.date >= new Date(from));

      if (to)
        tempData = tempData.filter((item) => item.data.date <= new Date(to));

      if (q) {
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
        const result = fuse.search(q);

        tempData = result.map((hit) => hit.item);
      }
    }

    return tempData;
  }, [data, q, series, preacher, from, to, tag]);

  const hasFilters = useMemo(() => {
    return JSON.stringify(search) !== JSON.stringify(defaultSearchValues);
  }, [search]);

  const resetFilters = () => {
    navigate({ search: () => defaultSearchValues });
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

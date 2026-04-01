import Fuse from "fuse.js";
import { useQueryStates } from "nuqs";

import type { BlogData, SermonData } from "@/data/types";

import { queryParsers, queryUrlKeys } from "./nuqsParsers";
import { bcv } from "./scriptureParsing";

export const useFilteredData = (data: SermonData[] | BlogData[]) => {
  const [
    {
      searchInput,
      seriesSelection,
      preacherSelection,
      fromDate,
      toDate,
      tagSelection,
    },
  ] = useQueryStates(queryParsers, { urlKeys: queryUrlKeys });

  let filteredData = data;

  // SERMON FILTERING
  if (data[0]?.collection === "sermons") {
    filteredData = filteredData.filter(
      (item): item is SermonData => item.collection === "sermons",
    );

    if (seriesSelection)
      filteredData = filteredData.filter(
        (item) => item.series.id === seriesSelection,
      );

    if (preacherSelection)
      filteredData = filteredData.filter(
        (item) => item.preacher.id === preacherSelection,
      );

    if (fromDate)
      filteredData = filteredData.filter(
        (item) => item.data.date >= new Date(fromDate),
      );

    if (toDate)
      filteredData = filteredData.filter(
        (item) => item.data.date <= new Date(toDate),
      );

    if (searchInput) {
      const osis = bcv.parse(searchInput).osis();

      if (osis) {
        const refRegExp = getRegExpFromOsis(osis);

        // Find sermons where scripture ref in .md file matches regex version of search term
        filteredData = filteredData.filter((s) =>
          s.data.scripture?.some((ref) =>
            refRegExp.some((regExp) => regExp.test(ref.osis ?? "")),
          ),
        );

        filteredData = sortByScriptureRef(filteredData, refRegExp);
      } else {
        const sermonSearchOptions = {
          includeScore: true,
          keys: [
            { name: "data.title", weight: 0.7 },
            { name: "preacher.data.name", weight: 0.3 },
          ],
        };

        const fuse = new Fuse(filteredData, sermonSearchOptions);
        const result = fuse.search(searchInput);

        filteredData = result.map((hit) => hit.item);
      }
    }
  }

  // BLOG FILTERING
  if (data[0]?.collection === "blog") {
    filteredData = filteredData.filter(
      (item): item is BlogData => item.collection === "blog",
    );

    if (tagSelection) {
      filteredData = filteredData.filter((item) =>
        item.data.tags?.includes(tagSelection),
      );
    }

    if (fromDate)
      filteredData = filteredData.filter(
        (item) => item.data.date >= new Date(fromDate),
      );

    if (toDate)
      filteredData = filteredData.filter(
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

      const fuse = new Fuse(filteredData, blogSearchOptions);
      const result = fuse.search(searchInput);

      filteredData = result.map((hit) => hit.item);
    }
  }

  return filteredData;
};

/** ------------------------ Helper Functions ------------------------ */

// const getRegExpFromOsis = (osis: string) => {
//   const split = osis
//     // e.g. osis input: "Luke.2.1-Luke.2.4,John.3"
//     // split multi-reference into array of single references
//     // Result: ['Luke.2.1-Luke.2.4', 'John.3']
//     .split(",")
//     // split ranges into single references + flatten array
//     // Result: ['Luke.2.1', 'Luke.2.4', 'John.3']
//     .map((ref) => ref.split("-"))
//     // Explicitly expand array to include each chapter in range
//     .map((refArray) => {
//       if (refArray.length < 2) return refArray;
//       const startChapter = parseInt(refArray[0]?.split(".")[1] ?? "");
//       const endChapter = parseInt(refArray[1]?.split(".")[1] ?? "");
//       const expandedArray = [...refArray];
//       for (let i = startChapter + 1; i < endChapter; i++) {
//         expandedArray.push(refArray[0]?.split(".")[0] + "." + i);
//       }
//       return expandedArray;
//     })
//     .flat();

//   // clean up array to include only unique values
//   const refs = [...new Set(split)];

//   return refs.map((ref) => {
//     const [book, chapter] = ref.split(".");

//     return chapter
//       ? new RegExp(`\\b${book}\\.${chapter}(?=[.\\s]|$)`)
//       : new RegExp(`\\b${book}(?=[.\\s])`);
//   });
// };

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getRegExpFromOsis = (osis: string) => {
  const refs = osis.split(",").flatMap((ref) => {
    const parts = ref.split("-");

    // Single reference
    if (parts.length === 1) return parts;

    const [start, end] = parts;

    const [bookStart, chapterStart] = start!.split(".");
    const [bookEnd, chapterEnd] = end!.split(".");

    const startNum = Number(chapterStart);
    const endNum = Number(chapterEnd);

    // Guard invalid / cross-book ranges
    if (
      bookStart !== bookEnd ||
      Number.isNaN(startNum) ||
      Number.isNaN(endNum)
    ) {
      return [start, end];
    }

    // Expand chapters
    const expanded = [];
    for (let i = startNum; i <= endNum; i++) {
      expanded.push(`${bookStart}.${i}`);
    }

    return expanded;
  });

  // Dedupe
  const unique = [...new Set(refs)];

  return unique.map((ref) => {
    const [book, chapter] = ref!.split(".");

    const safeBook = book ? escapeRegex(book) : "";
    const safeChapter = chapter ? escapeRegex(chapter) : "";

    return chapter
      ? new RegExp(`${safeBook}\\.${safeChapter}(?=[.\\s]|$)`)
      : new RegExp(`${safeBook}(?=[.\\s]|$)`);
  });
};

const sortByScriptureRef = (data: SermonData[], refRegExp: RegExp[]) => {
  // Sort sermon data in ascending scripture order
  return data.sort((a, b) => {
    // Find ref matching search term
    const aMatch = a.data.scripture?.find((ref) =>
      refRegExp.some((regExp) => regExp.test(ref.osis ?? "")),
    );
    const bMatch = b.data.scripture?.find((ref) =>
      refRegExp.some((regExp) => regExp.test(ref.osis ?? "")),
    );

    // Handle no refs found; shouldn't ever trigger b/c of prior filter function
    if (!aMatch && !bMatch) return 0;
    if (!aMatch) return 1;
    if (!bMatch) return -1;

    // split into BCV array
    const aRef = aMatch.osis?.split("-")[0]?.split(".");
    const bRef = bMatch.osis?.split("-")[0]?.split(".");

    const aChapter = aRef && aRef[1] ? parseInt(aRef[1]) : 0;
    const aVerse = aRef && aRef[2] ? parseInt(aRef[2]) : 0;

    const bChapter = bRef && bRef[1] ? parseInt(bRef[1]) : 0;
    const bVerse = bRef && bRef[2] ? parseInt(bRef[2]) : 0;

    // sort by chapter for different chapters
    if (aChapter !== bChapter) {
      return aChapter - bChapter;
    }

    // Sort by verse if same chapter
    return aVerse - bVerse;
  });
};

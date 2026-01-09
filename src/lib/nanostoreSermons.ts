import type { DateValue } from "@internationalized/date";
// Import bcv_parser to parse scripture reference
import { bcv_parser } from "bible-passage-reference-parser/esm/bcv_parser.js";
import * as lang from "bible-passage-reference-parser/esm/lang/en.js";
import Fuse from "fuse.js";
import { atom, computed, map } from "nanostores";

import type { SermonData } from "@/lib/types";

const bcv = new bcv_parser(lang);
bcv.set_options({
  book_alone_strategy: "full",
});

/** ------------------------ Types ------------------------ */
export interface SermonFilterParamsValue {
  series?: string;
  preacher?: string;
  from?: DateValue;
  to?: DateValue;
  sermonSearchTerm?: string;
}

export const isSermonFilterKey = (
  key: string,
): key is keyof SermonFilterParamsValue => {
  // NOTE: Be sure to update this array if changing SermonFilterParamsValue interface
  return ["series", "preacher", "from", "to", "sermonSearchTerm"].includes(key);
};

/** ------------------------ Stores ------------------------ */
export const $sermonFilterParams = map<SermonFilterParamsValue>({});
export const $allSermonData = atom<SermonData[] | undefined>(undefined);

/** ------------------------ Fuse.js Options ------------------------ */
const sermonSearchOptions = {
  includeScore: true,
  keys: [
    { name: "data.title", weight: 0.7 },
    { name: "preacher.data.name", weight: 0.3 },
  ],
};

/** ------------------------ Computed Filtered Sermons ------------------------ */
export const $filteredSermons = computed(
  [$sermonFilterParams, $allSermonData],
  ({ series, preacher, from, to, sermonSearchTerm }, allSermonData) => {
    if (!allSermonData) return undefined;

    let sermonData = allSermonData;

    // Filter by series
    if (series)
      sermonData = sermonData.filter((item) => item.series.id === series);

    // Filter by preacher
    if (preacher)
      sermonData = sermonData.filter((item) => item.preacher.id === preacher);

    // Filter by date range
    if (from)
      sermonData = sermonData.filter(
        (item) => item.data.date >= from.toDate("UTC"),
      );

    if (to)
      sermonData = sermonData.filter(
        (item) => item.data.date <= to.toDate("UTC"),
      );

    // Filter by search term
    if (sermonSearchTerm !== "" && sermonSearchTerm !== undefined) {
      // Check if search term is a parsable verse reference
      const osis = bcv.parse(sermonSearchTerm).osis();

      // If yes, filter by verse reference
      if (osis) {
        const sermonFilter = getRegExpFromOsis(osis);

        // Find sermons where scripture ref in .md file matches regex version of search term
        sermonData = sermonData.filter((s) =>
          s.data.scripture?.some((ref) =>
            sermonFilter?.some((regex) => regex.test(ref)),
          ),
        );

        // Sort sermon data in ascending scripture order
        sermonData = sermonData.sort((a, b) => {
          // Find ref matching search term
          const aMatch = a.data.scripture?.find((ref) =>
            sermonFilter?.some((regex) => regex.test(ref)),
          );
          const bMatch = b.data.scripture?.find((ref) =>
            sermonFilter?.some((regex) => regex.test(ref)),
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
      } else {
        // If no, make fuzzy search using fuse
        const fuse = new Fuse(sermonData, sermonSearchOptions);
        const result = fuse.search(sermonSearchTerm);

        sermonData = result.map((hit) => hit.item);
      }
    }

    return sermonData;
  },
);

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

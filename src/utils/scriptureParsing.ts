import { bcv_parser } from "bible-passage-reference-parser/esm/bcv_parser";
import * as lang from "bible-passage-reference-parser/esm/lang/en.js";
import brf_parser from "bible-reference-formatter";

import type { ParsedRef, SermonData } from "@/data/types";

export const bcv = new bcv_parser(lang);
bcv.set_options({
  book_alone_strategy: "full",
});

export const parseRef = (input: string): ParsedRef => {
  const osis = bcv.parse(input).osis();
  if (!osis) {
    return {
      osis: null,
      text: null,
      error: input,
    };
  }

  return { osis, text: brf_parser("esv-long", osis), error: null };
};

export const compactRef = (ref: string) => brf_parser("esv-short", ref);

export const listInvalidScriptureRefs = (
  allSermonData: SermonData[],
): string[] =>
  allSermonData.flatMap((sermon) =>
    (sermon.data.scripture ?? [])
      .filter((ref) => ref.error)
      .map(
        (ref) =>
          `Invalid reference "${ref.error}" in file ${sermon.data.title}`,
      ),
  );

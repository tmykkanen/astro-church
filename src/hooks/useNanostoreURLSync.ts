import { parseDate } from "@internationalized/date";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

import {
  $blogFilterParams,
  type BlogFilterParamsValue,
  isBlogFilterKey,
} from "@/lib/nanostoreBlog";
import {
  $sermonFilterParams,
  type SermonFilterParamsValue,
  isSermonFilterKey,
} from "@/lib/nanostoreSermons";
import { isDateValue } from "@/lib/types";

type FilterKey = string;

const normalize = <T>(value: T | null | undefined) =>
  value === "" || value === null ? undefined : value;

/**
 * Hook to sync a nanostore key with the URL
 * @param key - nanostore key (string)
 */
export const useNanostoreURLSync = <T = any>(key: FilterKey) => {
  const isSermonKey = isSermonFilterKey(key as string);
  const isBlogKey = isBlogFilterKey(key as string);

  const store = isSermonKey ? $sermonFilterParams : $blogFilterParams;
  const storeValueRaw = useStore(store);

  // Narrow the value properly
  let storeValue: any;
  if (isSermonKey) {
    const sermonStore = storeValueRaw as SermonFilterParamsValue;
    storeValue = sermonStore[key as keyof SermonFilterParamsValue];
  } else if (isBlogKey) {
    const blogStore = storeValueRaw as BlogFilterParamsValue;
    storeValue = blogStore[key as keyof BlogFilterParamsValue];
  }

  const setValue = (value: T | null | undefined) => {
    const normalized = normalize(value);

    if (isSermonKey) {
      $sermonFilterParams.setKey(
        key as keyof SermonFilterParamsValue,
        normalized as any,
      );
    } else if (isBlogKey && !isDateValue(normalized)) {
      $blogFilterParams.setKey(
        key as keyof BlogFilterParamsValue,
        normalized as any,
      );
    }

    const url = new URL(window.location.href);
    if (normalized === undefined) url.searchParams.delete(key as string);
    else url.searchParams.set(key as string, String(normalized));

    window.history.replaceState({}, "", url);
  };

  useEffect(() => {
    const syncFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const urlValue = params.get(key as string);
      if (urlValue !== null) {
        const parsedValue =
          key === "from" || key === "to" ? parseDate(urlValue) : urlValue;

        setValue(parsedValue as T);
      }
    };

    syncFromURL();
    window.addEventListener("popstate", syncFromURL);
    return () => window.removeEventListener("popstate", syncFromURL);
  }, [key, setValue]);

  return { value: storeValue as T | null, setValue };
};

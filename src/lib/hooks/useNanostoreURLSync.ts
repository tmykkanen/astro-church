import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  $sermonFilterParams,
  isSermonFilterKey,
  type SermonFilterParamsValue,
} from "@/lib/nanostoreSermons";
import {
  $writingsFilterParams,
  isWritingsFilterKey,
  type WritingsFilterParamsValue,
} from "@/lib/nanostoreWritings";
import { isDateValue } from "@/lib/types";
import { parseDate } from "@internationalized/date";

type FilterKey = string;
// type FilterKey =
//   | keyof SermonFilterParamsValue
//   | keyof WritingsFilterParamsValue;

const normalize = <T>(value: T | null | undefined) =>
  value === "" || value === null ? undefined : value;

/**
 * Hook to sync a nanostore key with the URL
 * @param key - nanostore key (string)
 */
export const useNanostoreURLSync = <T = any>(key: FilterKey) => {
  const isSermonKey = isSermonFilterKey(key as string);
  const isWritingKey = isWritingsFilterKey(key as string);

  const store = isSermonKey ? $sermonFilterParams : $writingsFilterParams;
  const storeValueRaw = useStore(store);

  // Narrow the value properly
  let storeValue: any;
  if (isSermonKey) {
    const sermonStore = storeValueRaw as SermonFilterParamsValue;
    storeValue = sermonStore[key as keyof SermonFilterParamsValue];
  } else if (isWritingKey) {
    const writingStore = storeValueRaw as WritingsFilterParamsValue;
    storeValue = writingStore[key as keyof WritingsFilterParamsValue];
  }

  const setValue = (value: T | null | undefined) => {
    const normalized = normalize(value);

    if (isSermonKey) {
      $sermonFilterParams.setKey(
        key as keyof SermonFilterParamsValue,
        normalized as any,
      );
    } else if (isWritingKey && !isDateValue(normalized)) {
      $writingsFilterParams.setKey(
        key as keyof WritingsFilterParamsValue,
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

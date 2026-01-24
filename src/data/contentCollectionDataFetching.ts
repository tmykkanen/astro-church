import { getCollection, getEntry } from "astro:content";

import type { BlogData, PreacherData, SeriesData, SermonData } from "@/types";

/* ================================== */
/* ========= SITE CONFIG ============ */
/* ================================== */
/**
 * Fetch site configuration file from src/content-collections/site.config.json
 */
export const siteConfig = await getEntry("config", "siteconfig");

/* ================================== */
/* ========= SERMONS ================ */
/* ================================== */

/**
 * 1. Fetch sermon collection from `src/content-collections/sermons`.
 * 2. Sort entries.
 * 3. For each entry, replace series and preacher objects with full
 * content entries from their corresponding collections using getEntry()
 * @returns Promise<SermonData[]>
 */
const getAllSermonData = async (): Promise<SermonData[]> => {
  const allSermons = (await getCollection("sermons")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const promises = allSermons.map(async (sermonItem) => {
    return {
      ...sermonItem,
      series: await getEntry(sermonItem.data.series),
      preacher: await getEntry(sermonItem.data.preacher),
    };
  });

  return Promise.all(promises);
};

/**
 * Const to hold return from getAllSermonData().
 * Contains an array of SermonData.
 * This is the same as the results of getCollection("sermons"),
 * with the exception that the results are sorted and series and preacher entries are
 * replaced with the getEntry() results for each.
 */
export const allSermonData = await getAllSermonData();

/* ================================== */
/* ========= SERIES ================= */
/* ================================== */

/**
 * 1. Fetch series collection from `src/content-collections/series`.
 * 2. Sort entries by date.
 * @returns Promise<SeriesData[]>
 */
const getAllSeriesData = async (): Promise<SeriesData[]> => {
  return (await getCollection("series")).sort(
    (a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf(),
  );
};

/**
 * Const to hold return from getAllSeriesData().
 * Contains an array of SeriesData, sorted by date.
 */
export const allSeriesData = await getAllSeriesData();

/* ================================== */
/* ========= PREACHER =============== */
/* ================================== */

/**
 * 1. Fetch preachers collection from `src/content-collections/preachers`.
 * 2. Sort entries: Last Name -> Priority -> Guest Status.
 * @returns Promise<PreacherData[]>
 */
const getAllPreachersData = async (): Promise<PreacherData[]> => {
  const preachers = await getCollection("preachers");

  return preachers.sort((a, b) => {
    // 1. Sort by Last Name
    const nameA = a.data.name.split(" ").at(-1) || "";
    const nameB = b.data.name.split(" ").at(-1) || "";
    const alpha = nameA.localeCompare(nameB);
    if (alpha !== 0) return alpha;

    // 2. Sort by Priority (1 is high, 0/unset is low)
    const prioA = a.data.priority === 0 ? 9999 : a.data.priority;
    const prioB = b.data.priority === 0 ? 9999 : b.data.priority;
    if (prioA !== prioB) return prioA - prioB;

    // 3. Guest status (Staff first)
    return Number(a.data.isGuest) - Number(b.data.isGuest);
  });
};

/**
 * Const to hold return from getAllPreachersData().
 * Contains an array of PreacherData, sorted by name, priority, and guest status.
 */
export const allPreachersData = await getAllPreachersData();

/* ================================== */
/* ========= BLOG =================== */
/* ================================== */

/**
 * 1. Fetch blog collection from `src/content-collections/blog`.
 * 2. Sort entries by date.
 * @returns Promise<BlogData[]>
 */
const getAllBlogData = async (): Promise<BlogData[]> => {
  return (await getCollection("blog")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
};

/**
 * Const to hold return from getAllBlogData().
 * Contains an array of PreacherData, sorted by name, priority, and guest status.
 */
export const allBlogData = await getAllBlogData();

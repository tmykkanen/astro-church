import Fuse from "fuse.js";
import { atom, computed, map } from "nanostores";

import type { BlogData } from "@/lib/types";

export interface BlogFilterParamsValue {
  tag?: string;
  blogSearchTerm?: string;
}

export const isBlogFilterKey = (
  key: string,
): key is keyof BlogFilterParamsValue => {
  return ["tag", "blogSearchTerm"].includes(key);
};

export const $blogFilterParams = map<BlogFilterParamsValue>({});
export const $allBlogData = atom<BlogData[] | undefined>(undefined);

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

export const $filteredBlog = computed(
  [$blogFilterParams, $allBlogData],
  ({ tag, blogSearchTerm }, allBlogData) => {
    if (!allBlogData) return undefined;

    let blogData = allBlogData;

    if (tag) {
      blogData = blogData.filter((item) => item.data.tags?.includes(tag));
    }

    if (blogSearchTerm !== "" && blogSearchTerm !== undefined) {
      const fuse = new Fuse(blogData, blogSearchOptions);
      const result = fuse.search(blogSearchTerm);

      blogData = result.map((hit) => hit.item);
    }

    return blogData;
  },
);

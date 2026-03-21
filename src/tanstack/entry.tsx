import { RouterProvider, createRouter } from "@tanstack/react-router";
import type { FC } from "react";

import type {
  BlogData,
  Paths,
  PreacherData,
  SeriesData,
  SermonData,
} from "@/data/types.ts";

// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {} as RouterContext,
  search: {
    strict: true,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Usually here we would render to the DOM, but since Astro will handle
// this for us we are okay to just return the component
export interface RouterContext {
  type: "sermon" | "blog";
  allSermonData?: SermonData[];
  allSeriesData?: SeriesData[];
  allPreachersData?: PreacherData[];
  allBlogData?: BlogData[];
  paths: Paths;
}

export const TanstackRouterProvider: FC<RouterContext> = ({
  type,
  allSermonData,
  allSeriesData,
  allPreachersData,
  allBlogData,
  paths,
}) => (
  <RouterProvider
    router={router}
    context={{
      type,
      allSermonData,
      allSeriesData,
      allPreachersData,
      paths,
      allBlogData,
    }}
  />
);

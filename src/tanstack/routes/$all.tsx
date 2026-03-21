import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod/v3";

import BlogArchive from "../components/BlogArchive";
import SermonArchive from "../components/SermonArchive";

export const defaultSearchValues = {
  q: "",
  series: "",
  preacher: "",
  from: "",
  to: "",
  tag: "",
};

const SearchSchema = z.object({
  q: z.string().default(defaultSearchValues.q),
  series: z.string().default(defaultSearchValues.series),
  preacher: z.string().default(defaultSearchValues.preacher),
  from: z.string().default(defaultSearchValues.from),
  to: z.string().default(defaultSearchValues.to),
  tag: z.string().default(defaultSearchValues.tag),
});

export type SearchSchemaProps = z.infer<typeof SearchSchema>;

export const Route = createFileRoute("/$all")({
  component: RouteComponent,
  loader: ({ context }) => {
    return context;
  },
  validateSearch: zodValidator(SearchSchema),
  search: {
    // strip default values
    middlewares: [stripSearchParams(defaultSearchValues)],
  },
});

function RouteComponent() {
  const context = Route.useLoaderData();

  if (context.type === "sermon") return <SermonArchive />;

  if (context.type === "blog") return <BlogArchive />;

  return (
    <div>
      <p>Please set a type</p>
    </div>
  );
}

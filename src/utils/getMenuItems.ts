import { type CollectionEntry, getCollection } from "astro:content";

import type { MenuItem } from "@/data/types";

const DEFAULT_ORDER = 999;

const toTitleCase = (str: string) =>
  str
    .replace(/-./g, (s) => " " + s[1]?.toUpperCase())
    .replace(/^./, (s) => s.toUpperCase());

const sortItems = (items: MenuItem[]): MenuItem[] =>
  [...items]
    .sort((a, b) => a.order - b.order)
    .map((item) => ({ ...item, submenu: sortItems(item.submenu) }));

const buildMenu = (
  pages: {
    id: string;
    filePath?: string;
    label: string;
    order?: number;
    type?: string;
  }[],
): MenuItem[] => {
  const root: Record<string, MenuItem> = {};

  for (const {
    id,
    filePath,
    label,
    order = DEFAULT_ORDER,
    type = null,
  } of pages) {
    const parts = id.split("/").filter(Boolean);

    if (!parts?.length) continue;

    parts.reduce(
      (siblings, part, i) => {
        const path = parts.slice(0, i + 1).join("/");

        const isLeaf = i === parts.length - 1;
        const isIndex = filePath?.split("/").slice(-1)[0] === "index.md";

        // Determine node label
        let nodeLabel: string;
        if (isIndex) {
          nodeLabel = toTitleCase(part);
        } else {
          nodeLabel = isLeaf ? label : toTitleCase(part);
        }

        let node = siblings.find((n) => n.path === path);

        if (!node) {
          node = {
            path,
            label: nodeLabel,
            order: DEFAULT_ORDER,
            type: null,
            submenu: [],
          };
          siblings.push(node);
        }

        if (isLeaf) {
          node.order = order;
          node.type = type;
        }

        // Store top-level nodes in root map for deduplication
        if (i === 0) root[path] ??= node;

        return node.submenu;
      },
      Object.values(root) as MenuItem[],
    );
  }

  return sortItems(Object.values(root));
};

const validateUniquePageTypes = (
  allPages: CollectionEntry<"pages">[],
  types: string[],
) => {
  for (const type of types) {
    const pagesWithType = allPages.filter((p) => p.data.type === type);

    if (pagesWithType.length > 1) {
      throw new Error(
        `Only one page can have type="${type}", but found ${pagesWithType.length}:\n` +
          pagesWithType
            .map((p) => `- ${p.data.title} (${p.filePath})`)
            .join("\n"),
      );
    }
  }
};

const pages = await getCollection("pages");

validateUniquePageTypes(pages, ["blog", "events", "sermons"]);

export const menu = buildMenu(
  pages.map((p) => ({
    id: p.id,
    filePath: p.filePath,
    label: p.data.title,
    order: p.data.order,
    type: p.data.type,
  })),
);

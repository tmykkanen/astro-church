import { getCollection } from "astro:content";

interface SimplifiedPageData {
  id: string[];
  path: string[];
  label: string;
  order?: number;
  type?: string;
}

export interface MenuItem {
  path: string;
  label: string;
  order: number;
  type: string | null;
  submenu: MenuItem[];
}

const getSimplifiedPageData = async (): Promise<SimplifiedPageData[]> => {
  const pages = await getCollection("pages");

  return pages.map((page) => ({
    id: page.id.split("/"),
    path: page
      .filePath!.replace("src/content-collections/pages/", "")
      .split("/"),
    label: page.data.title,
    order: page.data.order,
    type: page.data.type,
  }));
};

const createSortedNestedMenu = (data: SimplifiedPageData[]): MenuItem[] => {
  const menu: Record<string, MenuItem> = {};

  data.forEach((item) => {
    const pathParts = item.id;

    // Top-level item (no parent folder)
    if (pathParts.length === 1) {
      const key = pathParts[0];
      if (!menu[key]) {
        menu[key] = {
          path: key,
          label: item.label,
          order: item.order ?? 999,
          type: item.type ?? null,
          submenu: [],
        };
      } else {
        // Update order & type if this is the parent definition
        menu[key].order = item.order ?? 999;
        menu[key].type = item.type ?? null;
      }
    }
    // Nested item (has parent folder(s))
    else {
      const rootKey = pathParts[0];

      // Create root if it doesn't exist
      if (!menu[rootKey]) {
        menu[rootKey] = {
          path: rootKey,
          label: rootKey
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          order: 999, // Default high order for auto-generated parents
          type: null,
          submenu: [],
        };
      }

      // Navigate/create nested structure
      let currentLevel = menu[rootKey].submenu;
      let currentPath = rootKey;

      for (let i = 1; i < pathParts.length; i++) {
        currentPath += "/" + pathParts[i];
        const isLastPart = i === pathParts.length - 1;

        if (isLastPart) {
          // Add the final item
          currentLevel.push({
            path: currentPath,
            label: item.label,
            order: item.order ?? 999,
            type: item.type ?? null,
            submenu: [],
          });
        } else {
          // Find or create intermediate parent
          let parent = currentLevel.find((p: any) => p.path === currentPath);

          if (!parent) {
            parent = {
              path: currentPath,
              label: pathParts[i]
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              order: 999, // Default high order for auto-generated parents
              type: null,
              submenu: [],
            };
            currentLevel.push(parent);
          }

          currentLevel = parent.submenu;
        }
      }
    }
  });

  // Sort all levels recursively
  const sortSubmenu = (items: MenuItem[]) => {
    items.sort((a, b) => a.order - b.order);
    items.forEach((item) => {
      if (item.submenu && item.submenu.length > 0) {
        sortSubmenu(item.submenu);
      }
    });
  };

  const result = Object.values(menu);

  sortSubmenu(result);

  return result;
};

const getMenuItems = async (): Promise<MenuItem[]> => {
  const simplifiedPagesData = await getSimplifiedPageData();
  const menu = createSortedNestedMenu(simplifiedPagesData);

  return menu;
};

export const menu = await getMenuItems();

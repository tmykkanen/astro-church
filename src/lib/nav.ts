import slugify from "slugify";

import config from "@/_site-config.json";

export type ConfigMenuItem = {
  title: string;
  type?: string;
  subMenu?: ConfigMenuItem[];
};

export interface NavEntry {
  label: string;
  path: string;
  subMenu?: NavEntry[];
}

export type DynamicPath = {
  label: string;
  path: string;
};

const prepNavEntry = (item: ConfigMenuItem): NavEntry => {
  return item.subMenu
    ? {
        label: item.title,
        path: slugify(item.title, { lower: true, strict: true }),
        subMenu: item.subMenu.map((subItem: ConfigMenuItem) =>
          prepNavEntry(subItem),
        ),
      }
    : {
        label: item.title,
        path: slugify(item.title, { lower: true, strict: true }),
      };
};

export const navEntries: NavEntry[] = config.header.menu.map((item) =>
  prepNavEntry(item),
);

const findPathByType = (
  menuItemsArray: ConfigMenuItem[],
  targetType: string,
): DynamicPath | undefined => {
  for (const menuItem of menuItemsArray) {
    if (menuItem.type === targetType) {
      return {
        label: menuItem.title,
        path: slugify(menuItem.title).toLowerCase(),
      };
    }
    if (menuItem.subMenu && Array.isArray(menuItem.subMenu)) {
      const subMenuItem = findPathByType(menuItem.subMenu, targetType);
      if (subMenuItem) {
        return {
          label: subMenuItem.label,
          path: `${slugify(menuItem.title).toLowerCase()}/${subMenuItem.path}`,
        };
      }
    }
  }
};

export const eventsPath = findPathByType(config.header.menu, "Events");
export const blogPath = findPathByType(config.header.menu, "Blog");

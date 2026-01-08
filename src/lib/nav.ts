import config from "@/_site-config.json";
import slugify from "slugify";

type ConfigMenuItem = {
  title: string;
  subMenu?: ConfigMenuItem[];
};

export interface NavEntry {
  label: string;
  path: string;
  subMenu?: NavEntry[];
}

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

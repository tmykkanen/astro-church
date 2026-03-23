import { type DynamicPath } from "@/data/types";
import { type MenuItem, menu } from "@/utils/getMenuItems";

const findPathByType = (
  menuItems: MenuItem[],
  targetType: "blog" | "events" | "sermons",
): DynamicPath | undefined => {
  const results: DynamicPath[] = [];

  for (const item of menuItems) {
    if (item.type === targetType) {
      results.push({
        label: item.label,
        path: item.path,
      });
    }
    if (item.submenu.length > 0) {
      const submenuItems = findPathByType(item.submenu, targetType);
      if (submenuItems) {
        results.push({
          label: submenuItems.label,
          path: submenuItems.path,
        });
      }
    }
  }

  if (results.length > 1) {
    throw new Error(
      `Max one menu item with type "${targetType}" allowed! Found ${results.length} in configuration.`,
    );
  }

  return results[0];
};

export const paths = {
  blog: findPathByType(menu, "blog"),
  events: findPathByType(menu, "events"),
  sermons: findPathByType(menu, "sermons"),
};

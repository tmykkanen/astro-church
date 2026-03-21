import { useEffect, useMemo, useState } from "react";

export const useUrlSearchParams = () => {
  const [search, setSearch] = useState(() => window.location.search);

  useEffect(() => {
    const update = () => {
      const next = window.location.search;
      setSearch((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("popstate", update);

    const wrap = (method: "pushState" | "replaceState") => {
      const original = history[method];

      history[method] = function (...args: any[]) {
        const result = original.apply(this, args);
        update();
        return result;
      };

      return original;
    };

    const originalPush = wrap("pushState");
    const originalReplace = wrap("replaceState");

    return () => {
      window.removeEventListener("popstate", update);
      history.pushState = originalPush;
      history.replaceState = originalReplace;
    };
  }, []);

  return useMemo(() => new URLSearchParams(search), [search]);
};

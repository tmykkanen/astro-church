import { useEffect, useState } from "react";

const useIsMobile = (MOBILE_BREAKPOINT = 768): boolean => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    mql.addEventListener("change", handler);
    setIsMobile(mql.matches);

    return () => mql.removeEventListener("change", handler);
  }, [MOBILE_BREAKPOINT]);

  return isMobile;
};

export default useIsMobile;

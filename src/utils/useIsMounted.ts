import { useEffect, useState } from "react";

import { wait } from "./wait";

export const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // wait(500).then(() => setIsMounted(true));
    setIsMounted(true);
  }, []);

  return { isMounted };
};

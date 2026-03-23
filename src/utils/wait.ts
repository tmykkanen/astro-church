export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// wait(500).then(() => setIsMounted(true));

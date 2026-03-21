import { useEffect, useState } from "react";

export default function useUrlState(key: string, defaultValue: string) {
  const getValueFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) ?? defaultValue;
  };

  const [value, setValue] = useState(getValueFromUrl);

  // Sync state => URLSearchParams

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (value === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newURL);
  }, [value, key, defaultValue]);

  // Sync URL => state (back/forward support)

  useEffect(() => {
    const handlePopState = () => {
      setValue(getValueFromUrl());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return [value, setValue] as const;
}

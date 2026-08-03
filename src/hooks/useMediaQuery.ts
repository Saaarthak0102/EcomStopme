"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    let q = query;
    if (query === 'lg') q = '(min-width: 1024px)';
    if (query === 'md') q = '(min-width: 768px)';
    if (query === 'sm') q = '(min-width: 640px)';

    const media = window.matchMedia(q);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

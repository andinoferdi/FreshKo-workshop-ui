import { useEffect, useLayoutEffect } from "react";

// Suppress useLayoutEffect warning on server side and provide proper SSR handling
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined"
    ? useLayoutEffect
    : useEffect;

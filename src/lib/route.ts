import { useCallback, useEffect, useState } from "react";

export const OBJECTS = ["prancheta", "quadro", "monitor", "caderno", "estante", "envelope"] as const;
export type ObjectId = (typeof OBJECTS)[number];

export type Route = { obj: ObjectId | null; sub: string | null };

function parse(hash: string): Route {
  const [obj, sub] = hash.replace(/^#\/?/, "").split("/");
  return OBJECTS.includes(obj as ObjectId) ? { obj: obj as ObjectId, sub: sub || null } : { obj: null, sub: null };
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parse(location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = useCallback((obj: ObjectId | null, sub?: string | null) => {
    const next = obj ? `#/${obj}${sub ? `/${sub}` : ""}` : "#/";
    if (location.hash !== next) location.hash = next;
  }, []);

  return { ...route, go };
}

export type Go = ReturnType<typeof useRoute>["go"];

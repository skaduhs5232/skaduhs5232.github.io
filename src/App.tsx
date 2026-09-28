import { lazy, Suspense, useEffect, useRef, type ComponentType } from "react";
import { Room } from "./scene/Room";
import { useRoute, type Go, type ObjectId } from "./lib/route";

export type ViewProps = { sub: string | null; go: Go };

const views: Record<ObjectId, ComponentType<ViewProps>> = {
  prancheta: lazy(() => import("./views/Clipboard")),
  quadro: lazy(() => import("./views/Board")),
  monitor: lazy(() => import("./views/Monitor")),
  caderno: lazy(() => import("./views/Notebook")),
  estante: lazy(() => import("./views/Shelf")),
  envelope: lazy(() => import("./views/Letter")),
};

export default function App() {
  const { obj, sub, go } = useRoute();
  const lastObj = useRef<ObjectId | null>(null);

  useEffect(() => {
    if (obj) {
      lastObj.current = obj;
      localStorage.setItem("visited", "1");
      return;
    }
    if (lastObj.current) document.querySelector<HTMLElement>(`[data-obj="${lastObj.current}"]`)?.focus({ preventScroll: true });
  }, [obj]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !obj) return;
      sub ? go(obj) : go(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [obj, sub, go]);

  const View = obj ? views[obj] : null;

  return (
    <>
      <Room focus={obj} onOpen={(id) => go(id)} />
      {View && (
        <Suspense fallback={<div className="view-loading hand">abrindo…</div>}>
          <View key={obj} sub={sub} go={go} />
        </Suspense>
      )}
    </>
  );
}

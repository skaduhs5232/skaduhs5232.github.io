import { useEffect, useMemo } from "react";
import { getContent } from "./content";
import { usePrefs } from "./lib/prefs";
import PullRequest from "./pr/PullRequest";

export default function App() {
  const prefs = usePrefs();
  const content = useMemo(() => getContent(prefs.lang), [prefs.lang]);

  useEffect(() => {
    document.title = content.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", content.meta.description);
  }, [content]);

  return <PullRequest c={content} {...prefs} />;
}

import { useEffect, useState } from "react";
import { profile } from "../content";

export type Repo = { name: string; fork: boolean; language: string | null; stargazers_count: number; pushed_at: string };
export type GhEvent = { type: string; repo: string; created_at: string };
export type GitHubData = { repos: Repo[]; events: GhEvent[] };

const KEY = "gh-cache-v2";
let inflight: Promise<GitHubData> | null = null;

function load(): Promise<GitHubData> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (cached && Date.now() - cached.at < 30 * 60 * 1000) return Promise.resolve(cached.data);
  } catch {
    /* cache corrompido: busca de novo */
  }
  inflight ??= (async () => {
    const base = `https://api.github.com/users/${profile.githubUser}`;
    const [r, e] = await Promise.all([fetch(`${base}/repos?per_page=100&sort=pushed`), fetch(`${base}/events/public?per_page=30`)]);
    if (!r.ok) throw new Error(`GitHub ${r.status}`);
    const repos: Repo[] = (await r.json()).map(({ name, fork, language, stargazers_count, pushed_at }: Repo) => ({
      name, fork, language, stargazers_count, pushed_at,
    }));
    const events: GhEvent[] = e.ok
      ? (await e.json()).map((x: { type: string; repo: { name: string }; created_at: string }) => ({
          type: x.type, repo: x.repo.name, created_at: x.created_at,
        }))
      : [];
    const data = { repos, events };
    sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data }));
    return data;
  })();
  return inflight;
}

export function useGitHub() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    load().then((d) => alive && setData(d)).catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);
  return { data, failed };
}

export function findRepo(data: GitHubData | null, name?: string) {
  if (!data || !name) return null;
  return data.repos.find((r) => r.name.toLowerCase() === name.toLowerCase()) ?? null;
}

export function relTime(iso: string, locale: string) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [u, s] of units) if (Math.abs(diff) >= s) return rtf.format(Math.round(diff / s), u);
  return rtf.format(0, "minute");
}

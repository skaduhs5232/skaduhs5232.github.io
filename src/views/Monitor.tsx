import { useState, type KeyboardEvent } from "react";
import type { ViewProps } from "../App";
import { jobs, profile, projects, toolbox } from "../content";
import { relTime, useGitHub, type GhEvent } from "../lib/github";
import { ViewShell } from "./ViewShell";
import "../styles/monitor.scss";

const tabs = [
  { id: "demos", label: "demos ao vivo" },
  { id: "github", label: "github.log" },
  { id: "whoami", label: "whoami" },
] as const;
type Tab = (typeof tabs)[number]["id"];

const demos = projects.filter((p) => p.links.some((l) => l.type === "demo"));

export default function Monitor({ sub, go }: ViewProps) {
  const tab: Tab = tabs.some((t) => t.id === sub) ? (sub as Tab) : "demos";

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = tabs.findIndex((t) => t.id === tab);
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length].id;
    go("monitor", next);
    requestAnimationFrame(() => document.getElementById(`tab-${next}`)?.focus());
  };

  return (
    <ViewShell id="monitor" label="Monitor: demos e destaques técnicos" go={go} nearby={["quadro", "estante", "envelope"]}>
      <div className="bezel">
        <div className="screen">
          <div className="win-bar">
            <span className="dots" aria-hidden="true">
              <i /> <i /> <i />
            </span>
            <h2 id="monitor-title" className="win-title mono" tabIndex={-1}>
              thiago@bancada: ~/{tab}
            </h2>
          </div>

          <div className="win-tabs" role="tablist" aria-label="Janelas do monitor" onKeyDown={onKey}>
            {tabs.map((t) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                aria-controls="monitor-panel"
                tabIndex={tab === t.id ? 0 : -1}
                className="mono"
                onClick={() => go("monitor", t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div id="monitor-panel" className="win-body" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {tab === "demos" && <Demos go={go} />}
            {tab === "github" && <GitLog />}
            {tab === "whoami" && <WhoAmI />}
          </div>
        </div>
        <span className="bezel-brand mono" aria-hidden="true">
          bancada · 5232
        </span>
      </div>
    </ViewShell>
  );
}

function Demos({ go }: { go: ViewProps["go"] }) {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <>
      <p className="term-line">
        <span className="prompt">$</span> ls demos/ <span className="dim"># {demos.length} projetos rodando agora, abra em outra aba</span>
      </p>
      <ul className="demo-list">
        {demos.map((p) => {
          const url = p.links.find((l) => l.type === "demo")!.url;
          const repo = p.links.find((l) => l.type === "repo");
          return (
            <li key={p.id} className="demo">
              <div className="demo-head">
                <h3>{p.title}</h3>
                <span className="dim mono">{p.stack.slice(0, 3).join(" · ")}</span>
              </div>
              <p>{p.summary}</p>
              <div className="demo-actions">
                <a className="term-btn hot" href={url} target="_blank" rel="noopener">
                  abrir demo ↗
                </a>
                <button type="button" className="term-btn" aria-expanded={preview === p.id} onClick={() => setPreview(preview === p.id ? null : p.id)}>
                  {preview === p.id ? "fechar prévia" : "carregar prévia"}
                </button>
                {repo && (
                  <a className="term-btn" href={repo.url} target="_blank" rel="noopener">
                    código ↗
                  </a>
                )}
                <button type="button" className="term-btn" onClick={() => go("quadro", p.id)}>
                  ficha no quadro
                </button>
              </div>
              {preview === p.id && (
                <div className="demo-frame">
                  <iframe src={url} title={`Prévia: ${p.title}`} loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms" />
                  <p className="dim">Se a prévia ficar em branco, o site bloqueia iframes; use "abrir demo".</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

const verb: Record<string, string> = {
  PushEvent: "push",
  CreateEvent: "create",
  PullRequestEvent: "pr",
  IssuesEvent: "issue",
  WatchEvent: "star",
  ForkEvent: "fork",
  ReleaseEvent: "release",
};

function groupEvents(events: GhEvent[]) {
  const out: { repo: string; type: string; n: number; at: string }[] = [];
  for (const e of events) {
    const last = out[out.length - 1];
    if (last && last.repo === e.repo && last.type === e.type) last.n++;
    else out.push({ repo: e.repo, type: e.type, n: 1, at: e.created_at });
  }
  return out.slice(0, 12);
}

function GitLog() {
  const { data, failed } = useGitHub();

  if (failed)
    return (
      <p className="term-line">
        <span className="err">erro:</span> a API do GitHub não respondeu (limite de requisições?).{" "}
        <a href={profile.github} target="_blank" rel="noopener">
          ver perfil direto ↗
        </a>
      </p>
    );
  if (!data)
    return (
      <p className="term-line">
        <span className="prompt">$</span> curl api.github.com/users/{profile.githubUser} <span className="term-caret" aria-hidden="true" />
      </p>
    );

  const own = data.repos.filter((r) => !r.fork);
  const stars = own.reduce((s, r) => s + r.stargazers_count, 0);
  const langs = Object.entries(
    own.reduce<Record<string, number>>((acc, r) => {
      if (r.language) acc[r.language] = (acc[r.language] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);
  const max = langs[0]?.[1] ?? 1;

  return (
    <>
      <p className="term-line">
        <span className="prompt">$</span> gh stats {profile.githubUser}
      </p>
      <dl className="gh-stats">
        <div>
          <dt>repos</dt>
          <dd>{own.length}</dd>
        </div>
        <div>
          <dt>estrelas</dt>
          <dd>{stars}</dd>
        </div>
        <div>
          <dt>último push</dt>
          <dd>{own[0] ? relTime(own[0].pushed_at) : "—"}</dd>
        </div>
      </dl>

      <p className="term-line">
        <span className="prompt">$</span> gh langs --top 7
      </p>
      <ul className="gh-langs">
        {langs.map(([l, n]) => (
          <li key={l}>
            <span>{l}</span>
            <span className="bar" style={{ width: `${(n / max) * 100}%` }} aria-hidden="true" />
            <span className="dim">{n}</span>
          </li>
        ))}
      </ul>

      <p className="term-line">
        <span className="prompt">$</span> gh log --public
      </p>
      <ul className="gh-log">
        {groupEvents(data.events).map((e, i) => (
          <li key={i}>
            <span className="dim">{relTime(e.at)}</span>
            <span className="hot">{verb[e.type] ?? e.type.replace("Event", "").toLowerCase()}</span>
            <a href={`https://github.com/${e.repo}`} target="_blank" rel="noopener">
              {e.repo.replace(`${profile.githubUser}/`, "")}
            </a>
            {e.n > 1 && <span className="dim">×{e.n}</span>}
          </li>
        ))}
      </ul>
    </>
  );
}

function WhoAmI() {
  return (
    <>
      <p className="term-line">
        <span className="prompt">$</span> whoami
      </p>
      <pre className="whoami">
{`${profile.name}
${profile.role} @ ${jobs[0].org}
${profile.location} · ${profile.tagline}`}
      </pre>
      <p className="term-line">
        <span className="prompt">$</span> cat ~/.toolbox
      </p>
      <dl className="toolbox">
        {toolbox.map((g) => (
          <div key={g.group}>
            <dt>{g.group.toLowerCase()}:</dt>
            <dd>{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
      <p className="term-line">
        <span className="prompt">$</span> <span className="term-caret" aria-hidden="true" />
      </p>
    </>
  );
}

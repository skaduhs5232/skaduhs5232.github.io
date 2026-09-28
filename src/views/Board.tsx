import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ViewProps } from "../App";
import { linkLabel, projects, statusInfo, type Project, type Status } from "../content";
import { findRepo, relTime, useGitHub, type GitHubData } from "../lib/github";
import { ViewShell } from "./ViewShell";
import "../styles/board.scss";

const tilt = (i: number) => (((i * 37) % 9) - 4) * 0.55;

const filters: { id: Status | "all"; label: string }[] = [
  { id: "all", label: "tudo" },
  { id: "production", label: statusInfo.production.label },
  { id: "oss", label: statusInfo.oss.label },
  { id: "research", label: statusInfo.research.label },
  { id: "lab", label: statusInfo.lab.label },
];

export default function Board({ sub, go }: ViewProps) {
  const [filter, setFilter] = useState<Status | "all">("all");
  const { data } = useGitHub();
  const open = projects.find((p) => p.id === sub) ?? null;
  const lastOpen = useRef<string | null>(null);

  useEffect(() => {
    if (open) lastOpen.current = open.id;
    else if (lastOpen.current) document.querySelector<HTMLElement>(`[data-card="${lastOpen.current}"]`)?.focus();
  }, [open]);

  const shown = projects.filter((p) => filter === "all" || p.status === filter);

  return (
    <ViewShell id="quadro" label="Quadro de projetos" go={go} nearby={["monitor", "prancheta", "envelope"]}>
      <div className="board" {...(open ? { inert: true } : {})}>
        <header className="board-head">
          <h2 id="quadro-title" className="board-title" tabIndex={-1}>
            Quadro de projetos
          </h2>
          <p className="board-sub hand">
            {projects.length} peças pregadas · clique num card para abrir a ficha
          </p>
          <div className="board-pins" role="group" aria-label="Filtrar pela cor do alfinete">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`pin-filter${filter === f.id ? " on" : ""}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.id !== "all" && <span className={`dot pin-${statusInfo[f.id].pin}`} aria-hidden="true" />}
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <ul className="pinned">
          {shown.map((p) => (
            <li key={p.id} style={{ "--tilt": `${tilt(projects.indexOf(p))}deg` } as CSSProperties}>
              <PinnedCard p={p} data={data} onOpen={() => go("quadro", p.id)} />
            </li>
          ))}
        </ul>
      </div>

      {open && <Sheet p={open} data={data} onClose={() => go("quadro")} />}
    </ViewShell>
  );
}

function PinnedCard({ p, data, onOpen }: { p: Project; data: GitHubData | null; onOpen: () => void }) {
  const repo = findRepo(data, p.repo);
  const polaroid = Boolean(p.image);
  return (
    <button type="button" className={`pcard ${polaroid ? "polaroid" : "index"} s-${p.status}`} data-card={p.id} onClick={onOpen}>
      <span className={`pin pin-${statusInfo[p.status].pin}`} aria-hidden="true" />
      {polaroid && (
        <span className="pcard-photo">
          <img src={p.image} alt="" loading="lazy" decoding="async" />
        </span>
      )}
      <span className="pcard-meta mono">
        <span>{statusInfo[p.status].label}</span>
        <span>
          {repo && repo.stargazers_count > 0 && <>★ {repo.stargazers_count} · </>}
          {p.year}
        </span>
      </span>
      <span className="pcard-title">{p.title}</span>
      <span className="pcard-summary">{p.summary}</span>
      {p.metric && (
        <span className="pcard-metric hand">
          {p.metric.value} <small>{p.metric.label}</small>
        </span>
      )}
      <span className="pcard-stack mono">{p.stack.slice(0, 4).join(" · ")}</span>
    </button>
  );
}

function Sheet({ p, data, onClose }: { p: Project; data: GitHubData | null; onClose: () => void }) {
  const repo = findRepo(data, p.repo);
  useEffect(() => {
    document.getElementById("sheet-title")?.focus({ preventScroll: true });
  }, [p.id]);

  return (
    <div className="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <article className="sheet paper" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <span className="pin pin-a pin-caju" aria-hidden="true" />
        <span className="pin pin-b pin-azul" aria-hidden="true" />
        <button type="button" className="sheet-close mono" onClick={onClose}>
          voltar ao quadro ✕
        </button>

        <p className="kicker">Ficha técnica · {statusInfo[p.status].label}</p>
        <h3 id="sheet-title" className="serif-title" tabIndex={-1}>
          {p.title}
        </h3>
        <p className="sheet-summary">{p.summary}</p>

        {p.image && <img className="sheet-img" src={p.image} alt={`Captura de tela: ${p.title}`} />}

        <dl className="sheet-spec mono">
          <div>
            <dt>ano</dt>
            <dd>{p.year}</dd>
          </div>
          <div>
            <dt>papel</dt>
            <dd>{p.role}</dd>
          </div>
          {p.metric && (
            <div>
              <dt>marca</dt>
              <dd>
                <b>{p.metric.value}</b> {p.metric.label}
              </dd>
            </div>
          )}
          {repo && (
            <div>
              <dt>github</dt>
              <dd>
                ★ {repo.stargazers_count} · push {relTime(repo.pushed_at)}
              </dd>
            </div>
          )}
        </dl>

        {p.points.length > 0 && (
          <>
            <h4 className="sheet-h hand">o que eu fiz</h4>
            <ol className="sheet-points">
              {p.points.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          </>
        )}

        <h4 className="sheet-h hand">materiais</h4>
        <div className="stack-chips">
          {p.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>

        <div className="links sheet-links">
          {p.links.length ? (
            p.links.map((l) => (
              <a key={l.url} className={`btn${l.type === "demo" ? " primary" : ""}`} href={l.url} target="_blank" rel="noopener">
                {linkLabel[l.type]} ↗
              </a>
            ))
          ) : (
            <p className="muted mono">Código proprietário: sem link público.</p>
          )}
        </div>
      </article>
    </div>
  );
}

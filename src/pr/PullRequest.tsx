import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { profile, type Content, type Lang, type Project, type Status } from "../content";
import { findRepo, relTime, useGitHub, type GitHubData } from "../lib/github";
import { PALETTES, type Palette } from "../lib/prefs";
import "./pr.scss";

const TABS = ["conversation", "commits", "checks", "files"] as const;
type TabId = (typeof TABS)[number];

type Commit = { year: string; type: string; scope: string; msg: string; body?: string[]; href?: string; hash: string };
type Line = { text: string; href?: string };

const commitType: Record<Status, string> = { production: "feat", oss: "feat", research: "research", lab: "exp" };

function hash(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

function buildCommits(c: Content): Commit[] {
  return [
    ...c.career.map((x) => ({ ...x, body: x.job === undefined ? undefined : c.jobs[x.job].points })),
    ...c.projects.map((p) => ({
      year: p.year.slice(0, 4),
      type: commitType[p.status],
      scope: p.id,
      msg: p.metric ? `${p.title}: ${p.metric.value} ${p.metric.label}` : p.title,
      href: p.links[0]?.url,
    })),
  ]
    .map((x, i) => ({ ...x, hash: hash(`${x.scope}${x.year}${i}`) }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

function diffLines(p: Project, c: Content): Line[] {
  const d = c.ui.diff;
  return [
    { text: `# ${p.title}` },
    { text: "" },
    { text: `> ${p.summary}` },
    { text: "" },
    { text: `- ${d.status}: ${c.status[p.status]}` },
    { text: `- ${d.year}: ${p.year}` },
    { text: `- ${d.role}: ${p.role}` },
    ...(p.metric ? [{ text: `- ${d.result}: ${p.metric.value} ${p.metric.label}` }] : []),
    ...(p.points.length ? [{ text: "" }, ...p.points.map((x) => ({ text: `* ${x}` }))] : []),
    { text: "" },
    { text: `stack: ${p.stack.join(", ")}` },
    ...p.links.map((l) => ({ text: `[${c.linkLabel[l.type]}](${l.url})`, href: l.url })),
  ];
}

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

type Props = {
  c: Content;
  lang: Lang;
  setLang: (l: Lang) => void;
  palette: Palette;
  setPalette: (p: Palette) => void;
};

export default function PullRequest({ c, lang, setLang, palette, setPalette }: Props) {
  const { ui } = c;
  const { data, failed } = useGitHub();
  const [tab, setTab] = useState<TabId>(() => {
    const h = location.hash.slice(1);
    return (TABS as readonly string[]).includes(h) ? (h as TabId) : "conversation";
  });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);

  const commits = useMemo(() => buildCommits(c), [c]);
  const files = useMemo(() => c.projects.map((p) => ({ p, lines: diffLines(p, c) })), [c]);
  const additions = files.reduce((n, f) => n + f.lines.length, 0);

  const select = (id: TabId, focus = false) => {
    setTab(id);
    history.replaceState(null, "", `${location.search}#${id}`);
    if (focus) tabRefs.current[TABS.indexOf(id)]?.focus();
  };

  const openTab = (id: TabId) => {
    select(id);
    tabsRef.current?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = TABS.length;
    const next = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(TABS[next], true);
  };

  const counts: Record<TabId, number> = {
    conversation: c.principles.length + 3,
    commits: commits.length,
    checks: c.toolbox.length + 2,
    files: files.length,
  };

  return (
    <div className="pr">
      <header className="pr-top">
        <p className="pr-crumb">
          <span>{ui.org}</span> / <b>{ui.repo}</b>
        </p>
        <div className="pr-top-right">
          <Prefs c={c} lang={lang} setLang={setLang} palette={palette} setPalette={setPalette} />
          <nav className="pr-top-actions" aria-label={ui.shortcuts}>
            <a className="pr-btn" href={profile.cv} download hrefLang="pt-BR">
              {ui.cv}
            </a>
            <a className="pr-btn" href={profile.github} target="_blank" rel="noopener">
              GitHub ↗
            </a>
          </nav>
        </div>
      </header>

      <div className="pr-wrap">
        <div className="pr-head">
          <h1>
            {ui.title(c.role)} <span className="pr-num">#5232</span>
          </h1>
          <div className="pr-meta">
            <span className="pr-state">
              <Icon d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 9.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM4.25 5v6M12 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM11.25 11V6a2 2 0 0 0-2-2H7" />
              {ui.open}
            </span>
            <p>
              <b>{profile.githubUser}</b> {ui.mergeInto(commits.length)} <code>{ui.org}:main</code> {ui.fromBranch} <code>thiago:senior</code>
            </p>
          </div>
        </div>

        <div className="pr-tabs" role="tablist" aria-label={ui.tablist} ref={tabsRef}>
          {TABS.map((id, i) => (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`tab-${id}`}
              role="tab"
              type="button"
              aria-selected={tab === id}
              aria-controls="pr-panel"
              tabIndex={tab === id ? 0 : -1}
              onClick={() => select(id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {ui.tabs[id]} <span className="pr-count">{counts[id]}</span>
            </button>
          ))}
          <span className="pr-diffstat" aria-label={ui.diffstat(additions)}>
            <span className="add">+{additions}</span> <span className="del">−0</span>
          </span>
        </div>

        <div id="pr-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="pr-panel">
          {tab === "conversation" && <Conversation c={c} commits={commits} data={data} failed={failed} openTab={openTab} />}
          {tab === "commits" && <Commits c={c} commits={commits} />}
          {tab === "checks" && <Checks c={c} data={data} failed={failed} />}
          {tab === "files" && <Files c={c} files={files} data={data} />}
        </div>
      </div>

      <footer className="pr-foot">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{ui.footer}</span>
      </footer>
    </div>
  );
}

function Prefs({ c, lang, setLang, palette, setPalette }: Props) {
  const { ui } = c;
  return (
    <div className="pr-prefs" role="group" aria-label={ui.prefs}>
      <fieldset className="pr-palettes">
        <legend className="sr-only">{ui.palette}</legend>
        {PALETTES.map((p) => (
          <label key={p.id} className="pr-swatch" data-p={p.id} title={ui.palettes[p.id]}>
            <input type="radio" name="palette" value={p.id} checked={palette === p.id} onChange={() => setPalette(p.id)} />
            <span className="sr-only">{ui.palettes[p.id]}</span>
          </label>
        ))}
      </fieldset>
      <div className="pr-lang" role="group" aria-label={ui.language}>
        {(["pt", "en"] as const).map((l) => (
          <a
            key={l}
            href={`?lang=${l}`}
            hrefLang={l}
            lang={l === "pt" ? "pt-BR" : "en"}
            aria-current={lang === l ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              setLang(l);
            }}
          >
            {l === "pt" ? "PT" : "EN"}
          </a>
        ))}
      </div>
    </div>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const mergeIcon =
  "M5 3.5a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0ZM5 12.5a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0ZM13.6 12.5a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0ZM3.7 5v6M12.3 11V7a2.5 2.5 0 0 0-2.5-2.5H7.5";

function Avatar({ small }: { small?: boolean }) {
  return (
    <span className={`pr-avatar${small ? " sm" : ""}`} aria-hidden="true">
      TS
    </span>
  );
}

function Comment({ title, children, tag }: { title: ReactNode; children: ReactNode; tag?: string }) {
  return (
    <article className="pr-comment">
      <Avatar />
      <div className="pr-comment-box">
        <header>
          <span>{title}</span>
          {tag && <span className="pr-tag">{tag}</span>}
        </header>
        <div className="pr-md">{children}</div>
      </div>
    </article>
  );
}

function Labels({ c }: { c: Content }) {
  return (
    <>
      {c.labels.map((l, i) => (
        <span key={l} className={`pr-label l-${i}`}>
          {l}
        </span>
      ))}
    </>
  );
}

function liveSummary(data: GitHubData | null) {
  const own = data?.repos.filter((r) => !r.fork) ?? [];
  return { own, stars: own.reduce((n, r) => n + r.stargazers_count, 0), last: own[0] };
}

type ConvProps = { c: Content; commits: Commit[]; data: GitHubData | null; failed: boolean; openTab: (id: TabId) => void };

function Conversation({ c, commits, data, failed, openTab }: ConvProps) {
  const { ui } = c;
  const [merging, setMerging] = useState(false);
  const [copied, setCopied] = useState(false);
  const confirmRef = useRef<HTMLAnchorElement>(null);
  const mergeRef = useRef<HTMLButtonElement>(null);
  const opened = useRef(false);
  useEffect(() => {
    if (merging) {
      opened.current = true;
      confirmRef.current?.focus();
    } else if (opened.current) mergeRef.current?.focus();
  }, [merging]);

  const { own, stars, last } = liveSummary(data);
  const demos = c.projects.flatMap((p) => p.links.filter((l) => l.type === "demo").map((l) => ({ p, url: l.url }))).slice(0, 5);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sem clipboard: o e-mail segue visível */
    }
  };

  return (
    <div className="pr-conv">
      <div className="pr-timeline">
        <Comment
          title={
            <>
              <b>{profile.githubUser}</b> {ui.described}
            </>
          }
          tag={ui.author}
        >
          <h2>{ui.hSummary}</h2>
          {c.bio.map((p) => (
            <p key={p.slice(0, 16)}>{p}</p>
          ))}
          <h2>{ui.hNow}</h2>
          <ul>
            {c.now.map((n) => (
              <li key={n.title}>
                <b>{n.title}.</b> {n.text}
              </li>
            ))}
          </ul>
          <h2>{ui.hTest}</h2>
          <ul>
            {demos.map(({ p, url }) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener">
                  {p.title} ↗
                </a>{" "}
                <span className="pr-muted">· {p.summary.split(/[.:]/)[0]}</span>
              </li>
            ))}
          </ul>
          <h2>{ui.hChecklist}</h2>
          <ul className="pr-checklist">
            {c.checklist.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Comment>

        <p className="pr-event">
          <span className="pr-dot" aria-hidden="true" />
          <b>{profile.githubUser}</b> {ui.addedLabels} <Labels c={c} />
        </p>

        <div className="pr-event pr-event-commits">
          <p>
            <span className="pr-dot" aria-hidden="true" />
            <b>{profile.githubUser}</b> {ui.addedCommits(commits.length)}
          </p>
          <ul>
            {commits.slice(0, 5).map((x) => (
              <li key={x.hash}>
                <CommitMsg x={x} />
                <code className="pr-hash">{x.hash}</code>
              </li>
            ))}
          </ul>
          <button type="button" className="pr-link" onClick={() => openTab("commits")}>
            {ui.seeCommits(commits.length)}
          </button>
        </div>

        <Comment
          title={
            <>
              <b>{profile.githubUser}</b> {ui.selfReviewed}
            </>
          }
          tag={ui.selfReview}
        >
          <p className="pr-muted">{ui.principlesIntro}</p>
          <ol className="pr-threads">
            {c.principles.map((p, i) => (
              <li key={p.title}>
                <code className="pr-thread-line">
                  <span className="ln">{i + 1}</span>
                  <span className="add">+ {p.title}</span>
                </code>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </Comment>

        <section className="pr-mergebox" aria-labelledby="merge-h">
          <span className="pr-mb-badge" aria-hidden="true">
            <Icon d={mergeIcon} />
          </span>
          <div className="pr-mb-row">
            <span className="pr-mb-icon" aria-hidden="true">
              ✓
            </span>
            <div>
              <h2 id="merge-h">{ui.allPassed}</h2>
              <p className="pr-muted">
                {ui.checksLine(c.toolbox.length + 2)} ·{" "}
                {failed ? ui.ghDown : data ? ui.ghLine(own.length, stars, last ? relTime(last.pushed_at, ui.locale) : "—") : ui.ghLoading}
              </p>
            </div>
            <button type="button" className="pr-link" onClick={() => openTab("checks")}>
              {ui.details}
            </button>
          </div>
          <div className="pr-mb-row">
            <span className="pr-mb-icon" aria-hidden="true">
              ✓
            </span>
            <div>
              <h2>{ui.noConflicts}</h2>
              <p className="pr-muted">{ui.noConflictsText}</p>
            </div>
          </div>
          <div className="pr-mb-merge">
            {!merging ? (
              <button type="button" className="pr-merge" ref={mergeRef} aria-expanded={false} onClick={() => setMerging(true)}>
                {ui.merge}
              </button>
            ) : (
              <div className="pr-confirm">
                <p>
                  <b>{ui.confirmQ}</b> {ui.confirmNext}
                </p>
                <a className="pr-merge" ref={confirmRef} href={`mailto:${profile.email}?subject=${encodeURIComponent(ui.mailSubject)}`}>
                  {ui.confirm} · {profile.email}
                </a>
                <div className="pr-confirm-alt">
                  <button type="button" className="pr-btn" onClick={copy} aria-live="polite">
                    {copied ? ui.copied : ui.copyEmail}
                  </button>
                  <a className="pr-btn" href={profile.linkedin} target="_blank" rel="noopener">
                    LinkedIn ↗
                  </a>
                  <button type="button" className="pr-btn" onClick={() => setMerging(false)}>
                    {ui.cancel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="pr-side" aria-label={ui.sidebar}>
        <div>
          <h3>{ui.reviewers}</h3>
          <p>
            <span className="pr-pending" aria-hidden="true" /> {ui.reviewPending}
          </p>
        </div>
        <div>
          <h3>{ui.assignee}</h3>
          <p className="pr-assignee">
            <Avatar small /> {profile.short}
          </p>
        </div>
        <div>
          <h3>{ui.labelsH}</h3>
          <p className="pr-labels">
            <Labels c={c} />
          </p>
        </div>
        <div>
          <h3>{ui.milestone}</h3>
          <p>{ui.milestoneText}</p>
          <div className="pr-progress" aria-hidden="true">
            <span />
          </div>
        </div>
        <div>
          <h3>{ui.attachments}</h3>
          <p>
            <a href={profile.cv} download hrefLang="pt-BR">
              Thiago_Sampaio_Curriculo.pdf
            </a>
          </p>
          <p>
            <a href={profile.linkedin} target="_blank" rel="noopener">
              linkedin.com/in/thiago-de-oliveira-sampaio
            </a>
          </p>
        </div>
      </aside>
    </div>
  );
}

function CommitMsg({ x }: { x: Commit }) {
  return (
    <span className="pr-cmsg">
      <span className={`pr-ctype t-${x.type}`}>{x.type}</span>
      <span className="pr-cscope">({x.scope}):</span> {x.msg}
    </span>
  );
}

function Commits({ c, commits }: { c: Content; commits: Commit[] }) {
  const years = [...new Set(commits.map((x) => x.year))];
  return (
    <div className="pr-commits">
      {years.map((y) => (
        <section key={y} aria-labelledby={`y-${y}`}>
          <h2 id={`y-${y}`}>
            <span className="pr-dot" aria-hidden="true" /> {c.ui.commitsOf(y)}
          </h2>
          <ul>
            {commits
              .filter((x) => x.year === y)
              .map((x) => (
                <li key={x.hash}>
                  <div>
                    <CommitMsg x={x} />
                    {x.body && (
                      <ul className="pr-cbody">
                        {x.body.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {x.href ? (
                    <a className="pr-hash" href={x.href} target="_blank" rel="noopener" aria-label={c.ui.openScope(x.scope)}>
                      {x.hash} ↗
                    </a>
                  ) : (
                    <code className="pr-hash">{x.hash}</code>
                  )}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Checks({ c, data, failed }: { c: Content; data: GitHubData | null; failed: boolean }) {
  const { ui } = c;
  const { own, stars, last } = liveSummary(data);
  const langs = [...new Set(own.map((r) => r.language).filter(Boolean))].slice(0, 6);
  const live = failed ? "neutral" : data ? "ok" : "pending";
  const liveLabel = { ok: ui.passed, pending: ui.running, neutral: ui.neutral }[live];

  return (
    <div className="pr-checks">
      <p className="pr-checks-sum">
        <span className="pr-mb-icon" aria-hidden="true">
          ✓
        </span>
        {ui.checksPassed(c.toolbox.length + (live === "ok" ? 2 : 1))}
        {live === "pending" ? ui.oneRunning : live === "neutral" ? ui.oneNeutral : ""}
      </p>
      <ul>
        {c.toolbox.map((g) => (
          <li key={g.group}>
            <details>
              <summary>
                <span className="st ok" aria-label={ui.passed}>
                  ✓
                </span>
                <span className="name">build / {g.group.toLowerCase()}</span>
                <span className="pr-muted">{ui.verifications(g.items.length)}</span>
              </summary>
              <Log rows={g.items} />
            </details>
          </li>
        ))}
        <li>
          <details>
            <summary>
              <span className="st ok" aria-label={ui.passed}>
                ✓
              </span>
              <span className="name">{ui.lintName}</span>
              <span className="pr-muted">{ui.lintRules(c.principles.length)}</span>
            </summary>
            <Log rows={c.principles.map((p) => p.title)} />
          </details>
        </li>
        <li>
          <details open>
            <summary>
              <span className={`st ${live}`} aria-label={liveLabel}>
                {live === "ok" ? "✓" : live === "pending" ? "●" : "–"}
              </span>
              <span className="name">{ui.ghName}</span>
              <span className="pr-muted">{ui.live}</span>
            </summary>
            <pre className="pr-log">
              {failed && `${ui.ghFailed}\n`}
              {!data && !failed && `${ui.loading}\n`}
              {data &&
                [
                  [ui.repos, own.length],
                  [ui.stars, stars],
                  [ui.lastPush, last ? `${last.name}, ${relTime(last.pushed_at, ui.locale)}` : "—"],
                  [ui.langs, langs.join(", ") || "—"],
                ].map(([k, v], i) => (
                  <span key={k}>
                    <span className="ln">{i + 1}</span> {k}: <span className="add">{v}</span>
                    {"\n"}
                  </span>
                ))}
            </pre>
          </details>
        </li>
      </ul>
    </div>
  );
}

function Log({ rows }: { rows: string[] }) {
  return (
    <pre className="pr-log">
      {rows.map((r, i) => (
        <span key={r}>
          <span className="ln">{i + 1}</span> <span className="add">✓</span> {r}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}

function Files({ c, files, data }: { c: Content; files: { p: Project; lines: Line[] }[]; data: GitHubData | null }) {
  const { ui } = c;
  const go = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
    el?.querySelector("summary")?.focus({ preventScroll: true });
  };

  return (
    <div className="pr-files">
      <nav className="pr-tree" aria-label={ui.files}>
        <p className="pr-tree-dir">projects/</p>
        <ul>
          {files.map(({ p, lines }) => (
            <li key={p.id}>
              <button type="button" onClick={() => go(`f-${p.id}`)}>
                <span>{p.id}.md</span>
                <span className="add">+{lines.length}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pr-diffs">
        {files.map(({ p, lines }) => {
          const repo = findRepo(data, p.repo);
          return (
            <details key={p.id} id={`f-${p.id}`} className="pr-file" open={p.featured}>
              <summary>
                <span className="pr-file-name">projects/{p.id}.md</span>
                <span className="pr-file-stat">
                  <span className="add">+{lines.length}</span>
                  {repo && (
                    <span className="pr-muted">
                      {" "}
                      · ★ {repo.stargazers_count} · push {relTime(repo.pushed_at, ui.locale)}
                    </span>
                  )}
                </span>
              </summary>
              <table className="pr-diff">
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={i}>
                      <td className="ln">{i + 1}</td>
                      <td className="sign" aria-hidden="true">
                        +
                      </td>
                      <td className="code">
                        {l.href ? (
                          <a href={l.href} target="_blank" rel="noopener">
                            {l.text}
                          </a>
                        ) : (
                          l.text || " "
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {p.image && (
                <figure className="pr-bin">
                  <figcaption>
                    {p.image.replace(/^\//, "")} <span className="pr-muted">· {ui.binary}</span>
                  </figcaption>
                  <img src={p.image} alt={ui.screenshot(p.title)} loading="lazy" />
                </figure>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}

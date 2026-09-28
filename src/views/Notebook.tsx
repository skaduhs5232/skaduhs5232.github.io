import type { ViewProps } from "../App";
import { education, jobs, principles, toolbox } from "../content";
import { ViewShell } from "./ViewShell";
import "../styles/notebook.scss";

const tabs = [
  { id: "trajetoria", label: "trajetória" },
  { id: "ferramentas", label: "ferramentas" },
  { id: "metodo", label: "como eu trabalho" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export default function Notebook({ sub, go }: ViewProps) {
  const tab: Tab = tabs.some((t) => t.id === sub) ? (sub as Tab) : "trajetoria";

  return (
    <ViewShell id="caderno" label="Caderno de campo: trajetória, ferramentas e método" go={go} nearby={["prancheta", "estante", "quadro"]}>
      <div className="notebook">
        <nav className="nb-tabs" aria-label="Seções do caderno">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`nb-tab hand t-${t.id}`}
              aria-current={tab === t.id ? "page" : undefined}
              onClick={() => go("caderno", t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="spread">
          <span className="rings" aria-hidden="true" />
          {tab === "trajetoria" && <Trajetoria />}
          {tab === "ferramentas" && <Ferramentas />}
          {tab === "metodo" && <Metodo />}
        </div>
      </div>
    </ViewShell>
  );
}

function Title({ children }: { children: string }) {
  return (
    <h2 id="caderno-title" className="nb-title hand" tabIndex={-1}>
      {children}
    </h2>
  );
}

function Trajetoria() {
  return (
    <>
      <section className="page">
        <Title>Trajetória</Title>
        <ol className="timeline">
          {jobs.map((j) => (
            <li key={j.period}>
              <span className="tl-period mono">{j.period}</span>
              <h3>
                {j.role} <span className="tl-org">· {j.org}</span>
              </h3>
              <ul>
                {j.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
      <section className="page">
        <h3 className="nb-sub hand">Formação</h3>
        <ol className="timeline">
          {education.map((e) => (
            <li key={e.title}>
              <span className="tl-period mono">{e.period}</span>
              <h3>{e.title}</h3>
              <p className="tl-org">{e.org}</p>
            </li>
          ))}
        </ol>
        <p className="margin-note hand">
          de estagiário a sênior em 3 anos e meio. Caminho completo no currículo em PDF, na prancheta.
        </p>
      </section>
    </>
  );
}

function Ferramentas() {
  const half = Math.ceil(toolbox.length / 2);
  const cols = [toolbox.slice(0, half), toolbox.slice(half)];
  return (
    <>
      {cols.map((col, i) => (
        <section className="page" key={i}>
          {i === 0 ? <Title>Ferramentas</Title> : <span className="nb-title-spacer" aria-hidden="true" />}
          {col.map((g) => (
            <div key={g.group} className="tool-group">
              <h3 className="nb-sub hand">{g.group}</h3>
              <ul className="tool-items">
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}

function Metodo() {
  const half = Math.ceil(principles.length / 2);
  return (
    <>
      {[principles.slice(0, half), principles.slice(half)].map((col, i) => (
        <section className="page" key={i}>
          {i === 0 ? <Title>Como eu trabalho</Title> : <span className="nb-title-spacer" aria-hidden="true" />}
          <ol className="principles" start={i * half + 1}>
            {col.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}

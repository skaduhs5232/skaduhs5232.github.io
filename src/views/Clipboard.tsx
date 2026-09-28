import type { ViewProps } from "../App";
import { now, profile } from "../content";
import { ViewShell } from "./ViewShell";
import "../styles/clipboard.scss";

export default function Clipboard({ go }: ViewProps) {
  return (
    <ViewShell id="prancheta" label="Prancheta: sobre mim" go={go} nearby={["quadro", "caderno", "envelope"]}>
      <div className="clipboard">
        <span className="clipboard-clip" aria-hidden="true" />
        <article className="clipboard-sheet paper">
          <p className="kicker">Ficha · Bancada 5232</p>
          <h2 id="prancheta-title" className="serif-title" tabIndex={-1}>
            {profile.name}
          </h2>
          <p className="cs-role mono">
            {profile.role} · {profile.location}
          </p>
          <p className="cs-tagline hand">{profile.tagline}</p>

          <div className="cs-bio">
            {profile.bio.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>

          <h3 className="cs-h hand">na bancada agora</h3>
          <ul className="cs-now">
            {now.map((n) => (
              <li key={n.title}>
                <span className="cs-check" aria-hidden="true" />
                <div>
                  <span className="kicker">{n.tag}</span>
                  <b>{n.title}</b>
                  <p>{n.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="links cs-actions">
            <button type="button" className="btn primary" onClick={() => go("quadro")}>
              Ver projetos no quadro →
            </button>
            <button type="button" className="btn" onClick={() => go("envelope")}>
              Falar comigo
            </button>
            <a className="btn" href={profile.cv} download>
              Currículo (PDF) ↓
            </a>
          </div>

          <span className="postit cs-postit hand" aria-hidden="true">
            3+ anos
            <br />
            em produção
          </span>
        </article>
      </div>
    </ViewShell>
  );
}

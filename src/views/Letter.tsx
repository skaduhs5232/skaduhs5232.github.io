import { useState } from "react";
import type { ViewProps } from "../App";
import { profile } from "../content";
import { ViewShell } from "./ViewShell";
import "../styles/letter.scss";

export default function Letter({ go }: ViewProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sem clipboard: o link mailto continua disponível */
    }
  };

  return (
    <ViewShell id="envelope" label="Envelope: contato" go={go} nearby={["prancheta", "quadro", "monitor"]}>
      <div className="letter-wrap">
        <span className="letter-env" aria-hidden="true" />
        <article className="letter paper">
          <span className="letter-stamp" aria-hidden="true">
            CE
            <small>5232</small>
          </span>
          <p className="letter-date mono">Fortaleza, {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
          <h2 id="envelope-title" className="letter-hello hand" tabIndex={-1}>
            Olá!
          </h2>
          <p>
            Se você chegou até aqui, provavelmente tem um sistema que precisa durar, um legado que precisa virar
            arquitetura, ou uma ideia com IA que precisa sair do notebook. Gosto dos três.
          </p>
          <p>O caminho mais rápido é por e-mail. Respondo em até dois dias úteis.</p>

          <div className="letter-email">
            <a className="mono" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <button type="button" className="btn" onClick={copy} aria-live="polite">
              {copied ? "copiado ✓" : "copiar"}
            </button>
          </div>

          <ul className="letter-links">
            <li>
              <a className="btn primary" href={`mailto:${profile.email}?subject=Oi%20Thiago`}>
                Escrever e-mail
              </a>
            </li>
            <li>
              <a className="btn" href={profile.linkedin} target="_blank" rel="noopener">
                LinkedIn ↗
              </a>
            </li>
            <li>
              <a className="btn" href={profile.github} target="_blank" rel="noopener">
                GitHub ↗
              </a>
            </li>
            <li>
              <a className="btn" href={profile.cv} download>
                Currículo (PDF) ↓
              </a>
            </li>
          </ul>

          <p className="letter-sign hand">
            um abraço,
            <br />— Thiago
          </p>
        </article>
      </div>
    </ViewShell>
  );
}

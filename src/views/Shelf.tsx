import { useState } from "react";
import type { ViewProps } from "../App";
import { books } from "../content";
import { ViewShell } from "./ViewShell";
import "../styles/shelf.scss";

export default function Shelf({ sub, go }: ViewProps) {
  const book = books.find((b) => b.id === sub) ?? books[0];
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard bloqueado: o texto continua visível para copiar à mão */
    }
  };

  return (
    <ViewShell id="estante" label="Estante: pesquisa e publicações" go={go} nearby={["caderno", "quadro", "monitor"]}>
      <div className="shelf-view">
        <h2 id="estante-title" className="shelf-title" tabIndex={-1}>
          Estante de pesquisa
        </h2>
        <p className="shelf-sub hand">duas publicações e um mestrado em andamento. Puxe um livro.</p>

        <div className="shelf-row" role="group" aria-label="Livros">
          {books.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`spine c-${b.color}`}
              aria-pressed={b.id === book.id}
              onClick={() => {
                setCopied(false);
                go("estante", b.id);
              }}
            >
              <span className="spine-kind mono">{b.kind}</span>
              <span className="spine-title">{b.spine}</span>
            </button>
          ))}
          <span className="shelf-bookend" aria-hidden="true" />
        </div>
        <span className="shelf-ledge" aria-hidden="true" />

        <article className={`book-open paper c-${book.color}`} key={book.id} aria-live="polite">
          <p className="kicker">{book.kind}</p>
          <h3>{book.title}</h3>
          <p className="book-venue mono">{book.venue}</p>
          <p className="book-text">{book.text}</p>
          {book.cite && (
            <figure className="book-cite">
              <blockquote className="mono">{book.cite}</blockquote>
              <button type="button" className="btn" onClick={() => copy(book.cite!)}>
                {copied ? "copiado ✓" : "copiar citação (ABNT)"}
              </button>
            </figure>
          )}
          {book.id === "pavimento" && (
            <button type="button" className="btn primary" onClick={() => go("quadro", "pavimento")}>
              Ver o projeto no quadro →
            </button>
          )}
        </article>
      </div>
    </ViewShell>
  );
}

import { useEffect, type ReactNode } from "react";
import type { Go, ObjectId } from "../lib/route";
import "../styles/views.scss";

const nearbyLabel: Record<ObjectId, string> = {
  prancheta: "prancheta · sobre mim",
  quadro: "quadro · projetos",
  monitor: "monitor · demos",
  caderno: "caderno · trajetória",
  estante: "estante · pesquisa",
  envelope: "envelope · contato",
};

type Props = {
  id: ObjectId;
  label: string;
  go: Go;
  nearby: ObjectId[];
  children: ReactNode;
};

export function ViewShell({ id, label, go, nearby, children }: Props) {
  useEffect(() => {
    document.getElementById(`${id}-title`)?.focus({ preventScroll: true });
  }, [id]);

  return (
    <div className={`view view-${id}`} role="dialog" aria-modal="true" aria-label={label}>
      <button type="button" className="back hand" onClick={() => go(null)}>
        <span aria-hidden="true">←</span> voltar para a sala <kbd>esc</kbd>
      </button>

      <div className="view-scroll">
        {children}

        <nav className="nearby" aria-label="Outros objetos da sala">
          <span className="nearby-title hand">na mesa também:</span>
          {nearby.map((n) => (
            <button key={n} type="button" className="tape-label" onClick={() => go(n)}>
              {nearbyLabel[n]}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

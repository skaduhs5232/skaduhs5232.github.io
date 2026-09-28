import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { ObjectId } from "../lib/route";

type ObjProps = { id: ObjectId; label: string; tape: string; onOpen: (id: ObjectId) => void; children: ReactNode };

function Obj({ id, label, tape, onOpen, children }: ObjProps) {
  return (
    <button type="button" className={`obj obj-${id}`} data-obj={id} aria-label={label} onClick={() => onOpen(id)}>
      <span className="obj-art" aria-hidden="true">
        {children}
      </span>
      <span className="tape hand" aria-hidden="true">
        {tape}
      </span>
    </button>
  );
}

const miniCards = [
  { t: "Exitus", k: "photo", c: "caju" },
  { t: "Prof. Carvalho", k: "card", c: "azul" },
  { t: "Pavimento · 93%", k: "photo", c: "menta" },
  { t: "PokéGuess", k: "photo", c: "manga" },
  { t: "CCA", k: "card", c: "menta" },
  { t: "op-tasks-cli", k: "card", c: "azul" },
  { t: "Exitus Editor", k: "card", c: "caju" },
  { t: "Termo Musical", k: "card", c: "manga" },
];

export function Room({ focus, onOpen }: { focus: ObjectId | null; onOpen: (id: ObjectId) => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState("50% 50%");
  const [firstVisit] = useState(() => !localStorage.getItem("visited"));

  useLayoutEffect(() => {
    if (!focus) return;
    const el = stageRef.current?.querySelector<HTMLElement>(`[data-obj="${focus}"]`);
    if (el) setOrigin(`${el.offsetLeft + el.offsetWidth / 2}px ${el.offsetTop + el.offsetHeight / 2}px`);
  }, [focus]);

  const inert = focus ? { inert: true, "aria-hidden": true } : {};

  return (
    <main className={`room${focus ? " is-zoomed" : ""}`} {...inert}>
      <h1 className="sr-only">Bancada 5232: o ateliê de Thiago Sampaio, Engenheiro de Software Sênior</h1>
      <p className="sr-only">
        Uma sala de trabalho. Cada objeto abre uma parte do portfólio: prancheta (sobre mim), quadro (projetos), monitor
        (demos e GitHub), caderno (trajetória e ferramentas), estante (pesquisa) e envelope (contato).
      </p>

      <div className="stage" ref={stageRef} style={{ transformOrigin: origin }}>
        {/* parede */}
        <div className="wall" aria-hidden="true">
          <div className="window">
            <div className="sky" />
            <div className="city" />
            <div className="palm" />
            <div className="panes" />
          </div>
          <div className="plaque">
            <span className="plaque-name">Bancada 5232</span>
            <span className="plaque-sub">Thiago Sampaio · engenharia de software</span>
            <span className="plaque-loc">Fortaleza — CE</span>
          </div>
          <span className="postit postit-wall hand">ADR &gt; memória</span>
          <div className="outlet" />
        </div>

        {/* mesa */}
        <div className="desk" aria-hidden="true">
          <div className="desk-edge" />
        </div>

        <div className="decor keyboard" aria-hidden="true" />
        <div className="decor mug" aria-hidden="true">
          <span className="steam" />
          <span className="steam s2" />
          <span className="mug-print">5232</span>
        </div>
        <svg className="decor cable" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M8 0 C 8 40, 40 30, 55 60 S 70 100, 96 100" />
        </svg>
        <div className="decor pencil" aria-hidden="true" />

        {/* objetos — ordem do DOM = ordem do Tab */}
        <Obj id="prancheta" label="Prancheta: quem sou eu e o que estou fazendo agora" tape="sobre mim" onOpen={onOpen}>
          <span className="cb-board">
            <span className="cb-clip" />
            <span className="cb-paper">
              <span className="cb-name hand">Thiago Sampaio</span>
              <span className="cb-role">eng. de software sênior</span>
              <span className="cb-lines" />
            </span>
          </span>
          <span className={`postit postit-start hand${firstVisit ? " wiggle" : ""}`}>
            comece
            <br />
            por aqui!
          </span>
        </Obj>

        <Obj id="quadro" label="Quadro de cortiça: todos os projetos" tape="projetos" onOpen={onOpen}>
          <span className="cork">
            {miniCards.map((m, i) => (
              <span key={m.t} className={`mini mini-${i} mini-${m.k}`}>
                <span className={`pin pin-${m.c}`} />
                {m.k === "photo" && <span className={`mini-photo tone-${m.c}`} />}
                <span className="mini-title">{m.t}</span>
                {m.k === "card" && <span className="mini-lines" />}
              </span>
            ))}
            <svg className="string" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M16 14 L52 40 L83 22" />
            </svg>
          </span>
        </Obj>

        <Obj id="monitor" label="Monitor: demos ao vivo e atividade no GitHub" tape="demos" onOpen={onOpen}>
          <span className="mon-bezel">
            <span className="mon-screen">
              <span className="mon-bar">
                <i />
                <i />
                <i />
                <b>bancada — demos</b>
              </span>
              <span className="mon-code">
                <span className="ln c1" />
                <span className="ln c2" />
                <span className="ln c3" />
                <span className="ln c4" />
                <span className="ln c2 short" />
              </span>
              <span className="mon-term">
                thiago@bancada:~$ ls demos/
                <br />
                prof_oak  pokeguess  tiptap<span className="caret" />
              </span>
            </span>
            <span className="postit postit-mon hand">deploy na sexta? não.</span>
          </span>
          <span className="mon-neck" />
          <span className="mon-foot" />
        </Obj>

        <Obj id="caderno" label="Caderno: trajetória, ferramentas e como eu trabalho" tape="trajetória" onOpen={onOpen}>
          <span className="nb-cover">
            <span className="nb-label">
              <b className="hand">caderno de campo</b>
              <small>2022 → hoje</small>
            </span>
            <span className="nb-band" />
            <span className="nb-flag t1" />
            <span className="nb-flag t2" />
            <span className="nb-flag t3" />
          </span>
        </Obj>

        <Obj id="estante" label="Estante: publicações e pesquisa de mestrado" tape="pesquisa" onOpen={onOpen}>
          <span className="shelf-books">
            <span className="book b-nanquim">
              <em>Patologias em Pavimento</em>
            </span>
            <span className="book b-caju">
              <em>Estudante × Agente</em>
            </span>
            <span className="book b-menta">
              <em>CCA × IPBA</em>
            </span>
            <span className="book b-lean" />
            <span className="pokeball" />
            <span className="plant">
              <span className="leaf l1" />
              <span className="leaf l2" />
              <span className="leaf l3" />
              <span className="pot" />
            </span>
          </span>
          <span className="shelf-plank" />
        </Obj>

        <Obj id="envelope" label="Envelope: contato, e-mail, LinkedIn e currículo" tape="contato" onOpen={onOpen}>
          <span className="env">
            <span className="env-flap" />
            <span className="env-stamp">
              <b>CE</b>
            </span>
            <span className="env-to hand">
              para: você
              <br />
              de: Thiago
            </span>
          </span>
        </Obj>

        <div className="sunlight" aria-hidden="true" />
        <div className="lamp-glow" aria-hidden="true" />
      </div>

      {firstVisit && (
        <p className="hint hand" aria-hidden="true">
          <span className="hint-wide">Isto é um ateliê. Clique nos objetos (ou use Tab).</span>
          <span className="hint-narrow">Isto é um ateliê: toque nos objetos.</span>
        </p>
      )}
    </main>
  );
}

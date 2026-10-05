import { en } from "./en";
import { pt, type ptUi } from "./pt";

export type Lang = "pt" | "en";
export type Status = "production" | "oss" | "research" | "lab";
export type Link = { type: "repo" | "demo" | "doc"; url: string };

export const profile = {
  name: "Thiago de Oliveira Sampaio",
  short: "Thiago Sampaio",
  email: "thiagooliveira1039@gmail.com",
  linkedin: "https://linkedin.com/in/thiago-de-oliveira-sampaio",
  github: "https://github.com/skaduhs5232",
  githubUser: "skaduhs5232",
  cv: "/assets/Thiago_Sampaio_Curriculo.pdf",
};

const gh = (name: string): Link => ({ type: "repo", url: `https://github.com/skaduhs5232/${name}` });

type ProjectBase = {
  id: string;
  status: Status;
  year: string;
  stack: string[];
  links: Link[];
  repo?: string;
  image?: string;
  featured?: boolean;
};

const base = [
  { id: "exitus", featured: true, status: "production", year: "2023–2026", stack: ["Java", "Spring Boot", "Go", "Angular", "React", "PostgreSQL", "Docker", "GCP"], links: [] },
  {
    id: "tiptap",
    featured: true,
    status: "production",
    year: "2024–2025",
    image: "/assets/images/tiptap.png",
    stack: ["TypeScript", "Tiptap", "Angular", "Go"],
    repo: "Tiptap-Exitus",
    links: [gh("Tiptap-Exitus"), { type: "demo", url: "https://skaduhs5232.github.io/Tiptap-Exitus/" }],
  },
  {
    id: "profoak",
    featured: true,
    status: "oss",
    year: "2026",
    stack: ["Python", "FastAPI", "LLMs", "Ollama", "Docker"],
    repo: "prof_oak",
    links: [gh("prof_oak"), { type: "demo", url: "https://prof-oak-nu.vercel.app" }],
  },
  {
    id: "pavimento",
    featured: true,
    status: "research",
    year: "2025",
    image: "/assets/images/tcc.png",
    stack: ["Python", "PyTorch", "YOLO", "SAM2"],
    links: [{ type: "doc", url: "https://docs.google.com/document/d/135hKU4kXx79qQM8UIhOlumm-Gogv4NxMAWD9JkFKl04/edit?usp=sharing" }],
  },
  {
    id: "pokeguess",
    featured: true,
    status: "lab",
    year: "2025",
    image: "/assets/images/poke-draw.png",
    stack: ["Python", "TensorFlow", "MobileNetV2", "Streamlit"],
    repo: "poke_guess",
    links: [gh("poke_guess"), { type: "demo", url: "https://poke-draw-guess.streamlit.app/" }],
  },
  {
    id: "ticket",
    status: "oss",
    year: "2026",
    stack: ["Python", "RAG", "pgvector", "Gemini API", "TypeScript"],
    repo: "ticket-maker",
    links: [gh("ticket-maker"), { type: "demo", url: "https://skaduhs5232.github.io/ticket-maker/" }],
  },
  { id: "cca", status: "research", year: "2026", stack: ["Python", "SciPy", "Jupyter"], repo: "CCA", links: [gh("CCA")] },
  { id: "intent", status: "research", year: "2025", stack: ["Python", "BERTimbau", "HuggingFace", "Gemini API"], links: [] },
  { id: "medsystem", status: "production", year: "2025", stack: ["React", "Node.js", "PostgreSQL", "RabbitMQ"], links: [] },
  { id: "optasks", status: "oss", year: "2026", stack: ["TypeScript", "Node.js"], repo: "npx-cli-openProject", links: [gh("npx-cli-openProject")] },
  { id: "bancosync", status: "oss", year: "2026", stack: ["Node.js", "PostgreSQL", "Gemini API"], repo: "cli-sync-banco", links: [gh("cli-sync-banco")] },
  {
    id: "katex",
    status: "oss",
    year: "2025",
    stack: ["Angular", "TypeScript", "KaTeX"],
    repo: "Directive-Angular-KaTeX-interpreter",
    links: [gh("Directive-Angular-KaTeX-interpreter")],
  },
  { id: "spell", status: "production", year: "2025", stack: ["Go", "Docker"], repo: "spell-checker-golang", links: [gh("spell-checker-golang")] },
  { id: "pokeia", status: "lab", year: "2026", stack: ["Python", "Sentence-Transformers", "FAISS"], repo: "pokeIA", links: [gh("pokeIA")] },
  {
    id: "sqlguard",
    status: "oss",
    year: "2025",
    stack: ["React", "TypeScript", "Supabase"],
    repo: "sql-guard-cybok-main",
    links: [gh("sql-guard-cybok-main"), { type: "demo", url: "https://sql-guard-cybok-main-wfgl.vercel.app/" }],
  },
  {
    id: "agendamento",
    status: "oss",
    year: "2025",
    image: "/assets/images/agendamento.png",
    stack: ["Angular", "Node.js", "MongoDB", "Apps Script"],
    repo: "Agendamento-sheets",
    links: [gh("Agendamento-sheets"), { type: "demo", url: "https://skaduhs5232.github.io/ConsultorioDePsico/" }],
  },
  { id: "readme", status: "lab", year: "2025", stack: ["Python", "GPT-2", "FastAPI", "Docker"], repo: "gerador_read.me_ia", links: [gh("gerador_read.me_ia")] },
  {
    id: "topatudo",
    status: "oss",
    year: "2024",
    stack: ["TypeScript", "SCSS"],
    repo: "TopaTudo",
    links: [gh("TopaTudo"), { type: "demo", url: "https://ta-na-mao-sable.vercel.app/guest/login" }],
  },
  {
    id: "termo",
    status: "lab",
    year: "2025",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    repo: "termo-musica",
    links: [gh("termo-musica"), { type: "demo", url: "https://termo-musica.vercel.app" }],
  },
  { id: "blockchain", status: "lab", year: "2024", stack: ["Clojure"], repo: "Block_Chain_Clojure", links: [gh("Block_Chain_Clojure")] },
] as const satisfies readonly ProjectBase[];

export type ProjectId = (typeof base)[number]["id"];

export type ProjectText = {
  title: string;
  role: string;
  summary: string;
  points: string[];
  metric?: { value: string; label: string };
};

export type Project = ProjectBase & ProjectText;

export type Copy = {
  meta: { title: string; description: string };
  role: string;
  bio: string[];
  now: { title: string; text: string }[];
  status: Record<Status, string>;
  linkLabel: Record<Link["type"], string>;
  projects: Record<ProjectId, ProjectText>;
  jobs: { period: string; role: string; org: string; points: string[] }[];
  education: { period: string; title: string; org: string }[];
  career: { year: string; type: string; scope: string; msg: string; job?: number }[];
  toolbox: { group: string; items: string[] }[];
  principles: { title: string; text: string }[];
  labels: string[];
  checklist: string[];
  ui: typeof ptUi;
};

const copies: Record<Lang, Copy> = { pt, en };

export function getContent(lang: Lang) {
  const c = copies[lang];
  const projects: Project[] = base.map((b) => ({ ...(b as ProjectBase), ...c.projects[b.id] }));
  return { ...c, projects };
}

export type Content = ReturnType<typeof getContent>;

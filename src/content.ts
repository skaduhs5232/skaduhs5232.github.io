export const profile = {
  name: "Thiago de Oliveira Sampaio",
  short: "Thiago Sampaio",
  role: "Engenheiro de Software Sênior",
  tagline: "Full Stack · IA Aplicada · Modernização de legado",
  location: "Fortaleza, CE",
  email: "thiagooliveira1039@gmail.com",
  linkedin: "https://linkedin.com/in/thiago-de-oliveira-sampaio",
  github: "https://github.com/skaduhs5232",
  githubUser: "skaduhs5232",
  cv: "/assets/Thiago_Sampaio_Curriculo.pdf",
  bio: [
    "Construo software que precisa durar: plataformas educacionais que atendem várias instituições, ERPs legados que viram arquitetura moderna sem parar a operação e, nas horas vagas, modelos de IA que reconhecem Pokémon desenhados à mão.",
    "Hoje lidero a modernização de um ERP legado na S4E. Antes, passei mais de três anos na UniChristus, de estagiário a desenvolvedor full stack, projetando microsserviços em Java e Go e colocando OCR, ICR e TTS para corrigir provas. Sou bacharel em Ciência da Computação e mestrando em Informática Aplicada na UNIFOR.",
  ],
};

export const now = [
  {
    tag: "trabalho",
    title: "Modernizando um ERP legado",
    text: "Na S4E desde agosto de 2026: mapeio o AS-IS, desenho o TO-BE e transformo conhecimento tácito em ADRs, contratos de API e guias.",
  },
  {
    tag: "mestrado",
    title: "Cidades, bacias e lixo urbano",
    text: "Clusterizo cidades com o City Clustering Algorithm e cruzo com o potencial de deságue das bacias para prever o plástico que chega aos rios.",
  },
  {
    tag: "laboratório",
    title: "LLMs sem amarra de provedor",
    text: "O Professor Carvalho troca de Ollama local para qualquer API OpenAI-compatible mudando 3 variáveis de ambiente.",
  },
];

export type Status = "production" | "oss" | "research" | "lab";

export const statusInfo: Record<Status, { label: string; pin: string }> = {
  production: { label: "em produção", pin: "caju" },
  oss: { label: "open source", pin: "azul" },
  research: { label: "pesquisa", pin: "menta" },
  lab: { label: "experimento", pin: "manga" },
};

export type Link = { type: "repo" | "demo" | "doc"; url: string };

export type Project = {
  id: string;
  title: string;
  status: Status;
  year: string;
  role: string;
  summary: string;
  points: string[];
  stack: string[];
  links: Link[];
  repo?: string;
  image?: string;
  metric?: { value: string; label: string };
  featured?: boolean;
};

export const linkLabel: Record<Link["type"], string> = {
  repo: "código",
  demo: "demo ao vivo",
  doc: "documento",
};

const gh = (name: string): Link => ({ type: "repo", url: `https://github.com/skaduhs5232/${name}` });

export const projects: Project[] = [
  {
    id: "exitus",
    featured: true,
    title: "Ecossistema Educacional Exitus",
    status: "production",
    year: "2023–2026",
    role: "Full Stack · arquitetura",
    metric: { value: "12", label: "módulos integrados" },
    summary:
      "Plataforma educacional multi-tenant que atende várias instituições numa única base: avaliações, editor de conteúdo, correção automática, comunicação e mais.",
    points: [
      "Microsserviços em Java (Spring Boot) e Go com deploys independentes por domínio.",
      "Pipelines de OCR, ICR e TTS que geram, leem e corrigem provas sem etapas manuais.",
      "Modernização de módulos legados integrando sistemas internos e externos por API.",
    ],
    stack: ["Java", "Spring Boot", "Go", "Angular", "React", "PostgreSQL", "Docker", "GCP"],
    links: [],
  },
  {
    id: "tiptap",
    featured: true,
    title: "Exitus Editor",
    status: "production",
    year: "2024–2025",
    role: "Autor · biblioteca",
    image: "/assets/images/tiptap.png",
    summary:
      "Editor rich-text sobre Tiptap/ProseMirror com fórmulas, imagens e manipulação de conteúdo, usado como editor único em vários módulos.",
    points: [
      "Inicialização mínima: um elemento HTML e um arquivo JS.",
      "Corretor ortográfico integrado, servido por um microsserviço em Go.",
      "Extensões customizadas para conteúdo de avaliações.",
    ],
    stack: ["TypeScript", "Tiptap", "Angular", "Go"],
    repo: "Tiptap-Exitus",
    links: [gh("Tiptap-Exitus"), { type: "demo", url: "https://skaduhs5232.github.io/Tiptap-Exitus/" }],
  },
  {
    id: "profoak",
    featured: true,
    title: "Professor Carvalho",
    status: "oss",
    year: "2026",
    role: "Autor",
    metric: { value: "3", label: "env vars para trocar de LLM" },
    summary:
      "API FastAPI de um assistente com a persona permanente do Professor Carvalho, independente de provedor de LLM.",
    points: [
      "Camadas routes → services → models: o endpoint é testado com um LLM falso via dependency_overrides.",
      "Roda em Ollama local, vLLM ou Groq/Together trocando só LLM_BASE_URL, LLM_API_KEY e LLM_MODEL.",
      "Remove blocos <think> de modelos de raciocínio para não quebrar a persona nem estourar tokens.",
      "Deploy com Docker Compose na Oracle Cloud Free Tier.",
    ],
    stack: ["Python", "FastAPI", "LLMs", "Ollama", "Docker"],
    repo: "prof_oak",
    links: [gh("prof_oak"), { type: "demo", url: "https://prof-oak-nu.vercel.app" }],
  },
  {
    id: "pavimento",
    featured: true,
    title: "Patologias em pavimento asfáltico",
    status: "research",
    year: "2025",
    role: "Pesquisador · TCC",
    image: "/assets/images/tcc.png",
    metric: { value: "93,2%", label: "de precisão" },
    summary:
      "Visão computacional que detecta e segmenta falhas em vias urbanas a partir de fotos, com dataset próprio anotado à mão.",
    points: [
      "YOLOv11X com transfer learning a partir de pesos COCO.",
      "Segmentação com SAM2 e fine-tuning controlado contra overfitting.",
      "Dataset próprio com 757 imagens anotadas.",
    ],
    stack: ["Python", "PyTorch", "YOLO", "SAM2"],
    links: [
      { type: "doc", url: "https://docs.google.com/document/d/135hKU4kXx79qQM8UIhOlumm-Gogv4NxMAWD9JkFKl04/edit?usp=sharing" },
    ],
  },
  {
    id: "pokeguess",
    featured: true,
    title: "PokéGuess",
    status: "lab",
    year: "2025",
    role: "Autor",
    image: "/assets/images/poke-draw.png",
    metric: { value: "251", label: "Pokémon reconhecidos" },
    summary: "Você desenha um Pokémon e o modelo diz qual é. Classifica esboços das gerações 1 e 2 em tempo real.",
    points: [
      "Transfer learning com MobileNetV2 e fine-tuning em 2 fases.",
      "Data augmentation forte para compensar poucos exemplos por classe.",
    ],
    stack: ["Python", "TensorFlow", "MobileNetV2", "Streamlit"],
    repo: "poke_guess",
    links: [gh("poke_guess"), { type: "demo", url: "https://poke-draw-guess.streamlit.app/" }],
  },
  {
    id: "ticket",
    title: "Ticket Maker",
    status: "oss",
    year: "2026",
    role: "Autor",
    summary:
      "RAG sobre a documentação do time: indexa Markdown no pgvector e usa Gemini para montar tickets integrados ao OpenProject.",
    points: [
      "Ingestão de documentos com reindexação limpa e diretórios configuráveis.",
      "Migrações versionadas com Alembic sobre PostgreSQL + pgvector.",
    ],
    stack: ["Python", "RAG", "pgvector", "Gemini API", "TypeScript"],
    repo: "ticket-maker",
    links: [gh("ticket-maker"), { type: "demo", url: "https://skaduhs5232.github.io/ticket-maker/" }],
  },
  {
    id: "cca",
    title: "City Clustering Algorithm",
    status: "research",
    year: "2026",
    role: "Pesquisador · mestrado",
    metric: { value: "10⁶+", label: "sítios processáveis" },
    summary:
      "CCA para regionalização: agrupa setores ou pixels populacionais em clusters urbanos por densidade e distância haversine.",
    points: [
      "KD-tree sobre a esfera: mesmo resultado do laço par-a-par, rodando em milhões de sítios.",
      "Funciona com pontos (setores censitários) e rasters (GPW).",
    ],
    stack: ["Python", "SciPy", "Jupyter"],
    repo: "CCA",
    links: [gh("CCA")],
  },
  {
    id: "intent",
    title: "Intenção de mensagens de estudantes",
    status: "research",
    year: "2025",
    role: "Pesquisador",
    summary: "Pipeline de PLN que classifica mensagens de alunos por intenção e decide qual fluxo de IA responde.",
    points: [
      "Fine-tuning de BERTimbau com HuggingFace.",
      "Orquestração com Gemini conforme a categoria detectada.",
      "Publicado no XXVI Encontro de Pós-Graduação e Pesquisa da UNIFOR.",
    ],
    stack: ["Python", "BERTimbau", "HuggingFace", "Gemini API"],
    links: [],
  },
  {
    id: "medsystem",
    title: "Med System",
    status: "production",
    year: "2025",
    role: "Full Stack",
    summary:
      "Apoio a médicos externos e estudantes da UniChristus: atendimento clínico, apoio ao diagnóstico, receitas e rotinas médicas.",
    points: ["Mensageria com RabbitMQ entre serviços Node.js.", "Interface React + Tailwind para uso durante o atendimento."],
    stack: ["React", "Node.js", "PostgreSQL", "RabbitMQ"],
    links: [],
  },
  {
    id: "optasks",
    title: "op-tasks-cli",
    status: "oss",
    year: "2026",
    role: "Autor",
    summary: "CLI via npx que sincroniza tarefas do OpenProject com arquivos Markdown locais, nos dois sentidos.",
    points: ["Token salvo no diretório home, nunca no repositório.", "Seleção interativa de projetos; baixa só tarefas abertas atribuídas a você."],
    stack: ["TypeScript", "Node.js"],
    repo: "npx-cli-openProject",
    links: [gh("npx-cli-openProject")],
  },
  {
    id: "bancosync",
    title: "banco-sync-cli",
    status: "oss",
    year: "2026",
    role: "Autor",
    summary:
      "Mantém os arquivos SQL de migração em sincronia com o PostgreSQL real, usando Gemini para reescrevê-los e mostrando um diff antes de salvar.",
    points: ["Saída JSON estruturada do Gemini 2.5 Flash para preservar comentários e estilo."],
    stack: ["Node.js", "PostgreSQL", "Gemini API"],
    repo: "cli-sync-banco",
    links: [gh("cli-sync-banco")],
  },
  {
    id: "katex",
    title: "appKatex",
    status: "oss",
    year: "2025",
    role: "Autor",
    summary: "Diretiva Angular standalone e reativa (Signals) que renderiza LaTeX com KaTeX em qualquer componente.",
    points: ["Detecta $$…$$, \\[…\\] e \\(…\\) automaticamente.", "Escapa HTML que não é LaTeX para evitar XSS."],
    stack: ["Angular", "TypeScript", "KaTeX"],
    repo: "Directive-Angular-KaTeX-interpreter",
    links: [gh("Directive-Angular-KaTeX-interpreter")],
  },
  {
    id: "spell",
    title: "Spell checker em Go",
    status: "production",
    year: "2025",
    role: "Autor",
    summary: "Microsserviço containerizado em Go que fornece correção ortográfica ao Exitus Editor.",
    points: ["Serviço isolado, com deploy independente do editor."],
    stack: ["Go", "Docker"],
    repo: "spell-checker-golang",
    links: [gh("spell-checker-golang")],
  },
  {
    id: "pokeia",
    title: "PokeIA",
    status: "lab",
    year: "2026",
    role: "Autor",
    summary: "Pokédex semântica: busque \"pokémon de fogo que voa\" e receba Charizard. Também recomenda times.",
    points: ["Busca vetorial com Sentence-Transformers + FAISS."],
    stack: ["Python", "Sentence-Transformers", "FAISS"],
    repo: "pokeIA",
    links: [gh("pokeIA")],
  },
  {
    id: "sqlguard",
    title: "SQL Guard",
    status: "oss",
    year: "2025",
    role: "Autor",
    summary: "Laboratório que mostra fluxos de autenticação seguros e vulneráveis a SQL injection lado a lado.",
    points: ["Supabase Functions no backend, shadcn/ui + Radix no frontend."],
    stack: ["React", "TypeScript", "Supabase"],
    repo: "sql-guard-cybok-main",
    links: [gh("sql-guard-cybok-main"), { type: "demo", url: "https://sql-guard-cybok-main-wfgl.vercel.app/" }],
  },
  {
    id: "agendamento",
    title: "Agendamento de consultas",
    status: "oss",
    year: "2025",
    role: "Autor",
    image: "/assets/images/agendamento.png",
    summary: "Marcação de consultas com psicólogos, com Google Sheets como painel da clínica e sincronização via Apps Script.",
    points: ["Angular no front, Express + MongoDB no back."],
    stack: ["Angular", "Node.js", "MongoDB", "Apps Script"],
    repo: "Agendamento-sheets",
    links: [gh("Agendamento-sheets"), { type: "demo", url: "https://skaduhs5232.github.io/ConsultorioDePsico/" }],
  },
  {
    id: "readme",
    title: "Gerador de README com IA",
    status: "lab",
    year: "2025",
    role: "Autor",
    summary: "GPT-2 fine-tunado em READMEs do GitHub para gerar documentação, com API e interface no HuggingFace Spaces.",
    points: ["Pipeline completo: coleta, pré-processamento, treino e avaliação."],
    stack: ["Python", "GPT-2", "FastAPI", "Docker"],
    repo: "gerador_read.me_ia",
    links: [gh("gerador_read.me_ia")],
  },
  {
    id: "topatudo",
    title: "TopaTudo",
    status: "oss",
    year: "2024",
    role: "Autor",
    summary: "Marketplace para contratar prestadores de serviço, com jornadas de cliente e prestador. Meu repo mais estrelado.",
    points: ["Contas de teste: teste@teste.com ou prestador@teste.com, senha 12."],
    stack: ["TypeScript", "SCSS"],
    repo: "TopaTudo",
    links: [gh("TopaTudo"), { type: "demo", url: "https://ta-na-mao-sable.vercel.app/guest/login" }],
  },
  {
    id: "termo",
    title: "Termo Musical",
    status: "lab",
    year: "2025",
    role: "Autor",
    summary: "Um Termo para adivinhar o artista ouvindo 2 segundos de música. Desafio diário e modo prática.",
    points: ["Next.js 14 com App Router e Web Audio API."],
    stack: ["Next.js", "TypeScript", "Tailwind"],
    repo: "termo-musica",
    links: [gh("termo-musica"), { type: "demo", url: "https://termo-musica.vercel.app" }],
  },
  {
    id: "blockchain",
    title: "Blockchain em Clojure",
    status: "lab",
    year: "2024",
    role: "Autor",
    summary: "Uma blockchain escrita inteiramente em Clojure, para entender imutabilidade e encadeamento de hashes.",
    points: [],
    stack: ["Clojure"],
    repo: "Block_Chain_Clojure",
    links: [gh("Block_Chain_Clojure")],
  },
];

export const jobs = [
  {
    period: "ago/2026 — atual",
    role: "Engenheiro de Software Sênior",
    org: "S4E",
    points: [
      "Lidero o time que moderniza um ERP legado, do levantamento AS-IS/TO-BE à entrega em produção.",
      "Produzo ADRs, diagramas e contratos de API que reduzem a dependência de conhecimento tácito.",
      "Defino padrões por code review, mentoria e alinhamento entre squads.",
    ],
  },
  {
    period: "jan/2025 — ago/2026",
    role: "Desenvolvedor Full Stack",
    org: "UniChristus",
    points: [
      "Projetei microsserviços em Java (Spring Boot) e Go com deploys independentes.",
      "Integrei OCR, ICR e Text-to-Speech para gerar, ler e corrigir avaliações.",
      "Liderei arquitetura e code review com Docker, CI/CD e GCP.",
    ],
  },
  {
    period: "mar/2023 — dez/2024",
    role: "Estagiário Full Stack",
    org: "UniChristus",
    points: [
      "Entreguei features em Angular, React e Vue em ciclos quinzenais.",
      "Otimizei APIs Spring Boot e consultas PostgreSQL de alto volume.",
    ],
  },
];

export const education = [
  { period: "2026 — 2027", title: "Mestrado em Informática Aplicada", org: "UNIFOR · em andamento" },
  { period: "2022 — 2025", title: "Bacharelado em Ciência da Computação", org: "UNIFOR" },
];

export const toolbox = [
  { group: "Linguagens", items: ["Java", "Go", "Python", "TypeScript", "JavaScript", "C#", "C", "Clojure (por diversão)"] },
  { group: "Backend", items: ["Spring Boot", "Gin", "FastAPI", "Node.js / Express", ".NET", "REST", "gRPC", "RabbitMQ"] },
  { group: "Frontend", items: ["Angular", "React", "Svelte", "Next.js", "Tiptap / ProseMirror", "SCSS", "Web Components"] },
  { group: "IA", items: ["LLMs", "RAG", "LangChain / LangGraph", "HuggingFace", "BERTimbau", "Gemini e Anthropic API", "YOLO · SAM2 · OpenCV", "OCR · ICR · TTS", "PyTorch · TensorFlow"] },
  { group: "Dados & Infra", items: ["PostgreSQL · pgvector", "MongoDB", "Docker", "Kubernetes", "GCP", "CI/CD", "GitFlow"] },
  { group: "Processo", items: ["Microsserviços", "DDD", "SOLID", "TDD", "AS-IS / TO-BE", "ADR", "Scrum"] },
];

export const principles = [
  {
    title: "Decisão sem registro é decisão perdida",
    text: "Em legado, as regras moram na cabeça de poucas pessoas. Toda decisão relevante vira um ADR curto, versionado com o código.",
  },
  {
    title: "AS-IS antes do TO-BE",
    text: "Reescrever sem entender o fluxo atual reproduz os mesmos problemas com tecnologia nova. Primeiro documento o que existe.",
  },
  {
    title: "Fronteiras antes de frameworks",
    text: "Separo HTTP, regra de negócio e integrações. Trocar de provedor vira configuração, não refatoração.",
  },
  {
    title: "IA onde remove trabalho",
    text: "Aplico modelos em etapas manuais e repetitivas, como ler e corrigir provas. O ganho aparece como etapa eliminada.",
  },
  {
    title: "Incomodou duas vezes, vira ferramenta",
    text: "Atrito pequeno e recorrente custa caro. Por isso escrevo CLIs pequenas para o time.",
  },
  {
    title: "Code review é mentoria assíncrona",
    text: "Comento o porquê, aponto o padrão e deixo o link para o guia.",
  },
];

export const books = [
  {
    id: "pavimento",
    spine: "Patologias em Pavimento",
    color: "nanquim",
    kind: "Publicação · 2025",
    title: "Detecção de Patologias em Pavimento Asfáltico Utilizando Redes Neurais Convolucionais",
    venue: "XXVI Encontro de Pós-Graduação e Pesquisa · UNIFOR",
    text: "YOLOv11X e SAM2 sobre um dataset próprio de 757 imagens anotadas para detectar buracos, fissuras e remendos em vias urbanas.",
    cite: "SAMPAIO, T. O. Detecção de Patologias em Pavimento Asfáltico Utilizando Redes Neurais Convolucionais. In: XXVI Encontro de Pós-Graduação e Pesquisa, Universidade de Fortaleza (UNIFOR), 2025.",
  },
  {
    id: "pln",
    spine: "Estudante × Agente",
    color: "caju",
    kind: "Publicação · 2025",
    title: "Caracterização de Interações Estudante–Agente Conversacional por Processamento de Linguagem Natural",
    venue: "XXVI Encontro de Pós-Graduação e Pesquisa · UNIFOR",
    text: "Classificação de intenção com BERTimbau para entender como estudantes conversam com agentes de IA e orquestrar a resposta certa.",
    cite: "SAMPAIO, T. O. Caracterização de Interações Estudante–Agente Conversacional por Processamento de Linguagem Natural. In: XXVI Encontro de Pós-Graduação e Pesquisa, Universidade de Fortaleza (UNIFOR), 2025.",
  },
  {
    id: "mestrado",
    spine: "CCA × IPBA · rascunho",
    color: "menta",
    kind: "Mestrado · 2026–2027",
    title: "Ciência de dados espaciais e modelagem alométrica integrada",
    venue: "Informática Aplicada · UNIFOR (em andamento)",
    text: "Modelo preditivo de aporte de resíduos plásticos em bacias hidrográficas, correlacionando escala populacional (CCA) e potencial de deságue (IPBA), com validação de leis de potência e distribuições de cauda longa.",
  },
];

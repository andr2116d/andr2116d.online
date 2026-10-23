import type { Localized } from "@/shared/i18n/config";

export type Group = "backend" | "frontend" | "data" | "cloud";

export interface Element {
  id: string;
  symbol: string;
  name: string;
  /** Shorter label for narrow tiles; the accessible name stays `name`. */
  tileName?: string;
  group: Group;
  /** Project slugs (content collection ids) where the technology is documented. */
  usedIn: string[];
  description: Localized<string>;
}

export const groups: Record<Group, Localized<string>> = {
  backend: { es: "Backend", en: "Backend" },
  frontend: { es: "Frontend", en: "Frontend" },
  data: { es: "Datos e IA", en: "Data & AI" },
  cloud: { es: "Cloud", en: "Cloud" },
};

/** Ordered by group so that each group fills one column, like a periodic family. */
export const elements: Element[] = [
  {
    id: "go",
    symbol: "Go",
    name: "Go",
    group: "backend",
    usedIn: ["quikko"],
    description: {
      es: "APIs rápidas y tipadas. El backend de Quikko está escrito en Go con Echo y Clean Architecture.",
      en: "Fast, typed APIs. Quikko’s backend is written in Go with Echo and Clean Architecture.",
    },
  },
  {
    id: "python",
    symbol: "Py",
    name: "Python",
    group: "backend",
    usedIn: ["unitru-academic", "deconsta", "gemelo-socioeconomico"],
    description: {
      es: "Automatización, datos y modelos. La base común de UNITRU Academic, Deconsta y el Gemelo Socioeconómico.",
      en: "Automation, data and models. The shared foundation of UNITRU Academic, Deconsta and the Socioeconomic Twin.",
    },
  },
  {
    id: "fastapi",
    symbol: "Fa",
    name: "FastAPI",
    group: "backend",
    usedIn: ["unitru-academic", "deconsta", "gemelo-socioeconomico"],
    description: {
      es: "APIs en Python que conectan interfaces, procesos e inferencia de modelos.",
      en: "Python APIs that connect interfaces, processes and model inference.",
    },
  },
  {
    id: "typescript",
    symbol: "Ts",
    name: "TypeScript",
    group: "frontend",
    usedIn: ["quikko", "deconsta", "la-previa"],
    description: {
      es: "Tipos claros en los frontends de mis proyectos y en el backend NestJS de La Previa.",
      en: "Clear types across my project frontends and La Previa’s NestJS backend.",
    },
  },
  {
    id: "nextjs",
    symbol: "Nx",
    name: "Next.js",
    group: "frontend",
    usedIn: ["quikko", "unitru-academic", "gemelo-socioeconomico", "la-previa"],
    description: {
      es: "Interfaces con React para dashboards y productos: Quikko, UNITRU Academic, el Gemelo y La Previa.",
      en: "React interfaces for dashboards and products: Quikko, UNITRU Academic, the Twin and La Previa.",
    },
  },
  {
    id: "vue",
    symbol: "Vu",
    name: "Vue",
    group: "frontend",
    usedIn: ["deconsta"],
    description: {
      es: "La interfaz de Deconsta, con Vue 3, TypeScript, Pinia y Tailwind CSS.",
      en: "Deconsta’s interface, built with Vue 3, TypeScript, Pinia and Tailwind CSS.",
    },
  },
  {
    id: "pytorch",
    symbol: "Pt",
    name: "PyTorch",
    group: "data",
    usedIn: ["gemelo-socioeconomico"],
    description: {
      es: "Redes neuronales sobre grafos: GraphSAGE con PyTorch Geometric en el Gemelo Socioeconómico.",
      en: "Graph neural networks: GraphSAGE with PyTorch Geometric in the Socioeconomic Twin.",
    },
  },
  {
    id: "postgresql",
    symbol: "Pg",
    name: "PostgreSQL",
    tileName: "Postgres",
    group: "data",
    usedIn: ["deconsta", "la-previa"],
    description: {
      es: "Datos relacionales para las reglas y los flujos de Deconsta y La Previa.",
      en: "Relational data for the rules and workflows of Deconsta and La Previa.",
    },
  },
  {
    id: "redis",
    symbol: "Rd",
    name: "Redis",
    group: "data",
    usedIn: ["quikko", "deconsta"],
    description: {
      es: "Caché de redirecciones en Quikko; colas, pub/sub y límites en Deconsta.",
      en: "Redirect caching in Quikko; queues, pub/sub and rate limits in Deconsta.",
    },
  },
  {
    id: "aws",
    symbol: "Aw",
    name: "AWS",
    group: "cloud",
    usedIn: ["serverless-image-processor"],
    description: {
      es: "Servicios conectados: API Gateway, Lambda, S3 y SQS en el procesador de imágenes.",
      en: "Connected services: API Gateway, Lambda, S3 and SQS in the image processor.",
    },
  },
  {
    id: "docker",
    symbol: "Dk",
    name: "Docker",
    group: "cloud",
    usedIn: ["quikko", "unitru-academic", "la-previa"],
    description: {
      es: "Entornos reproducibles para aplicaciones, bases de datos y servicios.",
      en: "Reproducible environments for applications, databases and services.",
    },
  },
  {
    id: "terraform",
    symbol: "Tf",
    name: "Terraform",
    group: "cloud",
    usedIn: ["serverless-image-processor"],
    description: {
      es: "Infraestructura como código para tres entornos en AWS, con estado remoto por entorno.",
      en: "Infrastructure as code for three AWS environments, each with its own remote state.",
    },
  },
];

/** From the stack table of the public GitHub profile README or the projects above. */
export const alsoUsed = [
  "JavaScript",
  "Node.js",
  "Java",
  "Spring Boot",
  "NestJS",
  "React",
  "Tailwind CSS",
  "Astro",
  "Celery",
  "scikit-learn",
  "pandas",
  "PaddleOCR",
  "MongoDB",
  "InfluxDB",
  "Supabase",
  "Playwright",
  "Cloudflare",
  "Vercel",
  "Railway",
  "Git",
  "Linux",
];

export const stackCopy = {
  es: {
    kicker: "Stack",
    title: "La química de mi stack.",
    intro:
      "Cada tecnología aporta algo distinto; lo interesante es cómo reaccionan juntas. Selecciona un elemento para ver dónde lo uso.",
    legend: "Tecnologías",
    usedIn: "Dónde lo uso",
    also: "También en mi caja de herramientas",
  },
  en: {
    kicker: "Stack",
    title: "The chemistry of my stack.",
    intro:
      "Every technology brings something different; the interesting part is how they react together. Select an element to see where I use it.",
    legend: "Technologies",
    usedIn: "Where I use it",
    also: "Also in my toolbox",
  },
} as const;

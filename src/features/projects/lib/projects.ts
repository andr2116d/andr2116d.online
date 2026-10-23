import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "@/shared/i18n/config";

export type Project = CollectionEntry<"projects">;
export type FlowStep = Project["data"]["flow"][number];

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export function flowLabel(step: FlowStep, lang: Lang): string {
  return typeof step.label === "string" ? step.label : step.label[lang];
}

/** "P-01" style tag, like equipment numbering on a process diagram. */
export function projectTag(project: Project): string {
  return `P-${String(project.data.order).padStart(2, "0")}`;
}

export const projectsCopy = {
  es: {
    kicker: "Proyectos",
    title: "Lo que estoy construyendo.",
    intro:
      "Productos web, datos e inteligencia artificial, y algo de infraestructura en la nube. Cada caso explica el problema, la propuesta y mi participación, a partir de la documentación de su repositorio.",
    allRepos: "Todos mis repositorios en GitHub",
    team: "En equipo",
    personal: "Personal",
    open: "Ver caso",
    flowLabel: "Diagrama de flujo",
    // Detail page
    year: "Año",
    type: "Tipo",
    teamProject: "Proyecto en equipo",
    personalProject: "Proyecto personal",
    code: "Ver código en GitHub",
    demo: "Abrir demo",
    problem: "El problema",
    approach: "La propuesta",
    role: "Mi participación",
    architecture: "Flujo del sistema",
    architectureNote:
      "Dibujado con la notación de los diagramas de flujo de procesos de ingeniería química.",
    stack: "Tecnologías",
    evidence:
      "Descripción basada en la documentación pública del repositorio. Sin métricas inventadas.",
    legend: {
      source: "Entrada",
      process: "Proceso",
      store: "Almacenamiento",
      output: "Salida",
    },
    back: "Volver a proyectos",
    more: "Más proyectos",
    all: "Todos los proyectos",
    caseNav: "Navegación entre proyectos",
    positionLabel: "Proyecto",
    of: "de",
    previous: "Proyecto anterior",
    next: "Proyecto siguiente",
    details: "Ficha del proyecto",
    languages: "Lenguajes",
    demoPublic: "Pública",
    demoNone: "Sin demo pública",
    screen: "Así se ve",
    screenNote: "Captura de la pantalla pública de la demo.",
    screenNoteRepo: "Captura publicada en el README del repositorio.",
  },
  en: {
    kicker: "Projects",
    title: "What I’m building.",
    intro:
      "Web products, data and artificial intelligence, plus some cloud infrastructure. Each case explains the problem, the approach and my part, based on its repository’s documentation.",
    allRepos: "All my repositories on GitHub",
    team: "Team",
    personal: "Personal",
    open: "View case",
    flowLabel: "Flow diagram",
    year: "Year",
    type: "Type",
    teamProject: "Team project",
    personalProject: "Personal project",
    code: "View code on GitHub",
    demo: "Open demo",
    problem: "The problem",
    approach: "The approach",
    role: "My part",
    architecture: "System flow",
    architectureNote:
      "Drawn with the process flow diagram notation used in chemical engineering.",
    stack: "Technologies",
    evidence:
      "Description based on the repository’s public documentation. No invented metrics.",
    legend: {
      source: "Input",
      process: "Process",
      store: "Storage",
      output: "Output",
    },
    back: "Back to projects",
    more: "More projects",
    all: "All projects",
    caseNav: "Project navigation",
    positionLabel: "Project",
    of: "of",
    previous: "Previous project",
    next: "Next project",
    details: "Project details",
    languages: "Languages",
    demoPublic: "Public",
    demoNone: "No public demo",
    screen: "What it looks like",
    screenNote: "Screenshot of the demo’s public screen.",
    screenNoteRepo: "Screenshot published in the repository README.",
  },
} as const;

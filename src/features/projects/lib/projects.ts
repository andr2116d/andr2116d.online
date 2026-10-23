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
      "Cada proyecto se presenta como un diagrama de flujo: de dónde entran los datos, cómo se transforman y qué se entrega. La notación viene de la ingeniería química; el contenido, de los repositorios.",
    allRepos: "Todos mis repositorios en GitHub",
    team: "En equipo",
    personal: "Personal",
    open: "Ver caso",
    flowLabel: "Diagrama de flujo",
    // Detail page
    breadcrumb: "Proyectos",
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
    stack: "Tecnologías",
    evidence:
      "Descripción basada en la documentación pública del repositorio. Sin métricas inventadas.",
    legend: {
      source: "Entrada",
      process: "Proceso",
      store: "Almacenamiento",
      output: "Salida",
    },
    previous: "Proyecto anterior",
    next: "Proyecto siguiente",
    back: "Volver a proyectos",
  },
  en: {
    kicker: "Projects",
    title: "What I’m building.",
    intro:
      "Each project is shown as a process flow diagram: where data comes in, how it’s transformed and what gets delivered. The notation comes from chemical engineering; the content, from the repositories.",
    allRepos: "All my repositories on GitHub",
    team: "Team",
    personal: "Personal",
    open: "View case",
    flowLabel: "Flow diagram",
    breadcrumb: "Projects",
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
    stack: "Technologies",
    evidence:
      "Description based on the repository’s public documentation. No invented metrics.",
    legend: {
      source: "Input",
      process: "Process",
      store: "Storage",
      output: "Output",
    },
    previous: "Previous project",
    next: "Next project",
    back: "Back to projects",
  },
} as const;

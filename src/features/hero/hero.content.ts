import type { Localized } from "@/shared/i18n/config";

export const heroContent: Localized<{
  eyebrow: string;
  statement: string;
  lead: string;
  primary: string;
  secondary: string;
  location: string;
  art: {
    top: string;
    chemistry: string;
    software: string;
    ai: string;
    caption: string;
  };
  motion: { pause: string; play: string; label: string };
}> = {
  es: {
    eyebrow: "Ingeniería Química × Sistemas e IA",
    statement: "La curiosidad hecha código.",
    lead: "Estudio Ingeniería Química en la UNT e Ingeniería de Sistemas e Inteligencia Artificial en la UPAO. De la primera traigo el pensamiento en procesos; de la segunda, las herramientas para automatizarlos.",
    primary: "Ver proyectos",
    secondary: "Ver mi CV",
    location: "Trujillo, Perú",
    art: {
      top: "Todo está conectado",
      chemistry: "Química",
      software: "Software",
      ai: "IA",
      caption: "Dos disciplinas, una misma curva.",
    },
    motion: {
      pause: "Pausar",
      play: "Animar",
      label: "animación decorativa",
    },
  },
  en: {
    eyebrow: "Chemical Engineering × Systems & AI",
    statement: "Curiosity, written in code.",
    lead: "I study Chemical Engineering at UNT and Systems Engineering & Artificial Intelligence at UPAO. From the first I bring process thinking; from the second, the tools to automate it.",
    primary: "See projects",
    secondary: "View my CV",
    location: "Trujillo, Peru",
    art: {
      top: "Everything is connected",
      chemistry: "Chemistry",
      software: "Software",
      ai: "AI",
      caption: "Two disciplines, one curve.",
    },
    motion: {
      pause: "Pause",
      play: "Animate",
      label: "decorative animation",
    },
  },
};

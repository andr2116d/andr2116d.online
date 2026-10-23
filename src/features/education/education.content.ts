import type { ImageMetadata } from "astro";
import type { Localized } from "@/shared/i18n/config";
import untEscudo from "@/assets/logos/unt-escudo.png";
import upaoLogo from "@/assets/logos/upao-logotipo.svg";

export interface Institution {
  id: "unt" | "upao";
  discipline: "chem" | "ai";
  logo: ImageMetadata;
  /** Display height in px; width follows the official aspect ratio. */
  logoHeight: number;
  /** Year the degree started (confirmed by the owner). */
  since: string;
  url: string;
  university: string;
  degree: Localized<string>;
  logoAlt: Localized<string>;
}

export const institutions: Institution[] = [
  {
    id: "unt",
    discipline: "chem",
    logo: untEscudo,
    logoHeight: 72,
    since: "2024",
    url: "https://www.unitru.edu.pe/",
    university: "Universidad Nacional de Trujillo",
    degree: { es: "Ingeniería Química", en: "Chemical Engineering" },
    logoAlt: {
      es: "Escudo de la Universidad Nacional de Trujillo",
      en: "Coat of arms of Universidad Nacional de Trujillo",
    },
  },
  {
    id: "upao",
    discipline: "ai",
    logo: upaoLogo,
    logoHeight: 46,
    since: "2024",
    url: "https://www.upao.edu.pe/",
    university: "Universidad Privada Antenor Orrego",
    degree: {
      es: "Ingeniería de Sistemas e Inteligencia Artificial",
      en: "Systems Engineering & Artificial Intelligence",
    },
    logoAlt: {
      es: "Logotipo de la Universidad Privada Antenor Orrego",
      en: "Universidad Privada Antenor Orrego logo",
    },
  },
];

export const educationCopy = {
  es: {
    kicker: "Sobre mí · Formación",
    title: "Dos ingenierías. Una misma curiosidad.",
    intro: [
      "Soy Johel Andreé Vargas Villanueva, desarrollador autodidacta de Trujillo, Perú. Empecé a programar por pura curiosidad: quería entender cómo funciona por dentro una web o una app. Hoy curso dos carreras en paralelo: Ingeniería Química en la Universidad Nacional de Trujillo e Ingeniería de Sistemas e Inteligencia Artificial en la Universidad Privada Antenor Orrego.",
      "La primera me enseña a entender los procesos; la segunda, a transformarlos con tecnología. Me gusta inventar, aprendo rápido y no me gustan las cosas mal hechas. Me equivoco a menudo, y es justo así como aprendo: cada error me deja algo que hacer mejor.",
    ],
    offscreen: "Fuera de la pantalla: música. Toco el saxofón.",
    looking: {
      title: "Lo que busco",
      text: "Seguir aprendiendo y desarrollar soluciones que resuelvan problemas reales. Si tienes un proyecto o una oportunidad en la que pueda aportar, conversemos.",
      action: "Escríbeme",
    },
    status: "En curso",
    since: "desde",
    website: "Sitio oficial",
    venn: {
      label:
        "Diagrama: la ingeniería química y la ingeniería de sistemas e IA se cruzan en la automatización de procesos, los datos y la IA aplicada.",
      chem: "Química",
      chemNote: "procesos",
      ai: "Sistemas e IA",
      aiNote: "software",
      center: ["Automatización", "Datos", "IA aplicada"],
    },
  },
  en: {
    kicker: "About · Education",
    title: "Two engineering degrees. One curiosity.",
    intro: [
      "I’m Johel Andreé Vargas Villanueva, a self-taught developer from Trujillo, Peru. I started programming out of pure curiosity: I wanted to understand how a website or an app works on the inside. Today I’m pursuing two degrees at the same time: Chemical Engineering at Universidad Nacional de Trujillo and Systems Engineering & Artificial Intelligence at Universidad Privada Antenor Orrego.",
      "The first teaches me to understand processes; the second, to transform them with technology. I like inventing things, I learn fast and I don’t like sloppy work. I make mistakes often, and that’s exactly how I learn: every mistake leaves me something to do better.",
    ],
    offscreen: "Away from the screen: music. I play the saxophone.",
    looking: {
      title: "What I’m looking for",
      text: "To keep learning and build solutions to real problems. If you have a project or an opportunity where I can contribute, let’s talk.",
      action: "Get in touch",
    },
    status: "In progress",
    since: "since",
    website: "Official website",
    venn: {
      label:
        "Diagram: chemical engineering and systems & AI engineering meet in process automation, data and applied AI.",
      chem: "Chemistry",
      chemNote: "processes",
      ai: "Systems & AI",
      aiNote: "software",
      center: ["Automation", "Data", "Applied AI"],
    },
  },
} as const;

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
    logoHeight: 96,
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
    logoHeight: 72,
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
    kicker: "Formación",
    title: "Dos ingenierías. Una misma curiosidad.",
    intro: [
      "Soy Johel Andreé Vargas Villanueva, desarrollador autodidacta de Trujillo, Perú. Curso dos carreras en paralelo: Ingeniería Química en la Universidad Nacional de Trujillo e Ingeniería de Sistemas e Inteligencia Artificial en la Universidad Privada Antenor Orrego.",
      "La primera me enseña a entender los procesos; la segunda, a transformarlos con tecnología. Me interesa lo que sucede entre disciplinas: una interfaz que simplifica lo complejo, una API bien pensada o un proceso que deja de hacerse a mano.",
    ],
    status: "En curso",
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
    kicker: "Education",
    title: "Two engineering degrees. One curiosity.",
    intro: [
      "I’m Johel Andreé Vargas Villanueva, a self-taught developer from Trujillo, Peru. I’m pursuing two degrees at the same time: Chemical Engineering at Universidad Nacional de Trujillo and Systems Engineering & Artificial Intelligence at Universidad Privada Antenor Orrego.",
      "The first teaches me to understand processes; the second, to transform them with technology. I’m drawn to what happens between disciplines: an interface that makes complexity manageable, a well-designed API or a process that no longer has to be done by hand.",
    ],
    status: "In progress",
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

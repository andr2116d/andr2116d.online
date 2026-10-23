import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Projects are written from each repository's public documentation.
 * Rule: no metric, role or feature goes here unless the repository backs it up.
 */
const copy = z.object({
  /** Short category line, e.g. "Producto · Full stack". */
  kind: z.string(),
  /** One-line promise shown on the card. */
  tagline: z.string(),
  /** Meta description for the project page (≤ 160 characters). */
  description: z.string().max(160),
  summary: z.string(),
  problem: z.string(),
  approach: z.array(z.string()).min(1),
  /** Documented personal responsibility in team projects. */
  role: z.string().optional(),
  imageAlt: z.string().optional(),
});

const flowStep = z.object({
  /** Plain text when the label is the same in both languages (e.g. a technology). */
  label: z.union([z.string(), z.object({ es: z.string(), en: z.string() })]),
  /** Process-flow notation: where data enters, is transformed, stored or delivered. */
  type: z.enum(["source", "process", "store", "output"]),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      order: z.number().int().positive(),
      year: z.number().int(),
      team: z.boolean(),
      area: z.enum(["product", "data-ai", "cloud"]),
      repository: z.url(),
      demo: z.url().optional(),
      stack: z.array(z.string()).min(1),
      languages: z.array(z.string()).min(1),
      flow: z.array(flowStep).min(3).max(6),
      image: image().optional(),
      es: copy,
      en: copy,
    }),
});

export const collections = { projects };

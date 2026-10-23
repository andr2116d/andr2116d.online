import { getProjects } from "./projects";

/** Shared by the Spanish and English project routes; "more" wraps around the list. */
export async function projectPaths() {
  const projects = await getProjects();
  return projects.map((project, index) => ({
    params: { slug: project.id },
    props: {
      project,
      more: [1, 2].map((step) => projects[(index + step) % projects.length]!),
    },
  }));
}

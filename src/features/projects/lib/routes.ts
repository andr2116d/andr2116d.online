import { getProjects } from "./projects";

/** Shared by the Spanish and English project routes; neighbors wrap around. */
export async function projectPaths() {
  const projects = await getProjects();
  return projects.map((project, index) => ({
    params: { slug: project.id },
    props: {
      project,
      previous: projects.at(index - 1)!,
      next: projects[(index + 1) % projects.length]!,
    },
  }));
}

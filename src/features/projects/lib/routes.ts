import { getProjects } from "./projects";

/** Shared by the Spanish and English project routes; neighbors wrap around. */
export async function projectPaths() {
  const projects = await getProjects();
  const at = (index: number) =>
    projects[(index + projects.length) % projects.length]!;
  return projects.map((project, index) => ({
    params: { slug: project.id },
    props: {
      project,
      previous: at(index - 1),
      next: at(index + 1),
      more: [at(index + 1), at(index + 2)],
      position: index + 1,
      total: projects.length,
    },
  }));
}

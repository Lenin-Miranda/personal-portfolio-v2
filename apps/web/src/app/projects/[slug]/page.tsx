import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectCaseStudy from "../../components/ProjectCaseStudy";
import {
  getFeaturedProjectBySlug,
  getFeaturedProjectSlugs,
  getNextFeaturedProject,
} from "../../data/portfolio";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getFeaturedProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getFeaturedProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found | Lenin Miranda" };
  }

  const title = `${project.title} | Engineering case study`;

  return {
    description: project.positioning,
    openGraph: {
      description: project.positioning,
      images: [{ alt: project.alt, url: project.image }],
      title,
      type: "article",
    },
    title,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getFeaturedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextFeaturedProject(slug);

  if (!nextProject) {
    notFound();
  }

  return <ProjectCaseStudy nextProject={nextProject} project={project} />;
}

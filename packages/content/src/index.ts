export type Project = {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string | null;
  source: string;
  technologies: readonly string[];
  featured?: boolean;
};

export const site = {
  name: "Lenin Miranda",
  role: "Full-stack software engineer",
  email: "leninmiranda.dev@gmail.com",
  github: "https://github.com/Lenin-Miranda",
  linkedin: "https://www.linkedin.com/in/lenin-miranda-0b74b4288/",
} as const;

export const projects: readonly Project[] = [
  {
    name: "Impostor Futbol Online",
    description:
      "A real-time social game with rooms, role reveals, voting, scoring, and multiplayer rounds.",
    image: "/projects/impostor-futbol-online.jpg",
    imageAlt: "Impostor Futbol Online game interface",
    href: "https://impostor-online-game.vercel.app/",
    source: "https://github.com/Lenin-Miranda/impostor-online-game",
    technologies: ["Next.js", "TypeScript", "NestJS", "Supabase", "Socket.IO"],
    featured: true,
  },
  {
    name: "Task Manager",
    description:
      "A focused planning product with GitHub authentication and a modern relational data layer.",
    image: "/projects/task-manager.webp",
    imageAlt: "Task Manager application interface",
    href: "https://task-manager-self-iota.vercel.app/",
    source: "https://github.com/Lenin-Miranda/Task-Manager",
    technologies: ["Next.js", "TypeScript", "Prisma", "GraphQL", "PostgreSQL"],
  },
  {
    name: "Offerly",
    description:
      "A job application tracker with a Kanban workflow, authentication, and full-stack status management.",
    image: "/projects/offerly.jpg",
    imageAlt: "Offerly job application tracker interface",
    href: null,
    source: "https://github.com/Lenin-Miranda/OfferlyFE",
    technologies: ["Next.js", "TypeScript", "Node.js", "Express", "MongoDB"],
  },
] as const;

export const principles = [
  {
    title: "Clarify the problem",
    body: "Turn ambiguous requirements into a small, testable product shape before adding complexity.",
  },
  {
    title: "Build the full path",
    body: "Connect interface, application logic, and data so the final experience feels coherent.",
  },
  {
    title: "Refine what ships",
    body: "Test real states, remove friction, and make the details hold up beyond the first impression.",
  },
] as const;

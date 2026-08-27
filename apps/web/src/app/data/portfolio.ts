export const SITE = {
  email: "Lenin9073@gmail.com",
  github: "https://github.com/Lenin-Miranda",
  linkedin: "https://www.linkedin.com/in/lenin-miranda",
  location: "Las Vegas, Nevada",
  name: "Lenin Miranda",
  resume: "/resume/Lenin-Miranda-Resume.pdf",
  role: "Full-stack software engineer",
} as const;

export const NAV_ITEMS = [
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Selected work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export type Experience = {
  company: string;
  dates: string;
  highlights: readonly string[];
  location: string;
  proof: string;
  role: string;
  summary: string;
  technologies: readonly string[];
};

export const EXPERIENCE: readonly Experience[] = [
  {
    company: "Stealth Startup",
    dates: "Mar 2026 — Present",
    highlights: [
      "Built production AI communication workflows and NestJS services integrating ElevenLabs, Twilio, WhatsApp/SIP routing, webhooks, and external APIs.",
      "Automated onboarding, scheduling, confirmations, and notification workflows to reduce manual setup and improve client reliability.",
      "Shipped billing v1 with payment-cycle tracking, status webhooks, validation, retries, and service-level error handling.",
    ],
    location: "Remote · Part-time contractor",
    proof: "20+ production incidents resolved",
    role: "Full Stack Software Engineer",
    summary:
      "Production communication systems spanning React interfaces, backend services, telephony, messaging, billing, and third-party integrations.",
    technologies: [
      "React",
      "NestJS",
      "ElevenLabs",
      "Twilio",
      "WhatsApp / SIP",
      "Webhooks",
    ],
  },
  {
    company: "Marketing.com",
    dates: "Jan 2024 — Nov 2025",
    highlights: [
      "Built Python automation processing more than 100,000 daily records, cutting manual data preparation time by 70%.",
      "Created SQL and regex validation pipelines that standardized addresses and maintained 99% data accuracy at production scale.",
      "Reduced recurring data errors by 15% through normalization, exception handling, quality checks, and reusable processing rules.",
    ],
    location: "Las Vegas, Nevada",
    proof: "100K+ records processed daily",
    role: "Data Automation Specialist",
    summary:
      "High-volume production automation where accuracy, edge-case handling, and dependable daily delivery were the product.",
    technologies: [
      "Python",
      "SQL",
      "Regex",
      "Data validation",
      "Incident response",
    ],
  },
  {
    company: "TripleTen Externship",
    dates: "Sep 2025 — Oct 2025",
    highlights: [
      "Built KeystoneJS and GraphQL workflows for waitlists, invitations, role-based access, validation, and Google OAuth.",
      "Integrated MySQL and SendGrid for user lifecycle events, CSV imports, invitation delivery, and transactional email.",
      "Collaborated with product and frontend teammates on acceptance criteria, reviews, and scheduled delivery.",
    ],
    location: "Remote",
    proof: "4 workflows shipped in 6 weeks",
    role: "Backend Engineer",
    summary:
      "A focused product delivery engagement covering identity, lifecycle automation, data import, and transactional messaging.",
    technologies: [
      "KeystoneJS",
      "GraphQL",
      "MySQL",
      "SendGrid",
      "Google OAuth",
    ],
  },
  {
    company: "Odontools",
    dates: "Aug 2025 — Dec 2025",
    highlights: [
      "Built a React and Express commerce platform with search, filters, cart interactions, and complete order workflows.",
      "Designed MongoDB schemas and REST endpoints for products, orders, inventory, customer data, and administrative operations.",
      "Implemented responsive UI, validation, centralized errors, and transactional email notifications across the order lifecycle.",
    ],
    location: "Remote · Contractor",
    proof: "20+ products supported",
    role: "Full Stack Software Engineer",
    summary:
      "End-to-end commerce delivery connecting a responsive storefront to inventory, ordering, customer, and administrative systems.",
    technologies: [
      "React",
      "Express",
      "MongoDB",
      "REST APIs",
      "Transactional email",
    ],
  },
] as const;

export type FeaturedProject = {
  alt: string;
  build: string;
  challenge: string;
  id: string;
  image: string;
  links: readonly { href: string; label: string }[];
  number: string;
  positioning: string;
  result: string;
  role: string;
  stack: readonly string[];
  status: ProjectStatus;
  title: string;
  tone: "dark" | "light";
};

export type ProjectStatus = "in-progress" | "live" | "pending";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  "in-progress": "In progress",
  live: "Live",
  pending: "Pending deploy",
};

export const FEATURED_PROJECTS: readonly FeaturedProject[] = [
  {
    alt: "Impostor Fútbol Online landing page and live game room interface",
    build:
      "Built WebSocket lobbies, live player synchronization, voting, role assignment, and multi-round scoring in a TypeScript monorepo.",
    challenge:
      "Lobby membership, voting, roles, scoring, and reconnects all depend on one consistent room state. Typed events, validation, shared contracts, and reconnect-safe updates keep those transitions explicit.",
    id: "impostor-futbol",
    image: "/projects/impostor-futbol-online.jpg",
    links: [
      {
        href: "https://impostor-online-game.vercel.app/",
        label: "Live game",
      },
      {
        href: "https://github.com/Lenin-Miranda/impostor-online-game",
        label: "Source code",
      },
    ],
    number: "01",
    positioning:
      "A real-time multiplayer football social game built around synchronized rooms and round-based play.",
    result:
      "The frontend is publicly deployed on Vercel; the repository documents the complete Next.js, NestJS, Supabase, and local Docker workflow.",
    role: "Full-stack product engineering",
    stack: [
      "Next.js",
      "NestJS",
      "TypeScript",
      "WebSockets",
      "Supabase",
      "Docker",
    ],
    status: "live",
    title: "Impostor Fútbol Online",
    tone: "dark",
  },
  {
    alt: "Offerly job search platform landing page",
    build:
      "Built a Next.js Kanban workflow for creating, organizing, and updating job applications, backed by a typed Express API with authentication and CRUD operations.",
    challenge:
      "Application stages and authenticated user data need to stay consistent across local UI state, cached server state, API validation, and persistence.",
    id: "offerly",
    image: "/projects/offerly.jpg",
    links: [
      {
        href: "https://github.com/Lenin-Miranda/OfferlyFE",
        label: "Frontend source",
      },
      {
        href: "https://github.com/Lenin-Miranda/OfferlyBE",
        label: "API source",
      },
    ],
    number: "02",
    positioning:
      "A full-stack job application workspace for tracking opportunities through a clear, Kanban-style process.",
    result:
      "Frontend and API are documented in separate public repositories; production deployment is still in progress.",
    role: "Full-stack product engineering",
    stack: [
      "Next.js",
      "Express",
      "TypeScript",
      "MongoDB",
      "JWT",
      "React Query",
    ],
    status: "in-progress",
    title: "Offerly",
    tone: "light",
  },
] as const;

export function getFeaturedProjectBySlug(slug: string) {
  return FEATURED_PROJECTS.find((project) => project.id === slug);
}

export function getFeaturedProjectSlugs() {
  return FEATURED_PROJECTS.map((project) => project.id);
}

export function getNextFeaturedProject(slug: string) {
  const currentIndex = FEATURED_PROJECTS.findIndex(
    (project) => project.id === slug,
  );

  if (currentIndex < 0) {
    return undefined;
  }

  return FEATURED_PROJECTS[(currentIndex + 1) % FEATURED_PROJECTS.length];
}

export type AdditionalProject = {
  description: string;
  links: readonly { href: string; label: string }[];
  number: string;
  stack: readonly string[];
  status: ProjectStatus;
  title: string;
};

export const ADDITIONAL_PROJECTS: readonly AdditionalProject[] = [
  {
    description:
      "A bilingual, one-question-at-a-time student intake flow with a Next.js client, validated NestJS API, Supabase relational model, RLS, and queued email jobs.",
    links: [
      {
        href: "https://github.com/Lenin-Miranda/csn-form-demo",
        label: "Source code",
      },
    ],
    number: "03",
    stack: ["Next.js", "NestJS", "Supabase", "PostgreSQL", "Jest"],
    status: "pending",
    title: "CSN Intake Demo",
  },
  {
    description:
      "A public-facing Next.js site for a Las Vegas restaurant, bringing its Nicaraguan story, photography, customer reviews, and visit details into one responsive experience.",
    links: [
      {
        href: "https://la-cuchara-de-vilma.vercel.app/",
        label: "Live site",
      },
      {
        href: "https://github.com/Lenin-Miranda/LaCucharaDeVilma",
        label: "Source code",
      },
    ],
    number: "04",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    status: "live",
    title: "La Cuchara de Vilma",
  },
  {
    description:
      "A dental commerce product spanning catalog search, cart and checkout, JWT authentication, order workflows, inventory, administration, and transactional notifications.",
    links: [
      {
        href: "https://odontools.vercel.app/",
        label: "Live storefront",
      },
      {
        href: "https://github.com/Lenin-Miranda/Odontools",
        label: "Frontend source",
      },
      {
        href: "https://github.com/Lenin-Miranda/Odontools-backend",
        label: "API source",
      },
    ],
    number: "05",
    stack: ["React", "Express", "MongoDB", "JWT", "Nodemailer"],
    status: "live",
    title: "Odontools",
  },
  {
    description:
      "A focused task manager with GitHub OAuth, per-user task workflows, a Prisma data model, validation, and a responsive Next.js interface.",
    links: [
      {
        href: "https://task-manager-self-iota.vercel.app/",
        label: "Live app",
      },
      {
        href: "https://github.com/Lenin-Miranda/Task-Manager",
        label: "Source code",
      },
    ],
    number: "06",
    stack: ["Next.js", "TypeScript", "NextAuth", "Prisma", "SQLite"],
    status: "live",
    title: "Task Manager",
  },
  {
    description:
      "A React timeline interface for organizing shared memories, paired with an Express, Prisma, and PostgreSQL API with CRUD coverage and isolated tests.",
    links: [
      {
        href: "https://memory-timeline-frontend.vercel.app/",
        label: "Live preview",
      },
      {
        href: "https://github.com/Lenin-Miranda/memory-timeline-frontend",
        label: "Frontend source",
      },
      {
        href: "https://github.com/Lenin-Miranda/memory-timeline-backend-",
        label: "API source",
      },
    ],
    number: "07",
    stack: ["React", "Express", "Prisma", "PostgreSQL", "Jest"],
    status: "live",
    title: "Memory Timeline",
  },
  {
    description:
      "A responsive weather-based clothing client and Express API with profiles, CRUD, likes, protected routes, JWT authentication, ownership checks, and MongoDB persistence.",
    links: [
      {
        href: "https://seprojectreact.vercel.app/",
        label: "Live preview",
      },
      {
        href: "https://github.com/Lenin-Miranda/se_project_react",
        label: "Frontend source",
      },
      {
        href: "https://github.com/Lenin-Miranda/se_project_express",
        label: "API source",
      },
    ],
    number: "08",
    stack: ["React", "Express", "MongoDB", "JWT", "Joi"],
    status: "live",
    title: "WTWR Full-Stack App",
  },
  {
    description:
      "A GitHub-connected tool that selects commit ranges, streams an AI-generated changelog over SSE, and stores exportable history in Supabase.",
    links: [
      {
        href: "https://github.com/Lenin-Miranda/AI-Changelog-Generator",
        label: "Source code",
      },
    ],
    number: "09",
    stack: ["Next.js", "NestJS", "SSE", "OpenAI", "Supabase"],
    status: "pending",
    title: "AI Changelog Generator",
  },
  {
    description:
      "A privacy-aware computer-vision lab that uses OpenCV and MediaPipe landmarks to interpret visible facial movements such as blinking or opening the mouth.",
    links: [
      {
        href: "https://github.com/Lenin-Miranda/Python-face-expression-scanner",
        label: "Source code",
      },
    ],
    number: "10",
    stack: ["Python", "OpenCV", "MediaPipe", "Computer vision"],
    status: "in-progress",
    title: "Facial Movement Lab",
  },
];

export const CAPABILITIES = [
  {
    description:
      "Responsive product interfaces with deliberate states, interaction feedback, and maintainable component boundaries.",
    label: "Product interfaces",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Motion"],
  },
  {
    description:
      "Typed APIs and real-time workflows designed around clear contracts, validation, and failure handling.",
    label: "Service architecture",
    tools: ["Node.js", "NestJS", "Express", "REST", "GraphQL", "WebSockets"],
  },
  {
    description:
      "Relational and document data modeled for real product workflows, deployment, and reliable iteration.",
    label: "Data & infrastructure",
    tools: [
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Prisma",
      "Supabase",
      "AWS",
      "Docker",
    ],
  },
  {
    description:
      "Communication and lifecycle integrations connected with observability, retries, and incident-aware engineering.",
    label: "Integrations & reliability",
    tools: [
      "Twilio",
      "ElevenLabs",
      "SendGrid",
      "OAuth",
      "Webhooks",
      "SIP / WhatsApp",
    ],
  },
] as const;

export const PRINCIPLES = [
  {
    body: "Turn ambiguous requirements into a small, testable product shape before adding complexity.",
    number: "01",
    title: "Clarify the problem",
  },
  {
    body: "Connect interface, application logic, and data so the complete path behaves like one product.",
    number: "02",
    title: "Build the full path",
  },
  {
    body: "Test real states, document the edges, and refine the details that determine whether software feels dependable.",
    number: "03",
    title: "Refine what ships",
  },
] as const;

export const EDUCATION = [
  {
    detail:
      "Certificate in Full-Stack Software Engineering · Data structures, OOP, REST APIs, and databases",
    institution: "TripleTen Software Engineering Bootcamp",
    year: "2025",
  },
  {
    detail: "Responsive Web Design · JavaScript Algorithms and Data Structures",
    institution: "freeCodeCamp",
    year: "2025",
  },
] as const;

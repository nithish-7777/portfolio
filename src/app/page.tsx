import { profile, projects, skills } from "@/data/site";

const nav = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-4">
      <span className="font-mono text-sm text-accent">{index}</span>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export default function Home() {
  const contactLinks = [
    { label: "GitHub", href: profile.github },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
    profile.email && { label: profile.email, href: `mailto:${profile.email}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-line bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="#top" className="font-mono text-sm font-semibold tracking-tight">
            nithish<span className="text-accent">.</span>
          </a>
          <nav className="hidden gap-7 text-sm text-muted sm:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-5xl flex-1 px-6">
        <section className="py-24 sm:py-36">
          <p className="mb-5 font-mono text-sm text-accent">Hi, my name is</p>
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-2xl font-medium text-muted sm:text-4xl">{profile.role}</p>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{profile.tagline}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
            >
              See my work
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-foreground"
            >
              GitHub
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-foreground"
              >
                Resume
              </a>
            )}
          </div>
        </section>

        <section id="about" className="scroll-mt-24 py-16">
          <SectionHeading index="01" title="About" />
          <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section id="projects" className="scroll-mt-24 py-16">
          <SectionHeading index="02" title="Projects" />
          <div className="grid gap-5 sm:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.title}
                className="flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent"
              >
                <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{project.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex gap-5 text-sm font-medium">
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    Code ↗
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      Live site ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="scroll-mt-24 py-16">
          <SectionHeading index="03" title="Skills" />
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <div key={skill.group}>
                <dt className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
                  {skill.group}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span key={item} className="rounded-md bg-surface px-3 py-1.5 text-sm">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contact" className="scroll-mt-24 py-16 pb-28">
          <SectionHeading index="04" title="Contact" />
          <p className="max-w-2xl text-lg leading-relaxed text-muted">
            I&apos;m open to internships, freelance work and interesting collaborations. The fastest
            way to reach me is through the links below.
          </p>
          <ul className="mt-8 flex flex-wrap gap-4">
            {contactLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-8 font-mono text-xs text-muted">
          © 2026 {profile.name}. Built with Next.js and Tailwind CSS.
        </div>
      </footer>
    </>
  );
}

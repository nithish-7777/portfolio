import { KineticName } from "@/components/KineticName";
import { Nav } from "@/components/Nav";
import { ProjectVisual } from "@/components/ProjectVisual";
import { Reveal } from "@/components/Reveal";
import { RiskDemo } from "@/components/RiskDemo";
import { SignalField } from "@/components/SignalField";
import { Tracks } from "@/components/Tracks";
import { coursework, interests, lab, profile, projects, stack } from "@/data/site";

function SectionHeading({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <Reveal className="mb-14 sm:mb-20">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">
        <span className="text-flag">{index}</span> / {label}
      </p>
      <h2 className="mt-5 max-w-4xl font-head text-4xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
        {title}
      </h2>
    </Reveal>
  );
}

const shell = "mx-auto w-full max-w-[92rem] px-5 sm:px-8";

export default function Home() {
  const contactLinks = [
    { label: "GitHub", href: profile.github },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
    profile.email && { label: "Email", href: `mailto:${profile.email}` },
    profile.resumeUrl && { label: "Resume", href: profile.resumeUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <Nav />

      <main id="top">
        <section className="relative flex min-h-svh flex-col justify-end overflow-hidden pt-28 pb-8">
          <SignalField />
          <div className={`${shell} relative`}>
            <p className="mb-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs tracking-widest text-muted uppercase">
              <span>{profile.location}</span>
              <span className="text-line">/</span>
              <span>{profile.coordinates}</span>
            </p>
            <KineticName lines={profile.nameLines} label={profile.name} />
            <div className="mt-10 grid gap-8 border-t border-line pt-6 md:grid-cols-[1.4fr_1fr] md:items-end">
              <p className="max-w-xl text-lg leading-relaxed text-pretty sm:text-xl">{profile.tagline}</p>
              <div className="flex flex-col gap-5 md:items-end">
                <ul className="flex flex-wrap gap-2 font-mono text-xs">
                  {profile.roles.map((role) => (
                    <li key={role} className="rounded-full border border-line bg-bg/60 px-3 py-1.5 backdrop-blur">
                      {role}
                    </li>
                  ))}
                </ul>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flag" /> flagged
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-clear" /> cleared
                  </span>
                  <span>Live anomaly field. Move your cursor through it.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className={`${shell} scroll-mt-24 py-28 sm:py-40`}>
          <Reveal>
            <p className="font-mono text-xs tracking-widest text-muted uppercase">
              <span className="text-flag">01</span> / About
            </p>
            <p className="mt-8 max-w-6xl font-head text-3xl leading-[1.15] font-medium tracking-tight text-pretty sm:text-5xl">
              {profile.statement}
            </p>
          </Reveal>
          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
                {profile.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-head text-4xl font-bold tabular-nums sm:text-6xl">{stat.value}</dd>
                    <dt className="mt-2 font-mono text-[11px] tracking-wider text-muted uppercase">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-muted">
              {profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
          </div>
        </section>

        <section id="tracks" className={`${shell} scroll-mt-24 py-24 sm:py-32`}>
          <SectionHeading index="02" label="Education" title="Two degrees, running in parallel." />
          <Tracks />
          <Reveal className="mt-24">
            <p className="font-mono text-xs tracking-widest text-muted uppercase">Coursework</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {coursework.map((course) => (
                <li
                  key={course}
                  className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-text hover:text-text"
                >
                  {course}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="work" className={`${shell} scroll-mt-24 py-24 sm:py-32`}>
          <SectionHeading index="03" label="Case files" title="Each one started with a problem, not a tech stack." />
          <div className="space-y-6">
            {projects.map((project, index) => (
              <article
                key={project.title}
                style={{ top: `${5.5 + index * 0.9}rem` }}
                className="grid gap-8 rounded-3xl border border-line bg-surface p-6 sm:p-10 lg:sticky lg:grid-cols-[1.15fr_1fr] lg:items-center"
              >
                <div>
                  <p className="flex items-center gap-4 font-mono text-xs tracking-widest text-muted uppercase">
                    <span className="text-flag">{String(index + 1).padStart(2, "0")}</span>
                    {project.kind}
                  </p>
                  <h3 className="mt-5 font-head text-4xl leading-none font-semibold tracking-tight sm:text-5xl">
                    {project.title}
                  </h3>
                  <p className="mt-5 text-xl leading-snug text-text">{project.problem}</p>
                  <p className="mt-3 max-w-xl leading-relaxed text-muted">{project.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-2 font-mono text-xs text-muted">
                    {project.tech.map((tech) => (
                      <li key={tech} className="rounded-full border border-line px-3 py-1">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex gap-3 text-sm font-medium">
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-text px-5 py-2.5 text-bg transition-opacity hover:opacity-85"
                    >
                      Source ↗
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-line px-5 py-2.5 transition-colors hover:border-text"
                      >
                        Live site ↗
                      </a>
                    )}
                  </div>
                </div>
                <ProjectVisual kind={project.visual} />
              </article>
            ))}
          </div>
        </section>

        <section id="playground" className={`${shell} scroll-mt-24 py-24 sm:py-32`}>
          <SectionHeading index="04" label="Playground" title="Don't take my word for it. Score a payment." />
          <Reveal>
            <RiskDemo />
          </Reveal>
        </section>

        <section id="stack" className={`${shell} scroll-mt-24 py-24 sm:py-32`}>
          <SectionHeading index="05" label="Stack" title="What I build with, top to bottom." />
          <div className="border-t border-line">
            {stack.map((layer, index) => (
              <Reveal key={layer.layer} delay={index * 0.05}>
                <div className="group grid gap-4 border-b border-line py-7 transition-colors hover:bg-surface md:grid-cols-[16rem_1fr] md:items-center md:px-4">
                  <div>
                    <h3 className="font-head text-2xl font-semibold sm:text-3xl">{layer.layer}</h3>
                    <p className="mt-1 font-mono text-xs tracking-wider text-muted uppercase">{layer.role}</p>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg bg-surface-2 px-4 py-2 text-sm transition-colors group-hover:bg-bg"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="lab" className={`${shell} scroll-mt-24 py-24 sm:py-32`}>
          <SectionHeading index="06" label="Lab" title="Ideas I'm still turning over." />
          <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {lab.map((item) => (
              <li key={item.title} className="flex flex-col bg-surface p-7">
                <span className="self-start rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-widest text-muted uppercase">
                  {item.tag}
                </span>
                <h3 className="mt-6 font-head text-2xl leading-tight font-semibold">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.note}</p>
              </li>
            ))}
            <li className="flex flex-col justify-between bg-surface p-7">
              <p className="font-mono text-[10px] tracking-widest text-muted uppercase">Also into</p>
              <p className="mt-6 leading-relaxed text-muted">{interests.join(" · ")}</p>
            </li>
          </ul>
        </section>

        <section id="contact" className={`${shell} scroll-mt-24 pt-24 pb-16 sm:pt-40`}>
          <Reveal>
            <p className="font-mono text-xs tracking-widest text-muted uppercase">
              <span className="text-flag">07</span> / Contact
            </p>
            <h2 className="mt-6 font-head text-6xl leading-[0.9] font-bold tracking-tight uppercase sm:text-[9rem]">
              Got a real
              <br />
              problem<span className="text-flag">?</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              I&apos;m looking for internships, research work and collaborations where the software has to hold up in
              the real world.
            </p>
            <ul className="mt-10 flex flex-wrap gap-3">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-full border border-line px-7 py-3.5 font-medium transition-colors hover:border-clear hover:text-clear"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      </main>

      <footer
        className={`${shell} flex flex-wrap justify-between gap-3 border-t border-line py-6 font-mono text-[11px] text-muted`}
      >
        <span>© 2026 {profile.name}</span>
        <span>Designed and built in Chennai</span>
      </footer>
    </>
  );
}

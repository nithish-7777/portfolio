import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";
import { AskMe, ChennaiClock, CursorLens, GitHubPulse, Journey, Tilt } from "@/components/Extras";
import { KineticName } from "@/components/KineticName";
import { LensDock, LensLines, LensProvider, LensSections, LensText } from "@/components/Lens";
import { CountUp, ScrollWords, Spotlight } from "@/components/Motion";
import { Nav } from "@/components/Nav";
import { PhoneFrame, ProjectVisual } from "@/components/ProjectVisual";
import { Reveal } from "@/components/Reveal";
import { SignalField } from "@/components/SignalField";
import { Tracks } from "@/components/Tracks";
import {
  achievements,
  type Award,
  certifications,
  coursework,
  experience,
  interests,
  journey,
  questions,
  lab,
  process,
  profile,
  projects,
  services,
  stack,
} from "@/data/site";

const shell = "mx-auto w-full max-w-[92rem] px-5 sm:px-8";

// The number before each label comes from a CSS counter, so it stays correct
// when the sections are reordered for a different reader.
function Label({ children }: { children: string }) {
  return <p className="section-label font-mono text-xs tracking-widest text-muted uppercase">{children}</p>;
}

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`${shell} scroll-mt-24 py-24 sm:py-32`}>
      <Reveal className={title ? "mb-14 sm:mb-20" : ""}>
        <Label>{label}</Label>
        {title && (
          <h2 className="mt-5 max-w-4xl font-head text-4xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
            {title}
          </h2>
        )}
      </Reveal>
      {children}
    </section>
  );
}

function AwardCard({ award }: { award: Award }) {
  return (
    <Tilt className="h-full">
    <Spotlight className="glass-card group flex h-full flex-col overflow-hidden rounded-3xl">
      <a
        href={award.image}
        target="_blank"
        rel="noreferrer"
        aria-label={`View certificate: ${award.title}, ${award.event}`}
        className="relative block aspect-[7/5] overflow-hidden bg-black/30"
      >
        <Image
          src={award.image}
          alt={`Certificate for ${award.title}, ${award.event}`}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-80 grayscale transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
        />
      </a>
      <div className="flex flex-1 flex-col p-7">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">{award.date}</p>
        <h3 className="mt-4 font-head text-4xl leading-none font-bold text-lime">{award.title}</h3>
        <p className="mt-3 text-xl leading-snug">{award.event}</p>
        <p className="mt-2 text-muted">{award.issuer}</p>
      </div>
    </Spotlight>
    </Tilt>
  );
}

export default function Home() {
  const links = [
    { label: "WhatsApp", href: profile.whatsapp },
    { label: "Instagram", href: profile.instagram },
    { label: "GitHub", href: profile.github },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
    profile.resumeUrl && { label: "Resume", href: profile.resumeUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  const sections: Record<string, React.ReactNode> = {
    about: (
      <Section id="about" label="About">
        <ScrollWords
          text={profile.statement}
          className="mt-8 max-w-6xl font-head text-3xl leading-[1.15] font-medium tracking-tight text-pretty sm:text-5xl"
        />
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
              {profile.stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-head text-4xl font-bold tabular-nums sm:text-6xl">
                    <CountUp value={stat.value} />
                  </dd>
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
      </Section>
    ),

    services: (
      <Section id="services" label="Freelance" title="I also build websites and web apps for clients.">
        <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-xs tracking-widest uppercase">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />
          {profile.availability}
        </p>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.06}>
                <Spotlight className="glass-card h-full rounded-3xl p-7 sm:p-9">
                  <p className="font-mono text-xs text-hot">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-6 font-head text-2xl leading-tight font-semibold sm:text-3xl">{service.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-muted">{service.note}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
          <Reveal className="flex items-center justify-center py-6">
            {projects
              .filter((project) => project.shot)
              .map((project, index) => (
                <PhoneFrame
                  key={project.title}
                  src={project.shot!}
                  alt={`${project.title} running on a phone`}
                  className={index === 0 ? "z-10 -rotate-6" : "-ml-10 translate-y-8 rotate-6"}
                />
              ))}
          </Reveal>
        </div>
        <Reveal className="mt-16">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">How a project runs</p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((stage, index) => (
              <li key={stage.step} className="glass-card rounded-2xl p-6">
                <p className="font-mono text-xs text-muted">Step {index + 1}</p>
                <h3 className="mt-3 font-head text-xl font-semibold">{stage.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{stage.note}</p>
              </li>
            ))}
          </ol>
          <a
            href="#contact"
            className="mt-8 inline-block rounded-full bg-lime px-7 py-3.5 font-medium text-bg transition-opacity hover:opacity-85"
          >
            Start a project →
          </a>
        </Reveal>
      </Section>
    ),

    work: (
      <Section id="work" label="Work" title="Each one started with a problem, not a tech stack.">
        <div className="space-y-6">
          {projects.map((project, index) => (
            <Spotlight
              as="article"
              key={project.title}
              style={{ top: `${5.5 + index * 0.9}rem` }}
              className="glass-deep grid gap-8 rounded-3xl p-6 sm:p-10 lg:sticky lg:grid-cols-[1.15fr_1fr] lg:items-center"
            >
              <div>
                <p className="flex items-center gap-4 font-mono text-xs tracking-widest text-muted uppercase">
                  <span className="text-hot">{String(index + 1).padStart(2, "0")}</span>
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
              <ProjectVisual kind={project.visual} shot={project.shot} title={project.title} />
            </Spotlight>
          ))}
        </div>
        <GitHubPulse />
      </Section>
    ),

    ask: (
      <Section id="ask" label="Ask me" title="Six things people usually ask me.">
        <Reveal>
          <AskMe questions={questions} />
        </Reveal>
      </Section>
    ),

    journey: (
      <section id="journey" className="scroll-mt-24">
        <Journey stops={journey}>
          <div className={shell}>
            <Label>Journey</Label>
            <h2 className="mt-5 max-w-4xl font-head text-4xl leading-[1.02] font-semibold tracking-tight sm:text-6xl">
              Five turning points. Keep scrolling.
            </h2>
          </div>
        </Journey>
      </section>
    ),

    tracks: (
      <Section id="tracks" label="Education" title="Two degrees, running in parallel.">
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
      </Section>
    ),

    achievements: (
      <Section id="achievements" label="Achievements" title="Hackathon wins and a merit certificate.">
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.map((award, index) => (
            <Reveal key={award.event} delay={index * 0.06}>
              <AwardCard award={award} />
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    experience: (
      <Section id="experience" label="Experience" title="Where I've worked.">
        <div className="border-t border-line">
          {experience.map((job) => (
            <Reveal key={job.company}>
              <div className="grid gap-6 border-b border-line py-8 md:grid-cols-[1fr_1.2fr] md:px-4">
                <div>
                  <h3 className="font-head text-3xl leading-tight font-semibold sm:text-4xl">{job.role}</h3>
                  <p className="mt-2 text-lg">{job.company}</p>
                  <p className="mt-2 font-mono text-xs tracking-wider text-muted uppercase">{job.period}</p>
                </div>
                <ul className="space-y-2 text-muted">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-[0.7em] h-px w-4 shrink-0 bg-line" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    certs: certifications.length > 0 && (
      <Section id="certs" label="Certifications" title="Programmes I've completed.">
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.map((award, index) => (
            <Reveal key={award.event} delay={index * 0.06}>
              <AwardCard award={award} />
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    stack: (
      <Section id="stack" label="Stack" title="What I build with, top to bottom.">
        <div className="border-t border-line">
          {stack.map((layer, index) => (
            <Reveal key={layer.layer} delay={index * 0.05}>
              <div className="group grid gap-4 border-b border-line py-7 transition-colors hover:bg-white/5 md:grid-cols-[16rem_1fr] md:items-center md:px-4">
                <div>
                  <h3 className="font-head text-2xl font-semibold sm:text-3xl">{layer.layer}</h3>
                  <p className="mt-1 font-mono text-xs tracking-wider text-muted uppercase">{layer.role}</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <li
                      key={item}
                      className="glass-card rounded-lg px-4 py-2 text-sm"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    lab: (
      <Section id="lab" label="Lab" title="Ideas I'm still turning over.">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lab.map((item) => (
            <li key={item.title} className="glass-card flex flex-col rounded-3xl p-7">
              <span className="self-start rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-widest text-muted uppercase">
                {item.tag}
              </span>
              <h3 className="mt-6 font-head text-2xl leading-tight font-semibold">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{item.note}</p>
            </li>
          ))}
          <li className="glass-card flex flex-col justify-between rounded-3xl p-7">
            <p className="font-mono text-[10px] tracking-widest text-muted uppercase">Also into</p>
            <p className="mt-6 leading-relaxed text-muted">{interests.join(" · ")}</p>
          </li>
        </ul>
      </Section>
    ),

    contact: (
      <section id="contact" className={`${shell} scroll-mt-24 pt-24 pb-10 sm:pt-40`}>
        <Reveal>
          <Label>Contact</Label>
          <h2 className="mt-6 font-head text-6xl leading-[0.9] font-bold tracking-tight uppercase sm:text-[9rem]">
            <LensLines lines={profile.contactHeading} />
          </h2>
        </Reveal>
        <Reveal className="mt-14">
          <ContactForm />
        </Reveal>
        <ul className="mt-8 flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-lime hover:text-lime"
              >
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
    ),
  };

  return (
    <LensProvider>
      <div aria-hidden className="aurora">
        <span />
        <span />
        <span />
      </div>
      <CursorLens />
      <Nav />

      <main id="top">
        <section className="relative flex min-h-svh flex-col justify-end overflow-hidden pt-28 pb-24">
          <SignalField />
          <div className={`${shell} relative`}>
            <p className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-widest text-muted uppercase">
              <ChennaiClock />
              <span>{profile.location}</span>
            </p>
            <KineticName lines={profile.nameLines} label={profile.name} />
            <div className="mt-10 grid gap-8 border-t border-line pt-6 md:grid-cols-[1.4fr_1fr] md:items-end">
              <p className="max-w-xl text-lg leading-relaxed text-pretty sm:text-xl">
                <LensText text={profile.tagline} />
              </p>
              <div className="flex flex-col gap-5 md:items-end">
                <ul className="flex flex-wrap gap-2 font-mono text-xs md:justify-end">
                  {profile.roles.map((role) => (
                    <li key={role} className="glass rounded-full px-3 py-1.5">
                      {role}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 text-sm font-medium">
                  <a href="#about" className="rounded-full bg-text px-6 py-3 text-bg transition-opacity hover:opacity-85">
                    About me
                  </a>
                  <a
                    href="#work"
                    className="glass rounded-full px-6 py-3 transition-colors hover:border-text"
                  >
                    See my work
                  </a>
                  {profile.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="glass rounded-full px-6 py-3 transition-colors hover:border-text"
                    >
                      Resume ↓
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <LensSections sections={sections} />
      </main>

      <footer
        className={`${shell} flex flex-wrap justify-between gap-3 border-t border-line pt-6 pb-24 font-mono text-[11px] text-muted`}
      >
        <span>© 2026 {profile.name}</span>
        <span>Designed and built in Chennai</span>
      </footer>

      <LensDock />
    </LensProvider>
  );
}

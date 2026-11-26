import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Quote } from "lucide-react";
import { useContent } from "@/lib/content/store";
import { Editable } from "@/components/site/Editable";
import { AlumniMarquee } from "@/components/site/AlumniMarquee";
import { FacultyCard } from "@/components/site/FacultyCard";
import { Walkthrough } from "@/components/site/Walkthrough";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "V2 Classes, Hisar — Building Concepts. Shaping Futures." },
      {
        name: "description",
        content:
          "V2 Classes in Sector 13, Hisar has guided students in mathematics and science since 2000. Meet Varun Sir and the faculty.",
      },
      { property: "og:title", content: "V2 Classes, Hisar — Building Concepts. Shaping Futures." },
      {
        property: "og:description",
        content: "An educational institute in Sector 13, Hisar, guiding students since 2000.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { content } = useContent();
  const { home, about } = content.site;
  const faculty = content.faculty
    .filter((f) => f.status === "published")
    .sort((a, b) => a.order - b.order);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="grain-lines absolute inset-0" />
        <div className="container-x relative grid items-center gap-12 py-12 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-md animate-rise lg:mx-0">
            <figure className="relative overflow-hidden rounded-xl border border-border bg-surface">
              <img
                src={home.heroPhoto}
                alt="Varun Sir, founder of V2 Classes"
                className="aspect-[4/5] w-full object-cover"
                fetchPriority="high"
              />
              <figcaption className="absolute bottom-4 left-4 rounded-md bg-background/95 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <span className="text-brand">●</span> Varun Sir — {home.heroLabel}
              </figcaption>
            </figure>
          </div>
          <div className="animate-rise [animation-delay:120ms]">
            <p className="eyebrow">{home.eyebrow}</p>
            <h1 className="display-xl mt-6">
              {home.heading.split(". ").map((part, i, arr) => (
                <span key={i} className={i === 1 ? "block text-brand" : "block"}>
                  {part}
                  {i < arr.length - 1 ? "." : ""}
                </span>
              ))}
            </h1>
            <blockquote className="relative mt-10 border-l-2 border-brand pl-6">
              <Quote
                className="absolute -top-2 -left-3 h-6 w-6 bg-background text-brand"
                aria-hidden
              />
              <p className="font-display text-xl font-semibold leading-snug md:text-2xl">
                <Editable text={home.quote} />
              </p>
              <footer className="mt-3 text-sm text-muted-foreground">— {home.quoteAuthor}</footer>
            </blockquote>
            <p className="mt-8 max-w-xl leading-relaxed text-muted-foreground">{home.intro}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/about" className="btn-brand">
                Discover our story <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/alumni" className="btn-ghost">
                View alumni
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section
        aria-labelledby="alumni-title"
        className="mt-16 border-y border-border bg-surface/50 pt-14"
      >
        <div className="container-x mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Alumni achievements</p>
            <h2 id="alumni-title" className="mt-3 text-3xl font-extrabold md:text-5xl">
              Results that speak.
            </h2>
          </div>
          <Link to="/alumni" className="btn-ghost self-start sm:self-auto">
            Full archive <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <AlumniMarquee />
      </section>

      {/* About */}
      <section
        aria-labelledby="about-title"
        className="container-x mt-32 grid gap-16 lg:grid-cols-[1.1fr_1fr]"
      >
        <div>
          <p className="eyebrow">About V2 Classes</p>
          <h2 id="about-title" className="display-lg mt-4">
            {about.heading}
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {about.intro}
          </p>
          <dl className="mt-10 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
            <div className="bg-background p-6">
              <dt className="text-xs tracking-widest text-muted-foreground uppercase">Founded</dt>
              <dd className="mt-2 font-display text-5xl font-extrabold text-brand">
                {about.founded}
              </dd>
            </div>
            <div className="bg-background p-6">
              <dt className="text-xs tracking-widest text-muted-foreground uppercase">Location</dt>
              <dd className="mt-2 flex gap-2 font-display text-lg font-bold">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand" />
                {about.location}
              </dd>
            </div>
          </dl>
        </div>
        <div className="lg:pt-24">
          <p className="mb-5 text-sm font-semibold text-muted-foreground">The faculty</p>
          <div className="space-y-4">
            {faculty.map((f, i) => (
              <FacultyCard key={f.id} f={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Walkthrough />
    </>
  );
}

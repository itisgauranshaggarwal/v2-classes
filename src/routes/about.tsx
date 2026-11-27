import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { useContent } from "@/lib/content/store";
import { Editable } from "@/components/site/Editable";
import { PageHero } from "@/components/site/PageHero";
/* classroom placeholder photos removed — Gallery section now showcases photos */
import {
  absoluteUrl,
  breadcrumbSchema,
  canonicalLink,
  jsonLd,
  organizationSchema,
  seoMeta,
  siteUrl,
  webPageSchema,
} from "@/lib/seo";

const title = "About V2 Classes Hisar | Faculty & Institute Story";
const description =
  "Learn about V2 Classes, a coaching institute in Sector 13, Hisar founded in 2000. Meet Varun Sir and the faculty guiding students in mathematics and science.";

const facultySchema = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Varun Sir",
    jobTitle: "Founder & Mathematics Educator",
    description: "Founder of V2 Classes. Teaches mathematics and guides students academically.",
    worksFor: { "@id": `${siteUrl}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sunny Sir",
    jobTitle: "Academic Systems",
    description: "Prepares test papers and runs evaluation and the institute's academic systems.",
    worksFor: { "@id": `${siteUrl}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vikas Sir",
    jobTitle: "Student Affairs",
    description: "Looks after discipline, invigilation and day-to-day student assistance.",
    worksFor: { "@id": `${siteUrl}/#organization` },
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: seoMeta({ title, description, path: "/about" }),
    links: [canonicalLink("/about")],
    scripts: [
      jsonLd(organizationSchema),
      jsonLd(webPageSchema({ name: title, description, path: "/about" })),
      jsonLd(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      ),
      ...facultySchema.map(jsonLd),
    ],
  }),
  component: About,
});

function Story({ title, text }: { title: string; text: string }) {
  return (
    <section className="border-t border-border pt-10">
      <h2 className="text-2xl font-extrabold md:text-3xl">{title}</h2>
      <div className="mt-5 space-y-5 text-[1.075rem] leading-[1.85] text-foreground/85">
        {text.split(/\n\s*\n/).map((para, i) => (
          <p key={i}>
            <Editable text={para} />
          </p>
        ))}
      </div>
    </section>
  );
}

function About() {
  const { content } = useContent();
  const a = content.site.about;
  const faculty = content.faculty
    .filter((f) => f.status === "published")
    .sort((x, y) => x.order - y.order);
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            A legacy of learning, <span className="text-brand">since {a.founded}.</span>
          </>
        }
      >
        {a.intro}
      </PageHero>

      <article className="container-x mt-20">
        <div className="mx-auto max-w-[42rem] space-y-14">
          <Story title="Varun Sir's journey" text={a.founderJourney} />
          <Story title="How V2 Classes began" text={a.beginnings} />
          <Story title="Growth over the years" text={a.growth} />
        </div>
      </article>

      <section aria-labelledby="fac" className="container-x mt-28">
        <p className="eyebrow">Faculty</p>
        <h2 id="fac" className="display-lg mt-4">
          The people behind V2.
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {faculty.map((f) => (
            <article key={f.id} className="card-elegant overflow-hidden">
              <div className="aspect-[4/5] bg-surface">
                {f.photo ? (
                  <img
                    src={f.photo}
                    alt={f.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center">
                    <div className="text-center">
                      <UserRound className="mx-auto h-10 w-10 text-muted-foreground" />
                      <span className="placeholder-tag mt-3">Photo to be added</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="eyebrow">{f.role}</p>
                <h3 className="mt-2 text-2xl font-extrabold">{f.name}</h3>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{f.focus}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.shortBio}</p>
                <p className="mt-3 text-sm">
                  <Editable text={f.longBio} />
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

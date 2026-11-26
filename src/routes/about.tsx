import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { useContent } from "@/lib/content/store";
import { Editable } from "@/components/site/Editable";
import { PageHero } from "@/components/site/PageHero";
import hall from "@/assets/classroom_hall.jpg.asset.json";
import board from "@/assets/classroom_board.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — V2 Classes, Hisar" },
      { name: "description", content: "The story of V2 Classes, founded in 2000 in Sector 13, Hisar: Varun Sir, the faculty and how the institute grew." },
      { property: "og:title", content: "About V2 Classes" },
      { property: "og:description", content: "Founded in 2000 in Sector 13, Hisar. The story of the institute and its faculty." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function Story({ title, text }: { title: string; text: string }) {
  return (
    <section className="border-t border-border pt-10">
      <h2 className="text-2xl font-extrabold md:text-3xl">{title}</h2>
      <div className="mt-5 space-y-5 text-[1.075rem] leading-[1.85] text-foreground/85">
        {text.split(/\n\s*\n/).map((para, i) => <p key={i}><Editable text={para} /></p>)}
      </div>
    </section>
  );
}

function About() {
  const { content } = useContent();
  const a = content.site.about;
  const faculty = content.faculty.filter((f) => f.status === "published").sort((x, y) => x.order - y.order);
  return (
    <>
      <PageHero eyebrow="About Us" title={<>A legacy of learning, <span className="text-brand">since {a.founded}.</span></>}>{a.intro}</PageHero>

      <section className="container-x mt-16 grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <img src={hall.url} alt="Classroom hall at V2 Classes" loading="lazy" className="h-80 w-full rounded-xl object-cover md:h-[28rem]" />
        <img src={board.url} alt="Classroom with projection board at V2 Classes" loading="lazy" className="h-80 w-full rounded-xl object-cover md:mt-16 md:h-[28rem]" />
      </section>

      <article className="container-x mt-20">
        <div className="mx-auto max-w-[42rem] space-y-14">
          <Story title="Varun Sir's journey" text={a.founderJourney} />
          <Story title="How V2 Classes began" text={a.beginnings} />
          <Story title="Growth over the years" text={a.growth} />
        </div>
      </article>

      <section aria-labelledby="fac" className="container-x mt-28">
        <p className="eyebrow">Faculty</p>
        <h2 id="fac" className="display-lg mt-4">The people behind V2.</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {faculty.map((f) => (
            <article key={f.id} className="card-elegant overflow-hidden">
              <div className="aspect-[4/5] bg-surface">
                {f.photo ? <img src={f.photo} alt={f.name} loading="lazy" className="h-full w-full object-cover" />
                  : <div className="grid h-full place-items-center"><div className="text-center"><UserRound className="mx-auto h-10 w-10 text-muted-foreground" /><span className="placeholder-tag mt-3">Photo to be added</span></div></div>}
              </div>
              <div className="p-6">
                <p className="eyebrow">{f.role}</p>
                <h3 className="mt-2 text-2xl font-extrabold">{f.name}</h3>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{f.focus}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.shortBio}</p>
                <p className="mt-3 text-sm"><Editable text={f.longBio} /></p>
              </div>
            </article>
          ))}
        </div>
      </section>

    </>
  );
}

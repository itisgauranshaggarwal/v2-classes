import { createFileRoute } from "@tanstack/react-router";
import { useContent } from "@/lib/content/store";
import { filterAchievements } from "@/lib/content/alumni";
import { PageHero } from "@/components/site/PageHero";
import { AchievementCard } from "@/components/site/AchievementCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  breadcrumbSchema,
  canonicalLink,
  jsonLd,
  organizationSchema,
  seoMeta,
  siteUrl,
  webPageSchema,
} from "@/lib/seo";

const title = "Alumni Achievements | V2 Classes Hisar";
const description =
  "Explore alumni achievements from V2 Classes in Hisar — student names, institutes, and ranks or positions achieved.";

const coursesSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Mathematics Coaching",
    description: "Mathematics coaching and concept-building at V2 Classes in Hisar.",
    provider: { "@id": `${siteUrl}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Science Coaching",
    description: "Science coaching and academic guidance at V2 Classes in Hisar.",
    provider: { "@id": `${siteUrl}/#organization` },
  },
];

export const Route = createFileRoute("/alumni")({
  head: () => ({
    meta: seoMeta({ title, description, path: "/alumni" }),
    links: [canonicalLink("/alumni")],
    scripts: [
      jsonLd(organizationSchema),
      jsonLd(webPageSchema({ name: title, description, path: "/alumni" })),
      jsonLd(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Alumni", path: "/alumni" },
        ]),
      ),
      ...coursesSchema.map(jsonLd),
    ],
  }),
  component: Alumni,
});

function Alumni() {
  const { content, ready } = useContent();
  const list = filterAchievements(content.achievements);

  return (
    <>
      <PageHero
        eyebrow="Alumni"
        title={
          <>
            Every result, <span className="text-brand">a story of effort.</span>
          </>
        }
      >
        An archive of what V2 Classes students have achieved.
      </PageHero>

      <section className="container-x mt-16">
        {!ready ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="mb-5 h-80 break-inside-avoid rounded-2xl" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-20 text-center">
            <p className="font-display text-xl font-bold">No alumni achievements yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Achievements added from the admin dashboard will appear here.
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {list.map((a) => (
              <div key={a.id} className="mb-5 break-inside-avoid">
                <AchievementCard a={a} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

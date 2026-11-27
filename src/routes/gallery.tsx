import { createFileRoute } from "@tanstack/react-router";
import { useContent } from "@/lib/content/store";
import { PageHero } from "@/components/site/PageHero";
import { Skeleton } from "@/components/ui/skeleton";
import {
  breadcrumbSchema,
  canonicalLink,
  jsonLd,
  organizationSchema,
  seoMeta,
  webPageSchema,
} from "@/lib/seo";

const title = "Gallery | V2 Classes Hisar";
const description =
  "Browse photos from V2 Classes in Hisar — classrooms, activities, and moments from the institute.";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: seoMeta({ title, description, path: "/gallery" }),
    links: [canonicalLink("/gallery")],
    scripts: [
      jsonLd(organizationSchema),
      jsonLd(webPageSchema({ name: title, description, path: "/gallery" })),
      jsonLd(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ]),
      ),
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const { content, ready } = useContent();
  const photos = content.media;

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Moments from <span className="text-brand">V2 Classes.</span>
          </>
        }
      >
        A look inside our classrooms, activities, and learning environment.
      </PageHero>

      <section className="container-x mt-16">
        {!ready ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="mb-4 h-72 break-inside-avoid rounded-2xl" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-20 text-center">
            <p className="font-display text-xl font-bold">No gallery photos yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Photos added from the admin dashboard will appear here.
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {photos.map((photo) => (
              <figure
                key={photo.id}
                className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card"
              >
                <img
                  src={photo.url}
                  alt={photo.name || "V2 Classes gallery photo"}
                  loading="lazy"
                  className="block w-full object-cover"
                />
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

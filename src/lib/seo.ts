import portrait from "@/assets/varun_portrait.jpg.asset.json";
import { isPlaceholderText } from "@/lib/content/defaults";

const FALLBACK_SITE_URL = "https://v2-classes-website.itisgauranshaggarwal.workers.dev";

export const siteUrl = (import.meta.env["VITE_SITE_URL"]?.trim() || FALLBACK_SITE_URL).replace(
  /\/$/,
  "",
);

export const siteName = "V2 Classes";
export const siteTagline = "Building Concepts. Shaping Futures.";
export const siteDescription =
  "V2 Classes is an educational institute in Sector 13, Hisar, Haryana, guiding students in mathematics and science since 2000.";
export const siteLocale = "en_IN";

export const contactInfo = {
  address: "50, Shopping Complex, MDR108, Sector 13, Hisar, Haryana 125005",
  phone: "+91 98962 68600",
  whatsapp: "919896268600",
  mapQuery: "V2 Classes, Sector 13, Hisar, Haryana",
  locality: "Sector 13, Hisar",
  region: "Haryana",
  postalCode: "125005",
  country: "IN",
};

export const defaultOgImage = absoluteUrl(portrait.url);

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

export function cleanText(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || isPlaceholderText(trimmed)) return undefined;
  return trimmed;
}

type MetaTag = Record<string, string>;

export function seoMeta({
  title,
  description,
  path,
  image = defaultOgImage,
  type = "website",
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}): MetaTag[] {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const tags: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: siteName },
    { property: "og:locale", content: siteLocale },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: imageUrl },
    { property: "og:image:alt", content: title },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];
  if (noindex) tags.push({ name: "robots", content: "noindex, nofollow" });
  return tags;
}

export function canonicalLink(path: string) {
  return { rel: "canonical", href: absoluteUrl(path) };
}

export function jsonLd(data: unknown) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "Organization"],
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  description: siteDescription,
  url: siteUrl,
  logo: absoluteUrl("/favicon.svg"),
  image: defaultOgImage,
  telephone: contactInfo.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "50, Shopping Complex, MDR108",
    addressLocality: "Hisar",
    addressRegion: contactInfo.region,
    postalCode: contactInfo.postalCode,
    addressCountry: contactInfo.country,
  },
  areaServed: "Hisar, Haryana, India",
  foundingDate: "2000",
  sameAs: [] as string[],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  description: siteDescription,
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "en-IN",
};

export function webPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-IN",
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

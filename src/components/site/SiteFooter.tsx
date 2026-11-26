import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { useContent } from "@/lib/content/store";
import { Logo } from "./Logo";
import { Editable } from "./Editable";

export function SiteFooter() {
  const { content } = useContent();
  const { contact, social, settings } = content.site;
  const socials = [
    { href: social.instagram, label: "Instagram", Icon: Instagram },
    { href: social.facebook, label: "Facebook", Icon: Facebook },
    { href: social.youtube, label: "YouTube", Icon: Youtube },
  ].filter((s) => s.href);
  return (
    <footer className="mt-32 bg-ink text-primary-foreground">
      <div className="container-x grid gap-12 py-20 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-foreground">
              <Logo className="h-8 w-8" />
            </span>
            <span className="sr-only">{settings.siteName}</span>
          </div>
          <p className="mt-6 text-sm leading-relaxed opacity-70">{settings.footerText}</p>
          <div className="mt-6 flex gap-2">
            {socials.length === 0 && (
              <span className="text-xs opacity-50">
                Social links can be added from the admin dashboard.
              </span>
            )}
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-primary-foreground/20 transition hover:border-brand hover:bg-brand"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
          <span className="eyebrow !text-primary-foreground/50">Explore</span>
          <Link to="/" className="opacity-80 hover:opacity-100">
            Home
          </Link>
          <Link to="/about" className="opacity-80 hover:opacity-100">
            About Us
          </Link>
          <Link to="/alumni" className="opacity-80 hover:opacity-100">
            Alumni
          </Link>
          <Link to="/contact" className="opacity-80 hover:opacity-100">
            Contact Us
          </Link>
        </nav>
        <div className="flex flex-col gap-4 text-sm">
          <span className="eyebrow !text-primary-foreground/50">Visit & Call</span>
          <p className="flex gap-3 opacity-80">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            {contact.address}
          </p>
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="flex gap-3 opacity-80 hover:opacity-100"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {contact.phone}
          </a>
          <p className="flex gap-3 opacity-80">
            <Mail className="h-4 w-4 shrink-0" />
            <Editable text={contact.email} />
          </p>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 self-start font-semibold underline decoration-primary-foreground/30 decoration-2 underline-offset-4 hover:decoration-brand"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-x flex flex-col justify-between gap-2 py-6 text-xs opacity-50 sm:flex-row">
          <span>© {new Date().getFullYear()} V2 Classes, Hisar. All rights reserved.</span>
          <span>Est. 2000 · Sector 13, Hisar, Haryana</span>
        </div>
      </div>
    </footer>
  );
}

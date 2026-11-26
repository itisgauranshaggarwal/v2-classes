import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Cog,
  Film,
  Home,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Phone,
  Share2,
  ShieldAlert,
  Trophy,
  Users,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Logo } from "@/components/site/Logo";
import { Wordmark } from "@/components/site/Wordmark";
import * as S from "@/components/admin/sections";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — V2 Classes" },
      { name: "description", content: "Content management dashboard for the V2 Classes website." },
      { property: "og:title", content: "V2 Classes Admin" },
      { property: "og:description", content: "Content management dashboard for V2 Classes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

const SECTIONS = [
  {
    id: "overview",
    label: "Overview",
    Icon: LayoutDashboard,
    desc: "Summary of your website content.",
  },
  {
    id: "home",
    label: "Homepage",
    Icon: Home,
    desc: "Hero heading, quote, introduction and portrait.",
  },
  {
    id: "faculty",
    label: "Faculty",
    Icon: Users,
    desc: "Faculty members shown on Home and About.",
  },
  {
    id: "alumni",
    label: "Alumni",
    Icon: Trophy,
    desc: "Achievements for the marquee and alumni archive.",
  },
  {
    id: "about",
    label: "About Us",
    Icon: BookOpen,
    desc: "Story paragraphs shown on the About Us page.",
  },
  {
    id: "walkthrough",
    label: "Walkthrough",
    Icon: Film,
    desc: "Institute video and poster image.",
  },
  {
    id: "contact",
    label: "Contact info",
    Icon: Phone,
    desc: "Address, phone, WhatsApp, email and map.",
  },
  { id: "social", label: "Social links", Icon: Share2, desc: "Links shown in the footer." },
  { id: "media", label: "Media library", Icon: ImageIcon, desc: "Uploaded images." },
  { id: "enquiries", label: "Enquiries", Icon: Inbox, desc: "Messages from the contact form." },
  { id: "settings", label: "Settings", Icon: Cog, desc: "Site-wide settings." },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

const SESSION = "v2-admin-demo-session";

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !pw) {
      setErr("Enter an email and password.");
      return;
    }
    sessionStorage.setItem(SESSION, email);
    onLogin();
  };
  return (
    <div className="grid min-h-screen bg-ink lg:grid-cols-2">
      <div className="hidden flex-col justify-between p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary-foreground">
            <Logo className="h-7 w-7" />
          </span>
          <span className="font-display text-xl font-extrabold">V2 Classes</span>
        </div>
        <h1 className="display-lg max-w-md">Manage every word, photo and result.</h1>
        <p className="text-sm opacity-50">Content Management · Admin</p>
      </div>
      <div className="grid place-items-center bg-background p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <p className="eyebrow">Admin sign in</p>
            <h2 className="mt-2 text-3xl font-extrabold">Welcome back</h2>
          </div>
          <div className="flex gap-3 rounded-xl border border-dashed border-brand/50 bg-brand-soft p-3 text-xs text-brand-deep">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            Demo login: any email and password work. Real authentication isn't connected yet.
          </div>
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-input bg-card px-3 outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-input bg-card px-3 outline-none focus:border-brand"
            />
          </label>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button className="btn-brand w-full justify-center">Sign in</button>
          <Link
            to="/"
            className="block text-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to website
          </Link>
        </form>
      </div>
    </div>
  );
}

function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [section, setSection] = useState<SectionId>("overview");
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => setAuthed(!!sessionStorage.getItem(SESSION)), []);
  if (authed === null)
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  if (!authed) return <Login onLogin={() => setAuthed(true)} />;
  const current = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];
  const go = (id: string) => {
    setSection(id as SectionId);
    setNavOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:flex lg:h-screen lg:translate-x-0 border-r border-sidebar-border ${navOpen ? "flex translate-x-0" : "hidden -translate-x-full lg:flex"}`}
      >
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-5">
          <Logo className="h-7 w-7" />
          <Wordmark className="h-4 w-auto" />
          <span className="ml-auto rounded bg-surface px-1.5 py-0.5 text-[0.6rem] font-semibold tracking-wider text-muted-foreground uppercase">
            Admin
          </span>
        </div>
        <nav aria-label="Admin" className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {SECTIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => go(id)}
              aria-current={section === id ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition ${section === id ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="space-y-1 border-t border-sidebar-border p-3">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent"
          >
            <ExternalLink className="h-4 w-4" />
            View website
          </a>
          <button
            onClick={() => {
              sessionStorage.removeItem(SESSION);
              setAuthed(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      {navOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="border-b border-brand/20 bg-brand-soft px-6 py-2 text-center text-xs font-medium text-brand-deep">
          Demo mode — changes are saved in this browser only. Database, sign-in and email aren't
          connected yet.
        </div>
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-background/90 px-6 py-5 backdrop-blur lg:px-10">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-border lg:hidden"
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold">{current.label}</h1>
            <p className="truncate text-sm text-muted-foreground">{current.desc}</p>
          </div>
        </header>
        <div className="mx-auto max-w-6xl p-6 lg:p-10">
          {section === "overview" && <S.Overview go={go} />}
          {section === "home" && <S.HomeEditor />}
          {section === "faculty" && <S.FacultyManager />}
          {section === "alumni" && <S.AlumniManager />}
          {section === "about" && <S.AboutEditor />}
          {section === "walkthrough" && <S.WalkthroughEditor />}
          {section === "contact" && <S.ContactEditor />}
          {section === "social" && <S.SocialEditor />}
          {section === "media" && <S.MediaLibrary />}
          {section === "enquiries" && <S.EnquiryManager />}
          {section === "settings" && <S.SettingsEditor />}
        </div>
      </div>
    </div>
  );
}

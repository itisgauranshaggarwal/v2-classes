import {
  Copy,
  ExternalLink,
  Trash2,
  Upload,
  Users,
  Trophy,
  Inbox,
  Clock3,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useContent, uid } from "@/lib/content/store";
import type {
  Achievement,
  FacultyMember,
  TimelineItem,
  ContentState,
  SiteContent,
  Enquiry,
} from "@/lib/content/types";
import { CATEGORY_LABELS } from "@/lib/content/alumni";
import { CollectionManager } from "./CollectionManager";
import { ObjectEditor } from "./ObjectEditor";
import {
  StatusBadge,
  STATUS_OPTIONS,
  Toggle,
  readFileAsDataUrl,
  FieldRow,
  type FieldSpec,
} from "./fields";

function useSite<K extends keyof SiteContent>(k: K) {
  const { content, update } = useContent();
  return [
    content.site[k],
    (v: SiteContent[K]) => update((s) => ({ ...s, site: { ...s.site, [k]: v } })),
  ] as const;
}
function useCollection<K extends "faculty" | "achievements" | "timeline">(k: K) {
  const { content, update } = useContent();
  type Item = ContentState[K][number];
  const save = (item: Item) =>
    update((s) => {
      const list = s[k] as Item[];
      const next = list.some((i) => i.id === item.id)
        ? list.map((i) => (i.id === item.id ? item : i))
        : [...list, item];
      return { ...s, [k]: next };
    });
  const remove = (id: string) =>
    update((s) => ({ ...s, [k]: (s[k] as Item[]).filter((i) => i.id !== id) }));
  return { items: content[k] as Item[], save, remove };
}

export function Overview({ go }: { go: (s: string) => void }) {
  const { content } = useContent();
  const real = content.achievements.filter((a) => !a.isSample).length;
  const cards = [
    {
      label: "Alumni achievements",
      value: content.achievements.length,
      sub: `${real} real · ${content.achievements.length - real} sample`,
      Icon: Trophy,
      to: "alumni",
    },
    { label: "Faculty", value: content.faculty.length, sub: "members", Icon: Users, to: "faculty" },
    {
      label: "Enquiries",
      value: content.enquiries.length,
      sub: `${content.enquiries.filter((e) => e.status === "new").length} new`,
      Icon: Inbox,
      to: "enquiries",
    },
  ];
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, sub, Icon, to }) => (
          <button
            key={label}
            onClick={() => go(to)}
            className="rounded-lg border border-border bg-card p-5 text-left transition hover:border-foreground/30"
          >
            <Icon className="h-5 w-5 text-brand" />
            <p className="mt-4 font-display text-3xl font-extrabold">{value}</p>
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-bold">Content checklist</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>• Replace sample alumni entries with real achievements.</li>
          <li>• Add Varun Sir's quote and the About Us story paragraphs.</li>
          <li>• Add photos for Sunny Sir and Vikas Sir.</li>
          <li>• Upload the real walkthrough video.</li>
          <li>• Add the institute email, office hours and social links.</li>
        </ul>
      </div>
    </div>
  );
}

export function HomeEditor() {
  const [v, set] = useSite("home");
  const fields: FieldSpec<typeof v>[] = [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "heading", label: "Heading" },
    {
      key: "quote",
      label: "Varun Sir's quote",
      type: "textarea",
      hint: "Text in [brackets] is shown as a labelled placeholder.",
    },
    { key: "quoteAuthor", label: "Quote attribution" },
    { key: "heroLabel", label: "Designation label" },
    { key: "intro", label: "Introduction", type: "textarea" },
    { key: "heroPhoto", label: "Hero portrait", type: "image" },
  ];
  return <ObjectEditor value={v} fields={fields} onSave={set} />;
}

export function AboutEditor() {
  const [v, set] = useSite("about");
  const { values, ...rest } = v;
  const fields: FieldSpec<typeof rest>[] = [
    { key: "heading", label: "Heading", wide: true },
    { key: "founded", label: "Founding year" },
    { key: "location", label: "Location" },
    { key: "intro", label: "Introduction", type: "textarea" },
    { key: "founderJourney", label: "Varun Sir's journey", type: "textarea" },
    { key: "beginnings", label: "How V2 Classes began", type: "textarea" },
    { key: "growth", label: "Growth & development", type: "textarea" },
  ];
  return (
    <div className="space-y-6">
      <ObjectEditor value={rest} fields={fields} onSave={(r) => set({ ...r, values })} />
    </div>
  );
}

export function FacultyManager() {
  const { items, save, remove } = useCollection("faculty");
  return (
    <CollectionManager<FacultyMember>
      title="faculty member"
      items={[...items].sort((a, b) => a.order - b.order)}
      onSave={save}
      onDelete={remove}
      create={() => ({
        id: uid(),
        name: "",
        role: "",
        focus: "",
        shortBio: "",
        longBio: "",
        photo: "",
        order: items.length + 1,
        status: "draft",
      })}
      columns={[
        {
          label: "Member",
          render: (f) => (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-lg bg-surface">
                {f.photo && <img src={f.photo} alt="" className="h-full w-full object-cover" />}
              </div>
              <div>
                <p className="font-semibold">{f.name || "Untitled"}</p>
                <p className="text-xs text-muted-foreground">{f.role}</p>
              </div>
            </div>
          ),
        },
        { label: "Focus", render: (f) => f.focus },
        { label: "Order", render: (f) => f.order },
        { label: "Status", render: (f) => <StatusBadge status={f.status} /> },
      ]}
      fields={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "focus", label: "Focus" },
        { key: "order", label: "Display order", type: "number" },
        { key: "shortBio", label: "Short description", type: "textarea" },
        { key: "longBio", label: "Detailed profile", type: "textarea" },
        { key: "photo", label: "Photo", type: "image" },
        { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      ]}
    />
  );
}

export function AlumniManager() {
  const { items, save, remove } = useCollection("achievements");
  return (
    <CollectionManager<Achievement>
      title="achievement"
      items={items}
      onSave={save}
      onDelete={remove}
      addLabel="Add achievement"
      create={() => ({
        id: uid(),
        studentName: "",
        photo: "",
        exam: "",
        category: "iit-jee",
        result: "",
        institution: "",
        year: String(new Date().getFullYear()),
        featured: false,
        status: "draft",
        isSample: false,
      })}
      columns={[
        {
          label: "Student",
          render: (a) => (
            <div>
              <p className="font-semibold">{a.studentName || "Untitled"}</p>
              {a.isSample && <span className="placeholder-tag mt-1">Sample</span>}
            </div>
          ),
        },
        {
          label: "Exam",
          render: (a) => (
            <span>
              {CATEGORY_LABELS[a.category]}
              <br />
              <span className="text-xs text-muted-foreground">{a.exam}</span>
            </span>
          ),
        },
        { label: "Result", render: (a) => a.result },
        { label: "Year", render: (a) => a.year },
        {
          label: "Featured",
          render: (a) => (
            <Toggle
              label="Featured"
              checked={a.featured}
              onChange={(f) => save({ ...a, featured: f })}
            />
          ),
        },
        { label: "Status", render: (a) => <StatusBadge status={a.status} /> },
      ]}
      fields={[
        { key: "studentName", label: "Student name" },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
        },
        { key: "exam", label: "Examination" },
        { key: "result", label: "Rank / score / percentage" },
        { key: "institution", label: "Institution / admission" },
        { key: "year", label: "Year" },
        { key: "photo", label: "Photo (optional)", type: "image" },
        { key: "featured", label: "Featured", type: "toggle" },
        { key: "isSample", label: "Sample entry (design preview)", type: "toggle" },
        { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      ]}
    />
  );
}

export function TimelineManager() {
  const { items, save, remove } = useCollection("timeline");
  return (
    <CollectionManager<TimelineItem>
      title="milestone"
      items={items}
      onSave={save}
      onDelete={remove}
      addLabel="Add milestone"
      create={() => ({
        id: uid(),
        year: "",
        title: "",
        description: "",
        isPlaceholder: false,
        status: "draft",
      })}
      columns={[
        { label: "Year", render: (t) => <span className="font-display font-bold">{t.year}</span> },
        {
          label: "Milestone",
          render: (t) => (
            <span>
              {t.title}
              {t.isPlaceholder && <span className="placeholder-tag ml-2">Placeholder</span>}
            </span>
          ),
        },
        { label: "Status", render: (t) => <StatusBadge status={t.status} /> },
      ]}
      fields={[
        { key: "year", label: "Year" },
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "isPlaceholder", label: "Mark as placeholder", type: "toggle" },
        { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      ]}
    />
  );
}

export function WalkthroughEditor() {
  const [v, set] = useSite("walkthrough");
  return (
    <div className="space-y-6">
      <ObjectEditor
        value={v}
        onSave={set}
        fields={[
          { key: "title", label: "Section title" },
          {
            key: "videoUrl",
            label: "Video URL (MP4)",
            type: "url",
            hint: "Short, high-keyframe MP4s scrub most smoothly.",
          },
          { key: "caption", label: "Caption", type: "textarea" },
          { key: "poster", label: "Poster / fallback image", type: "image" },
          { key: "isPlaceholder", label: "Show 'Placeholder footage' label", type: "toggle" },
        ]}
      />
      <div className="rounded-xl border border-border bg-card p-4">
        <video
          src={v.videoUrl}
          poster={v.poster}
          controls
          className="aspect-video w-full rounded-lg bg-ink"
        />
      </div>
    </div>
  );
}

export function ContactEditor() {
  const [v, set] = useSite("contact");
  return (
    <ObjectEditor
      value={v}
      onSave={set}
      fields={[
        { key: "address", label: "Address", type: "textarea" },
        { key: "phone", label: "Phone" },
        {
          key: "whatsapp",
          label: "WhatsApp number",
          hint: "Country code + number, digits only (e.g. 919876543210)",
        },
        { key: "email", label: "Email" },
        { key: "hours", label: "Office hours" },
        {
          key: "mapQuery",
          label: "Map location",
          hint: "Place name or 'lat,lng' used for the Google Maps embed.",
        },
      ]}
    />
  );
}

export function SocialEditor() {
  const [v, set] = useSite("social");
  return (
    <ObjectEditor
      value={v}
      onSave={set}
      fields={[
        { key: "instagram", label: "Instagram URL", type: "url" },
        { key: "facebook", label: "Facebook URL", type: "url" },
        { key: "youtube", label: "YouTube URL", type: "url" },
      ]}
    />
  );
}

export function SettingsEditor() {
  const [v, set] = useSite("settings");
  const { reset } = useContent();
  return (
    <div className="space-y-6">
      <ObjectEditor
        value={v}
        onSave={set}
        fields={[
          { key: "siteName", label: "Site name" },
          { key: "tagline", label: "Tagline" },
          { key: "footerText", label: "Footer description", type: "textarea" },
          {
            key: "marqueeSpeed",
            label: "Alumni marquee duration (seconds)",
            type: "number",
            hint: "Higher = slower.",
          },
        ]}
      />
      <div className="rounded-xl border border-destructive/30 bg-card p-6">
        <h3 className="font-bold">Reset demo data</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Restores all content to the original defaults in this browser.
        </p>
        <button
          onClick={() => {
            reset();
            toast.success("Demo data reset");
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-destructive px-4 py-2 text-sm font-semibold text-destructive"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

export function MediaLibrary() {
  const { content, update } = useContent();
  const add = async (files: FileList | null) => {
    if (!files) return;
    const items = await Promise.all(
      [...files].map(async (f) => ({
        id: uid(),
        name: f.name,
        url: await readFileAsDataUrl(f),
        addedAt: new Date().toISOString().slice(0, 10),
      })),
    );
    update((s) => ({ ...s, media: [...items, ...s.media] }));
    toast.success(`${items.length} file(s) added`);
  };
  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-input bg-card py-10 text-sm hover:border-brand">
        <Upload className="h-6 w-6 text-brand" />
        <span className="font-semibold">Upload images</span>
        <span className="text-xs text-muted-foreground">Stored in this browser only (demo)</span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={(e) => add(e.target.files)}
        />
      </label>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {content.media.map((m) => (
          <figure key={m.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <img
              src={m.url}
              alt={m.name}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="flex items-center justify-between gap-2 p-3">
              <span className="min-w-0 truncate text-xs font-medium">{m.name}</span>
              <span className="flex shrink-0">
                <button
                  aria-label="Copy URL"
                  onClick={() => {
                    navigator.clipboard.writeText(m.url);
                    toast.success("URL copied");
                  }}
                  className="rounded p-1.5 hover:bg-surface"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  aria-label="Delete"
                  onClick={() =>
                    update((s) => ({ ...s, media: s.media.filter((x) => x.id !== m.id) }))
                  }
                  className="rounded p-1.5 text-destructive hover:bg-surface"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function EnquiryManager() {
  const { content, update } = useContent();
  const setStatus = (id: string, status: Enquiry["status"]) =>
    update((s) => ({
      ...s,
      enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, status } : e)),
    }));
  if (content.enquiries.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center text-muted-foreground">
        <Inbox className="mx-auto h-8 w-8" />
        <p className="mt-3 text-sm">
          No enquiries yet. Submissions from the Contact page appear here.
        </p>
        <a
          href="/contact"
          target="_blank"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand"
        >
          Open contact page <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  return (
    <div className="space-y-3">
      {content.enquiries.map((e) => (
        <article key={e.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{e.name}</p>
              <p className="text-xs text-muted-foreground">
                {e.phone} · {e.email} · {new Date(e.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={e.status} />
              <FieldRow label="">
                <select
                  value={e.status}
                  onChange={(x) => setStatus(e.id, x.target.value as Enquiry["status"])}
                  aria-label="Change status"
                  className="rounded-lg border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </FieldRow>
              <button
                aria-label="Delete enquiry"
                onClick={() =>
                  update((s) => ({ ...s, enquiries: s.enquiries.filter((x) => x.id !== e.id) }))
                }
                className="rounded p-2 text-destructive hover:bg-surface"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm">{e.message}</p>
        </article>
      ))}
    </div>
  );
}

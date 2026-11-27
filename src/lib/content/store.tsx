import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { defaultContent } from "./defaults";
import type {
  Achievement,
  ContentState,
  Enquiry,
  FacultyMember,
  MediaItem,
  SiteContent,
  TimelineItem,
} from "./types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

/**
 * Content repository.
 * - If Supabase env vars are present: reads/writes Supabase (source of truth).
 * - Otherwise: falls back to local defaults/localStorage demo mode for local development.
 * Consumers use `useContent()` unchanged.
 */
const KEY = "v2-content-v2";

function loadLocal(): ContentState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultContent;
    const parsed = JSON.parse(raw) as Partial<ContentState>;
    return {
      ...defaultContent,
      ...parsed,
      site: { ...defaultContent.site, ...(parsed.site ?? {}) },
    };
  } catch {
    return defaultContent;
  }
}

function saveLocal(content: ContentState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(content));
  } catch {
    /* quota exceeded */
  }
}

type Row = Record<string, unknown>;

function mapFaculty(row: Row): FacultyMember {
  return {
    id: String(row["id"] ?? ""),
    name: String(row["name"] ?? ""),
    role: String(row["role"] ?? ""),
    focus: String(row["focus"] ?? ""),
    shortBio: String(row["short_bio"] ?? ""),
    longBio: String(row["long_bio"] ?? ""),
    photo: String(row["photo"] ?? ""),
    order: Number(row["sort_order"] ?? 0),
    status: row["status"] === "draft" ? "draft" : "published",
  };
}

function mapAchievement(row: Row): Achievement {
  return {
    id: String(row["id"] ?? ""),
    featured: Boolean(row["featured"]),
    name: String(row["name"] ?? row["student_name"] ?? ""),
    photo: String(row["photo"] ?? ""),
    exam: String(row["exam"] ?? ""),
    achievement: String(row["achievement"] ?? row["result"] ?? ""),
    extraField: String(row["extra_field"] ?? ""),
    status: row["status"] === "draft" ? "draft" : "published",
  };
}

function mapTimeline(row: Row): TimelineItem {
  return {
    id: String(row["id"] ?? ""),
    year: String(row["year"] ?? ""),
    title: String(row["title"] ?? ""),
    description: String(row["description"] ?? ""),
    isPlaceholder: Boolean(row["is_placeholder"]),
    status: row["status"] === "draft" ? "draft" : "published",
  };
}

function mapEnquiry(row: Row): Enquiry {
  const status = row["status"];
  return {
    id: String(row["id"] ?? ""),
    name: String(row["name"] ?? ""),
    phone: String(row["phone"] ?? ""),
    email: String(row["email"] ?? ""),
    message: String(row["message"] ?? ""),
    createdAt: String(row["created_at"] ?? new Date().toISOString()),
    status: status === "contacted" || status === "closed" ? status : "new",
  };
}

function mapMedia(row: Row): MediaItem {
  return {
    id: String(row["id"] ?? ""),
    name: String(row["name"] ?? ""),
    url: String(row["url"] ?? ""),
    addedAt: String(row["added_at"] ?? new Date().toISOString().slice(0, 10)),
  };
}

function mapSite(row: Row): SiteContent {
  const site = defaultContent.site;
  return {
    home: { ...site.home, ...((row["home"] as object) ?? {}) },
    about: { ...site.about, ...((row["about"] as object) ?? {}) },
    walkthrough: { ...site.walkthrough, ...((row["walkthrough"] as object) ?? {}) },
    contact: { ...site.contact, ...((row["contact"] as object) ?? {}) },
    social: { ...site.social, ...((row["social"] as object) ?? {}) },
    settings: { ...site.settings, ...((row["settings"] as object) ?? {}) },
  };
}

async function loadFromSupabase(): Promise<ContentState> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAuthed = Boolean(session);

  const [siteRes, facultyRes, achievementsRes, timelineRes, mediaRes, enquiriesRes] =
    await Promise.all([
      supabase.from("site_content").select("*").eq("id", "default").maybeSingle(),
      supabase.from("faculty").select("*").order("sort_order", { ascending: true }),
      supabase.from("achievements").select("*").order("created_at", { ascending: false }),
      supabase
        .from("timeline")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("media").select("*").order("created_at", { ascending: false }),
      isAuthed
        ? supabase.from("enquiries").select("*").order("created_at", { ascending: false })
        : Promise.resolve({ data: [] as Row[], error: null }),
    ]);

  const errors = [
    siteRes.error,
    facultyRes.error,
    achievementsRes.error,
    timelineRes.error,
    mediaRes.error,
    enquiriesRes.error,
  ].filter(Boolean);
  if (errors.length) {
    console.error("Supabase content load errors:", errors);
  }

  return {
    site: siteRes.error || !siteRes.data ? defaultContent.site : mapSite(siteRes.data as Row),
    faculty: facultyRes.error
      ? defaultContent.faculty
      : ((facultyRes.data ?? []) as Row[]).map(mapFaculty),
    achievements: achievementsRes.error
      ? defaultContent.achievements
      : ((achievementsRes.data ?? []) as Row[]).map(mapAchievement),
    timeline: timelineRes.error
      ? defaultContent.timeline
      : ((timelineRes.data ?? []) as Row[]).map(mapTimeline),
    enquiries: enquiriesRes.error ? [] : ((enquiriesRes.data ?? []) as Row[]).map(mapEnquiry),
    media: mediaRes.error ? defaultContent.media : ((mediaRes.data ?? []) as Row[]).map(mapMedia),
  };
}

async function persistSite(site: SiteContent) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("site_content").upsert({ id: "default", ...site });
  if (error) {
    console.error("Failed to save site content:", error);
    throw error;
  }
}

async function persistFaculty(prev: FacultyMember[], next: FacultyMember[]) {
  const supabase = getSupabaseBrowserClient();
  const prevIds = new Set(prev.map((f) => f.id));
  const nextIds = new Set(next.map((f) => f.id));
  const removed = prev.filter((f) => !nextIds.has(f.id)).map((f) => f.id);
  if (removed.length) {
    const { error } = await supabase.from("faculty").delete().in("id", removed);
    if (error) {
      console.error("Failed to delete faculty:", error);
      throw error;
    }
  }
  if (next.length) {
    const rows = next.map((f) => ({
      id: f.id,
      name: f.name,
      role: f.role,
      focus: f.focus,
      short_bio: f.shortBio,
      long_bio: f.longBio,
      photo: f.photo,
      sort_order: f.order,
      status: f.status,
    }));
    const { error } = await supabase.from("faculty").upsert(rows);
    if (error) {
      console.error("Failed to save faculty:", error);
      throw error;
    }
  } else if (prevIds.size) {
    // all removed already handled
  }
}

async function persistAchievements(prev: Achievement[], next: Achievement[]) {
  const supabase = getSupabaseBrowserClient();
  const nextIds = new Set(next.map((a) => a.id));
  const removed = prev.filter((a) => !nextIds.has(a.id)).map((a) => a.id);
  if (removed.length) {
    const { error } = await supabase.from("achievements").delete().in("id", removed);
    if (error) {
      console.error("Failed to delete achievements:", error);
      throw error;
    }
  }
  if (next.length) {
    const rows = next.map((a) => ({
      id: a.id,
      featured: a.featured,
      name: a.name,
      photo: a.photo,
      exam: a.exam,
      achievement: a.achievement,
      extra_field: a.extraField,
      status: a.status,
    }));
    const { error } = await supabase.from("achievements").upsert(rows);
    if (error) {
      console.error("Failed to save achievements:", error);
      throw error;
    }
  }
}

async function persistTimeline(prev: TimelineItem[], next: TimelineItem[]) {
  const supabase = getSupabaseBrowserClient();
  const nextIds = new Set(next.map((t) => t.id));
  const removed = prev.filter((t) => !nextIds.has(t.id)).map((t) => t.id);
  if (removed.length) {
    const { error } = await supabase.from("timeline").delete().in("id", removed);
    if (error) {
      console.error("Failed to delete timeline:", error);
      throw error;
    }
  }
  if (next.length) {
    const rows = next.map((t, i) => ({
      id: t.id,
      year: t.year,
      title: t.title,
      description: t.description,
      is_placeholder: t.isPlaceholder,
      status: t.status,
      sort_order: i,
    }));
    const { error } = await supabase.from("timeline").upsert(rows);
    if (error) {
      console.error("Failed to save timeline:", error);
      throw error;
    }
  }
}

async function persistEnquiries(prev: Enquiry[], next: Enquiry[]) {
  const supabase = getSupabaseBrowserClient();
  const nextIds = new Set(next.map((e) => e.id));
  const removed = prev.filter((e) => !nextIds.has(e.id)).map((e) => e.id);
  if (removed.length) {
    const { error } = await supabase.from("enquiries").delete().in("id", removed);
    if (error) {
      console.error("Failed to delete enquiries:", error);
      throw error;
    }
  }
  if (next.length) {
    const rows = next.map((e) => ({
      id: e.id,
      name: e.name,
      phone: e.phone,
      email: e.email,
      message: e.message,
      created_at: e.createdAt,
      status: e.status,
    }));
    const { error } = await supabase.from("enquiries").upsert(rows);
    if (error) {
      console.error("Failed to save enquiries:", error);
      throw error;
    }
  }
}

async function persistMedia(prev: MediaItem[], next: MediaItem[]) {
  const supabase = getSupabaseBrowserClient();
  const nextIds = new Set(next.map((m) => m.id));
  const removed = prev.filter((m) => !nextIds.has(m.id)).map((m) => m.id);
  if (removed.length) {
    const { error } = await supabase.from("media").delete().in("id", removed);
    if (error) {
      console.error("Failed to delete media:", error);
      throw error;
    }
  }
  if (next.length) {
    const rows = next.map((m) => ({ id: m.id, name: m.name, url: m.url, added_at: m.addedAt }));
    const { error } = await supabase.from("media").upsert(rows);
    if (error) {
      console.error("Failed to save media:", error);
      throw error;
    }
  }
}

async function persistDiff(prev: ContentState, next: ContentState) {
  try {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const isAuthed = Boolean(session);

    const tasks: Promise<void>[] = [];
    if (prev.site !== next.site && isAuthed) tasks.push(persistSite(next.site));
    if (prev.faculty !== next.faculty && isAuthed)
      tasks.push(persistFaculty(prev.faculty, next.faculty));
    if (prev.achievements !== next.achievements && isAuthed)
      tasks.push(persistAchievements(prev.achievements, next.achievements));
    if (prev.timeline !== next.timeline && isAuthed)
      tasks.push(persistTimeline(prev.timeline, next.timeline));
    if (prev.enquiries !== next.enquiries && isAuthed)
      tasks.push(persistEnquiries(prev.enquiries, next.enquiries));
    if (prev.media !== next.media && isAuthed) tasks.push(persistMedia(prev.media, next.media));
    await Promise.all(tasks);
  } catch (err) {
    console.error("Failed to persist content:", err);
    toast.error("Could not save to Supabase. Check console/network for details.");
  }
}

interface Ctx {
  content: ContentState;
  update: (fn: (c: ContentState) => ContentState) => void;
  reset: () => void;
  ready: boolean;
  source: "supabase" | "local";
}
const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentState>(defaultContent);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<"supabase" | "local">("local");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (hasSupabaseEnv()) {
        try {
          const loaded = await loadFromSupabase();
          if (!cancelled) {
            setContent(loaded);
            setSource("supabase");
            setReady(true);
          }
          return;
        } catch (err) {
          console.error("Supabase load failed, falling back to local defaults:", err);
        }
      }
      if (!cancelled) {
        setContent(loadLocal());
        setSource("local");
        setReady(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((fn: (c: ContentState) => ContentState) => {
    setContent((prev) => {
      const next = fn(prev);
      if (hasSupabaseEnv()) {
        void persistDiff(prev, next);
      } else {
        saveLocal(next);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    if (hasSupabaseEnv()) {
      // In Supabase mode, reload defaults locally only; do not wipe database content.
      setContent(defaultContent);
    } else {
      localStorage.removeItem(KEY);
      setContent(defaultContent);
    }
  }, []);

  return (
    <ContentContext.Provider value={{ content, update, reset, ready, source }}>
      {ready ? children : <div className="min-h-screen bg-background" aria-busy="true" />}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}

export const uid = () => Math.random().toString(36).slice(2, 10);

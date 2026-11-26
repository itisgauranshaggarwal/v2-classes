import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultContent } from "./defaults";
import type { ContentState } from "./types";

/**
 * Demo content repository: browser localStorage only.
 * Swap `load`/`save` for database calls when the backend is connected; consumers use `useContent()` unchanged.
 */
const KEY = "v2-content-v1";
function load(): ContentState {
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

interface Ctx {
  content: ContentState;
  update: (fn: (c: ContentState) => ContentState) => void;
  reset: () => void;
  ready: boolean;
}
const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentState>(defaultContent);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setContent(load());
    setReady(true);
  }, []);
  const update = useCallback((fn: (c: ContentState) => ContentState) => {
    setContent((prev) => {
      const next = fn(prev);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* quota exceeded */
      }
      return next;
    });
  }, []);
  const reset = useCallback(() => {
    localStorage.removeItem(KEY);
    setContent(defaultContent);
  }, []);
  return (
    <ContentContext.Provider value={{ content, update, reset, ready }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}

export const uid = () => Math.random().toString(36).slice(2, 10);

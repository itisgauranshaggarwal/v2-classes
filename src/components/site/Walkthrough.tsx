import { ChevronLeft, ChevronRight, Play, X, Film } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useContent } from "@/lib/content/store";

type Mode = "idle" | "scrub" | "play";
const STEPS = 10;

export function Walkthrough() {
  const { content } = useContent();
  const w = content.site.walkthrough;
  const [mode, setMode] = useState<Mode>("idle");
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const range = () => {
    const el = trackRef.current;
    if (!el) return { top: 0, len: 1 };
    const top = el.getBoundingClientRect().top + window.scrollY;
    return { top, len: Math.max(1, el.offsetHeight - window.innerHeight) };
  };

  // Scroll -> currentTime
  useEffect(() => {
    if (mode !== "scrub") return;
    let raf = 0;
    const tick = () => {
      const { top, len } = range();
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / len));
      setProgress(p);
      const v = videoRef.current;
      if (v && v.duration) {
        const target = p * v.duration;
        if (Math.abs(v.currentTime - target) > 0.03) v.currentTime = target;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  const step = useCallback((dir: 1 | -1) => {
    const { top, len } = range();
    const cur = Math.round(((window.scrollY - top) / len) * STEPS);
    const next = Math.min(STEPS, Math.max(0, cur + dir));
    window.scrollTo({ top: top + (next / STEPS) * len, behavior: "smooth" });
  }, []);

  const exit = useCallback(() => {
    setMode("idle");
    setProgress(0);
    requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: "smooth" }));
  }, []);

  useEffect(() => {
    if (mode === "idle") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
      if (mode !== "scrub") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, step, exit]);

  const activate = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(reduce ? "play" : "scrub");
    if (!reduce)
      requestAnimationFrame(() => {
        const { top } = range();
        window.scrollTo({ top, behavior: "smooth" });
      });
  };

  return (
    <section ref={sectionRef} aria-labelledby="walk-title" className="mt-32">
      <div className="container-x mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Institute walkthrough</p>
          <h2 id="walk-title" className="display-lg mt-4">
            {w.title}
          </h2>
        </div>
        <div className="max-w-sm space-y-3 text-sm text-muted-foreground">
          <p>{w.caption}</p>
        </div>
      </div>

      {mode === "idle" && (
        <div className="container-x">
          <div className="group relative aspect-[16/9] overflow-hidden rounded-3xl bg-ink md:aspect-[21/9]">
            <img
              src={w.poster}
              alt="Classroom at V2 Classes"
              loading="lazy"
              className="h-full w-full object-cover opacity-75 transition-transform duration-[1.2s] group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
            />
            <button
              onClick={activate}
              className="absolute inset-0 grid place-items-center"
              aria-label="Start the walkthrough"
            >
              <span className="relative grid h-24 w-24 place-items-center rounded-full bg-brand text-primary-foreground transition-transform duration-300 group-hover:scale-105 md:h-28 md:w-28">
                <Play className="relative ml-1 h-9 w-9 fill-current" />
              </span>
            </button>
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 text-primary-foreground">
              <span className="text-sm font-medium opacity-90">
                Scroll to move through the institute
              </span>
              <button
                onClick={() => setMode("play")}
                className="rounded-full border border-primary-foreground/40 px-4 py-2 text-xs font-semibold backdrop-blur hover:bg-primary-foreground/10"
              >
                Play as normal video
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === "play" && (
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-ink">
            {failed ? (
              <img
                src={w.poster}
                alt="Classroom at V2 Classes"
                className="aspect-video w-full object-cover"
              />
            ) : (
              <video
                src={w.videoUrl}
                poster={w.poster}
                controls
                autoPlay
                playsInline
                onError={() => setFailed(true)}
                className="aspect-video w-full"
              />
            )}
            <button
              onClick={exit}
              aria-label="Close video"
              className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-background/90 text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {mode === "scrub" && (
        <div ref={trackRef} className="relative h-[400vh]">
          <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
            {failed ? (
              <img
                src={w.poster}
                alt="Classroom at V2 Classes"
                className="h-full w-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                src={w.videoUrl}
                poster={w.poster}
                muted
                playsInline
                preload="auto"
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/70"
            />
            <div className="absolute top-20 left-0 right-0 container-x flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-3">
                <span className="hidden text-xs opacity-80 sm:inline">
                  Scroll, swipe or use ← → keys
                </span>
              </div>
              <button
                onClick={exit}
                className="flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground"
              >
                <X className="h-4 w-4" />
                Exit
              </button>
            </div>
            <div className="absolute bottom-8 left-0 right-0 container-x flex items-center gap-4 text-primary-foreground">
              <button
                onClick={() => step(-1)}
                aria-label="Previous"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary-foreground/40 backdrop-blur hover:bg-primary-foreground/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div
                className="h-1 flex-1 overflow-hidden rounded-full bg-primary-foreground/20"
                role="progressbar"
                aria-label="Walkthrough progress"
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full bg-brand" style={{ width: `${progress * 100}%` }} />
              </div>
              <span className="w-12 text-right font-display text-sm font-bold tabular-nums">
                {Math.round(progress * 100)}%
              </span>
              <button
                onClick={() => step(1)}
                aria-label="Next"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand hover:bg-brand-deep"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

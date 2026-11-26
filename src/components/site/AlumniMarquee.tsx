import { useEffect, useRef } from "react";
import { useContent } from "@/lib/content/store";
import { AchievementCard } from "./AchievementCard";

/** Auto-scrolling strip driven by JS so it moves on every device; pauses on hover/touch and can be scrolled by hand. */
export function AlumniMarquee() {
  const { content } = useContent();
  const list = content.achievements.filter((a) => a.status === "published");
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const seconds = content.site.settings.marqueeSpeed;

  useEffect(() => {
    const el = ref.current;
    if (!el || list.length === 0) return;
    let raf = 0; let last = performance.now(); let pos = el.scrollLeft;
    const tick = (now: number) => {
      const dt = now - last; last = now;
      const half = el.scrollWidth / 2;
      if (!paused.current && half > el.clientWidth) {
        pos += (half / (seconds * 1000)) * dt;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      } else pos = el.scrollLeft;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [list.length, seconds]);

  if (list.length === 0) {
    return <p className="container-x py-12 text-center text-muted-foreground">Alumni achievements will appear here once added from the admin dashboard.</p>;
  }
  const loop = [...list, ...list];
  const pause = (v: boolean) => () => { paused.current = v; };
  return (
    <div ref={ref} onMouseEnter={pause(true)} onMouseLeave={pause(false)} onTouchStart={pause(true)} onTouchEnd={() => setTimeout(pause(false), 2500)}
      onFocus={pause(true)} onBlur={pause(false)} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul className="flex w-max gap-4 px-5 pb-14">
        {loop.map((a, i) => (
          <li key={`${a.id}-${i}`} aria-hidden={i >= list.length} className="w-64 shrink-0">
            <AchievementCard a={a} compact />
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { ReactNode } from "react";
export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="grain-lines relative overflow-hidden border-b border-border">
      <div className="container-x relative py-20 md:py-28">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="display-xl mt-5 max-w-5xl animate-rise [animation-delay:80ms]">{title}</h1>
        {children && <div className="mt-8 max-w-2xl animate-rise text-lg leading-relaxed text-muted-foreground [animation-delay:160ms]">{children}</div>}
      </div>
    </section>
  );
}

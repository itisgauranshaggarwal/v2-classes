import { isPlaceholderText } from "@/lib/content/defaults";
import { PencilLine } from "lucide-react";

/** Renders text; placeholders ([...]) get a clearly labelled dashed style. */
export function Editable({ text, className = "" }: { text: string; className?: string }) {
  if (isPlaceholderText(text)) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-md border border-dashed border-brand/50 bg-brand-soft/60 px-2 py-0.5 text-brand-deep ${className}`}
      >
        <PencilLine className="h-3.5 w-3.5 shrink-0" aria-hidden /> {text.slice(1, -1)}
      </span>
    );
  }
  return <span className={className}>{text}</span>;
}

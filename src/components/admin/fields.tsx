import { ImagePlus, X } from "lucide-react";
import type { ReactNode } from "react";

export type FieldSpec<T> = {
  key: keyof T & string;
  label: string;
  type?: "text" | "textarea" | "image" | "number" | "toggle" | "select" | "url";
  options?: { value: string; label: string }[];
  hint?: string;
  wide?: boolean;
};

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20";

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file); });
}

export function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed border-input bg-surface">
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-5 w-5 text-muted-foreground" />}
        {value && <button type="button" onClick={() => onChange("")} aria-label="Remove image" className="absolute top-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-background"><X className="h-3 w-3" /></button>}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-input px-3 py-2 text-xs font-semibold hover:bg-surface">
          Upload image
          <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (f) onChange(await readFileAsDataUrl(f)); }} />
        </label>
        <input className={inputCls} placeholder="…or paste an image URL" value={value.startsWith("data:") ? "" : value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

export function FieldRow({ label, hint, children, wide }: { label: string; hint?: string | undefined; children: ReactNode; wide?: boolean | undefined }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-brand" : "bg-surface-strong"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all ${checked ? "left-5.5" : "left-0.5"}`} />
    </button>
  );
}

export function FieldGrid<T extends Record<string, unknown>>({ fields, value, onChange }: { fields: FieldSpec<T>[]; value: T; onChange: (v: T) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => {
        const v = value[f.key];
        const wide = f.wide ?? (f.type === "textarea" || f.type === "image");
        let input: ReactNode;
        if (f.type === "textarea") input = <textarea rows={4} className={inputCls} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />;
        else if (f.type === "image") input = <ImageInput value={String(v ?? "")} onChange={(x) => set(f.key, x)} />;
        else if (f.type === "toggle") input = <Toggle label={f.label} checked={Boolean(v)} onChange={(x) => set(f.key, x)} />;
        else if (f.type === "number") input = <input type="number" className={inputCls} value={Number(v ?? 0)} onChange={(e) => set(f.key, Number(e.target.value))} />;
        else if (f.type === "select") input = (
          <select className={inputCls} value={String(v)} onChange={(e) => set(f.key, e.target.value)}>
            {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>);
        else input = <input type={f.type === "url" ? "url" : "text"} className={inputCls} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />;
        return <FieldRow key={f.key} label={f.label} hint={f.hint} wide={wide}>{input}</FieldRow>;
      })}
    </div>
  );
}

export const STATUS_OPTIONS = [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }];

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { published: "bg-brand-soft text-brand-deep", draft: "bg-surface-strong text-muted-foreground", new: "bg-brand text-primary-foreground", contacted: "bg-brand-soft text-brand-deep", closed: "bg-surface-strong text-muted-foreground" };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status] ?? "bg-surface"}`}>{status}</span>;
}

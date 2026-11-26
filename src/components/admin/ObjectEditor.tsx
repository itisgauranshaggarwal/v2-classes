import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FieldGrid, type FieldSpec } from "./fields";

/** Edit a single settings object with a local draft and explicit Save. */
export function ObjectEditor<T extends Record<string, unknown>>({
  value,
  fields,
  onSave,
}: {
  value: T;
  fields: FieldSpec<T>[];
  onSave: (v: T) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(value);
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <FieldGrid fields={fields} value={draft} onChange={setDraft} />
      <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-5">
        {dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
        <button
          disabled={!dirty}
          onClick={() => setDraft(value)}
          className="btn-ghost !py-2 !text-sm disabled:opacity-40"
        >
          Discard
        </button>
        <button
          disabled={!dirty}
          onClick={() => {
            onSave(draft);
            toast.success("Changes saved");
          }}
          className="btn-brand !py-2 !text-sm disabled:opacity-40"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

import { Pencil, Plus, Trash2, Inbox } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FieldGrid, type FieldSpec } from "./fields";

export type Column<T> = { label: string; render: (row: T) => ReactNode; className?: string };

/** Reusable table + add/edit dialog + delete confirmation for any content collection. */
export function CollectionManager<T extends { id: string }>({
  title,
  items,
  columns,
  fields,
  create,
  onSave,
  onDelete,
  addLabel = "Add new",
}: {
  title: string;
  items: T[];
  columns: Column<T>[];
  fields: FieldSpec<T>[];
  create: () => T;
  onSave: (item: T) => void;
  onDelete: (id: string) => void;
  addLabel?: string;
}) {
  const [editing, setEditing] = useState<T | null>(null);
  const [confirm, setConfirm] = useState<T | null>(null);
  const isNew = editing ? !items.some((i) => i.id === editing.id) : false;
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "record" : "records"}
        </p>
        <button onClick={() => setEditing(create())} className="btn-brand !py-2 !text-sm">
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        {items.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Inbox className="mx-auto h-8 w-8" />
            <p className="mt-3 text-sm">Nothing here yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface/60 text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                {columns.map((c) => (
                  <th key={c.label} className="px-4 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((row) => (
                <tr key={row.id} className="hover:bg-surface/40">
                  {columns.map((c) => (
                    <td key={c.label} className={`px-4 py-3 align-middle ${c.className ?? ""}`}>
                      {c.render(row)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setEditing(row)}
                      aria-label="Edit"
                      className="rounded-md p-2 hover:bg-surface"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirm(row)}
                      aria-label="Delete"
                      className="rounded-md p-2 text-destructive hover:bg-surface"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? `Add ${title}` : `Edit ${title}`}</DialogTitle>
          </DialogHeader>
          {editing && (
            <FieldGrid
              fields={fields}
              value={editing as T & Record<string, unknown>}
              onChange={(v) => setEditing(v)}
            />
          )}
          <DialogFooter>
            <button onClick={() => setEditing(null)} className="btn-ghost !py-2 !text-sm">
              Cancel
            </button>
            <button
              onClick={() => {
                if (editing) {
                  onSave(editing);
                  toast.success("Saved");
                  setEditing(null);
                }
              }}
              className="btn-brand !py-2 !text-sm"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this {title}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This can't be undone.</p>
          <DialogFooter>
            <button onClick={() => setConfirm(null)} className="btn-ghost !py-2 !text-sm">
              Cancel
            </button>
            <button
              onClick={() => {
                if (confirm) {
                  onDelete(confirm.id);
                  toast.success("Deleted");
                  setConfirm(null);
                }
              }}
              className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

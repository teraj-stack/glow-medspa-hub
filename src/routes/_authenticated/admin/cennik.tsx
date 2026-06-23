import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { TECHNOLOGIES } from "@/data/technologies";
import { formatCena } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  listHiddenPricingItems,
  setPricingItemHidden,
  setPricingItemsHidden,
} from "@/lib/pricing-visibility.functions";

export const Route = createFileRoute("/_authenticated/admin/cennik")({
  component: AdminPricing,
});

type ItemKey = `${string}::${string}`;

function keyFor(slug: string, label: string): ItemKey {
  return `${slug}::${label}`;
}

function parseKey(key: ItemKey) {
  const sep = key.indexOf("::");
  return { slug: key.slice(0, sep), label: key.slice(sep + 2) };
}

function AdminPricing() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(listHiddenPricingItems);
  const toggleFn = useServerFn(setPricingItemHidden);
  const bulkToggleFn = useServerFn(setPricingItemsHidden);
  const [pending, setPending] = useState<Set<ItemKey>>(new Set());
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [selected, setSelected] = useState<Set<ItemKey>>(new Set());
  const [bulkPending, setBulkPending] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; hide: boolean }>({
    open: false,
    hide: true,
  });
  type UndoEntry = {
    id: number;
    description: string;
    items: { slug: string; label: string }[];
    previousHidden: Map<ItemKey, boolean>;
  };
  const UNDO_LIMIT = 10;
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [undoPending, setUndoPending] = useState(false);

  const pushUndo = (entry: Omit<UndoEntry, "id">) => {
    setUndoStack((prev) => {
      const next = [...prev, { ...entry, id: Date.now() + Math.random() }];
      return next.length > UNDO_LIMIT ? next.slice(next.length - UNDO_LIMIT) : next;
    });
  };

  const { data: hidden = [], isLoading } = useQuery({
    queryKey: ["hidden-pricing-items"],
    queryFn: () => listFn(),
  });

  const hiddenSet = useMemo(
    () => new Set(hidden.map((h) => keyFor(h.slug, h.label))),
    [hidden],
  );

  const groups = useMemo(
    () => TECHNOLOGIES.filter((t) => t.pricing.length > 0),
    [],
  );

  const toggle = async (slug: string, label: string, hide: boolean) => {
    const key = keyFor(slug, label);
    setPending((p) => new Set(p).add(key));
    const previousHidden = new Map<ItemKey, boolean>();
    previousHidden.set(key, hiddenSet.has(key));
    try {
      await toggleFn({ data: { slug, label, hidden: hide } });
      await queryClient.invalidateQueries({ queryKey: ["hidden-pricing-items"] });
      pushUndo({
        description: hide ? `Ukryto „${label}"` : `Przywrócono „${label}"`,
        items: [{ slug, label }],
        previousHidden,
      });
      toast.success(hide ? "Pozycja ukryta" : "Pozycja przywrócona", {
        action: { label: "Cofnij", onClick: () => performUndo() },
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Nie udało się zaktualizować pozycji");
    } finally {
      setPending((p) => {
        const n = new Set(p);
        n.delete(key);
        return n;
      });
    }
  };

  const isSelected = (slug: string, label: string) =>
    selected.has(keyFor(slug, label));

  const toggleSelected = (slug: string, label: string) => {
    const key = keyFor(slug, label);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleGroup = (slug: string, rows: { label: string }[]) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = rows.every((p) => next.has(keyFor(slug, p.label)));
      for (const p of rows) {
        const key = keyFor(slug, p.label);
        if (allSelected) next.delete(key);
        else next.add(key);
      }
      return next;
    });
  };

  const requestBulkToggle = (hide: boolean) => {
    if (selected.size === 0) return;
    setConfirmDialog({ open: true, hide });
  };

  const confirmBulkToggle = async () => {
    if (selected.size === 0) {
      setConfirmDialog({ open: false, hide: true });
      return;
    }
    const hide = confirmDialog.hide;
    const items = Array.from(selected).map((k) => {
      const { slug, label } = parseKey(k);
      return { slug, label, hidden: hide };
    });
    const previousHidden = new Map<ItemKey, boolean>();
    for (const k of selected) previousHidden.set(k, hiddenSet.has(k));
    setBulkPending(true);
    setConfirmDialog({ open: false, hide });
    try {
      await bulkToggleFn({ data: { items } });
      await queryClient.invalidateQueries({ queryKey: ["hidden-pricing-items"] });
      setSelected(new Set());
      pushUndo({
        description: hide
          ? `Ukryto ${items.length} pozycji`
          : `Przywrócono ${items.length} pozycji`,
        items: items.map(({ slug, label }) => ({ slug, label })),
        previousHidden,
      });
      toast.success(
        hide
          ? `Ukryto ${items.length} pozycji`
          : `Przywrócono ${items.length} pozycji`,
        { action: { label: "Cofnij", onClick: () => performUndo() } },
      );
    } catch (e: any) {
      toast.error(e?.message ?? "Nie udało się zaktualizować pozycji");
    } finally {
      setBulkPending(false);
    }
  };

  const performUndo = async (entryId?: number) => {
    if (undoPending || undoStack.length === 0) return;
    const entry = entryId
      ? undoStack.find((e) => e.id === entryId)
      : undoStack[undoStack.length - 1];
    if (!entry) return;
    const items = entry.items.map(({ slug, label }) => {
      const key = keyFor(slug, label);
      return { slug, label, hidden: entry.previousHidden.get(key) ?? false };
    });
    setUndoPending(true);
    try {
      await bulkToggleFn({ data: { items } });
      await queryClient.invalidateQueries({ queryKey: ["hidden-pricing-items"] });
      setUndoStack((prev) => prev.filter((e) => e.id !== entry.id));
      toast.success(`Cofnięto: ${entry.description}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Nie udało się cofnąć akcji");
    } finally {
      setUndoPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Cennik</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ukrywaj wybrane pozycje cennika przed pacjentami bez kasowania ich z bazy.
            Ukryta pozycja nie znika z systemu — możesz ją w każdej chwili przywrócić.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            Ukryte: <strong className="text-foreground">{hidden.length}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHiddenOnly((v) => !v)}
          >
            {showHiddenOnly ? "Pokaż wszystkie" : "Pokaż tylko ukryte"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Wczytywanie…</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={
                  selected.size > 0 &&
                  groups
                    .flatMap((g) =>
                      g.pricing
                        .filter((p) =>
                          showHiddenOnly ? hiddenSet.has(keyFor(g.slug, p.label)) : true,
                        )
                        .map((p) => keyFor(g.slug, p.label)),
                    )
                    .every((k) => selected.has(k))
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    const next = new Set<ItemKey>();
                    for (const g of groups) {
                      for (const p of g.pricing) {
                        if (showHiddenOnly && !hiddenSet.has(keyFor(g.slug, p.label))) continue;
                        next.add(keyFor(g.slug, p.label));
                      }
                    }
                    setSelected(next);
                  } else {
                    setSelected(new Set());
                  }
                }}
                aria-label="Zaznacz wszystkie pozycje"
              />
              <span className="text-muted-foreground">
                Zaznaczono:{" "}
                <strong className="text-foreground">{selected.size}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {lastAction && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={undoPending}
                  onClick={performUndo}
                >
                  {undoPending ? "…" : "Cofnij ostatnią akcję"}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                disabled={selected.size === 0 || bulkPending}
                onClick={() => requestBulkToggle(false)}
              >
                {bulkPending && confirmDialog.hide === false ? "…" : "Przywróć zaznaczone"}
              </Button>
              <Button
                size="sm"
                disabled={selected.size === 0 || bulkPending}
                onClick={() => requestBulkToggle(true)}
              >
                {bulkPending && confirmDialog.hide === true ? "…" : "Ukryj zaznaczone"}
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {groups.map((t) => {
              const rows = t.pricing.filter((p) =>
                showHiddenOnly ? hiddenSet.has(keyFor(t.slug, p.label)) : true,
              );
              if (rows.length === 0) return null;
              const groupSelectedCount = rows.filter((p) =>
                isSelected(t.slug, p.label),
              ).length;
              const groupChecked =
                rows.length > 0 && groupSelectedCount === rows.length;
              const groupIndeterminate =
                groupSelectedCount > 0 && groupSelectedCount < rows.length;

              return (
                <section key={t.slug}>
                  <div className="mb-2 flex items-center gap-2">
                    <Checkbox
                      checked={
                        groupIndeterminate ? "indeterminate" : groupChecked
                      }
                      onCheckedChange={() => toggleGroup(t.slug, rows)}
                      aria-label={`Zaznacz wszystkie pozycje w ${t.name}`}
                    />
                    <h3 className="font-medium text-foreground">{t.name}</h3>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <table className="w-full text-sm">
                      <tbody>
                        {rows.map((p) => {
                          const key = keyFor(t.slug, p.label);
                          const isHidden = hiddenSet.has(key);
                          const isPending = pending.has(key);
                          return (
                            <tr
                              key={p.label}
                              className="border-b border-border last:border-0"
                            >
                              <td className="w-10 px-2 py-3 text-center">
                                <Checkbox
                                  checked={isSelected(t.slug, p.label)}
                                  onCheckedChange={() =>
                                    toggleSelected(t.slug, p.label)
                                  }
                                  aria-label={`Zaznacz ${p.label}`}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={!isHidden}
                                    disabled={isPending}
                                    onCheckedChange={(checked) =>
                                      toggle(t.slug, p.label, !checked)
                                    }
                                    aria-label={
                                      isHidden
                                        ? "Przywróć pozycję"
                                        : "Ukryj pozycję"
                                    }
                                  />
                                  <span
                                    className={
                                      isHidden
                                        ? "text-muted-foreground line-through"
                                        : ""
                                    }
                                  >
                                    {p.label}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                    isHidden
                                      ? "bg-amber-500/15 text-amber-500"
                                      : "bg-emerald-500/15 text-emerald-500"
                                  }`}
                                >
                                  {isHidden ? "ukryta" : "widoczna"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-muted-foreground">
                                {formatCena(p.price, { prefix: "od" })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((d) => ({ ...d, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.hide ? "Ukryj zaznaczone pozycje?" : "Przywróć zaznaczone pozycje?"}
            </DialogTitle>
            <DialogDescription>
              Wybrano {selected.size} pozycji. Czy na pewno chcesz je{" "}
              {confirmDialog.hide ? "ukryć" : "przywrócić"}?
              Ukryte pozycje nie będą widoczne na publicznej stronie cennika,
              ale pozostaną w bazie.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog((d) => ({ ...d, open: false }))}
            >
              Anuluj
            </Button>
            <Button onClick={confirmBulkToggle} disabled={bulkPending}>
              {bulkPending ? "…" : confirmDialog.hide ? "Ukryj" : "Przywróć"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

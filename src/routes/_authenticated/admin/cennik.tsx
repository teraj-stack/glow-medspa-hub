import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { TECHNOLOGIES } from "@/data/technologies";
import { formatCena } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  listHiddenPricingItems,
  setPricingItemHidden,
} from "@/lib/pricing-visibility.functions";

export const Route = createFileRoute("/_authenticated/admin/cennik")({
  component: AdminPricing,
});

function AdminPricing() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(listHiddenPricingItems);
  const toggleFn = useServerFn(setPricingItemHidden);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);

  const { data: hidden = [], isLoading } = useQuery({
    queryKey: ["hidden-pricing-items"],
    queryFn: () => listFn(),
  });

  const hiddenSet = useMemo(
    () => new Set(hidden.map((h) => `${h.slug}::${h.label}`)),
    [hidden],
  );

  const groups = useMemo(
    () => TECHNOLOGIES.filter((t) => t.pricing.length > 0),
    [],
  );

  const toggle = async (slug: string, label: string, hide: boolean) => {
    const key = `${slug}::${label}`;
    setPending((p) => new Set(p).add(key));
    try {
      await toggleFn({ data: { slug, label, hidden: hide } });
      await queryClient.invalidateQueries({ queryKey: ["hidden-pricing-items"] });
      toast.success(hide ? "Pozycja ukryta" : "Pozycja przywrócona");
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
        <div className="space-y-8">
          {groups.map((t) => {
            const rows = t.pricing.filter((p) =>
              showHiddenOnly ? hiddenSet.has(`${t.slug}::${p.label}`) : true,
            );
            if (rows.length === 0) return null;
            return (
              <section key={t.slug}>
                <h3 className="font-medium text-foreground mb-2">{t.name}</h3>
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <table className="w-full text-sm">
                    <tbody>
                      {rows.map((p) => {
                        const key = `${t.slug}::${p.label}`;
                        const isHidden = hiddenSet.has(key);
                        const isPending = pending.has(key);
                        return (
                          <tr
                            key={p.label}
                            className={`border-b border-border last:border-0 ${
                              isHidden ? "bg-muted/40" : ""
                            }`}
                          >
                            <td className="px-4 py-3">
                              <span
                                className={
                                  isHidden ? "text-muted-foreground line-through" : ""
                                }
                              >
                                {p.label}
                              </span>
                              {isHidden && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700">
                                  ukryte
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-muted-foreground">
                              {formatCena(p.price, { prefix: "od" })}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                size="sm"
                                variant={isHidden ? "default" : "outline"}
                                disabled={isPending}
                                onClick={() => toggle(t.slug, p.label, !isHidden)}
                              >
                                {isPending
                                  ? "…"
                                  : isHidden
                                    ? "Przywróć"
                                    : "Ukryj"}
                              </Button>
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
      )}
    </div>
  );
}

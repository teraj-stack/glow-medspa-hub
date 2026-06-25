import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  listUsersWithRoles,
  grantRole,
  revokeRole,
  type UserWithRoles,
} from "@/lib/user-roles.functions";
import { checkAdminPanelAccess } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/uzytkownicy")({
  beforeLoad: async () => {
    try {
      const { isAdmin } = await checkAdminPanelAccess();
      if (!isAdmin) throw redirect({ to: "/admin" });
    } catch (e: any) {
      if (e?.isRedirect) throw e;
      throw redirect({ to: "/admin" });
    }
  },
  component: AdminUsersPage,
});

type Role = "admin" | "moderator";

function AdminUsersPage() {
  const qc = useQueryClient();
  const list = useServerFn(listUsersWithRoles);
  const grant = useServerFn(grantRole);
  const revoke = useServerFn(revokeRole);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users-roles", search],
    queryFn: () => list({ data: { search } }),
  });

  const mGrant = useMutation({
    mutationFn: (v: { target_user_id: string; role: Role }) => grant({ data: v }),
    onSuccess: () => {
      toast.success("Rola nadana");
      qc.invalidateQueries({ queryKey: ["admin", "users-roles"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Błąd"),
  });

  const mRevoke = useMutation({
    mutationFn: (v: { target_user_id: string; role: Role }) => revoke({ data: v }),
    onSuccess: () => {
      toast.success("Rola odebrana");
      qc.invalidateQueries({ queryKey: ["admin", "users-roles"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Błąd"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Użytkownicy i role</h2>
        <p className="text-sm text-muted-foreground">
          Nadawaj i odbieraj role Admin / Moderator. Każda zmiana jest zapisywana w dzienniku audytu (severity: critical).
        </p>
      </div>

      <Card className="p-4">
        <Input
          placeholder="Szukaj po e-mailu lub nazwisku…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Użytkownik</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Ostatnie logowanie</TableHead>
              <TableHead className="text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Ładowanie…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && (data ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Brak użytkowników.
                </TableCell>
              </TableRow>
            )}
            {(data ?? []).map((u: UserWithRoles) => {
              const isAdmin = u.roles.includes("admin");
              const isMod = u.roles.includes("moderator");
              const busy = mGrant.isPending || mRevoke.isPending;
              return (
                <TableRow key={u.user_id}>
                  <TableCell>
                    <div className="font-medium">{u.email ?? "(brak e-maila)"}</div>
                    <div className="text-xs text-muted-foreground">
                      {u.full_name ?? "—"} · {u.user_id.slice(0, 8)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {isAdmin && <Badge variant="default">admin</Badge>}
                      {isMod && <Badge variant="secondary">moderator</Badge>}
                      {!isAdmin && !isMod && (
                        <span className="text-xs text-muted-foreground">user</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleString("pl-PL")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {(["admin", "moderator"] as Role[]).map((role) => {
                      const has = u.roles.includes(role);
                      return (
                        <Button
                          key={role}
                          size="sm"
                          variant={has ? "outline" : "default"}
                          disabled={busy}
                          onClick={() => {
                            const label = role === "admin" ? "Administrator" : "Moderator";
                            const verb = has ? "ODEBRAĆ" : "NADAĆ";
                            if (!confirm(`${verb} rolę ${label} użytkownikowi ${u.email}?`)) return;
                            (has ? mRevoke : mGrant).mutate({
                              target_user_id: u.user_id,
                              role,
                            });
                          }}
                        >
                          {has ? `− ${role}` : `+ ${role}`}
                        </Button>
                      );
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

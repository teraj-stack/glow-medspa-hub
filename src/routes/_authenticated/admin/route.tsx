import { createFileRoute, Outlet, Link, redirect, useRouterState } from "@tanstack/react-router";
import { checkAdminPanelAccess } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    try {
      const { hasAccess } = await checkAdminPanelAccess();
      if (!hasAccess) throw redirect({ to: "/" });
      return { adminAccess: true };
    } catch (e: any) {
      if (e?.isRedirect) throw e;
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabs = [
    { to: "/admin", label: "Pulpit", exact: true },
    { to: "/admin/rezerwacje", label: "Rezerwacje" },
    { to: "/admin/lekarze", label: "Lekarze" },
    { to: "/admin/cennik", label: "Cennik" },
    { to: "/admin/seo", label: "SEO" },
    { to: "/admin/web-vitals", label: "Web Vitals" },
    { to: "/admin/audyt", label: "Audyt" },
  ];
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Panel administracyjny</h1>
          <nav className="flex gap-1">
            {tabs.map((t) => {
              const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

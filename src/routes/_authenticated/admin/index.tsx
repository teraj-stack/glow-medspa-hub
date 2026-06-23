import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const cards = [
    {
      to: "/admin/rezerwacje",
      title: "Rezerwacje",
      description: "Przeglądaj i zarządzaj wizytami pacjentów.",
    },
    {
      to: "/admin/lekarze",
      title: "Lekarze",
      description: "Zarządzaj lekarzami, godzinami pracy i integracją kalendarza.",
    },
    {
      to: "/admin/cennik",
      title: "Cennik",
      description: "Ukrywaj i przywracaj pozycje cennika bez usuwania ich z bazy.",
    },
    {
      to: "/admin/seo",
      title: "SEO",
      description: "Monitoring widoczności w Google, mapy witryny i sprawdzanie indeksacji.",
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Pulpit</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Wybierz sekcję, którą chcesz zarządzać.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="block rounded-lg border border-border p-5 hover:border-primary transition-colors"
          >
            <h3 className="font-medium">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

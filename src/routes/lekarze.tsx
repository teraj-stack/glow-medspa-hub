import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/lekarze")({
  component: LekarzeLayout,
});

function LekarzeLayout() {
  return (
    <>
      <nav aria-label="Okruszki" className="container-luxury pt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">
          Strona główna
        </Link>
        <span aria-hidden className="mx-2">/</span>
        <span className="text-foreground/70">Lekarze</span>
      </nav>
      <Outlet />
    </>
  );
}

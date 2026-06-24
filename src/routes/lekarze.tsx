import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/lekarze")({
  component: LekarzeLayout,
});

function LekarzeLayout() {
  return <Outlet />;
}

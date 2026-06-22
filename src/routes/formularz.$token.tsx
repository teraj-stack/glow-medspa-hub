import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

const loadOrderByToken = createServerFn({ method: "GET" })
  .inputValidator((data: { token: string }) => {
    if (!/^[a-f0-9]{16,128}$/.test(data.token)) throw new Error("Invalid token");
    return data;
  })
  .handler(async ({ data }) => {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: order } = await supabase
      .from("consultation_orders")
      .select("full_name,email,consultation_type,preferred_date,intake_completed_at,status")
      .eq("intake_token", data.token)
      .maybeSingle();
    return order;
  });

export const Route = createFileRoute("/formularz/$token")({
  head: () => ({
    meta: [
      { title: "Formularz wstępnej diagnostyki | Beauty & Mind Clinic" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["intake", params.token],
        queryFn: () => loadOrderByToken({ data: { token: params.token } }),
      }),
    ),
  component: IntakeForm,
  errorComponent: () => (
    <div className="container-luxury py-20 text-center">
      <p>Nie udało się wczytać formularza.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-luxury py-20 text-center">
      <p>Nie znaleziono.</p>
    </div>
  ),
});

function IntakeForm() {
  const { token } = Route.useParams();
  const { data: order } = useSuspenseQuery(
    queryOptions({
      queryKey: ["intake", token],
      queryFn: () => loadOrderByToken({ data: { token } }),
    }),
  );

  if (!order) {
    return (
      <section className="container-luxury py-20 text-center">
        <h1 className="font-serif text-2xl text-ink">Link jest nieprawidłowy lub wygasł</h1>
        <p className="mt-3 text-foreground/70">
          Skontaktuj się z kliniką, abyśmy wysłali nowy formularz.
        </p>
      </section>
    );
  }

  return (
    <section className="container-luxury py-12 md:py-20">
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8">
        <h1 className="font-serif text-3xl text-ink">Formularz wstępnej diagnostyki</h1>
        <p className="mt-2 text-foreground/70">
          Cześć {order.full_name}! Wypełnij formularz najpóźniej 24 godziny przed wizytą
          ({order.consultation_type === "online" ? "konsultacja online" : "konsultacja w klinice"}
          {order.preferred_date ? `, ${order.preferred_date}` : ""}).
        </p>
        <p className="mt-6 rounded-md bg-secondary/40 px-4 py-3 text-sm text-foreground/80">
          Treść formularza zostanie wkrótce dodana. Lekarz skontaktuje się z Tobą w razie
          dodatkowych pytań.
        </p>
      </div>
    </section>
  );
}

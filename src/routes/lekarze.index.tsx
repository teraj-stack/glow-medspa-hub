import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listActiveDoctors } from "@/lib/doctors.functions";

const doctorsQuery = queryOptions({
  queryKey: ["public-doctors"],
  queryFn: () => listActiveDoctors(),
  // Cache dłużej — lista zmienia się rzadko; Query trzyma w pamięci 30 min
  // i odświeża w tle przy ponownym wejściu (stale-while-revalidate).
  staleTime: 10 * 60_000,
  gcTime: 30 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

export const Route = createFileRoute("/lekarze/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(doctorsQuery),
  // Router SWR — przez 10 min loader nie blokuje nawigacji, dane są cache'owane;
  // po godzinie wpis jest usuwany z pamięci routera.
  staleTime: 10 * 60_000,
  gcTime: 60 * 60_000,
  head: () => ({
    meta: [
      { title: "Lekarze i specjaliści — BMClinics.ai Siedlce" },
      {
        name: "description",
        content:
          "Zespół BMClinics.ai w Siedlcach — lekarze i specjaliści medycyny estetycznej z warszawskim doświadczeniem.",
      },
      { property: "og:title", content: "Lekarze i specjaliści — BMClinics.ai" },
      {
        property: "og:description",
        content:
          "Poznaj zespół kliniki w Siedlcach — kompetencje, specjalizacje i doświadczenie z premium klinik warszawskich.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LekarzePage,
  pendingMs: 200,
  pendingMinMs: 300,
  pendingComponent: LekarzePending,
  errorComponent: LekarzeError,
  notFoundComponent: () => (
    <main className="bg-background">
      <section className="container-luxury py-20 text-center">
        <p className="text-sm text-muted-foreground">Nie znaleziono.</p>
      </section>
    </main>
  ),
});

function LekarzeHeading() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Zespół kliniki
      </p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
        Lekarze i specjaliści
      </h1>
    </div>
  );
}

function DoctorSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border/60 bg-card p-6 md:p-8"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="size-28 shrink-0 animate-pulse rounded-full bg-muted md:size-32" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted/80" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-muted/70" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted/70" />
            <div className="h-3 w-4/6 animate-pulse rounded bg-muted/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LekarzePending() {
  return (
    <main className="bg-background" aria-busy="true" aria-live="polite">
      <section className="container-luxury py-16 md:py-24">
        <LekarzeHeading />
        <p className="sr-only">Wczytywanie listy lekarzy…</p>
        <ul className="mt-14 grid gap-10 md:mt-20 md:grid-cols-2 lg:gap-14">
          {Array.from({ length: 2 }).map((_, i) => (
            <li key={i}>
              <DoctorSkeleton />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function LekarzeError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <main className="bg-background" role="alert">
      <section className="container-luxury py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-border/60 bg-card p-8 text-center md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Wystąpił błąd
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground">
            Nie udało się załadować listy lekarzy
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Spróbuj ponownie za chwilę. Jeśli problem się powtórzy, skontaktuj
            się z nami bezpośrednio.
          </p>
          {error?.message && (
            <pre className="mx-auto mt-5 max-w-full overflow-x-auto rounded-md bg-muted/60 px-3 py-2 text-left text-[11px] text-muted-foreground">
              {error.message}
            </pre>
          )}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
            >
              Spróbuj ponownie
            </button>
            <Link
              to="/konsultacja"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm tracking-wide text-foreground transition hover:border-champagne/60"
            >
              Umów konsultację
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function DoctorCard({ doctor }: { doctor: { id: string; slug: string; full_name: string; title: string | null; bio: string | null; photo_url: string | null } }) {
  const initials = doctor.full_name
    .replace(/^(dr|lek|prof)\.?\s+/i, "")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  const cardInner = (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      <div className="shrink-0">
        {doctor.photo_url ? (
          <img
            src={doctor.photo_url}
            alt={doctor.full_name}
            width={128}
            height={128}
            loading="lazy"
            decoding="async"
            className="size-28 rounded-full object-cover ring-1 ring-border md:size-32"
          />
        ) : (
          <div
            aria-hidden
            className="flex size-28 items-center justify-center rounded-full bg-secondary text-2xl font-serif text-muted-foreground md:size-32"
          >
            {initials}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          {doctor.full_name}
        </h2>
        {doctor.title && (
          <p className="mt-1 text-sm text-muted-foreground">{doctor.title}</p>
        )}
        {doctor.bio && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
            {doctor.bio}
          </p>
        )}
      </div>
    </div>
  );

  const hasProfilePage = doctor.slug === "halina-gabara" || doctor.slug === "jan-bujok";

  if (hasProfilePage) {
    return (
      <Link
        to={`/lekarze/${doctor.slug}`}
        className="group block rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-md md:p-8"
        aria-label={`Profil ${doctor.full_name}`}
      >
        {cardInner}
      </Link>
    );
  }

  return (
    <div className="group rounded-2xl border border-border/60 bg-card p-6 md:p-8">
      {cardInner}
    </div>
  );

}

function LekarzePage() {
  const { data: doctors } = useSuspenseQuery(doctorsQuery);

  return (
    <main className="bg-background">
      <section className="container-luxury py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Zespół kliniki
          </p>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
            Lekarze i specjaliści
          </h1>
          <p className="mt-5 text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            Dziesięć lat doświadczenia w premium klinikach Warszawy — ten sam standard
            opieki w Siedlcach. Każda terapia projektowana indywidualnie, z naciskiem
            na bezpieczeństwo i przewidywalny efekt.
          </p>
        </div>

        {doctors.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            Lista zespołu wkrótce zostanie zaktualizowana.
          </p>
        ) : (
          <ul className="mt-14 grid gap-10 md:mt-20 md:grid-cols-2 lg:gap-14">
            {doctors.map((d) => (
              <li key={d.id}>
                <DoctorCard doctor={d} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-16 flex justify-center md:mt-20">
          <Link
            to="/konsultacja"
            className="inline-flex h-12 items-center justify-center rounded-md bg-ink px-8 text-sm tracking-wide text-alabaster transition hover:bg-ink/90"
          >
            Umów konsultację
          </Link>
        </div>
      </section>
    </main>
  );
}

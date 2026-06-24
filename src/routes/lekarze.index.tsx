import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listActiveDoctors } from "@/lib/doctors.functions";

const doctorsQuery = queryOptions({
  queryKey: ["public-doctors"],
  queryFn: () => listActiveDoctors(),
  staleTime: 5 * 60_000,
});

export const Route = createFileRoute("/lekarze/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(doctorsQuery),
  head: () => ({
    meta: [
      { title: "Lekarze i specjaliści — Beauty & Mind Clinic Siedlce" },
      {
        name: "description",
        content:
          "Zespół Beauty & Mind Clinic w Siedlcach — lekarze i specjaliści medycyny estetycznej z warszawskim doświadczeniem.",
      },
      { property: "og:title", content: "Lekarze i specjaliści — Beauty & Mind Clinic" },
      {
        property: "og:description",
        content:
          "Poznaj zespół kliniki w Siedlcach — kompetencje, specjalizacje i doświadczenie z premium klinik warszawskich.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LekarzePage,
  errorComponent: ({ error }) => (
    <main className="bg-background">
      <section className="container-luxury py-20 text-center">
        <p className="text-sm text-muted-foreground">
          Nie udało się załadować listy lekarzy: {error.message}
        </p>
      </section>
    </main>
  ),
  notFoundComponent: () => (
    <main className="bg-background">
      <section className="container-luxury py-20 text-center">Nie znaleziono.</section>
    </main>
  ),
});

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

  if (doctor.slug === "halina-gabara") {
    return (
      <Link
        to="/lekarze/halina-gabara"
        className="group block rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-md md:p-8"
        aria-label="Profil lek. Haliny Gabary"
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

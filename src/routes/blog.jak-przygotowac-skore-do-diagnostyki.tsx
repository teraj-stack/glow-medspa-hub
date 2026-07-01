import { createFileRoute, Link } from "@tanstack/react-router";
import { DiagnostykaInlineCTA } from "@/components/site/DiagnostykaInlineCTA";
import { ArrowLeft } from "lucide-react";

const FAQ = [
  {
    q: "Czy przed analizą skóry mogę użyć kremu nawilżającego?",
    a: "Tak, lekki krem nawilżający rano jest w porządku. Unikaj jednak filtrów mineralnych, pudrów i makijażu w dniu badania — zaburzają obraz w kamerze wielospektralnej i pomiar nawilżenia.",
  },
  {
    q: "Ile dni przed diagnostyką odstawić retinol i kwasy?",
    a: "Retinol, tretynoinę i mocne kwasy (AHA/BHA/TCA) odstaw na 5–7 dni przed badaniem. Skóra po ich działaniu jest przejściowo bardziej zaczerwieniona, co fałszuje ocenę stanu naczyń i bariery.",
  },
  {
    q: "Czy opalona skóra dyskwalifikuje z badania?",
    a: "Nie dyskwalifikuje, ale zmienia interpretację przebarwień i utrudnia planowanie zabiegów laserowych. Optymalnie odczekaj 3–4 tygodnie po intensywnej ekspozycji na słońce.",
  },
  {
    q: "Czy mogę przyjść po zabiegu z toksyną botulinową lub kwasem hialuronowym?",
    a: "Tak, ale poinformuj o tym przed badaniem — uwzględniamy to w interpretacji napięcia mięśniowego i objętości. Sama diagnostyka jest bezpieczna po każdym takim zabiegu.",
  },
];

export const Route = createFileRoute("/blog/jak-przygotowac-skore-do-diagnostyki")({
  head: () => ({
    meta: [
      { title: "Jak przygotować skórę do diagnostyki — 7 dni krok po kroku | BMClinics" },
      {
        name: "description",
        content:
          "Retinol, kwasy, opalanie, makijaż — co odstawić i kiedy, żeby analiza skóry twarzy dała wiarygodny wynik. Praktyczna lista na 7 dni przed badaniem.",
      },
      { property: "og:title", content: "Jak przygotować skórę do diagnostyki — checklist na 7 dni" },
      { property: "og:description", content: "Praktyczna lista przygotowania do analizy skóry twarzy." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://bmclinics.ai/blog/jak-przygotowac-skore-do-diagnostyki" },
      { property: "og:locale", content: "pl_PL" },
    ],
    links: [{ rel: "canonical", href: "https://bmclinics.ai/blog/jak-przygotowac-skore-do-diagnostyki" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Article,
});

function Article() {
  return (
    <>
      <section className="bg-secondary/40 py-12 md:py-20">
        <div className="container-luxury max-w-3xl">
          <Link to="/diagnostyka-skory-warszawa" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Diagnostyka skóry
          </Link>
          <h1 className="mt-6 font-serif text-ink">Jak przygotować skórę do diagnostyki — 7 dni krok po kroku</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Analiza skóry twarzy jest tak dokładna, jak stan skóry w dniu badania. Kilka drobnych decyzji w tygodniu poprzedzającym wizytę
            decyduje o tym, czy zobaczymy Twoją skórę „taką, jaka jest”, czy zafałszowaną kosmetyką.
          </p>
        </div>
      </section>

      <article className="container-luxury max-w-3xl space-y-8 py-16 md:py-24">
        <section>
          <h2 className="font-serif text-2xl text-ink">7 dni przed: retinoidy i mocne kwasy</h2>
          <p className="mt-3 text-muted-foreground">
            Retinol, tretynoina, kwas glikolowy, migdałowy w wysokich stężeniach — wszystko, co przyspiesza złuszczanie — zostaw w szafce
            na tydzień. Skóra po nich jest bardziej zaczerwieniona, a warstwa rogowa cieńsza, co zawyża wynik naczyniowy i zaniża pomiar bariery.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">3 dni przed: peelingi, mikrodermabrazja, sauna</h2>
          <p className="mt-3 text-muted-foreground">
            Każdy zabieg mechanicznie lub termicznie stymulujący skórę zmienia ukrwienie i nawilżenie. Diagnostyka po saunie pokaże inną skórę
            niż ta, z którą żyjesz na co dzień — a chcemy zobaczyć obraz reprezentatywny.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">24 godziny przed: nawodnienie i sen</h2>
          <p className="mt-3 text-muted-foreground">
            Wypij 1,5–2 l wody, śpij minimum 7 godzin, zrezygnuj z alkoholu. Odwodnienie widać w kamerze wielospektralnej jako spłycone
            drobne linie i podkrążone oczy — objawy, których nie chcemy „doliczyć” do prawdziwego stanu skóry.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">W dniu badania: przyjdź bez makijażu</h2>
          <p className="mt-3 text-muted-foreground">
            Bez podkładu, pudru, korektora, kremów BB/CC. Delikatne oczyszczenie rano żelem lub mleczkiem — bez peelingu. Filtr przeciwsłoneczny
            możesz nałożyć, jeśli musisz wyjść z domu; zdejmiemy go przed pomiarem.
          </p>
        </section>

        <DiagnostykaInlineCTA />

        <section>
          <h2 className="font-serif text-2xl text-ink">Czego nie musisz zmieniać</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Leków przewlekłych — nigdy nie odstawiaj ich samodzielnie.</li>
            <li>Antykoncepcji hormonalnej — jej obraz w skórze jest częścią diagnozy.</li>
            <li>Codziennej pielęgnacji nawilżającej (bez aktywów) — chcemy widzieć skórę w Twoim rytmie.</li>
          </ul>
        </section>

        <section aria-labelledby="faq" className="border-t border-border/60 pt-10">
          <h2 id="faq" className="font-serif text-2xl text-ink">Najczęstsze pytania przed diagnostyką</h2>
          <div className="mt-6 space-y-6">
            {FAQ.map((f) => (
              <div key={f.q}>
                <h3 className="font-medium text-ink">{f.q}</h3>
                <p className="mt-2 text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <DiagnostykaInlineCTA variant="safety" />
      </article>
    </>
  );
}

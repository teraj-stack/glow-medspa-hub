import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getNapSettings } from "@/lib/nap.functions";

const napQuery = queryOptions({
  queryKey: ["nap-settings"],
  queryFn: () => getNapSettings(),
  staleTime: 10 * 60_000,
  gcTime: 60 * 60_000,
});

export { napQuery };

/**
 * NAP (Name, Address, Phone) block — spójne dane cytowań, ta sama treść
 * którą wpisujemy do Google Business Profile, ZnanyLekarz, PKT itd.
 * Renderowany w stopce; ma stabilne selectory dla SEO.
 */
export function NapBlock({ variant = "footer" }: { variant?: "footer" | "inline" }) {
  const { data: nap } = useSuspenseQuery(napQuery);
  const isFooter = variant === "footer";
  const muted = isFooter ? "text-alabaster/80" : "text-muted-foreground";
  const heading = isFooter ? "text-champagne" : "text-champagne";
  return (
    <address
      className={`not-italic text-sm leading-relaxed ${muted}`}
      itemScope
      itemType="https://schema.org/MedicalClinic"
      data-testid="nap-block"
    >
      <meta itemProp="url" content={nap.website} />
      <div className={`text-xs uppercase tracking-[0.3em] ${heading}`}>Kontakt · NAP</div>
      <div className="mt-3 font-medium" itemProp="name">
        {nap.business_name}
      </div>
      <div
        className="mt-1"
        itemProp="address"
        itemScope
        itemType="https://schema.org/PostalAddress"
      >
        <div itemProp="streetAddress">{nap.street_address}</div>
        <div>
          <span itemProp="postalCode">{nap.postal_code}</span>{" "}
          <span itemProp="addressLocality">{nap.city}</span>
          {nap.region ? (
            <>
              , <span itemProp="addressRegion">{nap.region}</span>
            </>
          ) : null}
        </div>
        <meta itemProp="addressCountry" content={nap.country_code} />
      </div>
      {nap.phone ? (
        <div className="mt-1">
          tel:{" "}
          <a
            href={`tel:${(nap.phone_e164 ?? nap.phone).replace(/\s+/g, "")}`}
            className="underline decoration-champagne/40 underline-offset-4 hover:decoration-champagne"
            itemProp="telephone"
          >
            {nap.phone}
          </a>
        </div>
      ) : null}
      {nap.email ? (
        <div className="mt-1">
          e-mail:{" "}
          <a
            href={`mailto:${nap.email}`}
            className="underline decoration-champagne/40 underline-offset-4 hover:decoration-champagne"
            itemProp="email"
          >
            {nap.email}
          </a>
        </div>
      ) : null}
      {nap.hours_json.length > 0 ? (
        <div className="mt-3">
          <div className={`text-xs uppercase tracking-[0.25em] ${heading}`}>Godziny</div>
          <ul className="mt-1 space-y-0.5">
            {nap.hours_json.map((h, i) => (
              <li key={i}>
                {h.day}: {h.opens}–{h.closes}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {nap.google_maps_url ? (
        <a
          href={nap.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block underline decoration-champagne/40 underline-offset-4 hover:decoration-champagne"
        >
          Zobacz na mapie →
        </a>
      ) : null}
    </address>
  );
}

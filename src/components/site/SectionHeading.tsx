import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  center,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.3em] text-champagne">{eyebrow}</div>
      )}
      <Tag className="gold-line max-w-3xl font-serif text-ink">{title}</Tag>
      {description && (
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
      )}
    </div>
  );
}

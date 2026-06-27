/**
 * Cloudflare Image Resizing helper.
 *
 * Wraps a source image URL with `/cdn-cgi/image/<options>/<source>` so that
 * Cloudflare resizes, recompresses and serves modern formats (AVIF/WebP via
 * `format=auto`) on the fly. Origin pliki w Supabase Storage potrafią ważyć
 * setki kB — przepuszczenie ich przez transformer w praktyce daje 70–90%
 * oszczędności bajtów i pozwala dostarczać sensowne wymiary zamiast
 * skalować w przeglądarce.
 *
 * Działa na każdym zone'ie Cloudflare, na którym włączono Image Resizing.
 * W dev/preview (gdy `import.meta.env.PROD` jest false albo brak okna)
 * zwracamy oryginalny URL — lokalny serwer Vite nie ma `/cdn-cgi/image/`.
 */

export type CfImageOptions = {
  width: number;
  height?: number;
  quality?: number;
  /** `cover` (default) zachowuje proporcje i przycina, `contain` mieści całość. */
  fit?: "cover" | "contain" | "scale-down" | "crop" | "pad";
  /** Wymuszony format; domyślnie `auto` (AVIF/WebP/JPG zależnie od UA). */
  format?: "auto" | "avif" | "webp" | "jpeg";
  dpr?: 1 | 2 | 3;
};

const ENABLED =
  // Włączone tylko w produkcyjnym buildzie i tylko w przeglądarce —
  // w SSR nie znamy origin, więc bezpieczniej zwrócić oryginalny URL.
  typeof window !== "undefined" &&
  (import.meta.env.PROD || import.meta.env.VITE_CF_IMAGES === "1");

function buildOptions(o: CfImageOptions): string {
  const parts = [
    `width=${o.width}`,
    o.height ? `height=${o.height}` : null,
    `fit=${o.fit ?? "cover"}`,
    `format=${o.format ?? "auto"}`,
    `quality=${o.quality ?? 82}`,
    o.dpr && o.dpr > 1 ? `dpr=${o.dpr}` : null,
  ].filter(Boolean);
  return parts.join(",");
}

/**
 * Zwraca URL przepuszczony przez Cloudflare Image Resizing.
 * Dla blob:/data: i lokalnych ścieżek (`/...`) oraz w dev — passthrough.
 */
export function cfImage(src: string | null | undefined, opts: CfImageOptions): string {
  if (!src) return "";
  if (!ENABLED) return src;
  if (src.startsWith("blob:") || src.startsWith("data:")) return src;
  if (src.startsWith("/cdn-cgi/image/")) return src;
  return `/cdn-cgi/image/${buildOptions(opts)}/${src}`;
}

/** Buduje `srcSet` dla retiny (1x + 2x). */
export function cfImageSrcSet(
  src: string | null | undefined,
  opts: CfImageOptions,
): string | undefined {
  if (!src || !ENABLED) return undefined;
  if (src.startsWith("blob:") || src.startsWith("data:")) return undefined;
  const x1 = cfImage(src, { ...opts, dpr: 1 });
  const x2 = cfImage(src, { ...opts, dpr: 2 });
  return `${x1} 1x, ${x2} 2x`;
}

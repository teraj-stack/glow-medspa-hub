import { ImgHTMLAttributes } from "react";

type Props = {
  avifUrl?: string;
  webpUrl?: string;
  fallbackUrl: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "className">;

/**
 * Optimized hero <picture> with AVIF + WebP sources and JPEG/PNG fallback.
 * Marks the image as the LCP candidate when `eager` is true
 * (`loading="eager"`, `fetchpriority="high"`, `decoding="async"`).
 * Pair with a `<link rel="preload" as="image" type="image/avif" href={avifUrl}>`
 * in the route's `head().links` to shave further ms off LCP.
 */
export function HeroPicture({
  avifUrl,
  webpUrl,
  fallbackUrl,
  alt,
  width,
  height,
  className,
  imgClassName,
  eager,
  ...imgProps
}: Props) {
  return (
    <picture className={className}>
      {avifUrl ? <source srcSet={avifUrl} type="image/avif" /> : null}
      {webpUrl ? <source srcSet={webpUrl} type="image/webp" /> : null}
      <img
        src={fallbackUrl}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        className={imgClassName}
        {...imgProps}
      />
    </picture>
  );
}

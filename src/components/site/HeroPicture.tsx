import { ImgHTMLAttributes } from "react";
import { Watermark } from "./Watermark";

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
  /** Hide the Bujok Medical watermark overlay (default: shown). */
  noWatermark?: boolean;
  watermarkSize?: "sm" | "md" | "lg";
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "className">;

/**
 * Optimized hero <picture> with AVIF + WebP sources and JPEG/PNG fallback.
 * Marks the image as the LCP candidate when `eager` is true.
 * Renders a Bujok Medical watermark in the top-right unless `noWatermark` is set.
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
  noWatermark,
  watermarkSize = "md",
  ...imgProps
}: Props) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <picture>
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
      {!noWatermark && <Watermark size={watermarkSize} />}
    </div>
  );
}

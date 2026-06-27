import { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Watermark } from "./Watermark";
import { cfImage } from "@/lib/cf-image";

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
  /**
   * Build a width-descriptor srcSet via Cloudflare Image Resizing so phones
   * download a smaller variant. Provide one `sizes` value that matches the
   * rendered slot, e.g. `(max-width: 768px) 100vw, 600px`.
   */
  responsiveWidths?: number[];
  sizes?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "className" | "sizes">;

function buildSrcSet(src: string, widths: number[], format: "avif" | "webp" | "auto"): string {
  return widths
    .map((w) => `${cfImage(src, { width: w, format })} ${w}w`)
    .join(", ");
}

/**
 * Optimized hero <picture> with AVIF + WebP sources and JPEG/PNG fallback.
 * Marks the image as the LCP candidate when `eager` is true. When
 * `responsiveWidths` is set, emits width-based srcSet via the CF image
 * transformer so mobile devices fetch a smaller variant.
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
  responsiveWidths,
  sizes,
  ...imgProps
}: Props) {
  const useResponsive = !!(responsiveWidths && responsiveWidths.length > 0);
  return (
    <div className={cn("relative", className)}>
      <picture>
        {avifUrl ? (
          <source
            srcSet={
              useResponsive
                ? buildSrcSet(avifUrl, responsiveWidths!, "avif")
                : avifUrl
            }
            sizes={useResponsive ? sizes : undefined}
            type="image/avif"
          />
        ) : null}
        {webpUrl ? (
          <source
            srcSet={
              useResponsive
                ? buildSrcSet(webpUrl, responsiveWidths!, "webp")
                : webpUrl
            }
            sizes={useResponsive ? sizes : undefined}
            type="image/webp"
          />
        ) : null}
        <img
          src={fallbackUrl}
          srcSet={
            useResponsive
              ? buildSrcSet(fallbackUrl, responsiveWidths!, "auto")
              : undefined
          }
          sizes={useResponsive ? sizes : undefined}
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

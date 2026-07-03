import { ImgHTMLAttributes, useMemo } from "react";
import { cfImage, cfImageSrcSet } from "@/lib/cf-image";

type Props = {
  src: string;
  alt: string;
  /** Rendered/display width in CSS pixels. Used to size 1× variant. */
  width: number;
  /** Rendered/display height in CSS pixels. Preserves aspect + prevents CLS. */
  height: number;
  /**
   * Optional explicit width descriptors for responsive srcSet. When omitted,
   * we emit a retina (1×/2×) srcSet based on `width`.
   */
  responsiveWidths?: number[];
  sizes?: string;
  quality?: number;
  fit?: "cover" | "contain" | "scale-down" | "crop" | "pad";
  format?: "auto" | "avif" | "webp" | "jpeg";
  /**
   * When true, marks the image as LCP-friendly (eager + fetchPriority=high).
   * Use sparingly — a page should have at most one LCP candidate, which is
   * usually already handled by `HeroPicture`. Default: false (lazy).
   */
  eager?: boolean;
  className?: string;
} & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "sizes" | "alt" | "width" | "height" | "className" | "loading" | "fetchPriority"
>;

/**
 * Drop-in `<img>` that runs the source through Cloudflare Image Resizing so
 * the browser downloads a size- and format-appropriate variant instead of the
 * origin file. Emits either a width-descriptor srcSet (when
 * `responsiveWidths`/`sizes` are provided) or a retina 1×/2× srcSet.
 *
 * Nie używaj tego dla LCP hero — do tego jest `HeroPicture` z preloadem.
 */
export function CfImg({
  src,
  alt,
  width,
  height,
  responsiveWidths,
  sizes,
  quality,
  fit = "cover",
  format = "auto",
  eager = false,
  className,
  ...rest
}: Props) {
  const optimizedSrc = useMemo(
    () => cfImage(src, { width, quality, fit, format }),
    [src, width, quality, fit, format],
  );

  const srcSet = useMemo(() => {
    if (responsiveWidths && responsiveWidths.length > 0) {
      return responsiveWidths
        .map((w) => `${cfImage(src, { width: w, quality, fit, format })} ${w}w`)
        .join(", ");
    }
    return cfImageSrcSet(src, { width, quality, fit, format });
  }, [src, width, quality, fit, format, responsiveWidths]);

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={responsiveWidths && sizes ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      className={className}
      {...rest}
    />
  );
}

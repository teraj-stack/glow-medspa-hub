import { useState, useMemo, useCallback, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { cfImage } from "@/lib/cf-image";

type BlurUpImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  srcSet?: string;
  sizes?: string;
  /** Source URL used to generate the low-resolution blur placeholder. Defaults to `src`. */
  placeholderSrc?: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  /** Whether the image should be treated as the LCP candidate (no blur delay). */
  eager?: boolean;
} & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "sizes" | "alt" | "width" | "height" | "className" | "loading" | "fetchPriority"
>;

/**
 * Blur-up image placeholder.
 *
 * Renders a tiny, heavily compressed version of the image first (via
 * Cloudflare Image Resizing) with a CSS blur filter. Once the full-resolution
 * image finishes loading, the placeholder fades out smoothly. This improves
 * perceived performance and keeps the layout stable because the wrapper
 * reserves the exact aspect ratio from the provided width/height.
 */
export function BlurUpImage({
  src,
  alt,
  width,
  height,
  srcSet,
  sizes,
  placeholderSrc,
  className,
  imgClassName,
  loading = "lazy",
  fetchPriority = "auto",
  eager,
  onLoad,
  ...imgProps
}: BlurUpImageProps) {
  const [loaded, setLoaded] = useState(false);

  const aspectRatio = useMemo(
    () => ({ aspectRatio: `${width} / ${height}` }),
    [width, height],
  );

  const placeholderUrl = useMemo(() => {
    const source = placeholderSrc || src;
    // Generate a tiny, low-quality variant. The blur filter hides the artefacts.
    return cfImage(source, {
      width: 20,
      quality: 10,
      fit: "cover",
      format: "auto",
    });
  }, [placeholderSrc, src]);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      onLoad?.(event);
    },
    [onLoad],
  );

  const wrapperClass = cn(
    "relative overflow-hidden bg-muted",
    className,
  );

  const placeholderClass = cn(
    "absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out",
    loaded ? "opacity-0" : "opacity-100",
    "blur-[20px] scale-110", // scale slightly so blur edges don't show
  );

  const imageClass = cn(
    "relative block size-full object-cover transition-opacity duration-700 ease-out",
    loaded ? "opacity-100" : "opacity-0",
    imgClassName,
  );

  return (
    <div className={wrapperClass} style={aspectRatio}>
      <img
        src={placeholderUrl}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        className={placeholderClass}
        decoding="async"
      />
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : loading}
        fetchPriority={eager ? "high" : fetchPriority}
        decoding="async"
        className={imageClass}
        onLoad={handleLoad}
        {...imgProps}
      />
    </div>
  );
}

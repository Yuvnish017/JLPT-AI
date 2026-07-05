"use client";

import Image from "next/image";
import type { ImgHTMLAttributes } from "react";

export type ComicImageProps = {
  src: string;
  alt: string;
  /** "panel" = full-width reader art; "thumbnail" = cover card */
  variant?: "panel" | "thumbnail";
  className?: string;
  sizes?: string;
  priority?: boolean;
  onError?: ImgHTMLAttributes<HTMLImageElement>["onError"];
};

function isSvgSrc(src: string): boolean {
  return /\.svg(\?.*)?$/i.test(src);
}

/**
 * Comic assets may be SVG or raster (.webp).
 * SVGs use plain img (next/image blocks them in production).
 * Panels preserve intrinsic aspect ratio — no cropping.
 */
export default function ComicImage({
  src,
  alt,
  variant = "panel",
  className = "",
  sizes,
  priority,
  onError,
}: ComicImageProps) {
  if (variant === "panel") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        onError={onError}
        className={`block h-auto w-full ${className}`}
      />
    );
  }

  // Thumbnail (cover cards) — portrait-friendly frame, no crop
  if (isSvgSrc(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        onError={onError}
        className={`absolute inset-0 h-full w-full object-contain ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-contain ${className}`}
      sizes={sizes ?? "(max-width: 640px) 100vw, 320px"}
      priority={priority}
      onError={onError}
    />
  );
}

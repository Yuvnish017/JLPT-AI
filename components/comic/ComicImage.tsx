"use client";

import Image from "next/image";
import type { ImgHTMLAttributes } from "react";

export type ComicImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onError?: ImgHTMLAttributes<HTMLImageElement>["onError"];
};

function isSvgSrc(src: string): boolean {
  return /\.svg(\?.*)?$/i.test(src);
}

/**
 * Comic assets may be SVG placeholders or raster panels (.webp).
 * next/image blocks SVG optimization in production — use a plain img for SVGs.
 */
export default function ComicImage({
  src,
  alt,
  fill = false,
  className = "",
  sizes,
  priority,
  onError,
}: ComicImageProps) {
  if (isSvgSrc(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={onError}
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} onError={onError} className={className} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={onError}
    />
  );
}

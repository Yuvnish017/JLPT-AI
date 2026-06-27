"use client";

import type { ReactNode } from "react";

export type SpeechBubbleProps = {
  children: ReactNode;
  position?: "left" | "right" | "center";
  className?: string;
};

export default function SpeechBubble({
  children,
  position = "center",
  className = "",
}: SpeechBubbleProps) {
  const align =
    position === "left"
      ? "items-start text-left"
      : position === "right"
        ? "items-end text-right"
        : "items-center text-center";

  const tail =
    position === "left"
      ? "before:left-8"
      : position === "right"
        ? "before:right-8"
        : "before:left-1/2 before:-translate-x-1/2";

  return (
    <div
      className={`relative flex flex-col ${align} ${className}`}
      role="region"
      aria-label="Dialogue"
    >
      <div
        className={`relative max-w-full rounded-2xl border-2 border-slate-950/80 bg-white px-5 py-4 text-slate-900 shadow-lg shadow-black/20 before:absolute before:-bottom-2 before:h-4 before:w-4 before:rotate-45 before:border-b-2 before:border-r-2 before:border-slate-950/80 before:bg-white ${tail}`}
      >
        {children}
      </div>
    </div>
  );
}

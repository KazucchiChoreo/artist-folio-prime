import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Slideshow({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {images.map((src, i) => (
        <div
          key={src + i}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1800ms] ease-in-out",
            i === idx ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            src={src}
            alt=""
            className={cn("h-full w-full object-cover", i === idx && "animate-slow-zoom")}
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      <div className="absolute inset-0 veil pointer-events-none" />
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={cn(
                "h-[2px] transition-all duration-500",
                i === idx ? "w-12 bg-gold" : "w-6 bg-foreground/30 hover:bg-foreground/50",
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

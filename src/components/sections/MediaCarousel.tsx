"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaCard, MediaCardProps } from "@/components/ui/MediaCard";

export interface MediaCarouselProps {
  title: string;
  items: MediaCardProps[];
  headerAction?: ReactNode;
}

export function MediaCarousel({ title, items, headerAction }: MediaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const clientWidth = scrollRef.current.clientWidth;
      const scrollAmount = direction === "left" ? -clientWidth + 150 : clientWidth - 150;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  let maskStyle = "none";
  if (canScrollLeft && canScrollRight) {
    maskStyle = "linear-gradient(to right, transparent, black 10%, black 90%, transparent)";
  } else if (canScrollLeft) {
    maskStyle = "linear-gradient(to right, transparent, black 10%, black 100%)";
  } else if (canScrollRight) {
    maskStyle = "linear-gradient(to right, black 0%, black 90%, transparent)";
  }

  return (
    <section className="w-full px-8 lg:px-16 py-6 group/carousel">
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-8 border-b border-secondary pb-4 text-foreground relative">
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          {title}
        </h2>
        {headerAction && (
          <div className="flex items-center gap-4 text-[0.6875rem] font-bold">
            {headerAction}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 z-20 bg-background border border-secondary p-3 rounded-full text-foreground hover:text-primary hover:border-primary transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Scroll Container with Masking */}
        <div style={{ WebkitMaskImage: maskStyle, maskImage: maskStyle }} className="transition-all duration-300">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar"
          >
            {items.map((item, idx) => (
              <div key={idx} className="snap-start shrink-0 w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)]">
                <MediaCard {...item} />
              </div>
            ))}
          </div>
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 z-20 bg-background border border-secondary p-3 rounded-full text-foreground hover:text-primary hover:border-primary transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </section>
  );
}

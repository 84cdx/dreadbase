"use client";

import { HeroMovie } from "@/lib/tmdb";
import { useEffect, useState } from "react";

export interface HeroStats {
  label: string;
  value: string;
}

export interface HeroSectionProps {
  systemStatus?: string;
  movies?: HeroMovie[];
}

export function HeroSection({
  systemStatus = "SYSTEM_STATUS",
  movies = [],
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [movies]);

  if (!movies || movies.length === 0) {
    return <section className="relative h-[600px] w-full bg-surface overflow-hidden" />;
  }

  return (
    <section className="relative h-[600px] w-full bg-surface overflow-hidden group">
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {/* Progress Bar under navbar */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-secondary/20 z-30 opacity-100">
        <div
          className="h-full bg-primary"
          key={`progress-${currentIndex}`}
          style={{ animation: 'progress 10s linear forwards' }}
        />
      </div>

      {movies.map((movie, index) => {
        const stats: HeroStats[] = [
          { label: "TMDB_RATING", value: movie.rating },
          { label: "RELEASE_YEAR", value: movie.year },
        ];

        return (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-70"
              style={{ objectPosition: "center 20%" }}
              src={movie.backdropUrl}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="max-w-2xl">
                  <span className="text-primary font-bold text-[0.6875rem] tracking-[0.3em] uppercase block mb-2">
                    {systemStatus} // SCAN {index + 1}/{movies.length}
                  </span>
                  <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-4 leading-none text-foreground">
                    {movie.title}
                  </h1>
                  <p className="text-foreground text-sm max-w-md opacity-80 leading-relaxed line-clamp-3">
                    {movie.overview}
                  </p>
                </div>

                <div className="flex gap-12 border-l border-secondary pl-8 shrink-0">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-right">
                      <div className="text-[0.6rem] text-foreground opacity-50 uppercase tracking-widest">
                        {stat.label}
                      </div>
                      <div className="text-3xl font-black text-primary hover:scale-105 transition-all duration-300">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

"use client";

import { Star, Calendar } from "lucide-react";
import { SpotlightGame } from "@/lib/igdb";

interface GameOfDayProps {
  game: SpotlightGame | null;
}

export function GameOfDay({ game }: GameOfDayProps) {
  if (!game) return null;

  return (
    <div className="md:col-span-3 group relative overflow-hidden bg-surface border border-secondary rounded-2xl flex flex-col md:flex-row items-stretch shadow-[0_10px_60px_rgba(0,0,0,0.6)] min-h-[480px] transition-all hover:border-primary/40">

      {/* Background Atmosphere Scrim */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-surface)_0%,var(--color-surface-80)_40%,transparent_100%)] z-10" />
        {game.screenshotUrl && game.screenshotUrl.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={game.screenshotUrl}
            alt="Atmospheric Layer"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-background/50" />
        )}
      </div>

      {/* Massive Poster Section - FIXED: 340px and static */}
      <div className="relative z-20 w-full md:flex-[0_0_340px] bg-background">
        <div className="h-full w-full relative overflow-hidden border-r border-secondary group-hover:border-primary transition-colors duration-500">
          {game.coverUrl && game.coverUrl.length > 0 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={game.coverUrl}
              alt={game.name}
              className="w-full h-full object-cover transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-hover opacity-20 uppercase font-black tracking-widest text-[0.5rem]">
              MISSING_VISUAL_RECORDS
            </div>
          )}
          <div className="absolute top-3 left-3 bg-primary px-4 py-1.5 rounded-lg text-[0.65rem] font-black text-white shadow-[0_0_20px_rgba(208,0,0,0.5)] tracking-[0.2em] uppercase z-30">
            STAFF_PICK
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-20 flex-1 p-8 md:p-12 flex flex-col justify-center bg-surface/40 backdrop-blur-sm">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-lg text-[0.6rem] font-black tracking-widest uppercase flex items-center gap-2">
              <Star className="w-3 h-3 fill-primary" /> CRITICAL_SPOTLIGHT
            </span>
            <span className="text-[0.65rem] text-foreground opacity-30 font-bold uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> {game.releaseLabel}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-6 transition-colors duration-300">
            {game.name}
          </h2>
          <p className="text-sm md:text-base opacity-70 leading-relaxed font-light line-clamp-4 italic max-w-xl">
            "{game.summary}"
          </p>
        </div>

        {/* Dynamic Analytics / Rating */}
        <div className="mb-10 max-w-md">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-foreground opacity-30">ARCHIVE_QUALITY_INDEX</span>
            <span className="text-2xl font-black text-primary tracking-tighter font-mono">{game.ratingLabel}</span>
          </div>
          <div className="h-2.5 w-full bg-surface-hover border border-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary relative transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(208,0,0,0.4)]"
              style={{ width: `${game.rating}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Massive Actions */}
        <div className="flex gap-4 max-w-sm">
          <a href={`/game/${game.id}`} className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl text-[0.7rem] font-black uppercase tracking-[0.2em] hover:bg-primary-hover active:scale-95 transition-all shadow-[0_10px_30px_rgba(208,0,0,0.2)] text-center">
            LEARN MORE
          </a>
          <button className="flex-1 border border-secondary text-foreground py-4 rounded-xl text-[0.7rem] font-black uppercase tracking-[0.2em] hover:bg-surface-hover active:scale-95 transition-all">
            VAULT
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

export interface BannerPanelProps {
  bgUrl: string;
  badgeText: string;
  title: string;
  subtitle: string;
  pulseBadge?: boolean;
}

export function BannerPanel({ bgUrl, badgeText, title, subtitle, pulseBadge = false }: BannerPanelProps) {
  return (
    <div className="relative group cursor-pointer h-72 bg-gradient-to-br from-surface to-background border border-secondary/40 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 transition-transform duration-700 group-hover:scale-105 grayscale"
        style={{ backgroundImage: `url('${bgUrl}')` }}
      />
      <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
        <span className={`text-[0.6rem] font-black tracking-[0.5em] text-primary mb-3 block ${pulseBadge ? "animate-pulse" : ""}`}>
          {badgeText}
        </span>
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{title}</h3>
        <p className="text-[0.7rem] opacity-40 uppercase tracking-widest font-bold">{subtitle}</p>
      </div>
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

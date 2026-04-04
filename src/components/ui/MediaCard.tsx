"use client";

import { Star } from "lucide-react";

export interface MediaCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  rating?: number;
  badge?: string;
  variant?: "movie" | "game";
  description?: string;
  onClick?: () => void;
}

export function MediaCard({
  title,
  subtitle,
  imageUrl,
  rating,
  badge,
  variant = "movie",
  onClick,
}: MediaCardProps) {
  // Ensure we don't pass empty string to src
  const hasImage = imageUrl && imageUrl.length > 0;

  return (
    <div 
      className="group cursor-pointer flex flex-col h-full transition-all active:scale-95" 
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] bg-surface-hover mb-3 overflow-hidden border border-transparent rounded-xl group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(208,0,0,0.15)] transition-all">
        {hasImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-background/50 opacity-20">
            <span className="text-4xl font-black mb-2">?</span>
            <span className="text-[0.45rem] font-black tracking-widest uppercase">IMAGE_NOT_AVAILABLE</span>
          </div>
        )}
        
        {badge && (
          <div className="absolute top-2 left-2 bg-primary px-2 py-0.5 rounded-lg text-[0.55rem] font-black text-primary-foreground shadow-lg tracking-widest uppercase">
            {badge}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="text-[0.6rem] font-black uppercase tracking-widest text-primary">SCAN_DETAILS</div>
        </div>
      </div>

      <div className="flex flex-col flex-1 transform transition-transform group-hover:translate-x-1">
        <h3 className="text-[0.75rem] font-black leading-tight uppercase tracking-tighter mb-1 text-foreground">
          {title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[0.6rem] opacity-30 font-bold uppercase tracking-widest">
            {subtitle}
          </span>
          
          {rating !== undefined && rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-primary text-primary" />
              <span className="text-[0.65rem] font-black text-primary">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

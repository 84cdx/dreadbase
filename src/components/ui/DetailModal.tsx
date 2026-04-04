"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

export interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    subtitle: string;
    imageUrl: string;
    description?: string;
    rating?: number;
    badge?: string;
    variant?: "movie" | "game";
  } | null;
}

export function DetailModal({ isOpen, onClose, data }: DetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted || !data) return null;

  const hasImage = data.imageUrl && data.imageUrl.length > 0;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
      />
      <div className={`relative w-full max-w-2xl bg-surface border border-secondary rounded-2xl overflow-hidden transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95 shadow-[0_0_100px_rgba(208,0,0,0.2)]"}`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-background/50 hover:bg-primary/20 text-foreground hover:text-primary rounded-full backdrop-blur-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
          <div className="w-full md:w-2/5 aspect-[2/3] relative bg-surface-hover">
            {hasImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.imageUrl} alt={data.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center opacity-20 bg-background/40">
                <span className="text-6xl font-black mb-4">?</span>
                <span className="text-[0.6rem] font-black tracking-[0.3em] uppercase">IMAGE_NOT_IN_DATABASE</span>
              </div>
            )}
          </div>
          <div className="flex-1 p-8 flex flex-col">
            <span className="text-primary font-black text-[0.6rem] tracking-widest uppercase mb-1">{data.variant || "OBJECT"}</span>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 leading-none">{data.title}</h2>
            <p className="text-[0.65rem] opacity-40 uppercase tracking-widest mb-6">{data.subtitle}</p>
            
            <div className="mb-8 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
              <h4 className="text-[0.6rem] font-black uppercase tracking-widest text-primary mb-2 border-b border-secondary pb-1">DATABASE_SYNOPSIS</h4>
              <p className="text-sm opacity-70 leading-relaxed italic font-light">{data.description || "No archival data found for this entry."}</p>
            </div>

            <div className="mt-auto flex gap-4">
              <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-[0.6rem] font-black uppercase tracking-widest hover:bg-primary-hover shadow-lg active:scale-95 transition-all">LOG ENTRY</button>
              <button className="flex-1 border border-secondary text-foreground py-3 rounded-xl text-[0.6rem] font-black uppercase tracking-widest hover:bg-surface-hover active:scale-95 transition-all">VAULT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

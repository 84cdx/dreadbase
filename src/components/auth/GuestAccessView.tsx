"use client";

import { useState } from "react";
import Link from "next/link";
import { LoginModal } from "./LoginModal";
import { ShieldAlert } from "lucide-react";

interface GuestAccessViewProps {
  title: string;
  subtitle: string;
}

export function GuestAccessView({ title, subtitle }: GuestAccessViewProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface via-black to-black relative overflow-hidden">
      {/* Background ambient effect */}

      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_30px_rgba(0,0,0,0.08)] relative z-10 overflow-hidden">

        <div className="px-8 pt-11 pb-9">
          {/* Header styled exactly like LoginModal */}
          <div className="mb-3 text-left">
            <p className="text-red-600 text-[0.6rem] font-black tracking-[0.4em] uppercase mb-2">
              DREADBASE // AUTH
            </p>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-tight justify-left flex gap-1.5">
              ACCESS<br />
              <span className="text-red-600">DENIED</span>
            </h2>
          </div>

          <p className="text-neutral-500 text-[0.65rem] font-bold uppercase tracking-[0.15em] mb-5 leading-relaxed text-left py-1">
            {subtitle}
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-black text-[0.7rem] uppercase tracking-[0.2em] py-3.5 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(185,28,28,0.4)] active:scale-[0.98] cursor-pointer"
            >
              INITIALIZE_ACCESS
            </button>

            <Link
              href="/"
              className="flex items-center justify-center w-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white/60 hover:text-white font-black text-[0.7rem] uppercase tracking-[0.15em] py-3.5 rounded-lg transition-all active:scale-[0.98]"
            >
              BACK_TO_HOME
            </Link>
          </div>

          <p className="mt-6 text-center text-[0.55rem] text-neutral-700 uppercase tracking-[0.2em] leading-relaxed italic">
            CONNECTION_PENDING // SECTOR_LOCKED
          </p>
        </div>
      </div>

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 border-t border-secondary/30 bg-black shadow-[0_-20px_50px_rgba(0,0,0,0.5)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-12 text-[0.65rem] tracking-[0.25em] uppercase font-black text-foreground opacity-40">
        <div className="flex flex-col md:flex-row w-full md:w-auto items-center md:items-start gap-4 md:gap-12 border-b md:border-0 border-neutral-800/50 pb-8 md:pb-0">
          <Link href="/about" className="w-full md:w-auto text-center md:text-left py-3 md:py-0 border-b md:border-0 border-neutral-800/50 hover:text-primary hover:opacity-100 transition-all">ABOUT_DREADBASE</Link>
          <Link href="/impressum" className="w-full md:w-auto text-center md:text-left py-3 md:py-0 border-b md:border-0 border-neutral-800/50 hover:text-primary hover:opacity-100 transition-all">IMPRESSUM</Link>
          <Link href="/contact" className="w-full md:w-auto text-center md:text-left py-3 md:py-0 border-b md:border-0 border-neutral-800/50 hover:text-primary hover:opacity-100 transition-all">CONTACT_TERMINAL</Link>
          <Link href="/privacy" className="w-full md:w-auto text-center md:text-left py-3 md:py-0 last:border-0 hover:text-primary hover:opacity-100 transition-all">PRIVACY_PROTOCOL</Link>
        </div>
        <div className="text-center md:text-right">
          <span className="block mb-1">© 2026 DREADBASE_INTEL</span>
          <span className="text-[0.55rem] opacity-50 tracking-tighter italic">STATUS: FULLY_ENCRYPTED // CONNECTION_STABLE</span>
        </div>
      </div>
    </footer>
  );
}

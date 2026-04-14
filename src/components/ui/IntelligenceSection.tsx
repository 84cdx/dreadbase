"use client";

import Link from "next/link";

interface NewsCardProps {
  imageUrl: string;
  headline: string;
  teaser: string;
  link: string;
}

function NewsCard({ imageUrl, headline, teaser, link }: NewsCardProps) {
  return (
    <div className="relative h-64 md:h-72 border border-neutral-800 rounded-xl overflow-hidden group hover:border-primary/50 transition-all duration-500 bg-black">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={headline}
          className="w-full h-full object-cover grayscale brightness-[0.15] transition-all duration-700 group-hover:brightness-[0.2] group-hover:scale-110"
        />
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
      </div>

      {/* Content Overlay Layer */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-end">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-2 leading-tight drop-shadow-lg">
            {headline}
          </h3>
          <p className="text-[0.65rem] md:text-xs text-foreground/60 uppercase tracking-[0.25em] font-bold leading-relaxed mb-6 max-w-[90%] drop-shadow-md">
            {teaser}
          </p>

          <Link
            href={link}
            className="inline-block py-2.5 px-6 bg-transparent border border-neutral-700 text-foreground/40 font-black text-[0.55rem] uppercase tracking-[0.3em] hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-lg backdrop-blur-sm"
          >
            READ FULL REPORT
          </Link>
        </div>
      </div>
    </div>
  );
}

export function IntelligenceSection() {
  return (
    <section className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-secondary/15 border-y border-secondary/10 pt-12 pb-6 mb-0">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-[0.6rem] md:text-[0.9rem] font-black text-primary uppercase tracking-[0.4em] mb-2 flex flex-col md:flex-row items-center gap-2 md:gap-4">
            LATEST INTELLIGENCE <span className="hidden md:inline text-foreground opacity-10">//</span>
            <span className="text-foreground/40">FIELD REPORTS</span>
          </h2>
          <div className="h-px w-16 bg-primary/30 mx-auto md:mx-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <NewsCard
            imageUrl="/images/Foto_1.webp"
            headline="SCARY MOVIE 6 // TRAILER"
            teaser="Watch the first classified footage of the upcoming franchise reboot."
            link="#"
          />

          <NewsCard
            imageUrl="/images/manga.webp"
            headline="MANGA EXPANSION"
            teaser="Integrating dark literature and manga databases into the ecosystem soon."
            link="#"
          />
        </div>
      </div>
    </section>
  );
}




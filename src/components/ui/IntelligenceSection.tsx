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
    <Link
      href={link}
      className="block group outline-none focus:ring-0 no-underline"
    >
      <div className="relative h-64 md:h-72 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-500 bg-black cursor-pointer group-hover:border-neutral-700 group-hover:scale-[1.01] group-focus:border-primary/40 group-focus:ring-1 group-focus:ring-primary/20">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={headline}
            className="w-full h-full object-cover grayscale brightness-[0.2] transition-all duration-700 group-hover:brightness-[0.28] group-hover:scale-105"
          />
          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
        </div>

        {/* Content Overlay Layer */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-end">
          {/* Status Label - Top Right */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 border border-primary/40 rounded-lg text-[0.6rem] font-mono font-bold tracking-[0.2em] text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200 uppercase z-20">
            OPEN_FILE
          </div>

          <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-2 leading-tight group-hover:text-white/80 transition-colors">
              {headline}
            </h3>
            <p className="text-[0.65rem] md:text-xs text-foreground/50 uppercase tracking-[0.25em] font-bold leading-relaxed max-w-[85%] flex items-center">
              {teaser.replace(/ >>$/, "")}
              <span className="inline-block ml-2 text-5xl text-white/30 group-hover:text-primary group-hover:translate-x-1.5 transition-transform-colors duration-300">
                &raquo;
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
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
            link="/news/scary-movie"
          />

          <NewsCard
            imageUrl="/images/manga.webp"
            headline="MANGA EXPANSION"
            teaser="Integrating dark literature and manga databases into the ecosystem soon."
            link="/news/manga-expansion"
          />
        </div>
      </div>
    </section>
  );
}




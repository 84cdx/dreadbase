import { HeroMovie } from "@/lib/tmdb";

export interface HeroStats {
  label: string;
  value: string;
}

export interface HeroSectionProps {
  systemStatus?: string;
  // Static fallback props (still supported for non-dynamic use)
  title?: string;
  description?: string;
  backgroundImageUrl?: string;
  stats?: HeroStats[];
  // Dynamic TMDB data – if provided, overrides the static props above
  heroMovie?: HeroMovie | null;
}

const FALLBACK_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDMk58Ww_TjKX7AZh8AAXR1bf5-ztGo1Alp4bfDhcdUAzrdDFt9JMcfwFSvryA5FpBbmOZljFZ4psB53Z1X5Lltvc7Ejotw1VPOh8tvjIL6o-904gPXScKI5oGV_THvFITSf5zxWBi-sVEae6UBLI0NXam0RbinyjGvhfd3qg6njttAdnE99AFw55LPIDP2BcjcCmBk4CLr3X9tViZb-gaNhI_rAB98HL2esYvIiLJGSERkDNFWUwmTNae74E3DNr80BJon1-LLnmFk";

export function HeroSection({
  systemStatus = "SYSTEM_STATUS // ACTIVE_TRENDS",
  title: staticTitle,
  description: staticDescription,
  backgroundImageUrl: staticBg,
  stats: staticStats,
  heroMovie,
}: HeroSectionProps) {
  // Resolve dynamic vs. static data
  const title = heroMovie?.title ?? staticTitle ?? "DREADBASE";
  const description = heroMovie?.overview ?? staticDescription ?? "";
  const bgUrl = (heroMovie?.backdropUrl || staticBg) ?? FALLBACK_BG;

  const stats: HeroStats[] = heroMovie
    ? [
        { label: "TMDB_RATING", value: heroMovie.rating },
        { label: "RELEASE_YEAR", value: heroMovie.year },
      ]
    : (staticStats ?? []);

  return (
    <section className="relative h-[500px] w-full bg-surface overflow-hidden">
      {/* Backdrop image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        src={bgUrl}
      />

      {/* Gradient overlay – dark at bottom, transparent at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

      {/* Inner Container aligned with max-w-7xl */}
      <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <span className="text-primary font-bold text-[0.6875rem] tracking-[0.3em] uppercase block mb-2">
              {systemStatus}
            </span>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-4 leading-none text-foreground">
              {title}
            </h1>
            <p className="text-foreground text-sm max-w-md opacity-80 leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          {stats.length > 0 && (
            <div className="flex gap-12 border-l border-secondary pl-8 shrink-0">
              {stats.map((stat, index) => (
                <div key={index} className="text-right">
                  <div className="text-[0.6rem] text-foreground opacity-50 uppercase tracking-widest">
                    {stat.label}
                  </div>
                  <div className="text-3xl font-black text-primary hover:scale-105 transition-all duration-300">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

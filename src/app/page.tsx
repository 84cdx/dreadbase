import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { CommunityFeed, FeedItemData } from "@/components/sections/CommunityFeed";
import { MediaCarousel } from "@/components/sections/MediaCarousel";
import { GameOfDay } from "@/components/sections/GameOfDay";
import { BannerSection } from "@/components/ui/BannerSection";
import { HeroSkeleton, SectionSkeleton, GameOfDaySkeleton } from "@/components/ui/Skeleton";

// Server Actions
import { getPopularMovies, getTopRatedMovies, getPopularHeroMovies } from "@/lib/tmdb";
import { getHorrorGames, getGameDetails, getHighestRatedGames } from "@/lib/igdb";

const FEED_ITEMS: FeedItemData[] = [
  {
    id: "log1",
    username: "OPERATOR_KANE",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5_lqkD1rLFctdCbrNYTgTmVwUX8MqLgRvV42MLDx24i00HVv6_ubIQddJ0hWRtQe0LYtYFvxJJTd1tKbjZV6Ogu77N-ndKGhc7TQj7BeS6HgCcq6jjemtwmma_WPolv7YHygVoBYb7azj7xPBkw_tfkyGxzuqjRbVRxZWCotfjVLjQ0Jotjy6P89pWoTh_Wl4SJdVrDmyQgwWU2EO7EoZsBZukQFWst0ehn2GlU6KiM-zco46V_xSeoPd9c96Y00J05Pv8zjGVRR2",
    timeAgo: "2M_AGO",
    content: 'Logged "SMILE 2" — Absolute visceral tension.',
    rating: 4,
  },
  {
    id: "log2",
    username: "SYS_ADMIN",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdao2iv6hGFOxjq5P95ru6MDrFWJH09769iRqcBONqVCFXBwbdlrjL9kPHUcw1i3zB7G-Nnc-pW5_Rr7CUrQNEDAVr2DOxHMedZaI8kbUIJByRRWgumbcEYVELetmYM0bYFzeHQLS6CvXLqrwNVnXgeN4BEWsDH6b_Nay6_HdHBuanhURVrA9MYB-fRuVd0jF4qJfQMtDA3OOACGC3nrYxzpfxn91sjOfbwzE0Kodvhrut8gMPrCieoTETSV3Wl6ZUesAhj-J_os8n",
    timeAgo: "14M_AGO",
    content: 'Tagged "SILENT HILL 2" for vaulting.',
    badge: "GAME_OBJECT",
  },
];

async function HeroWrapper() {
  const heroMovies = await getPopularHeroMovies();
  return <HeroSection movies={heroMovies} />;
}

async function PopularWrapper() {
  const movies = await getPopularMovies();
  return <MediaCarousel title="POPULAR MOVIES THIS WEEK" items={movies} />;
}

async function TrendingWrapper() {
  const games = await getHorrorGames();
  return <MediaCarousel title="TRENDING GAMES" items={games} />;
}

async function SpotLightWrapper() {
  const game = await getGameDetails("222341");
  return <GameOfDay game={game} />;
}

async function HighestWrapper() {
  const games = await getHighestRatedGames();
  return <MediaCarousel title="HIGHEST RATED GAMES" items={games} />;
}

async function CriticalWrapper() {
  const movies = await getTopRatedMovies();
  return <MediaCarousel title="CRITICALLY ACCLAIMED FILMS" items={movies} />;
}

export default function Home() {
  return (
    <>
      <main className="w-full pt-16 min-h-screen overflow-x-hidden">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroWrapper />
        </Suspense>

        <section className="space-y-4">
          <Suspense fallback={<SectionSkeleton />}>
            <PopularWrapper />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <TrendingWrapper />
          </Suspense>
        </section>

        {/* 2nd Section: GameOfDay + Feed */}
        <section className="max-w-7xl mx-auto px-8 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Suspense fallback={<GameOfDaySkeleton />}>
            <SpotLightWrapper />
          </Suspense>
          <div className="lg:col-span-1">
            <CommunityFeed feedTitle="ACCESS_FEED" buttonText="VIEW_LOGS" items={FEED_ITEMS} />
          </div>
        </section>

        <section className="space-y-4">
          <Suspense fallback={<SectionSkeleton />}>
            <HighestWrapper />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <CriticalWrapper />
          </Suspense>
        </section>

        {/* RESTORED: 'Stitch' Full-Width Section using modular Component */}
        <BannerSection />

        <footer className="w-full py-16 border-t border-secondary/10 bg-[#0a0a0a] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-10 text-[0.65rem] tracking-[0.25em] uppercase font-black text-foreground opacity-40">
            <div className="flex gap-12">
              <a href="#" className="hover:text-primary hover:opacity-100 transition-all">ABOUT_DREADBASE</a>
              <a href="#" className="hover:text-primary hover:opacity-100 transition-all">IMPRESSUM</a>
              <a href="#" className="hover:text-primary hover:opacity-100 transition-all">CONTACT_TERMINAL</a>
              <a href="#" className="hover:text-primary hover:opacity-100 transition-all">PRIVACY_PROTOCOL</a>
            </div>
            <div className="text-right">
              <span className="block mb-1">© 2026 DREADBASE_INTEL</span>
              <span className="text-[0.55rem] opacity-50 tracking-tighter">STATUS: FULLY_ENCRYPTED // CONNECTION_STABLE</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

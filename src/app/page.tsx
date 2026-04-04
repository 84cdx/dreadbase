"use client";

import { useEffect, useState } from "react";
import { Header, TopNavItem } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { CommunityFeed, FeedItemData } from "@/components/sections/CommunityFeed";
import { MediaCardProps } from "@/components/ui/MediaCard";
import { MediaCarousel } from "@/components/sections/MediaCarousel";
import { GameOfDay } from "@/components/sections/GameOfDay";
import { DetailModal } from "@/components/ui/DetailModal";

// Server Actions
import { getPopularMovies, getTopRatedMovies, getPopularHeroMovie } from "@/lib/tmdb";
import { getHorrorGames, getGameById, getHighestRatedGames } from "@/lib/igdb";

const TOP_NAV_ITEMS: TopNavItem[] = [
  { id: "movies", label: "MOVIES", href: "#", isActive: true },
  { id: "games", label: "GAMES", href: "#", isActive: false },
  { id: "vault", label: "VAULT", href: "#", isActive: false },
  { id: "activity", label: "ACTIVITY", href: "#", isActive: false },
];

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

export default function Home() {
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [heroMovie, setHeroMovie] = useState<any>(null);
  const [popularMovies, setPopularMovies] = useState<MediaCardProps[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaCardProps[]>([]);
  const [trendingGames, setTrendingGames] = useState<MediaCardProps[]>([]);
  const [highestRatedGames, setHighestRatedGames] = useState<MediaCardProps[]>([]);
  const [spotlightGame, setSpotlightGame] = useState<any>(null);

  useEffect(() => {
    async function loadArchive() {
      try {
        const [hero, popM, topM, trendG, topG, spotG] = await Promise.all([
          getPopularHeroMovie(),
          getPopularMovies(),
          getTopRatedMovies(),
          getHorrorGames(),
          getHighestRatedGames(),
          getGameById(222341), // SH2 Remake
        ]);
        setHeroMovie(hero);
        setPopularMovies(popM);
        setTopRatedMovies(topM);
        setTrendingGames(trendG);
        setHighestRatedGames(topG);
        setSpotlightGame(spotG);
      } catch (e) {
        console.error("Archive Access Error:", e);
      }
    }
    loadArchive();
  }, []);

  return (
    <>
      <Header logoText="DREADBASE" navItems={TOP_NAV_ITEMS} searchPlaceholder="SCAN_FILES..." />
      <main className="w-full pt-16 min-h-screen overflow-x-hidden">
        <DetailModal isOpen={!!selectedMedia} onClose={() => setSelectedMedia(null)} data={selectedMedia} />

        <HeroSection heroMovie={heroMovie} stats={[{ label: "ARCHIVE_SYNC", value: "OK" }, { label: "WEEKLY_LOGS", value: "1.2K" }]} />

        <section className="space-y-4">
          <MediaCarousel title="POPULAR_THIS_WEEK" items={popularMovies.map(m => ({ ...m, onClick: () => setSelectedMedia(m) }))} />
        </section>

        {/* 2nd Section: GameOfDay + Feed */}
        <section className="max-w-7xl mx-auto px-8 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <GameOfDay game={spotlightGame} />
          <div className="lg:col-span-1">
            <CommunityFeed feedTitle="ACCESS_FEED" buttonText="VIEW_LOGS" items={FEED_ITEMS} />
          </div>
        </section>

        <section className="space-y-4">
          <MediaCarousel title="TRENDING_GAMES" items={trendingGames.map(g => ({ ...g, onClick: () => setSelectedMedia(g) }))} />
          <MediaCarousel title="HIGHEST_RATED_GAMES" items={highestRatedGames.map(g => ({ ...g, onClick: () => setSelectedMedia(g) }))} />
          <MediaCarousel title="CRITICAL_ACCLAIM_FILMS" items={topRatedMovies.map(m => ({ ...m, onClick: () => setSelectedMedia(m) }))} />
        </section>

        {/* RESTORED: 'Stitch' Full-Width Section */}
        <section className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-[#0a0a0a] border-y border-secondary/20 py-24 mb-0">
          <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

              {/* Banner Box 1: Trending */}
              <div className="relative group cursor-pointer h-72 bg-gradient-to-br from-surface to-background border border-secondary/40 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549490349-8643362247b5')] bg-cover bg-center opacity-20 transition-transform duration-700 group-hover:scale-110 grayscale" />
                <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <span className="text-[0.6rem] font-black tracking-[0.5em] text-primary mb-3 block animate-pulse">ARCHIVE_ALERT</span>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">TRENDING_RIGHT_NOW</h3>
                  <p className="text-[0.7rem] opacity-40 uppercase tracking-widest font-bold">Deep scanning trending archives...</p>
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

              {/* Banner Box 2: Community */}
              <div className="relative group cursor-pointer h-72 bg-gradient-to-br from-surface to-background border border-secondary/40 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0')] bg-cover bg-center opacity-20 transition-transform duration-700 group-hover:scale-110 grayscale" />
                <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <span className="text-[0.6rem] font-black tracking-[0.5em] text-primary mb-3 block">ACCESS_GRANTED</span>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">COMMUNITY_PICK</h3>
                  <p className="text-[0.7rem] opacity-40 uppercase tracking-widest font-bold">Recommended by high-level operators</p>
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>

            </div>
          </div>
        </section>

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

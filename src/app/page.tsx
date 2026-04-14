import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { CommunityFeed, FeedItemData } from "@/components/sections/CommunityFeed";
import { MediaCarousel } from "@/components/sections/MediaCarousel";
import { GameOfDay } from "@/components/sections/GameOfDay";
import { IntelligenceSection } from "@/components/ui/IntelligenceSection";
import { HeroSkeleton, SectionSkeleton, GameOfDaySkeleton } from "@/components/ui/Skeleton";

// Server Actions
import { getPopularMovies, getTopRatedMovies, getPopularHeroMovies } from "@/lib/tmdb";
import { getHorrorGames, getGameDetails, getHighestRatedGames } from "@/lib/igdb";

const FEED_ITEMS: FeedItemData[] = [
  {
    id: "announcement",
    username: "CHRIS_DIETRICH",
    avatarUrl: "/images/pbnew.png",
    timeAgo: "JUST_NOW",
    content: "Community & Social features coming soon. Database expansion in progress...",
    badge: "SYS_MSG",
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
        <IntelligenceSection />

      </main>
    </>
  );
}

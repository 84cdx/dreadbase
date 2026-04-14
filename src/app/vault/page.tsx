import { Suspense } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Global Skeletons for Suspense Boundaries
function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 animate-pulse">
          <div className="w-full aspect-[2/3] bg-secondary/50 rounded-xl"></div>
          <div className="h-4 bg-secondary/50 rounded w-3/4"></div>
          <div className="h-3 bg-secondary/50 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

import { MediaCard } from "@/components/ui/MediaCard";

function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    return `/vault?page=${pageNumber}`;
  };

  return (
    <div className="flex justify-center items-center gap-6 mt-24">
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="p-1 border border-secondary text-foreground/40 hover:bg-secondary/20 hover:border-white/70 hover:text-white/70 transition-all rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <div className="w-11 h-11" /> // Placeholder to keep layout stable
      )}

      <div className="flex gap-3">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;

          if (totalPages > 10) {
            if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 2) {
              if (Math.abs(page - currentPage) === 3) return <span key={page} className="text-secondary/40 self-center">...</span>;
              return null;
            }
          }

          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`w-11 h-11 flex items-center justify-center border transition-all rounded-xl text-xs font-black
                ${isActive
                  ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(208,0,0,0.4)]'
                  : 'border-secondary text-foreground/40 hover:bg-secondary/20 hover:border-white/70 hover:text-white/70'
                }`}
            >
              {page}
            </Link>
          )
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="p-1 border border-secondary text-foreground/40 hover:bg-secondary/20 hover:border-white/70 hover:text-white/70 transition-all rounded-full flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <div className="w-11 h-11" />
      )}
    </div>
  )
}

const LIMIT = 12;

function VaultGrid({ data }: { data: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-10">
      {data.map(item => {
        let legacyPoster = item.poster_path;
        if (item.media_type === 'game' && legacyPoster) {
          legacyPoster = legacyPoster.replace("t_1080p", "t_cover_big").replace("t_720p", "t_cover_big").replace("t_screenshot_huge", "t_cover_big");
        }

        return (
          <MediaCard
            key={item.id}
            id={item.media_id}
            variant={item.media_type}
            cardStyle="vault"
            title={item.title}
            subtitle="VAULT_ENTRY"
            imageUrl={legacyPoster}
            rating={item.rating}
          />
        );
      })}
    </div>
  );
}

import { GuestAccessView } from "@/components/auth/GuestAccessView";

export default async function VaultPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) {
    return (
      <GuestAccessView 
        title="ACCESS DENIED" 
        subtitle="AUTHORIZATION REQUIRED. YOU MUST CONNECT TO THE DREADBASE TO MANAGE YOUR PERSONAL ARCHIVE."
      />
    );
  }

  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  // Fetch current page content and total counts simultaneously
  const [movieRes, gameRes] = await Promise.all([
    supabase.from('vault').select('*', { count: 'exact' }).eq('user_id', user.id).eq('media_type', 'movie').order('added_at', { ascending: false }).range(from, to),
    supabase.from('vault').select('*', { count: 'exact' }).eq('user_id', user.id).eq('media_type', 'game').order('added_at', { ascending: false }).range(from, to)
  ]);

  const moviesOnPage = movieRes.data || [];
  const gamesOnPage = gameRes.data || [];
  const movieCount = movieRes.count || 0;
  const gameCount = gameRes.count || 0;

  const totalEntries = movieCount + gameCount;

  if (totalEntries === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Ambient atmospheric background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(208,0,0,0.05)_0%,rgba(0,0,0,1)_70%)]" />

        <div className="relative z-10 max-w-2xl px-6 py-16 border-y border-secondary/30">
          <h1 className="text-primary font-black uppercase tracking-[0.3em] text-sm md:text-base mb-6 animate-pulse">
            SYSTEM STATUS: ARCHIVE NULL
          </h1>
          <p className="text-2xl md:text-4xl text-foreground font-black tracking-widest leading-tight mb-12 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            YOUR VAULT IS EMPTY.<br />
            START YOUR COLLECTION<br />
            <span className="text-primary/80">IN THE SHADOWS.</span>
          </p>
          <Link
            href="/"
            className="inline-block px-10 py-5 bg-primary/10 border border-primary text-primary font-black text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_30px_rgba(208,0,0,0.4)] transition-all duration-300 rounded-lg backdrop-blur-md"
          >
            RETURN TO HOME
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(Math.max(movieCount, gameCount) / LIMIT);

  return (
    <div className="min-h-[100dvh] bg-black text-foreground pb-40">
      {/* Structural Header Layout */}
      <header className="relative pt-24 pb-8 px-6 md:px-12 border-b border-secondary/40 bg-gradient-to-b from-surface/50 to-transparent">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-primary font-black text-[0.65rem] md:text-xs uppercase tracking-[0.4em] mb-2 drop-shadow-[0_0_8px_rgba(208,0,0,0.5)]">
            USER ARCHIVE // SECTOR V
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground uppercase tracking-tighter drop-shadow-xl flex items-center gap-10">
            VAULT
            <span className="text-[0.6rem] md:text-xl font-bold tracking-[0.2em] text-primary-foreground bg-primary px-3 py-1 rounded">
              {totalEntries} CLASSIFIED ENTRIES
            </span>
          </h1>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 space-y-12 md:space-y-16">

        {moviesOnPage.length === 0 && gamesOnPage.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
            <span className="text-4xl font-black mb-4 tracking-tighter italic text-red-900">/ ACCESS ERR /</span>
            <h2 className="text-2xl font-black uppercase tracking-widest text-secondary-foreground">ARCHIVE EMPTY // NO DATA FOUND</h2>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em]">RECALIBRATE FREQUENCY OR RETURN TO EARLIER LEVELS</p>
          </div>
        ) : (
          <>
            {/* MOVIES SECTION */}
            {moviesOnPage.length > 0 && (
              <section id="movies-section">
                <div className="flex items-end gap-4 mb-8 border-b border-primary/20 pb-4">
                  <h2 className="text-2xl md:text-4xl font-black text-primary uppercase tracking-[0.15em] drop-shadow-[0_0_15px_rgba(208,0,0,0.4)]">
                    MOVIES
                  </h2>
                  <span className="text-[0.65rem] md:text-xs text-foreground/40 font-bold tracking-[0.3em] uppercase pb-1 md:pb-2">
                    CINEMATIC ARCHIVE
                  </span>
                </div>
                <VaultGrid data={moviesOnPage} />
              </section>
            )}

            {/* GAMES SECTION */}
            {gamesOnPage.length > 0 && (
              <section id="games-section">
                <div className="flex items-end gap-4 mb-8 border-b border-primary/20 pb-4">
                  <h2 className="text-2xl md:text-4xl font-black text-primary uppercase tracking-[0.15em] drop-shadow-[0_0_15px_rgba(208,0,0,0.4)]">
                    GAMES
                  </h2>
                  <span className="text-[0.65rem] md:text-xs text-foreground/40 font-bold tracking-[0.3em] uppercase pb-1 md:pb-2">
                    INTERACTIVE ARCHIVE
                  </span>
                </div>
                <VaultGrid data={gamesOnPage} />
              </section>
            )}
          </>
        )}

        <Pagination currentPage={page} totalPages={totalPages} />

      </div>
    </div>
  );
}

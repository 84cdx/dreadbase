import { Suspense } from "react";
import { getMovieDetails, getSimilarMovies } from "@/lib/tmdb";
import { MediaCarousel } from "@/components/sections/MediaCarousel";
import { Star } from "lucide-react";
import { SectionSkeleton } from "@/components/ui/Skeleton";
import { VaultAction, VaultRatingBadge } from "@/components/ui/VaultAction";
import { WatchlistAction } from "@/components/ui/WatchlistAction";
import { createClient } from "@/utils/supabase/server";

async function SimilarMoviesWrapper({ id }: { id: string }) {
  const similarMovies = await getSimilarMovies(id);
  if (!similarMovies || similarMovies.length === 0) return null;
  return (
    <section className="mt-24 space-y-4">
      <MediaCarousel title="SIMILAR CONTENT" items={similarMovies} />
    </section>
  );
}

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  let isInVault = false;
  let isInWatchlist = false;
  let vaultRating = 0;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (userData?.user) {
    // Check Vault
    const { data: vaultData } = await supabase
      .from("vault")
      .select("media_id, rating")
      .eq("user_id", userData.user.id)
      .eq("media_id", id)
      .eq("media_type", "movie")
      .single();

    if (vaultData) {
      isInVault = true;
      vaultRating = vaultData.rating ?? 0;
    }

    // Check Watchlist
    const { data: watchlistData } = await supabase
      .from("watchlist")
      .select("media_id")
      .eq("user_id", userData.user.id)
      .eq("media_id", id)
      .eq("media_type", "movie")
      .single();

    if (watchlistData) {
      isInWatchlist = true;
    }
  }

  if (!movie) {
    return (
      <div className="bg-background min-h-screen text-center flex items-center justify-center">
        <h1 className="text-xl font-bold tracking-widest text-primary">DATA CORRUPTED // FILE NOT FOUND</h1>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <main className="pt-16 pb-24">
        {/* Banner header */}
        <section className="relative w-full h-[60vh] min-h-[500px]">
          {(() => {
            const heroImage = movie.backdropUrl || movie.posterUrl || "";
            const hasHeroImage = heroImage.length > 0;
            return hasHeroImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroImage}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                style={{ objectPosition: "center 20%" }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-hover opacity-20">
                <span className="text-xl font-black tracking-widest uppercase">NO_VISUAL_RECORD</span>
              </div>
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16 z-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end justify-between">
              <div className="max-w-3xl">
                <span className="text-primary font-bold text-xs tracking-widest uppercase mb-4 block">
                  MOVIE ARCHIVE // ID: {movie.id}
                </span>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-nog">
                  {movie.title}
                </h1>
                <div className="flex items-center gap-4 mb-6">
                  {movie.rating > 0 && (
                    <span className="flex items-center gap-1.5 text-lg font-black text-primary">
                      <Star className="w-5 h-5 fill-primary" /> {movie.rating.toFixed(1)}
                    </span>
                  )}
                  <span className="text-xl font-bold opacity-30">//</span>
                  <span className="font-bold tracking-widest opacity-80">{movie.year}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((g) => (
                    <span key={g} className="bg-surface border border-secondary px-3 py-1 rounded-full text-[0.6rem] uppercase tracking-widest font-black">
                      {g}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <VaultAction
                    mediaId={String(movie.id)}
                    mediaType="movie"
                    title={movie.title}
                    posterPath={movie.posterUrl || movie.backdropUrl || ""}
                    isInVault={isInVault}
                  />
                  <WatchlistAction
                    mediaId={String(movie.id)}
                    mediaType="movie"
                    title={movie.title}
                    posterPath={movie.posterUrl || movie.backdropUrl || ""}
                    isInWatchlist={isInWatchlist}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-16 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-2">
            <h2 className="text-[0.65rem] font-black tracking-[0.3em] text-foreground opacity-30 mb-6 uppercase">RESTRICTED_SYNOPSIS</h2>
            <p className="text-base md:text-lg opacity-80 font-light leading-relaxed">
              {movie.overview || "No data available."}
            </p>
          </div>
          <div className="col-span-1 flex flex-col items-start md:items-end gap-8">
            {/* ── Vault Rating Sektion ── only visible when archived */}
            {isInVault && (
              <div className="flex flex-col items-start md:items-end w-full">
                <p className="text-[0.75rem] font-black uppercase tracking-[0.3em] text-foreground/40 mb-4">YOUR RATING</p>
                <VaultRatingBadge
                  rating={vaultRating}
                  mediaId={String(movie.id)}
                  mediaType="movie"
                  title={movie.title}
                  posterPath={movie.posterUrl || movie.backdropUrl || ""}
                />
              </div>
            )}

            {/* Separator — only if in vault to separate sections */}
            {isInVault && <div className="h-px w-full bg-neutral-800/60" />}

            {/* Analytics Section */}
            <div className="w-full flex flex-col items-start md:items-end">
              <h2 className="text-[0.65rem] font-black tracking-[0.3em] text-foreground opacity-30 mb-6 uppercase">ANALYTICS_INDEX</h2>
              <div className="h-4 w-full bg-surface border border-secondary rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-primary" style={{ width: `${(movie.rating / 5) * 100}%` }} />
              </div>
              <div className="mt-2 text-[0.6rem] font-bold tracking-widest opacity-50">
                {movie.rating.toFixed(1)} / 5.0
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<SectionSkeleton />}>
          <SimilarMoviesWrapper id={id} />
        </Suspense>
      </main>
    </div>
  );
}

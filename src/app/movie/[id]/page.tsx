import { Suspense } from "react";
import { getMovieDetails, getSimilarMovies } from "@/lib/tmdb";
import { MediaCarousel } from "@/components/sections/MediaCarousel";
import { Star } from "lucide-react";
import { SectionSkeleton } from "@/components/ui/Skeleton";

async function SimilarMoviesWrapper({ id }: { id: string }) {
  const similarMovies = await getSimilarMovies(id);
  if (!similarMovies || similarMovies.length === 0) return null;
  return (
    <section className="mt-24 space-y-4">
       <MediaCarousel title="SIMILAR_CONTENT" items={similarMovies} />
    </section>
  );
}

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);
  
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
                   <button className="bg-primary text-primary-foreground py-3 px-8 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-primary-hover active:scale-95 transition-all shadow-[0_0_20px_rgba(208,0,0,0.3)]">
                     ADD TO VAULT
                   </button>
                   <button className="border border-secondary text-foreground py-3 px-8 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-surface-hover active:scale-95 transition-all">
                     ADD TO LIST
                   </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 lg:px-16 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-2">
            <h2 className="text-[0.65rem] font-black tracking-[0.3em] text-foreground opacity-30 mb-6 uppercase">RESTRICTED_SYNOPSIS</h2>
            <p className="text-base md:text-lg opacity-80 font-light leading-relaxed">
              {movie.overview || "No data available."}
            </p>
          </div>
          <div className="col-span-1">
            <h2 className="text-[0.65rem] font-black tracking-[0.3em] text-foreground opacity-30 mb-6 uppercase">ANALYTICS_INDEX</h2>
            <div className="h-4 w-full bg-surface border border-secondary rounded-full overflow-hidden shadow-inner">
               <div className="h-full bg-primary" style={{ width: `${(movie.rating / 5) * 100}%` }} />
            </div>
            <div className="mt-2 text-right text-[0.6rem] font-bold tracking-widest opacity-50">
              {movie.rating.toFixed(1)} / 5.0
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

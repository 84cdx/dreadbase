"use server";

import { MediaCardProps } from "@/components/ui/MediaCard";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";
const HORROR_GENRE_ID = "27";

const TMDB_GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

export interface HeroMovie {
  id: number;
  title: string;
  overview: string;
  backdropUrl: string;
  rating: string;
  year: string;
}

interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

/**
 * INTERNAL USE ONLY – Not for Server Action Export
 * Converts raw TMDB results into local UI props.
 */
function mapTMDBMovieToMediaCard(movie: TMDBMovie): MediaCardProps {
  const year = movie.release_date ? movie.release_date.split("-")[0] : "UNKNOWN";
  const normalizedRating = movie.vote_average / 2;
  const genres = movie.genre_ids?.map(id => TMDB_GENRES[id]).filter(g => g && g !== "Horror").slice(0, 2).join(" / ") || "FILM";

  return {
    id: movie.id.toString(),
    title: movie.title,
    subtitle: `${year} // ${genres.toUpperCase()}`,
    imageUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "", // Returns empty string if no image available
    rating: normalizedRating,
    description: movie.overview,
    variant: "movie",
  };
}

async function fetchTMDB(endpoint: string): Promise<TMDBResponse> {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  let url = `${TMDB_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    accept: "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  } else if (apiKey) {
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}api_key=${apiKey}`;
  } else {
    // If no credentials, we gracefully fail here
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  
  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`TMDB Request Failed! Status: ${res.status} | URL: ${url}`);
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    return await res.json();
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// ==========================================
// PUBLIC SERVER ACTIONS (MUST BE ASYNC)
// ==========================================

export async function getPopularMovies(): Promise<MediaCardProps[]> {
  const data = await fetchTMDB(`/discover/movie?with_genres=${HORROR_GENRE_ID}&sort_by=popularity.desc`);
  return (data?.results || []).map(mapTMDBMovieToMediaCard);
}

export async function getTopRatedMovies(): Promise<MediaCardProps[]> {
  const data = await fetchTMDB(`/discover/movie?with_genres=${HORROR_GENRE_ID}&sort_by=vote_average.desc&vote_count.gte=300`);
  return (data?.results || []).map(mapTMDBMovieToMediaCard);
}

export async function getPopularHeroMovies(limit = 5): Promise<HeroMovie[]> {
  const data = await fetchTMDB(`/discover/movie?with_genres=${HORROR_GENRE_ID}&sort_by=popularity.desc`);
  const tops = data?.results?.slice(0, limit) || [];
  
  return tops.map(top => {
    const year = top.release_date ? top.release_date.split("-")[0] : "UNKNOWN";
    return {
      id: top.id,
      title: top.title,
      overview: top.overview,
      backdropUrl: top.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${top.backdrop_path}` : "",
      rating: (top.vote_average / 2).toFixed(1),
      year,
    };
  });
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  backdropUrl: string;
  posterUrl: string;
  rating: number;
  year: string;
  genres: string[];
}

export async function getMovieDetails(id: string): Promise<MovieDetail | null> {
  const data: any = await fetchTMDB(`/movie/${id}`);
  if (!data || !data.id) return null;

  const year = data.release_date ? data.release_date.split("-")[0] : "UNKNOWN";
  return {
    id: data.id,
    title: data.title,
    overview: data.overview,
    backdropUrl: data.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${data.backdrop_path}` : "",
    posterUrl: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : "",
    rating: data.vote_average ? data.vote_average / 2 : 0,
    year,
    genres: (data.genres || []).map((g: any) => g.name),
  };
}

export async function getSimilarMovies(id: string): Promise<MediaCardProps[]> {
  const data = await fetchTMDB(`/movie/${id}/similar`);
  return (data?.results || []).slice(0, 10).map(mapTMDBMovieToMediaCard);
}

export async function searchMovies(query: string): Promise<MediaCardProps[]> {
  if (!query) return [];
  const safeQuery = encodeURIComponent(query);
  const data = await fetchTMDB(`/search/movie?query=${safeQuery}`);
  
  if (!data?.results) return [];
  
  const nicheGenres = [27, 53, 9648, 878]; // Horror, Thriller, Mystery, Sci-Fi
  const filtered = data.results.filter((m) => m.genre_ids?.some(id => nicheGenres.includes(id)));
  
  // If filtered is empty but we have results, return the unfiltered ones as fallback
  const finalResults = filtered.length > 0 ? filtered : data.results;
  
  return finalResults.slice(0, 5).map(mapTMDBMovieToMediaCard);
}

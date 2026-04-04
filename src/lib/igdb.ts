"use server";

import { MediaCardProps } from "@/components/ui/MediaCard";

const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_API_URL = "https://api.igdb.com/v4/games";

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * INTERNAL USE ONLY – Not for Server Action Export
 */
async function getTwitchAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("IGDB Credentials missing from .env.local");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const res = await fetch(`${TWITCH_TOKEN_URL}?${params.toString()}`, {
    method: "POST",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Twitch token error: ${res.status}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  return cachedToken;
}

// ==========================================
// RAW DATA TYPES
// ==========================================

interface IGDBCover { url: string; }
interface IGDBScreenshot { url: string; }
interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  cover?: IGDBCover;
  screenshots?: IGDBScreenshot[];
  total_rating?: number;
  total_rating_count?: number;
  first_release_date?: number;
}

export interface SpotlightGame {
  id: number;
  name: string;
  summary: string;
  coverUrl: string;
  screenshotUrl: string;
  rating: number;
  ratingLabel: string;
  year: string;
  releaseLabel: string;
}

// ==========================================
// INTERNAL MAPPERS (No export)
// ==========================================

function transformCoverUrl(url: string | undefined): string {
  if (!url) return "";
  return "https:" + url.replace("t_thumb", "t_cover_big");
}

function mapIGDBGameToMediaCard(game: IGDBGame): MediaCardProps {
  const year = game.first_release_date 
    ? new Date(game.first_release_date * 1000).getFullYear().toString()
    : "UNKNOWN";
  
  return {
    title: game.name,
    subtitle: `${year} // HORROR`,
    imageUrl: transformCoverUrl(game.cover?.url),
    rating: game.total_rating ? game.total_rating / 20 : 0,
    description: game.summary,
    variant: "game",
  };
}

function mapToSpotlightGame(game: IGDBGame): SpotlightGame {
  const rD = game.first_release_date ? new Date(game.first_release_date * 1000) : null;
  const year = rD ? rD.getFullYear().toString() : "UNKNOWN";
  const releaseLabel = rD ? rD.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "TBA";
  const rating = game.total_rating ?? 0;
  const rawS = game.screenshots?.[0]?.url;

  return {
    id: game.id,
    name: game.name,
    summary: game.summary ?? "No synopsis found.",
    coverUrl: game.cover?.url ? "https:" + game.cover.url.replace("t_thumb", "t_720p") : "",
    screenshotUrl: rawS ? "https:" + rawS.replace("t_thumb", "t_cover_big") : "",
    rating,
    ratingLabel: rating > 0 ? (rating / 10).toFixed(1) + " / 10" : "N/A",
    year,
    releaseLabel,
  };
}

// ==========================================
// PUBLIC SERVER ACTIONS (MUST BE ASYNC)
// ==========================================

export async function getGameById(id: number): Promise<SpotlightGame | null> {
  try {
    const token = await getTwitchAccessToken();
    const body = `fields name, summary, cover.url, screenshots.url, total_rating, total_rating_count, first_release_date; where id = ${id}; limit 1;`;
    
    const res = await fetch(IGDB_API_URL, {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID!,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body,
      next: { revalidate: 3600 },
    });

    const games = await res.json() as IGDBGame[];
    return games[0] ? mapToSpotlightGame(games[0]) : null;
  } catch (e) {
    console.error("IGDB ID FETCH ERROR:", e);
    return null;
  }
}

export async function getHorrorGames(): Promise<MediaCardProps[]> {
  try {
    const token = await getTwitchAccessToken();
    const body = "fields name, summary, cover.url, total_rating, first_release_date, hypes, total_rating_count; where themes = (19) & first_release_date > 1577836800 & total_rating_count > 0; sort hypes desc; limit 15;";
    
    const res = await fetch(IGDB_API_URL, {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID!,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body,
      next: { revalidate: 3600 },
    });

    const games = await res.json() as IGDBGame[];
    return games.map(mapIGDBGameToMediaCard);
  } catch (e) {
    console.error("IGDB LIST FETCH ERROR:", e);
    return [];
  }
}

export async function getHighestRatedGames(): Promise<MediaCardProps[]> {
  try {
    const token = await getTwitchAccessToken();
    const body = "fields name, summary, cover.url, total_rating, first_release_date, total_rating_count; where themes = (19) & total_rating_count > 5 & total_rating != null; sort total_rating desc; limit 15;";
    
    const res = await fetch(IGDB_API_URL, {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID!,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body,
      next: { revalidate: 3600 },
    });

    const games = await res.json() as IGDBGame[];
    return games.map(mapIGDBGameToMediaCard);
  } catch (e) {
    console.error("IGDB RATING FETCH ERROR:", e);
    return [];
  }
}

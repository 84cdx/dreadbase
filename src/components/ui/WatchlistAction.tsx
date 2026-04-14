"use client";

import { useState, useEffect } from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import { addToWatchlist, removeFromWatchlist } from "@/app/watchlist/actions";
import { createClient } from "@/utils/supabase/client";

interface WatchlistActionProps {
  mediaId: string;
  mediaType: "movie" | "game";
  title: string;
  posterPath: string;
  isInWatchlist: boolean;
}

export function WatchlistAction({
  mediaId,
  mediaType,
  title,
  posterPath,
  isInWatchlist,
}: WatchlistActionProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data?.user);
    };
    checkAuth();
  }, []);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(mediaId, mediaType);
      } else {
        await addToWatchlist(mediaId, mediaType, title, posterPath);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`py-3 px-8 rounded-xl text-xs font-black uppercase tracking-[0.2em] active:scale-95 transition-all disabled:opacity-50 ${
          isInWatchlist
            ? "bg-secondary/40 text-foreground/50 border border-secondary hover:bg-secondary/60 hover:text-foreground"
            : "border border-secondary text-foreground hover:bg-surface-hover"
        }`}
      >
        {loading 
          ? (isInWatchlist ? "REMOVING..." : "ADDING...") 
          : (isInWatchlist ? "REMOVE FROM LIST" : "ADD TO LIST")}
      </button>

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </>
  );
}

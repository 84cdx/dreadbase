"use client";

import { useState, useEffect } from "react";
import { Pencil, Star } from "lucide-react";
import { VaultModal } from "./VaultModal";
import { LoginModal } from "@/components/auth/LoginModal";
import { removeFromVault } from "@/app/vault/actions";
import { createClient } from "@/utils/supabase/client";

interface VaultActionProps {
  mediaId: string;
  mediaType: "movie" | "game";
  title: string;
  posterPath: string;
  isInVault: boolean;
  initialRating?: number;
}

/** Standalone component — rendered separately above the analytics bar on detail pages */
export function VaultRatingBadge({
  rating,
  mediaId,
  mediaType,
  title,
  posterPath,
}: {
  rating: number;
  mediaId: string;
  mediaType: "movie" | "game";
  title: string;
  posterPath: string;
}) {
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex gap-1.5" title={`Your rating: ${rating > 0 ? rating.toFixed(1) + " / 5.0" : "none"}`}>
          {[0, 1, 2, 3, 4].map((index) => {
            const isFull = rating >= index + 1;
            const isHalf = rating > index && rating < index + 1;
            return (
              <div key={index} className="relative w-10 h-10">
                <Star className="absolute inset-0 w-10 h-10 text-secondary/40" strokeWidth={1} />
                {isFull && <Star className="absolute inset-0 w-10 h-10 text-primary fill-primary" strokeWidth={1} />}
                {isHalf && (
                  <div className="absolute inset-0 overflow-hidden w-[50%]">
                    <Star className="w-10 h-10 text-primary fill-primary" strokeWidth={1} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {rating > 0 && (
          <span className="text-xl font-black text-primary tabular-nums tracking-tighter">
            {rating.toFixed(1)}
          </span>
        )}
        <button
          onClick={() => setIsVaultModalOpen(true)}
          title="Edit vault rating"
          className="ml-2 p-2 rounded-lg text-foreground/30 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      {isVaultModalOpen && (
        <VaultModal
          mediaId={mediaId}
          mediaType={mediaType}
          title={title}
          posterPath={posterPath}
          onClose={() => setIsVaultModalOpen(false)}
        />
      )}
    </>
  );
}

export function VaultAction({
  mediaId,
  mediaType,
  title,
  posterPath,
  isInVault,
}: VaultActionProps) {
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
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

  const handleAddClick = () => {
    if (isAuthenticated) {
      setIsVaultModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeFromVault(mediaId, mediaType);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isInVault ? (
        <button
          onClick={handleRemove}
          disabled={loading}
          className="bg-secondary text-foreground py-3 px-8 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-secondary/80 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "REMOVING..." : "REMOVE FROM VAULT"}
        </button>
      ) : (
        <button
          onClick={handleAddClick}
          className="bg-primary text-primary-foreground py-3 px-8 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-primary-hover active:scale-95 transition-all shadow-[0_0_20px_rgba(208,0,0,0.3)]"
        >
          ADD TO VAULT
        </button>
      )}

      {isVaultModalOpen && (
        <VaultModal
          mediaId={mediaId}
          mediaType={mediaType}
          title={title}
          posterPath={posterPath}
          onClose={() => setIsVaultModalOpen(false)}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </>
  );
}

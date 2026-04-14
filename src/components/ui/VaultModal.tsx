"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Star, X, Loader2, AlertCircle } from "lucide-react";
import { addToVault } from "@/app/vault/actions";
import { signInWithGoogle } from "@/app/auth/actions";
import { createClient } from "@/utils/supabase/client";

interface VaultModalProps {
  mediaId: string;
  mediaType: "movie" | "game";
  title: string;
  posterPath: string;
  onClose: () => void;
}

export function VaultModal({ mediaId, mediaType, title, posterPath, onClose }: VaultModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "guest">("loading");
  const [isPending, startTransition] = useTransition();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setAuthStatus(data?.user ? "authenticated" : "guest");
    };
    checkAuth();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await addToVault(mediaId, mediaType, rating, title, posterPath);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        onClose();
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to connect to the archive. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateRating = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    const starIndex = parseInt(e.currentTarget.dataset.index || "0");
    return starIndex + (isHalf ? 0.5 : 1);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-300 transition-colors cursor-pointer z-10"
          aria-label="Close vault modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-8 pt-10 pb-8">

          {/* Header */}
          <p className="text-primary text-[0.6rem] font-black tracking-[0.4em] uppercase mb-2">
            DREADBASE // VAULT
          </p>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-1">
            ARCHIVE ENTRY
          </h2>
          <p className="text-neutral-600 text-[0.65rem] font-bold uppercase tracking-[0.15em] mb-7 border-b border-neutral-800 pb-5 line-clamp-1">
            {title}
          </p>

          {/* Auth: Loading */}
          {authStatus === "loading" && (
            <div className="py-10 flex justify-center items-center">
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-primary animate-pulse">
                ANALYZING_AUTHORIZATION...
              </span>
            </div>
          )}

          {/* Auth: Guest fallback */}
          {authStatus === "guest" && (
            <div className="text-center py-4">
              <p className="text-primary font-black uppercase tracking-[0.1em] text-sm mb-3">
                ACCESS DENIED.
              </p>
              <p className="text-neutral-500 text-xs leading-relaxed mb-8">
                You must be logged in to archive entries.
              </p>
              <button
                onClick={() => startTransition(() => { signInWithGoogle(); })}
                disabled={isPending}
                className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-black text-[0.7rem] uppercase tracking-[0.2em] py-3 rounded-lg transition-all mb-3 cursor-pointer flex items-center justify-center gap-2"
              >
                {isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> CONNECTING...</> : "LOGIN WITH GOOGLE"}
              </button>
              <button
                onClick={onClose}
                className="w-full border border-neutral-800 text-neutral-500 py-3 rounded-lg text-[0.7rem] font-black uppercase tracking-widest hover:bg-neutral-900 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Auth: Authenticated */}
          {authStatus === "authenticated" && (
            <>
              {/* Stars */}
              <div
                className="flex justify-center gap-3 mb-2"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[0, 1, 2, 3, 4].map((index) => {
                  const currentDisplayRating = hoverRating || rating;
                  const isFull = currentDisplayRating >= index + 1;
                  const isHalf = currentDisplayRating > index && currentDisplayRating < index + 1;

                  return (
                    <div
                      key={index}
                      data-index={index}
                      className="relative cursor-pointer w-12 h-12"
                      onMouseMove={(e) => setHoverRating(calculateRating(e))}
                      onClick={(e) => setRating(calculateRating(e))}
                    >
                      <Star className="absolute inset-0 w-12 h-12 text-neutral-700" strokeWidth={1} />
                      {isFull && (
                        <Star className="absolute inset-0 w-12 h-12 text-primary fill-primary" strokeWidth={1} />
                      )}
                      {isHalf && (
                        <div className="absolute inset-0 overflow-hidden w-[50%] h-12">
                          <Star className="w-12 h-12 text-primary fill-primary" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Rating label + Clear — fixed height container prevents layout shift */}
              <div className="h-8 flex items-center justify-center gap-3 mb-6">
                {rating > 0 ? (
                  <>
                    <span className="text-[0.7rem] font-black text-primary tracking-widest tabular-nums">
                      {rating.toFixed(1)} / 5.0
                    </span>
                    <button
                      onClick={() => setRating(0)}
                      className="text-[0.6rem] font-bold text-neutral-600 hover:text-neutral-300 uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span className="text-[0.65rem] font-bold text-neutral-700 uppercase tracking-widest">
                    OPTIONAL — SKIP TO SAVE
                  </span>
                )}
              </div>

              {/* Error */}
              {errorMsg && (
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 mb-4">
                  <AlertCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-primary text-[0.6rem] font-bold uppercase tracking-wider">
                    {errorMsg}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 border border-neutral-800 text-neutral-400 py-3 rounded-lg text-[0.7rem] font-black uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white py-3 rounded-lg text-[0.7rem] font-black uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(185,28,28,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> SAVING...</> : "SAVE TO VAULT"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

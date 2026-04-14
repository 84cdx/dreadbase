"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { X, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { signInWithGoogle, signInWithEmail } from "@/app/auth/actions";

interface LoginModalProps {
  onClose: () => void;
}

// Google "G" SVG icon
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-4 h-4 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginModal({ onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [redirectTo, setRedirectTo] = useState("/");
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Capture current URL for post-login redirect
  useEffect(() => {
    setRedirectTo(window.location.pathname);
  }, []);

  // Focus email input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    setErrorMsg(null);

    const result = await signInWithEmail(email.trim(), redirectTo);

    if (result?.error) {
      setStatus("error");
      setErrorMsg(result.error);
    } else {
      setStatus("success");
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,0,0,0.08)] overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-300 transition-colors cursor-pointer"
          aria-label="Close login modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-8 pt-10 pb-8">
          {/* Header */}
          {status !== "success" && (
            <div className="mb-7">
              <p className="text-red-600 text-[0.6rem] font-black tracking-[0.4em] uppercase mb-2">
                DREADBASE // AUTH
              </p>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight justify-left flex gap-1.5">
                ENTER THE<br />
                <span className="text-red-600">ARCHIVE</span>
              </h2>
            </div>
          )}

          {/* === SUCCESS STATE === */}
          {status === "success" ? (
            <div className="py-2 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-700/10 border border-red-700/30 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-white font-black uppercase tracking-widest text-md mb-2">LINK DISPATCHED</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Check your inbox — a magic link has been sent to{" "}
                  <span className="text-white font-bold">{email}</span>.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 text-[0.65rem] font-black uppercase tracking-widest text-neutral-600 hover:text-neutral-300 transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          ) : (
            <>
              {/* === EMAIL FORM === */}
              <form onSubmit={handleEmailSubmit} className="space-y-3 mb-6">
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600 group-focus-within:text-red-600 transition-colors" />
                  <input
                    ref={inputRef}
                    type="email"
                    required
                    placeholder="YOUR_EMAIL_ADDRESS"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-700 focus:ring-1 focus:ring-red-700/50 text-white text-[0.7rem] font-bold tracking-widest placeholder:text-neutral-700 rounded-lg pl-10 pr-4 py-3 outline-none transition-all uppercase"
                  />
                </div>

                {/* Error */}
                {status === "error" && errorMsg && (
                  <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-primary text-[0.6rem] font-bold uppercase tracking-wider">{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || !email.trim()}
                  className="w-full bg-red-700 hover:bg-red-600 disabled:bg-neutral-800 disabled:opacity-20 disabled:cursor-not-allowed text-white font-black text-[0.7rem] uppercase tracking-[0.2em] py-3 rounded-lg transition-all enabled:hover:shadow-[0_0_20px_rgba(185,28,28,0.4)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === "loading" ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> SENDING...</>
                  ) : (
                    "SEND MAGIC LINK"
                  )}
                </button>
              </form>

              {/* === SEPARATOR === */}
              <div className="relative flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-neutral-800" />
                <span className="text-neutral-700 text-[0.6rem] font-black tracking-[0.3em] uppercase">OR</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              {/* === GOOGLE === */}
              <button
                onClick={() => startGoogleTransition(() => { signInWithGoogle(redirectTo); })}
                disabled={isGooglePending || status === "loading"}
                className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-800 hover:border-neutral-700 text-white font-black text-[0.7rem] uppercase tracking-[0.15em] py-3 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isGooglePending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> CONNECTING...</>
                ) : (
                  <><GoogleIcon /> CONTINUE WITH GOOGLE</>
                )}
              </button>

              {/* Footer note */}
              <p className="mt-6 text-center text-[0.55rem] text-neutral-700 uppercase tracking-widest leading-relaxed">
                By signing in, you accept the terms of the archive.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

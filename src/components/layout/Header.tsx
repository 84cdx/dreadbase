"use client";

import { useState, useRef, useEffect } from "react";
import { Search, User, Menu, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { searchMovies } from "@/lib/tmdb";
import { searchGames } from "@/lib/igdb";
import { MediaCardProps } from "@/components/ui/MediaCard";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "@/app/auth/actions";
import { LoginModal } from "@/components/auth/LoginModal";

export interface TopNavItem {
  id: string;
  label: string;
  href: string;
}

export interface HeaderProps {
  logoText: string;
  navItems: TopNavItem[];
  searchPlaceholder: string;
}

export function Header({ logoText, navItems, searchPlaceholder }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ movies: MediaCardProps[], games: MediaCardProps[] }>({ movies: [], games: [] });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await signOut();
    // Hard reset: Force a full reload on the current path to clear all auth states
    window.location.href = window.location.pathname;
  };

  // Close user dropdown on click outside
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  }, []);

  // Fetch Session from Supabase SSR and handle Auth State changes
  useEffect(() => {
    const supabase = createClient();
    
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user?.user_metadata?.avatar_url) {
        setUserAvatar(session.user.user_metadata.avatar_url);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user ?? null;
        setCurrentUser(user);
        
        if (event === "SIGNED_OUT") {
          setUserAvatar(null);
          setIsUserMenuOpen(false);
          setResults({ movies: [], games: [] });
        } else if (user?.user_metadata?.avatar_url) {
          setUserAvatar(user.user_metadata.avatar_url);
        } else {
          setUserAvatar(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Reset selected index when results or search open state change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results, isSearchFocused]);

  // Debounce and trigger search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ movies: [], games: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const [mov, gam] = await Promise.all([
          searchMovies(searchQuery),
          searchGames(searchQuery)
        ]);
        setResults({ movies: mov, games: gam });
      } catch (e) {
        setResults({ movies: [], games: [] });
      } finally {
        setIsLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const closeSearch = () => {
    setIsSearchFocused(false);
    setSearchQuery("");
  };

  // Close dropdown on click outside or process Keyboard Nav
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (!isSearchFocused) return;

      const flatResults = [
        ...results.movies.map(m => ({ id: m.id, type: 'movie' })),
        ...results.games.map(g => ({ id: g.id, type: 'game' }))
      ];
      const maxIndex = flatResults.length - 1;

      if (e.key === "Escape") {
        setIsSearchFocused(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex > -1) {
        e.preventDefault();
        const selected = flatResults[selectedIndex];
        if (selected) {
          router.push(`/${selected.type}/${selected.id}`);
          closeSearch();
        }
      }
    };
    document.addEventListener("mousedown", clickHandler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", clickHandler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [isSearchFocused, results, selectedIndex, router]);

  return (
    <>
      <header className="bg-background/95 backdrop-blur-md text-primary font-['Inter'] uppercase tracking-[0.1em] text-[0.6875rem] top-0 w-full border-b border-secondary flex justify-between items-center px-4 md:px-6 h-16 fixed z-[100] shadow-sm">

        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="text-xl font-black tracking-tighter text-primary cursor-pointer hover:opacity-80 transition-all">
              {logoText}
            </div>
          </Link>
          <nav className="hidden md:flex gap-6 items-center border-l border-secondary pl-8 h-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  className={`px-3 py-1 transition-all hover:text-primary ${isActive ? "text-primary font-black drop-shadow-[0_0_8px_rgba(208,0,0,0.5)]" : "text-foreground opacity-50 font-bold"}`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* Search with ABSOLUTE Dropdown */}
          <div ref={searchContainerRef} className="relative hidden sm:block">
            <div className={`relative group transition-all duration-300 ${isSearchFocused ? "lg:w-80 w-64" : "lg:w-64 w-48"}`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isSearchFocused ? "text-primary" : "text-foreground opacity-50"}`} />
              <input
                className="bg-surface border border-secondary rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-[0.6875rem] pl-10 pr-4 py-2 w-full uppercase tracking-widest text-foreground outline-none transition-all shadow-inner"
                placeholder={searchPlaceholder}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>

            {/* Absolute Dropdown Results */}
            {isSearchFocused && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-surface border border-secondary rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-4 border-b border-secondary/20 bg-background/20 font-black text-[0.55rem] tracking-[0.2em] text-primary flex items-center justify-between">
                  <span>SCAN_LOG_V.01</span>
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>

                {!searchQuery.trim() ? (
                  <div className="p-8 text-center bg-surface flex flex-col items-center">
                    <p className="text-[0.65rem] text-foreground opacity-30 uppercase tracking-[0.25em] font-black">AWAITING_INPUT...</p>
                  </div>
                ) : isLoading ? (
                  <div className="p-8 text-center bg-surface flex flex-col items-center">
                    <p className="text-[0.65rem] text-foreground opacity-30 uppercase tracking-[0.25em] font-black animate-pulse">SEARCHING_DATABASE...</p>
                    <p className="text-[0.55rem] text-primary/40 mt-3 uppercase tracking-widest leading-relaxed">INITIATING_DEEP_LEVEL_RECOVERY</p>
                  </div>
                ) : (results.movies.length === 0 && results.games.length === 0) ? (
                  <div className="p-8 text-center bg-surface flex flex-col items-center">
                    <p className="text-[0.65rem] text-foreground opacity-30 uppercase tracking-[0.25em] font-black">NO HORRORS FOUND...</p>
                  </div>
                ) : (
                  <div className="bg-surface max-h-[450px] overflow-y-auto overscroll-contain w-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-background/20 [&::-webkit-scrollbar-thumb]:bg-primary/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {results.movies.length > 0 && (
                      <div className="p-2 border-b border-secondary/20">
                        <div className="text-[0.5rem] font-black tracking-widest uppercase text-foreground/40 mb-2 px-2">MOVIES</div>
                        {results.movies.map((m, idx) => {
                          const isSelected = selectedIndex === idx;
                          return (
                            <Link key={m.id} href={`/movie/${m.id}`} onClick={closeSearch} className={`flex gap-3 hover:bg-secondary/20 p-2 rounded-lg transition-colors items-center group ${isSelected ? "bg-secondary/20 ring-1 ring-primary/50" : ""}`}>
                              <div className="w-8 h-12 bg-background shrink-0 rounded overflow-hidden">
                                {m.imageUrl && <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                              </div>
                              <div>
                                <div className="text-[0.7rem] font-bold leading-tight">{m.title}</div>
                                <div className="text-[0.55rem] uppercase opacity-50 tracking-widest">{m.subtitle?.split(" // ")[0] || m.year || "UNKNOWN"}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {results.games.length > 0 && (
                      <div className="p-2">
                        <div className="text-[0.5rem] font-black tracking-widest uppercase text-foreground/40 mb-2 px-2">GAMES</div>
                        {results.games.map((g, idx) => {
                          const isSelected = selectedIndex === results.movies.length + idx;
                          return (
                            <Link key={g.id} href={`/game/${g.id}`} onClick={closeSearch} className={`flex gap-3 hover:bg-secondary/20 p-2 rounded-lg transition-colors items-center group ${isSelected ? "bg-secondary/20 ring-1 ring-primary/50" : ""}`}>
                              <div className="w-8 h-12 bg-background shrink-0 rounded overflow-hidden">
                                {g.imageUrl && <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                              </div>
                              <div>
                                <div className="text-[0.7rem] font-bold leading-tight">{g.title}</div>
                                <div className="text-[0.55rem] uppercase opacity-50 tracking-widest">{g.subtitle?.split(" // ")[0] || g.year || "UNKNOWN"}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Account Dropdown */}
          <div ref={userMenuRef} className="relative">
            {currentUser ? (
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex w-9 h-9 items-center justify-center rounded-full hover:ring-1 hover:ring-primary transition-all overflow-hidden p-[2px] cursor-pointer"
              >
                <img src={userAvatar || ""} alt="Profile" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="flex p-2 rounded-full transition-all text-foreground opacity-50 hover:text-primary hover:opacity-100 outline-none cursor-pointer">
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Dropdown Menu */}
            {currentUser && isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-secondary shadow-xl rounded-lg z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col">
                  <Link
                    href="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="px-4 py-3 text-[0.65rem] font-bold text-foreground/70 hover:text-foreground hover:bg-secondary/20 transition-colors text-left"
                  >
                    ACCOUNT SETTINGS
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-3 text-[0.65rem] font-bold text-foreground/70 hover:text-foreground hover:bg-secondary/20 transition-colors text-left border-t border-secondary uppercase tracking-widest cursor-pointer"
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-foreground hover:bg-secondary rounded-lg z-[110]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed top-16 left-0 w-full bg-black/98 backdrop-blur-lg z-[90] md:hidden border-b border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col p-4 py-8">
              <div className="text-[0.55rem] font-black text-primary/40 tracking-[0.3em] uppercase mb-6 px-4">SYSTEM_NAVIGATION</div>
              <div className="flex flex-col border-t border-neutral-800">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-6 px-4 text-xl font-black tracking-[0.2em] uppercase transition-all flex items-center justify-between group border-b border-neutral-800 last:border-0 ${isActive ? "text-primary" : "text-foreground opacity-70"}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}

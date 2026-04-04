"use client";

import { useState, useRef, useEffect } from "react";
import { Search, User, Menu, X } from "lucide-react";

export interface TopNavItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface HeaderProps {
  logoText: string;
  navItems: TopNavItem[];
  searchPlaceholder: string;
}

export function Header({ logoText, navItems, searchPlaceholder }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className="bg-background/95 backdrop-blur-md text-primary font-['Inter'] uppercase tracking-[0.1em] text-[0.6875rem] top-0 w-full border-b border-secondary flex justify-between items-center px-4 md:px-6 h-16 fixed z-[60] shadow-sm">
        
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-8">
          <div className="text-xl font-black tracking-tighter text-primary cursor-pointer hover:opacity-80 transition-all">{logoText}</div>
          <nav className="hidden md:flex gap-6 items-center border-l border-secondary pl-8 h-8">
            {navItems.map((item) => (
              <a 
                key={item.id} 
                className={`px-3 py-1 transition-all hover:text-primary ${item.isActive ? "text-primary font-black" : "text-foreground opacity-50 font-bold"}`} 
                href={item.href}
              >
                {item.label}
              </a>
            ))}
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
              <div className="absolute top-full mt-2 left-0 right-0 bg-surface border border-secondary rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-4 border-b border-secondary/20 bg-background/20 font-black text-[0.55rem] tracking-[0.2em] text-primary flex items-center justify-between">
                  <span>SCAN_LOG_V.01</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </div>
                <div className="p-8 text-center bg-surface flex flex-col items-center">
                  <p className="text-[0.65rem] text-foreground opacity-30 uppercase tracking-[0.25em] font-black">SEARCHING_DATABASE...</p>
                  <p className="text-[0.55rem] text-primary/40 mt-3 uppercase tracking-widest leading-relaxed">INITIATING_DEEP_LEVEL_RECOVERY</p>
                </div>
              </div>
            )}
          </div>

          {/* Account Icon - FIXED: color only on hover */}
          <button className="hidden md:flex p-2 rounded-full transition-all text-foreground opacity-50 hover:text-primary hover:opacity-100 outline-none">
            <User className="w-5 h-5" />
          </button>
          
          <button className="md:hidden p-2 text-foreground hover:bg-secondary rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
    </>
  );
}

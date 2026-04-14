import Link from "next/link";

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Ambient atmospheric background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(208,0,0,0.05)_0%,rgba(0,0,0,1)_70%)]" />
      
      <div className="relative z-10 max-w-2xl px-6 py-16 border-y border-secondary/30">
        <h1 className="text-primary font-black uppercase tracking-[0.3em] text-sm md:text-base mb-6 animate-pulse">
          SOCIAL_INTERFACE // ACCESS_DENIED
        </h1>
        <p className="text-2xl md:text-4xl text-foreground font-black tracking-widest leading-tight mb-12 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          WORK IN PROGRESS.<br/>
          THE COMMUNITY HUB IS<br/>
          <span className="text-primary/80">UNDER CONSTRUCTION.</span>
        </p>
        <Link 
          href="/" 
          className="inline-block px-10 py-5 bg-primary/10 border border-primary text-primary font-black text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_30px_rgba(208,0,0,0.4)] transition-all duration-300 rounded-lg backdrop-blur-md"
        >
          RETURN TO HOME
        </Link>
      </div>
    </div>
  );
}

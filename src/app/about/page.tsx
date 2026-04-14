import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 md:p-8 text-center relative overflow-hidden">
      {/* Ambient background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(208,0,0,0.05)_0%,rgba(0,0,0,1)_70%)]" />
      
      <div className="relative z-10 max-w-2xl px-6 py-16 border-y border-secondary/30">
        <h1 className="text-primary font-black uppercase tracking-[0.4em] text-[0.6rem] md:text-base mb-8 break-words">
          MISSION_PROTOCOL // ABOUT_DREADBASE
        </h1>
        <p className="text-xl md:text-3xl text-foreground font-black tracking-widest leading-tight mb-12 uppercase drop-shadow-xl">
          Centralized database for classified media intelligence.<br/>
          <span className="text-primary/80">Archiving the dark side of cinema and gaming.</span>
        </p>
        <div className="text-[0.65rem] md:text-xs text-foreground/40 font-bold tracking-[0.3em] uppercase max-w-lg mx-auto leading-relaxed">
          DREADBASE is a sovereign digital archive dedicated to the systematic classification of horror-themed interactive and cinematic artifacts. We monitor the shadows to provide operators with the intelligence needed to navigate the unknown.
        </div>
        <div className="mt-16">
          <Link 
            href="/" 
            className="inline-block px-10 py-5 border border-primary text-primary font-black text-[0.6rem] uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_30px_rgba(208,0,0,0.4)] transition-all duration-300 rounded-lg"
          >
            RETURN TO COMMAND CENTER
          </Link>
        </div>
      </div>
    </div>
  );
}

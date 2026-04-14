import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface ArticleContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  date: string;
  readTime: string;
  content: string[];
  youtubeId?: string;
  otherReportSlug: string;
  otherReportTitle: string;
  otherReportImage: string;
}

const ARTICLES: Record<string, ArticleContent> = {
  "scary-movie": {
    title: "SCARY MOVIE 6 // REBOOT PROTOCOL",
    subtitle: "INVESTIGATING THE NEXT CHAPTER IN THE ICONIC HORROR PARODY FRANCHISE",
    imageUrl: "/images/Foto_1.webp",
    date: "APRIL 14, 2026",
    readTime: "4 MIN",
    content: [
      "The latest reports confirm that the Scary Movie franchise is officially being reactivated. After years of dormancy, the series is set to return with a focus on secret development and modern horror deconstruction. This 'Reboot Protocol' aim is to dismantle contemporary horror tropes and re-initialize them for a new generation of viewers.",
      "The cinematic landscape has shifted significantly since the last official entry. This expansion focuses on the current wave of 'Elevated Horror,' with targeted deconstructions of recent psychological and folk-horror hits. Sources suggest a return to the series' roots, prioritizing sharp visual comedy and rapid-fire cultural references.",
      "Below is the latest trailer released to the public. Further monitoring of production updates is advised."
    ],
    youtubeId: "_4CvRre-Rb8",
    otherReportSlug: "manga-expansion",
    otherReportTitle: "MANGA EXPANSION LOG",
    otherReportImage: "/images/manga.webp"
  },
  "manga-expansion": {
    title: "MANGA EXPANSION // THE SILENT PAGES",
    subtitle: "INTEGRATION OF DARK LITERATURE DATABASES INTO THE DREADBASE ECOSYSTEM",
    imageUrl: "/images/manga.webp",
    date: "APRIL 12, 2026",
    readTime: "6 MIN",
    content: [
      "Dreadbase is expanding its intelligence collection beyond cinema and digital archives into the world of illustrated horror. This systematic integration provides users with access to some of the most profound psychological horror ever recorded in manga format.",
      "Key titles currently being categorized include the spiral-born anomalies of Junji Ito (Uzumaki), the eternal struggle of Berserk, and the architectural insanity of Drifting Classroom. These works represent high-priority entries for our dark literature database.",
      "The goal is to establish a comprehensive cross-media archive. By mapping the visual language of Japanese horror, we strengthen our understanding of universal themes of dread. Deployment of the new database modules is scheduled for the coming weeks."
    ],
    otherReportSlug: "scary-movie",
    otherReportTitle: "SCARY MOVIE REPORT",
    otherReportImage: "/images/Foto_1.webp"
  }
};

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES[slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-foreground font-sans selection:bg-primary selection:text-white pb-24">
      {/* Backdrop Section */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover object-[center_25%] opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        {/* Navigation Button */}
        <div className="absolute top-24 left-8 lg:left-16 z-50">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-neutral-950 border border-secondary text-white/50 font-black text-[0.7rem] uppercase tracking-[0.2em] rounded-lg transition-all hover:text-white/70 hover:bg-black/50 hover:border-white/70 active:scale-[0.98] cursor-pointer group backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
            RETURN_TO_SYSTEM
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-8 relative z-10 -mt-24">
        <div className="space-y-12">
          {/* Header */}
          <header>
            <div className="flex items-center gap-4 mb-6 text-[0.65rem] font-bold text-primary tracking-[0.2em] uppercase">
              <span>REPORT</span>
              <span className="text-secondary">•</span>
              <span>{article.date}</span>
              <span className="text-secondary">•</span>
              <span>{article.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter uppercase leading-[1.1] text-white">
              {article.title}
            </h1>

            <div className="h-1 w-20 bg-primary mb-8 ml-0" />

            <p className="text-lg md:text-xl text-foreground font-bold tracking-tight opacity-90 leading-relaxed border-l-2 border-primary/30 pl-6">
              {article.subtitle}
            </p>
          </header>

          {/* Article Text */}
          <div className="space-y-8 text-foreground/70 leading-relaxed text-base md:text-lg text-justify md:text-left">
            {article.content.map((p, i) => (
              <p key={i}>
                {p}
              </p>
            ))}
          </div>

          {/* Media Content (YouTube) */}
          {article.youtubeId && (
            <div className="pt-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-secondary shadow-2xl bg-surface">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${article.youtubeId}?autoplay=0&mute=0&controls=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Recommended Section */}
          <section className="pt-8 space-y-8">
            <div className="flex items-center justify-between border-b border-secondary pb-4">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                OTHER REPORTS
              </h2>
            </div>

            <Link
              href={`/news/${article.otherReportSlug}`}
              className="group flex gap-6 items-center p-5 bg-surface border border-secondary hover:border-primary/50 transition-all rounded-xl"
            >
              <div className="w-24 h-24 md:w-32 md:h-20 shrink-0 overflow-hidden rounded-lg bg-black">
                <img
                  src={article.otherReportImage}
                  alt="Other report"
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <span className="text-[0.6rem] font-bold text-primary tracking-[0.2em] uppercase">NEXT STORY</span>
                <h3 className="text-base md:text-xl font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">
                  {article.otherReportTitle}
                </h3>
              </div>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

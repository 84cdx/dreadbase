import { Rss, Star } from "lucide-react";

export interface FeedItemData {
  id: string;
  username: string;
  avatarUrl: string;
  timeAgo: string;
  content: string;
  rating?: number;
  badge?: string;
}

export interface CommunityFeedProps {
  feedTitle: string;
  buttonText: string;
  items: FeedItemData[];
}

export function CommunityFeed({ feedTitle, buttonText, items }: CommunityFeedProps) {
  return (
    <div className="bg-surface border border-secondary flex flex-col rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:border-primary/50">
      <div className="p-6 border-b border-secondary flex justify-between items-center text-foreground bg-surface-hover/30">
        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          {feedTitle}
        </h3>
        <Rss className="w-4 h-4 opacity-40 text-foreground transition-all duration-300 hover:text-primary hover:opacity-100 cursor-pointer" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border-b border-secondary hover:bg-surface-hover transition-all duration-300 group cursor-pointer"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-background rounded-full overflow-hidden border border-secondary group-hover:border-primary transition-all duration-300 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={item.username}
                  className="w-full h-full object-cover"
                  src={item.avatarUrl}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-[0.6875rem] font-bold text-primary transition-all duration-300 group-hover:text-primary-foreground">
                    {item.username}
                  </span>
                  <span className="text-[0.5rem] text-foreground opacity-30">
                    {item.timeAgo}
                  </span>
                </div>
                <p className="text-[0.75rem] text-foreground leading-tight mt-1 opacity-70 group-hover:opacity-100 transition-all duration-300">
                  {item.content}
                </p>

                {item.rating !== undefined && (
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 transition-colors duration-300 ${
                          i < (item.rating || 0)
                            ? "text-primary fill-current group-hover:drop-shadow-[0_0_3px_rgba(208,0,0,0.5)]"
                            : "text-secondary"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {item.badge && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-secondary text-foreground rounded-lg text-[0.5rem] uppercase font-bold transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-4 text-[0.6rem] text-foreground uppercase tracking-[0.2em] font-bold opacity-40 hover:opacity-100 hover:bg-surface-hover hover:text-primary transition-all duration-300">
        {buttonText}
      </button>
    </div>
  );
}

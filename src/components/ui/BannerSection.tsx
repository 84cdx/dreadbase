"use client";

import { BannerPanel } from "./BannerPanel";

export function BannerSection() {
  return (
    <section className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-[#0a0a0a] border-y border-secondary/20 py-24 mb-0">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <BannerPanel 
            bgUrl="https://images.unsplash.com/photo-1549490349-8643362247b5"
            badgeText="ARCHIVE_ALERT"
            title="TRENDING_RIGHT_NOW"
            subtitle="Deep scanning trending archives..."
            pulseBadge={true}
          />
          
          <BannerPanel 
            bgUrl="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0"
            badgeText="ACCESS_GRANTED"
            title="COMMUNITY_PICK"
            subtitle="Recommended by high-level operators"
          />

        </div>
      </div>
    </section>
  );
}

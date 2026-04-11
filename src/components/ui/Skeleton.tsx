export function HeroSkeleton() {
  return (
    <section className="w-full h-[600px] bg-secondary/10 animate-pulse relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-secondary/20" />
      <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl w-full space-y-4">
            <div className="w-32 h-3 bg-secondary/20 rounded" />
            <div className="w-3/4 h-16 bg-secondary/20 rounded" />
            <div className="w-1/2 h-4 bg-secondary/20 rounded" />
            <div className="w-1/2 h-4 bg-secondary/20 rounded" />
          </div>
          <div className="flex gap-12 border-l border-secondary/20 pl-8 shrink-0">
             <div className="w-16 h-12 bg-secondary/20 rounded" />
             <div className="w-16 h-12 bg-secondary/20 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="flex flex-col h-full gap-2 animate-pulse">
      <div className="aspect-[2/3] bg-secondary/20 rounded-xl" />
      <div className="w-3/4 h-3 bg-secondary/20 rounded mt-2" />
      <div className="w-full flex justify-between mt-auto pt-1">
         <div className="w-8 h-2 bg-secondary/20 rounded" />
         <div className="w-8 h-2 bg-secondary/20 rounded" />
      </div>
      <div className="w-1/2 h-2 bg-secondary/20 rounded" />
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <section className="w-full px-8 lg:px-16 py-6 group/carousel">
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-8 border-b border-secondary/20 pb-4">
         <div className="w-64 h-6 bg-secondary/20 rounded animate-pulse" />
      </div>
      <div className="max-w-7xl mx-auto flex gap-6 overflow-hidden">
         {[...Array(6)].map((_, i) => (
           <div key={i} className="w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)] shrink-0">
             <MediaCardSkeleton />
           </div>
         ))}
      </div>
    </section>
  );
}

export function GameOfDaySkeleton() {
  return (
    <div className="md:col-span-3 group relative overflow-hidden bg-surface border border-secondary/20 rounded-2xl flex flex-col md:flex-row items-stretch min-h-[480px] animate-pulse">
      <div className="relative z-20 w-full md:flex-[0_0_340px] bg-secondary/10" />
      <div className="relative z-20 flex-1 p-8 md:p-12 flex flex-col justify-center bg-surface/20">
         <div className="w-24 h-4 bg-secondary/20 rounded mb-4" />
         <div className="w-3/4 h-12 bg-secondary/20 rounded mb-6" />
         <div className="w-full h-4 bg-secondary/20 rounded mb-2" />
         <div className="w-5/6 h-4 bg-secondary/20 rounded mb-8" />
         <div className="w-full h-8 bg-secondary/20 rounded mb-10" />
         <div className="flex gap-4 max-w-sm">
           <div className="flex-1 h-12 bg-secondary/20 rounded-xl" />
           <div className="flex-1 h-12 bg-secondary/20 rounded-xl" />
         </div>
      </div>
    </div>
  );
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-black pt-40 pb-24 px-6 md:px-16 container max-w-4xl mx-auto">
      <div className="border-l-2 border-primary pl-6 md:pl-8 mb-16">
        <h1 className="text-3xl md:text-6xl font-black text-foreground uppercase tracking-tighter mb-4 break-words">
          IMPRESSUM
        </h1>
        <p className="text-primary font-black text-xs tracking-[0.4em] uppercase opacity-80">
          LEGAL_ENTRIES // RECORD_302
        </p>
      </div>

      <div className="space-y-12 text-foreground/60 font-medium tracking-wide leading-relaxed uppercase text-sm">
        <section>
          <h2 className="text-foreground text-base font-black mb-4 tracking-widest border-b border-secondary/20 pb-2">OPERATOR_DETAILS</h2>
          <p>Chris Dietrich<br/>Dreadbase Digital Ops<br/>München, Germany</p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-black mb-4 tracking-widest border-b border-secondary/20 pb-2">CONTACT_LINE</h2>
          <p>Email: terminal@dreadbase.com<br/>Direct: SECURE_CHANNEL_O1</p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-black mb-4 tracking-widest border-b border-secondary/20 pb-2">LIABILITY_PROTOCOL</h2>
          <p>This is a purely aesthetic project. All media data is provided by TMDB and IGDB. We do not claim ownership of the archival material. The database is simulated for visual immersion.</p>
        </section>
      </div>
    </div>
  );
}

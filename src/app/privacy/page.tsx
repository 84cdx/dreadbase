export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black pt-40 pb-24 px-6 md:px-16 container max-w-4xl mx-auto">
      <div className="border-l-2 border-primary pl-6 md:pl-8 mb-16">
        <h1 className="text-3xl md:text-6xl font-black text-foreground uppercase tracking-tighter mb-4 break-words">
          PRIVACY_PROTOCOL
        </h1>
        <p className="text-primary font-black text-xs tracking-[0.4em] uppercase opacity-80">
          DATA_PROTECTION // ENCRYPTION_LEVEL: OMEGA
        </p>
      </div>

      <div className="space-y-12 text-foreground/60 font-medium tracking-wide leading-relaxed uppercase text-sm">
        <section>
          <h2 className="text-foreground text-base font-black mb-4 tracking-widest border-b border-secondary/20 pb-2">DATA_COLLECTION</h2>
          <p>Dreadbase only stores account-related information (Google profile data) provided during authentication. This information is used strictly to sync your personal Vault and List across nodes.</p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-black mb-4 tracking-widest border-b border-secondary/20 pb-2">SURVEILLANCE_COOKIES</h2>
          <p>We use session markers to ensure your terminal remains connected to the database. No third-party tracking scripts are permitted within the Dreadbase ecosystem.</p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-black mb-4 tracking-widest border-b border-secondary/20 pb-2">PURGE_REQUESTS</h2>
          <p>Should you wish to de-manifest your presence from our archives, your data can be purged immediately via the Account settings (Sector S - Coming Soon).</p>
        </section>
      </div>
    </div>
  );
}

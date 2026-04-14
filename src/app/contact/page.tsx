export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 md:p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(208,0,0,0.03)_0%,rgba(0,0,0,1)_60%)]" />
      
      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-2 break-words">
            CONTACT_TERMINAL
          </h1>
          <div className="h-1 w-24 bg-primary mx-auto" />
        </div>

        <div className="bg-surface/30 border border-secondary/40 p-6 md:p-10 rounded-2xl backdrop-blur-md shadow-2xl text-left">
          <p className="text-[0.65rem] font-bold text-primary uppercase tracking-[0.3em] mb-8 border-b border-primary/20 pb-4">
            INITIATE_UPLINK // FREQUENCY: 44.1 Hz
          </p>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <span className="text-[0.6rem] font-black text-foreground/40 uppercase tracking-widest">ENCRYPTED_ID</span>
              <p className="text-sm md:text-lg font-black text-foreground uppercase tracking-wider break-all">terminal@dreadbase.com</p>
            </div>
            
            <div className="flex flex-col gap-2 pt-4">
              <span className="text-[0.6rem] font-black text-foreground/40 uppercase tracking-widest">STATUS</span>
              <p className="text-xs font-bold text-foreground/80 uppercase tracking-widest leading-relaxed">
                Direct neural uplink is currently offline. Please use the traditional SMTP protocol for data transmission.
              </p>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="text-[0.5rem] font-black text-primary/60 uppercase tracking-[0.4em]">LISTENING_FOR_SIGNALS...</div>
          </div>
        </div>
      </div>
    </div>
  );
}

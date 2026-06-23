import { useRef, useState } from "react";
import { Upload, Sparkles, Camera, Scan, Check, RefreshCw, Wand2 } from "lucide-react";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import look4 from "@/assets/look-4.jpg";
import heroImg from "@/assets/hero.jpg";

const HAIRSTYLES = [
  { id: "fade", name: "Fade Cut", preview: look2 },
  { id: "under", name: "Undercut", preview: look3 },
  { id: "pomp", name: "Pompadour", preview: look4 },
] as const;

const ACTORS = [
  { id: "mahesh", name: "Mahesh Babu", avatar: look2, vibe: "Sharp fade · Princely polish" },
  { id: "prabhas", name: "Prabhas", avatar: look3, vibe: "Long mane · Full beard" },
  { id: "charan", name: "Ram Charan", avatar: heroImg, vibe: "Slicked pomp · Sculpted beard" },
  { id: "allu", name: "Allu Arjun", avatar: look4, vibe: "Textured top · Designer stubble" },
] as const;

function UploadZone({
  src,
  onFile,
  label,
  ratio = "aspect-[3/4]",
}: {
  src: string | null;
  onFile: (url: string) => void;
  label: string;
  ratio?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <button
      onClick={() => ref.current?.click()}
      className={`group relative w-full overflow-hidden rounded-md border border-dashed border-gold/40 bg-onyx/60 transition-all hover:border-gold ${ratio}`}
    >
      {src ? (
        <img src={src} alt="Upload preview" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gradient-gold)] text-primary-foreground">
            <Upload className="h-5 w-5" />
          </div>
          <div className="text-sm font-display text-foreground">{label}</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            JPG · PNG · HEIC
          </div>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(URL.createObjectURL(f));
        }}
      />
    </button>
  );
}

function Hairstyle() {
  const [src, setSrc] = useState<string | null>(null);
  const [style, setStyle] = useState<(typeof HAIRSTYLES)[number]>(HAIRSTYLES[0]);
  return (
    <section className="rounded-md border border-gold/30 bg-onyx/60 p-8">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold">
        <Wand2 className="h-3.5 w-3.5" /> AI Hairstyle Visualizer
      </div>
      <h3 className="mt-3 font-display text-3xl leading-tight">
        Try a cut before you <em className="text-gold-gradient italic">commit</em>.
      </h3>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft mb-3">Your photo</div>
          <UploadZone src={src} onFile={setSrc} label="Upload a clear front photo" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft mb-3">Preview · {style.name}</div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-gold/40 bg-card">
            <img src={style.preview} alt={style.name} className="h-full w-full object-cover" />
            {src && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-transparent" />
            )}
            <div className="absolute left-3 top-3 rounded-full border border-gold/40 bg-onyx/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold backdrop-blur">
              {src ? "Match preview" : "Sample"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {HAIRSTYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
              style.id === s.id
                ? "border-gold/60 bg-gold/10 text-gold"
                : "border-border text-muted-foreground hover:border-gold/40"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
    </section>
  );
}

function TollywoodGen() {
  const [src, setSrc] = useState<string | null>(null);
  const [actor, setActor] = useState<(typeof ACTORS)[number] | null>(null);
  const [processing, setProcessing] = useState(false);

  const generate = (a: (typeof ACTORS)[number]) => {
    setActor(a);
    setProcessing(true);
    setTimeout(() => setProcessing(false), 1100);
  };

  return (
    <section className="rounded-md border border-gold/30 bg-onyx/60 p-8">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold">
        <Sparkles className="h-3.5 w-3.5" /> Tollywood Look Generator
      </div>
      <h3 className="mt-3 font-display text-3xl leading-tight">
        Cinematic <em className="text-gold-gradient italic">match</em>.
      </h3>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft mb-3">Your selfie</div>
          <UploadZone src={src} onFile={setSrc} label="Upload selfie" />
        </div>

        <div className="lg:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft mb-3">Choose your hero</div>
          <div className="grid grid-cols-2 gap-3">
            {ACTORS.map((a) => {
              const sel = actor?.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => generate(a)}
                  className={`group relative overflow-hidden rounded-sm border transition-all ${
                    sel ? "border-gold shadow-gold" : "border-gold/20 hover:border-gold/60"
                  }`}
                >
                  <img src={a.avatar} alt={a.name} className="aspect-square h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2 text-left">
                    <div className="font-display text-xs leading-tight">{a.name}</div>
                  </div>
                  {sel && (
                    <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gradient-gold)] text-primary-foreground">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft mb-3">Cinematic match</div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-gold/40 bg-card">
            {actor ? (
              <>
                <img src={actor.avatar} alt={actor.name} className="h-full w-full object-cover" />
                {src && (
                  <img
                    src={src}
                    alt="You"
                    className="absolute right-3 top-3 h-20 w-20 rounded-sm border border-gold/40 object-cover shadow-elegant"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent" />
                <div className="absolute inset-x-3 bottom-3">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{actor.name}</div>
                  <div className="font-display text-lg leading-tight">{actor.vibe}</div>
                </div>
                {processing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-onyx/70 backdrop-blur-sm">
                    <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-onyx/80 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-gold">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Processing
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-xs text-muted-foreground">
                Pick an actor to generate your cinematic match.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Analysis() {
  const [src, setSrc] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<null | {
    hairDensity: string;
    hairType: string;
    skinType: string;
    recs: string[];
  }>(null);

  const scan = () => {
    if (!src) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult({
        hairDensity: "Medium-high · 158 follicles/cm²",
        hairType: "Wavy 2B · Medium porosity",
        skinType: "Combination · T-zone reactive",
        recs: [
          "Nizam Gold Facial — brightening base",
          "Scalp detox + biotin serum (4 sessions)",
          "Designer stubble sculpt every 9 days",
        ],
      });
    }, 1500);
  };

  return (
    <section className="rounded-md border border-gold/30 bg-onyx/60 p-8">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold">
        <Scan className="h-3.5 w-3.5" /> AI Skin & Hair Analysis
      </div>
      <h3 className="mt-3 font-display text-3xl leading-tight">
        A <em className="text-gold-gradient italic">diagnostic</em> in 90 seconds.
      </h3>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft mb-3">Upload face</div>
          <div className="relative">
            <UploadZone src={src} onFile={(u) => { setSrc(u); setResult(null); }} label="Upload front-facing photo" />
            {scanning && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
                <div className="absolute inset-x-0 h-12 animate-[scanline_1.5s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
              </div>
            )}
          </div>
          <button
            onClick={scan}
            disabled={!src || scanning}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-primary-foreground shadow-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanning ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
            {scanning ? "Scanning…" : "Run diagnostic"}
          </button>
        </div>

        <div className="rounded-md border-gold-hairline bg-card/60 p-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Report</div>
          {!result && !scanning && (
            <div className="mt-6 text-sm text-muted-foreground">
              Upload a clear, well-lit front photo. The model will return structured hair & skin parameters and a treatment plan.
            </div>
          )}
          {scanning && (
            <div className="mt-6 space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-3 animate-pulse rounded bg-gold/10" style={{ width: `${90 - i * 12}%` }} />
              ))}
            </div>
          )}
          {result && (
            <div className="mt-5 space-y-4">
              {[
                { k: "Hair density", v: result.hairDensity },
                { k: "Hair type", v: result.hairType },
                { k: "Skin type", v: result.skinType },
              ].map((row) => (
                <div key={row.k} className="flex items-center justify-between border-b border-gold/15 pb-3">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">{row.k}</div>
                  <div className="font-display text-sm text-foreground">{row.v}</div>
                </div>
              ))}
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">Recommended treatments</div>
                <ul className="mt-3 space-y-2">
                  {result.recs.map((r) => (
                    <li key={r} className="flex items-start gap-2 rounded-sm border border-gold/15 bg-gold/5 px-3 py-2 text-xs">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function VisualStudio() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-6 py-16">
      <div>
        <div className="text-[11px] uppercase tracking-[0.3em] text-gold">AI Visual Studio</div>
        <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          See the result before the <em className="text-gold-gradient italic">first cut</em>.
        </h2>
      </div>
      <Hairstyle />
      <TollywoodGen />
      <Analysis />
    </div>
  );
}
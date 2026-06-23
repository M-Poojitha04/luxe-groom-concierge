import { useMemo, useState } from "react";
import { Sparkles, Wand2, MapPin, Star, IndianRupee, Check } from "lucide-react";

const SALONS = [
  {
    id: "mirrors",
    name: "Mirrors Luxury Salon",
    area: "Jubilee Hills",
    match: 98,
    reasoning: "Master Imran specialises in Tollywood red-carpet fades; private suite open Sat 7:30 PM.",
    tags: ["Private Suite", "Sandalwood ritual", "Champagne welcome"],
    price: 6800,
  },
  {
    id: "truefitt",
    name: "Truefitt & Hill",
    area: "Banjara Hills",
    match: 95,
    reasoning: "Mayfair-trained barbers; matched to your preference for English heritage shaves.",
    tags: ["Heritage Suite", "Hot towel", "Cognac service"],
    price: 8400,
  },
  {
    id: "bblunt",
    name: "BBlunt Atelier",
    area: "Gachibowli",
    match: 92,
    reasoning: "Celebrity fade architect Karthik available within 24 hours; high colour expertise.",
    tags: ["Scalp diagnostic", "Colour atelier"],
    price: 5400,
  },
] as const;

const OCCASIONS = ["Wedding", "Engagement", "Photoshoot", "Date night", "Business"] as const;

const CELEBS = [
  { name: "Mahesh Babu", look: "Sharp fade · Princely polish", est: 6800 },
  { name: "Prabhas", look: "Long mane · Full beard", est: 9200 },
  { name: "Ram Charan", look: "Slicked pomp · Sculpted beard", est: 7600 },
  { name: "Vijay Deverakonda", look: "Tousled crop · Glow facial", est: 8400 },
  { name: "Nani", look: "Side-part · Trimmed beard", est: 6400 },
  { name: "Allu Arjun", look: "Textured top · Designer stubble", est: 7900 },
] as const;

export function Marketplace() {
  const [budget, setBudget] = useState(8000);
  const [occasion, setOccasion] = useState<(typeof OCCASIONS)[number]>("Wedding");

  const pkg = useMemo(() => {
    const items: { t: string; p: number }[] = [];
    if (budget >= 4000) items.push({ t: "Atelier Precision Cut", p: 5400 });
    if (budget >= 7000) items.push({ t: "Royal Straight Shave", p: 3800 });
    if (budget >= 12000) items.push({ t: "Nizam Gold Facial", p: 7900 });
    if (occasion === "Wedding" && budget >= 15000) items.push({ t: "Bridegroom 30-day Plan", p: 4500 });
    const total = items.reduce((s, i) => s + i.p, 0);
    return { items, total };
  }, [budget, occasion]);

  return (
    <div className="mx-auto max-w-7xl space-y-20 px-6 py-16">
      {/* Recommendation engine */}
      <section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold">AI Salon Recommendation Engine</div>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              Three ateliers, ranked by your <em className="text-gold-gradient italic">match score</em>.
            </h2>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SALONS.map((s) => (
            <article key={s.id} className="group relative flex flex-col rounded-sm border border-gold/30 bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-gold">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                    <MapPin className="h-3 w-3" /> {s.area}
                  </div>
                  <h3 className="mt-2 font-display text-2xl leading-tight">{s.name}</h3>
                </div>
                <div className="border-gold-hairline rounded-full bg-onyx/80 px-3 py-1.5 text-center backdrop-blur">
                  <div className="font-display text-base leading-none text-gold">{s.match}%</div>
                  <div className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-muted-foreground">Match</div>
                </div>
              </div>
              <div className="mt-5 rounded-sm border border-gold/15 bg-gold/5 p-3 text-xs leading-relaxed text-foreground/80">
                <span className="text-gold">Why: </span>{s.reasoning}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-full border border-gold/30 bg-gold/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-soft">{t}</span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-5">
                <span className="font-display text-2xl text-gold">₹{s.price.toLocaleString("en-IN")}</span>
                <button className="inline-flex items-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-primary-foreground shadow-gold">Reserve</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Package builder */}
      <section className="rounded-md border border-gold/30 bg-onyx/60 p-8 md:p-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold">
              <Wand2 className="h-3.5 w-3.5" /> AI Package Builder
            </div>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
              Compose a ritual to your <em className="text-gold-gradient italic">budget & occasion</em>.
            </h2>

            <div className="mt-8 space-y-6">
              <div>
                <label className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                  <span>Budget</span>
                  <span className="text-gold">₹{budget.toLocaleString("en-IN")}</span>
                </label>
                <input
                  type="range"
                  min={3000}
                  max={25000}
                  step={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="mt-3 w-full accent-[oklch(0.78_0.12_80)]"
                />
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>₹3k</span><span>₹25k</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">Occasion</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => setOccasion(o)}
                      className={`rounded-full border px-4 py-2 text-xs transition-all ${
                        occasion === o
                          ? "border-gold/60 bg-gold/10 text-gold"
                          : "border-border text-muted-foreground hover:border-gold/40"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-gold/30 bg-card/60 p-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold">
              <Sparkles className="h-3.5 w-3.5" /> Curated package
            </div>
            <h3 className="mt-3 font-display text-2xl">For your {occasion.toLowerCase()}</h3>

            <div className="mt-5 space-y-3">
              {pkg.items.length === 0 && (
                <div className="rounded-sm border border-border bg-onyx/40 p-4 text-sm text-muted-foreground">
                  Increase budget to unlock signature rituals.
                </div>
              )}
              {pkg.items.map((i) => (
                <div key={i.t} className="flex items-center justify-between rounded-sm border border-gold/15 bg-gold/5 px-4 py-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-gold" />
                    <span>{i.t}</span>
                  </div>
                  <span className="font-display text-gold">₹{i.p.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gold/20 pt-5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">Total</span>
              <span className="font-display text-3xl text-gold">₹{pkg.total.toLocaleString("en-IN")}</span>
            </div>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-primary-foreground shadow-gold">
              Reserve this package
            </button>
          </div>
        </div>
      </section>

      {/* Celebrity marketplace */}
      <section>
        <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Celebrity Style Marketplace</div>
        <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          Looks matched to <em className="text-gold-gradient italic">estimated cost</em>.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CELEBS.map((c) => (
            <article key={c.name} className="group rounded-sm border-gold-hairline bg-card/60 p-6 transition-all hover:-translate-y-1 hover:shadow-gold">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                  <Star className="h-3 w-3 fill-gold text-gold" /> Tollywood
                </div>
                <div className="flex items-center gap-1 rounded-full border border-gold/30 px-2.5 py-1 text-[10px] text-gold">
                  <IndianRupee className="h-3 w-3" />{c.est.toLocaleString("en-IN")}
                </div>
              </div>
              <h3 className="mt-3 font-display text-2xl">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.look}</p>
              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gold/40 px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground">
                Get this look
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
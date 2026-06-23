import { useMemo, useState } from "react";
import { TrendingUp, Flame, Calendar, Sparkles } from "lucide-react";

const TRENDS = [
  { rank: 1, name: "Korean Textured Cut", growth: 184, demand: 96, color: "oklch(0.78 0.12 80)" },
  { rank: 2, name: "Tollywood Sharp Fade", growth: 142, demand: 88, color: "oklch(0.72 0.14 60)" },
  { rank: 3, name: "Nizam Gold Facial", growth: 119, demand: 81, color: "oklch(0.68 0.13 50)" },
  { rank: 4, name: "Royal Straight Shave", growth: 96, demand: 74, color: "oklch(0.64 0.11 40)" },
  { rank: 5, name: "Designer Stubble Sculpt", growth: 78, demand: 69, color: "oklch(0.60 0.10 30)" },
  { rank: 6, name: "Scalp Detox Ritual", growth: 64, demand: 61, color: "oklch(0.56 0.09 20)" },
] as const;

const NEIGHBOURHOOD_HEAT = [
  { area: "Jubilee Hills", index: 94 },
  { area: "Banjara Hills", index: 88 },
  { area: "Gachibowli", index: 76 },
  { area: "HITEC City", index: 71 },
  { area: "Madhapur", index: 64 },
] as const;

const WEDDING_PLAN = [
  { d: 30, t: "Skin diagnostic + scalp detox", note: "Mirrors Jubilee · 90 min" },
  { d: 25, t: "Hair colour gloss + shape preview", note: "BBlunt Gachibowli" },
  { d: 21, t: "Nizam Gold Facial — Round 1", note: "Brightening base" },
  { d: 14, t: "Beard architecture session", note: "Truefitt & Hill" },
  { d: 10, t: "Precision cut · final shape", note: "Master Imran" },
  { d: 7, t: "Nizam Gold Facial — Round 2", note: "Lymphatic sculpt" },
  { d: 3, t: "Royal Straight Shave rehearsal", note: "Single-blade ritual" },
  { d: 1, t: "Touch-up + scent ceremony", note: "On-site mobile suite" },
  { d: 0, t: "Wedding day — Bridegroom suite", note: "Stylist on standby 4h" },
] as const;

export function Trends() {
  const max = Math.max(...TRENDS.map((t) => t.growth));
  const [activeDay, setActiveDay] = useState<number>(30);
  const active = useMemo(() => WEDDING_PLAN.find((p) => p.d === activeDay) ?? WEDDING_PLAN[0], [activeDay]);

  return (
    <div className="mx-auto max-w-7xl space-y-20 px-6 py-16">
      {/* Trends dashboard */}
      <section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold">
              <TrendingUp className="h-3.5 w-3.5" /> Hyderabad Grooming Trends
            </div>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              What the city is <em className="text-gold-gradient italic">booking</em> this week.
            </h2>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-gold/30 bg-onyx/60 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-gold md:inline-flex">
            <Flame className="h-3 w-3" /> Live · updated 2 min ago
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Bar chart */}
          <div className="rounded-md border border-gold/30 bg-onyx/60 p-6 lg:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold-soft">Top rituals · WoW growth %</div>
            <div className="mt-6 space-y-4">
              {TRENDS.map((t) => (
                <div key={t.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-3">
                      <span className="font-display text-lg text-gold">#{t.rank}</span>
                      <span className="font-display">{t.name}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      +{t.growth}% · <span className="text-gold">{t.demand} demand</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-card">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(t.growth / max) * 100}%`, background: `linear-gradient(90deg, ${t.color}, oklch(0.85 0.12 85))` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neighbourhood heat */}
          <div className="rounded-md border-gold-hairline bg-card/60 p-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold-soft">Neighbourhood demand index</div>
            <div className="mt-6 space-y-5">
              {NEIGHBOURHOOD_HEAT.map((n) => (
                <div key={n.area}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{n.area}</span>
                    <span className="font-display text-gold">{n.index}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-onyx">
                    <div className="h-full rounded-full bg-[var(--gradient-gold)]" style={{ width: `${n.index}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-sm border border-gold/20 bg-gold/5 p-3 text-xs text-muted-foreground">
              <span className="text-gold">Insight: </span>Jubilee Hills demand for Korean Textured Cut up 184% vs last week.
            </div>
          </div>
        </div>
      </section>

      {/* Wedding planner */}
      <section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold">
              <Calendar className="h-3.5 w-3.5" /> AI Wedding Groom Planner
            </div>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              A <em className="text-gold-gradient italic">30-day</em> ceremony for the groom.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Each milestone is scheduled, reserved and reconfirmed by your concierge.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-md border border-gold/30 bg-onyx/60 p-8">
          {/* timeline track */}
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <div className="relative flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {WEDDING_PLAN.map((m) => {
                const isActive = m.d === activeDay;
                return (
                  <button
                    key={m.d}
                    onClick={() => setActiveDay(m.d)}
                    className="group flex shrink-0 flex-col items-center gap-2"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border text-xs font-display transition-all ${
                        isActive
                          ? "border-gold bg-[var(--gradient-gold)] text-primary-foreground shadow-gold"
                          : "border-gold/30 bg-onyx text-gold-soft hover:border-gold/60"
                      }`}
                    >
                      {m.d === 0 ? "Day" : `T-${m.d}`}
                    </span>
                    <span className={`text-[10px] uppercase tracking-[0.2em] ${isActive ? "text-gold" : "text-muted-foreground"}`}>
                      {m.d === 0 ? "0" : `${m.d}d`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-sm border border-gold/30 bg-card/60 p-6 md:col-span-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold">
                <Sparkles className="h-3.5 w-3.5" /> {active.d === 0 ? "Wedding day" : `T-${active.d} days`}
              </div>
              <h3 className="mt-3 font-display text-3xl leading-tight">{active.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{active.note}</p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-primary-foreground shadow-gold">
                Lock this milestone
              </button>
            </div>
            <div className="rounded-sm border-gold-hairline bg-onyx/40 p-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold-soft">Plan summary</div>
              <div className="mt-4 space-y-3">
                {WEDDING_PLAN.slice(0, 5).map((m) => (
                  <div key={m.d} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{m.d === 0 ? "Wedding day" : `T-${m.d}`}</span>
                    <span className="text-foreground/80">{m.t.split("·")[0]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-gold/20 pt-4 text-[10px] uppercase tracking-[0.25em] text-gold">
                9 milestones · Reserved
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import { useMemo, useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  IndianRupee,
  Users,
  Sparkles,
  Calendar as CalendarIcon,
  Scissors,
  Crown,
  Star,
  AlertCircle,
  Tag,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const FORECAST = [
  { day: "Mon", load: 42 },
  { day: "Tue", load: 38 },
  { day: "Wed", load: 51 },
  { day: "Thu", load: 64 },
  { day: "Fri", load: 95, alert: true },
  { day: "Sat", load: 88 },
  { day: "Sun", load: 72 },
];

const REVENUE = [
  { name: "Royal Straight Shave", pct: 28, rev: 412000 },
  { name: "Atelier Precision Cut", pct: 34, rev: 498000 },
  { name: "Nizam Gold Facial", pct: 21, rev: 308000 },
  { name: "Bridal Groom Package", pct: 17, rev: 251000 },
];

const SEGMENTS = [
  { name: "Luxury Regulars", count: 184, ltv: "₹ 84k", color: "from-gold/40 to-gold/10" },
  { name: "Corporate Executives", count: 312, ltv: "₹ 46k", color: "from-emerald-400/30 to-emerald-400/5" },
  { name: "Wedding Grooms", count: 96, ltv: "₹ 1.2L", color: "from-rose-400/30 to-rose-400/5" },
];

const STYLISTS = [
  {
    name: "Master Aarav Khatri",
    spec: ["Royal shave", "Hot towel ritual", "Beard architecture"],
    rating: 4.96,
    bookings: 412,
    conflicts: 0,
    portfolio: ["Mahesh Babu fade", "Naga Chaitanya stubble"],
  },
  {
    name: "Master Karthik Vaidya",
    spec: ["Celebrity fades", "Korean textured cut", "Color correction"],
    rating: 4.92,
    bookings: 388,
    conflicts: 2,
    portfolio: ["Allu Arjun pomp", "Vijay textured crop"],
  },
  {
    name: "Master Reema Sundar",
    spec: ["24K Gold facial", "Lymphatic sculpt", "Pre-wedding glow"],
    rating: 4.98,
    bookings: 276,
    conflicts: 1,
    portfolio: ["Bridal radiance", "Editorial skin"],
  },
];

const HOURS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const DAYS = ["Wed", "Thu", "Fri", "Sat", "Sun"];

type SlotState = "free" | "booked" | "hold" | "vip";

const SEED: Record<string, SlotState> = {
  "Wed-11:00": "booked", "Wed-14:00": "hold", "Wed-17:00": "booked",
  "Thu-10:00": "booked", "Thu-15:00": "vip", "Thu-18:00": "booked",
  "Fri-12:00": "booked", "Fri-17:00": "booked", "Fri-18:00": "booked", "Fri-19:00": "vip",
  "Sat-11:00": "vip", "Sat-13:00": "booked", "Sat-16:00": "booked", "Sat-18:00": "booked",
  "Sun-12:00": "hold", "Sun-15:00": "booked",
};

function cellClass(s: SlotState) {
  switch (s) {
    case "booked": return "bg-foreground/15 text-muted-foreground border-foreground/10";
    case "hold": return "bg-amber-400/15 text-amber-200 border-amber-400/30";
    case "vip": return "bg-gradient-to-br from-gold/30 to-gold/5 text-gold border-gold/40";
    default: return "bg-transparent text-muted-foreground/70 border-foreground/10 hover:border-gold/40 hover:text-foreground";
  }
}

export function SalonPortal() {
  const [slots, setSlots] = useState<Record<string, SlotState>>(SEED);
  const [liveBookingCount, setLiveBookingCount] = useState<number | null>(null);
  const [metricLoading, setMetricLoading] = useState(true);

  useEffect(() => {
    async function fetchTotalBookings() {
      try {
        setMetricLoading(true);
        const { count, error } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });

        if (!error && count !== null) {
          setLiveBookingCount(count);
        }
      } catch (err) {
        console.error("Failed to read platform metric count:", err);
      } finally {
        setMetricLoading(false);
      }
    }
    fetchTotalBookings();
  }, []);

  const toggle = (key: string) => {
    setSlots((p) => {
      const cur = p[key] ?? "free";
      const next: SlotState = cur === "free" ? "booked" : cur === "booked" ? "hold" : cur === "hold" ? "vip" : "free";
      return { ...p, [key]: next };
    });
  };

  const totalRev = useMemo(() => REVENUE.reduce((a, r) => a + r.rev, 0), []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
            <Crown className="h-3 w-3" /> Atelier control room
          </div>
          <h1 className="mt-3 font-display text-4xl tracking-tight">Salon Management Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mirrors Luxury Salon · Jubilee Hills · Owner view</p>
        </div>
        <div className="hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/15 to-transparent px-5 py-3 text-right md:block">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80">Live revenue today</div>
          <div className="font-display text-2xl text-foreground">₹ 1,84,500</div>
        </div>
      </div>

      {/* Dynamic pricing banner */}
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/20 via-gold/5 to-transparent p-5">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-gold/50 bg-background/60">
              <Tag className="h-5 w-5 text-gold" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Dynamic pricing intelligence</div>
              <div className="font-display text-xl">Book at 3 PM, Save ₹300 · Off-peak surge ends in 02:14:08</div>
            </div>
          </div>
          <button className="rounded-full border border-gold/60 bg-gold px-5 py-2 text-xs uppercase tracking-[0.25em] text-primary-foreground hover:bg-gold/90 cursor-pointer">
            Apply pricing rules
          </button>
        </div>
      </div>

      {/* Owner metrics grid */}
      <div className="grid gap-5 lg:grid-cols-4">
        {/* NEW: Live Supabase Relational Synchronization Telemetry Widget */}
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-500 font-bold">
              <CalendarIcon className="h-4 w-4" /> Active Bookings
            </div>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[8px] uppercase tracking-widest text-emerald-300">
              PostgreSQL Live
            </span>
          </div>
          <div className="my-4">
            <div className="font-display text-5xl font-black text-foreground tracking-tight flex items-center gap-2">
              {metricLoading ? (
                <RefreshCw className="h-8 w-8 text-gold animate-spin" />
              ) : (
                liveBookingCount ?? 0
              )}
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">Appointments synced via Supabase client</p>
          </div>
          <p className="text-[11px] text-muted-foreground/90 leading-relaxed border-t border-gold/10 pt-2">
            Dynamic real-time dashboard registration. Counters increment immediately upon client generation of a secure Royal Pass checkout signature.
          </p>
        </div>

        {/* Forecast */}
        <div className="rounded-2xl border border-gold/15 bg-card/40 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-gold" /> AI Demand Forecast
            </div>
            <span className="rounded-full border border-rose-400/40 bg-rose-400/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-rose-300">
              <AlertTriangle className="mr-1 inline h-3 w-3" /> +45% Fri rush
            </span>
          </div>
          <div className="mt-5 flex h-40 items-end gap-2">
            {FORECAST.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t ${d.alert ? "bg-gradient-to-t from-gold to-amber-200" : "bg-foreground/15"}`}
                  style={{ height: `${d.load}%` }}
                />
                <span className={`text-[10px] uppercase tracking-widest ${d.alert ? "text-gold" : "text-muted-foreground"}`}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Friday evening predicted at 95% capacity. Recommend opening 2 extra suites and surge-pricing late slots.
          </p>
        </div>

        {/* Revenue */}
        <div className="rounded-2xl border border-gold/15 bg-card/40 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <IndianRupee className="h-4 w-4 text-gold" /> AI Revenue Dashboard
            </div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-300">+18% WoW</span>
          </div>
          <div className="mt-4 font-display text-3xl">₹ {(totalRev / 100000).toFixed(2)}L</div>
          <div className="mt-4 space-y-3">
            {REVENUE.map((r) => (
              <div key={r.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-foreground/90 text-[11px] truncate max-w-[140px]">{r.name}</span>
                  <span className="text-muted-foreground text-[11px] shrink-0">{r.pct}% · ₹{(r.rev / 1000).toFixed(0)}k</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <div className="h-full bg-gradient-to-r from-gold to-amber-200" style={{ width: `${r.pct * 2.8}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Segments */}
        <div className="rounded-2xl border border-gold/15 bg-card/40 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <Users className="h-4 w-4 text-gold" /> AI Customer Segmentation
          </div>
          <div className="mt-5 space-y-3">
            {SEGMENTS.map((s) => (
              <div
                key={s.name}
                className={`rounded-xl border border-gold/20 bg-gradient-to-r ${s.color} p-4`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-sm leading-tight">{s.name}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                      {s.count} guests · Avg LTV {s.ltv}
                    </div>
                  </div>
                  <Sparkles className="h-4 w-4 text-gold shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stylist profiles */}
      <div className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold">02 · Atelier roster</div>
            <h2 className="mt-1 font-display text-2xl">Stylist Profiles</h2>
          </div>
          <button className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-gold cursor-pointer">
            + Invite stylist
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {STYLISTS.map((s) => (
            <div key={s.name} className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-card/40 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/30 to-transparent">
                    <Scissors className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <div className="font-display text-lg">{s.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-gold text-gold" /> {s.rating} · {s.bookings} bookings
                    </div>
                  </div>
                </div>
                {s.conflicts > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-rose-400/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-rose-300">
                    <AlertCircle className="h-3 w-3" /> {s.conflicts} conflict{s.conflicts > 1 ? "s" : ""}
                  </span>
                ) : (
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-300">
                    Clear
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.spec.map((t) => (
                  <span key={t} className="rounded-full border border-gold/20 bg-background/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 border-t border-gold/10 pt-3 text-xs text-muted-foreground">
                Portfolio · {s.portfolio.join(" · ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slot matrix */}
      <div className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold">03 · Real-time booking grid</div>
            <h2 className="mt-1 font-display text-2xl flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-gold" /> Slot Booking Matrix
            </h2>
          </div>
          <div className="flex gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Legend swatch="bg-transparent border-foreground/10" label="Free" />
            <Legend swatch="bg-foreground/15" label="Booked" />
            <Legend swatch="bg-amber-400/15 border-amber-400/30" label="Hold" />
            <Legend swatch="bg-gradient-to-br from-gold/30 to-gold/5 border-gold/40" label="VIP" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gold/15 bg-card/40 p-4">
          <div className="min-w-[680px]">
            <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <div></div>
              {DAYS.map((d) => (
                <div key={d} className="px-2 py-1 text-center">{d}</div>
              ))}
            </div>
            <div className="mt-2 space-y-2">
              {HOURS.map((h) => (
                <div key={h} className="grid grid-cols-[80px_repeat(5,1fr)] gap-2">
                  <div className="flex items-center px-2 text-xs text-muted-foreground">{h}</div>
                  {DAYS.map((d) => {
                    const k = `${d}-${h}`;
                    const s = slots[k] ?? "free";
                    return (
                      <button
                        key={k}
                        onClick={() => toggle(k)}
                        className={`h-10 rounded-md border text-[10px] uppercase tracking-widest transition-all cursor-pointer ${cellClass(s)}`}
                      >
                        {s === "free" ? "+" : s}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Tap a cell to cycle: free → booked → hold → VIP. Conflicts are surfaced on the stylist's profile in real time.
        </p>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded-sm border ${swatch}`} />
      {label}
    </div>
  );
}
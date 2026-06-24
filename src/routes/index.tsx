import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Search,
  MapPin,
  Scissors,
  Calendar,
  Clock,
  ChevronRight,
  X,
  Crown,
  Star,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Check,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import treatmentShave from "@/assets/treatment-shave.jpg";
import treatmentHair from "@/assets/treatment-hair.jpg";
import treatmentFacial from "@/assets/treatment-facial.jpg";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import look4 from "@/assets/look-4.jpg";
import { AIConcierge } from "@/components/dashboard/AIConcierge";
import { Marketplace } from "@/components/dashboard/Marketplace";
import { Trends } from "@/components/dashboard/Trends";
import { VisualStudio } from "@/components/dashboard/VisualStudio";
import { SalonPortal } from "@/components/dashboard/SalonPortal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nizams.ai — Hyderabad's Ultra-Luxury Grooming Concierge" },
      {
        name: "description",
        content:
          "AI-curated bookings at Hyderabad's finest grooming ateliers. Tollywood-grade styling across Jubilee Hills, Banjara Hills and Gachibowli.",
      },
      { property: "og:title", content: "Nizams.ai — Ultra-Luxury Grooming, Hyderabad" },
      {
        property: "og:description",
        content:
          "Your AI concierge for celebrity-grade haircuts, royal shaves and skincare in Hyderabad.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const NEIGHBOURHOODS = ["Jubilee Hills", "Banjara Hills", "Gachibowli", "HITEC City"] as const;

const TREATMENTS = [
  {
    title: "Royal Straight Shave",
    subtitle: "Hot towel · Single-blade · Sandalwood ritual",
    duration: "55 min",
    price: 3800,
    image: treatmentShave,
    tag: "Signature",
  },
  {
    title: "Atelier Precision Cut",
    subtitle: "Master stylist · Scissor-over-comb · Bespoke wash",
    duration: "1h 20m",
    price: 5400,
    image: treatmentHair,
    tag: "Most loved",
  },
  {
    title: "Nizam Gold Facial",
    subtitle: "24K leaf · Kumkumadi · Lymphatic sculpt",
    duration: "1h 40m",
    price: 7900,
    image: treatmentFacial,
    tag: "Editor's pick",
  },
] as const;

const LOOKS = [
  {
    name: "The Maverick",
    inspo: "Inspired by Prabhas",
    detail: "Long mane · Full beard · Hero silhouette",
    image: look3,
    duration: "2h 30m",
    price: 9200,
  },
  {
    name: "The Heir",
    inspo: "Inspired by Mahesh Babu",
    detail: "Sharp fade · Tight stubble · Princely polish",
    image: look2,
    duration: "1h 45m",
    price: 6800,
  },
  {
    name: "The Rebel",
    inspo: "Inspired by Ram Charan",
    detail: "Slicked pomp · Sculpted beard",
    image: heroImg,
    duration: "2h 00m",
    price: 7600,
  },
  {
    name: "The Romantic",
    inspo: "Inspired by Vijay Deverakonda",
    detail: "Tousled crop · Soft stubble · Glow facial",
    image: look4,
    duration: "2h 15m",
    price: 8400,
  },
  {
    name: "The Classicist",
    inspo: "Inspired by Nani",
    detail: "Side-part · Trimmed beard · Sharpened lines",
    image: look1,
    duration: "1h 50m",
    price: 6400,
  },
] as const;

const SUGGESTIONS = [
  "Wedding-ready beard shape near Jubilee Hills this Saturday",
  "A 90-minute facial in Banjara Hills before 7pm",
  "Get me the Mahesh Babu fade in Gachibowli",
  "Father–son grooming suite, Sunday morning",
] as const;

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

type CartItem = {
  id: string;
  title: string;
  meta: string;
  duration: string;
  price: number;
};

function Index() {
  const [query, setQuery] = useState("");
  const [activeArea, setActiveArea] = useState<string>("Jubilee Hills");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [conciergeQuery, setConciergeQuery] = useState<string | null>(null);
  const [tab, setTab] = useState<"home" | "concierge" | "marketplace" | "trends" | "studio" | "portal">("home");

  const total = useMemo(() => cart.reduce((s, c) => s + c.price, 0), [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => (prev.find((p) => p.id === item.id) ? prev : [...prev, item]));
    setDrawerOpen(true);
  };

  const runConcierge = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setConciergeQuery(trimmed);
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        document.getElementById("treatments")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const conciergeResults = useMemo(
    () => [
      {
        id: "mirrors-jubilee",
        salon: "Mirrors Luxury Salon",
        area: "Jubilee Hills",
        match: 98,
        stylist: "Master Imran Qureshi",
        stylistNote: "12 yrs · Tollywood red-carpet specialist",
        tags: ["Private Suite Allocated", "Single-blade ritual", "Sandalwood finish"],
        slot: "Saturday · 7:30 PM",
        duration: "1h 45m",
        price: 6800,
      },
      {
        id: "truefitt-banjara",
        salon: "Truefitt & Hill",
        area: "Banjara Hills",
        match: 95,
        stylist: "Master Arjun Reddy",
        stylistNote: "Trained in Mayfair · House barber",
        tags: ["English Heritage Suite", "Hot towel ceremony", "Cognac service"],
        slot: "Sunday · 11:00 AM",
        duration: "2h 00m",
        price: 8400,
      },
      {
        id: "bblunt-gachibowli",
        salon: "BBlunt Atelier",
        area: "Gachibowli",
        match: 92,
        stylist: "Master Karthik Vaidya",
        stylistNote: "Celebrity fade architect",
        tags: ["Private Suite Allocated", "Scalp diagnostic", "Champagne welcome"],
        slot: "Friday · 6:15 PM",
        duration: "1h 30m",
        price: 5400,
      },
    ],
    [],
  );

  const visibleResults = conciergeResults.slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Nav */}
      <header className="relative z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:py-8">
          <a href="#" className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-gold" strokeWidth={1.4} />
            <span className="font-display text-2xl tracking-wide">
              Nizams<span className="text-gold">.ai</span>
            </span>
          </a>
          <nav className="hidden items-center gap-2 text-sm md:flex">
            {([
              { id: "home", label: "Home" },
              { id: "concierge", label: "AI Concierge" },
              { id: "marketplace", label: "Marketplace & Packages" },
              { id: "trends", label: "Trends" },
              { id: "studio", label: "AI Visual Studio" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
                  tab === t.id
                    ? "border border-gold/60 bg-gold/10 text-gold"
                    : "border border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setTab(tab === "portal" ? "home" : "portal")}
            className={`border-gold-hairline rounded-sm px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-all ${
              tab === "portal"
                ? "bg-gold text-primary-foreground"
                : "bg-transparent text-foreground hover:bg-gold hover:text-primary-foreground"
            }`}
          >
            {tab === "portal" ? "Exit portal" : "Salon portal"}
          </button>
        </div>
      </header>

      {tab === "concierge" && <AIConcierge />}
      {tab === "marketplace" && <Marketplace />}
      {tab === "trends" && <Trends />}
      {tab === "studio" && <VisualStudio />}
      {tab === "portal" && <SalonPortal />}

      {tab === "home" && (
      <>
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.78_0.12_80/0.18),transparent_70%)]" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-16 pt-12 md:pt-20 lg:grid-cols-12 lg:gap-8">
          {/* Left: copy + search */}
          <div className="lg:col-span-7">
            <div className="border-gold-hairline mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-gold-soft">
              <span className="h-1 w-1 rounded-full bg-gold" /> Hyderabad · Members only
            </div>
            <h1 className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.98] tracking-tight">
              An <em className="font-medium not-italic text-gold-gradient italic">AI concierge</em>
              <br />
              for the city's
              <br />
              finest grooming.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Tell us the look. We curate the master, the atelier and the hour —
              from Jubilee Hills to Gachibowli. Discreet. Cinematic. Effortlessly arranged.
            </p>

            {/* AI Search Concierge */}
            <div className="relative mt-10">
              <div className="absolute -inset-px rounded-md bg-[var(--gradient-gold)] opacity-60 blur-[1px]" />
              <div className="relative rounded-md border border-gold/40 bg-onyx/80 p-2 shadow-elegant backdrop-blur-xl">
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <div className="flex flex-1 items-center gap-3 px-4 py-3">
                    <Sparkles className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          runConcierge(query);
                        }
                      }}
                      placeholder="Ask the concierge — “Royal shave in Banjara Hills, Friday 7pm”"
                      className="w-full bg-transparent font-display text-lg text-foreground placeholder:text-muted-foreground/70 focus:outline-none md:text-xl"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-2 pb-2 md:pb-0">
                    <div className="hidden items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-xs text-muted-foreground md:flex">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                      {activeArea}
                    </div>
                    <button
                      onClick={() => runConcierge(query || SUGGESTIONS[0])}
                      className="group inline-flex items-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
                    >
                      <Search className="h-4 w-4" />
                      Curate
                    </button>
                  </div>
                </div>
              </div>

              {/* suggestion chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => runConcierge(s)}
                    className="border-gold-hairline rounded-full px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-gold/10 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* area pills */}
              <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-gold-soft">Serving</span>
                {NEIGHBOURHOODS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setActiveArea(n)}
                    className={`rounded-full border px-3 py-1.5 transition-all ${
                      activeArea === n
                        ? "border-gold/60 bg-gold/10 text-gold"
                        : "border-border hover:border-gold/40 hover:text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* trust strip */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { k: "42", v: "Curated ateliers" },
                { k: "9.6", v: "Avg. concierge rating" },
                { k: "24/7", v: "Personal stylist" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-3xl text-gold md:text-4xl">{s.k}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: editorial portrait */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-sm border-gold-hairline shadow-elegant">
              <img
                src={heroImg}
                alt="Tollywood-inspired styling at Nizams.ai"
                width={1600}
                height={1280}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold-soft">
                    House signature
                  </div>
                  <div className="mt-1 font-display text-2xl">The Nizam</div>
                </div>
                <div className="border-gold-hairline rounded-full bg-onyx/70 px-3 py-1 text-xs text-gold backdrop-blur">
                  ₹12,400
                </div>
              </div>
            </div>
            {/* floating callout */}
            <div className="absolute -left-6 top-10 hidden w-56 rounded-sm border border-gold/30 bg-card/90 p-4 shadow-elegant backdrop-blur md:block">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" /> Concierge note
              </div>
              <p className="mt-2 font-display text-sm leading-snug text-foreground/90">
                "I've held a 7:30pm slot with Master Imran at The Marble Room, Jubilee Hills."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section id="treatments" className="relative border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          {conciergeQuery ? (
            <>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold">
                    <Sparkles className="h-3.5 w-3.5" /> AI Concierge Recommendations
                  </div>
                  <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
                    For "<em className="text-gold-gradient italic">{conciergeQuery}</em>"
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                    Three ateliers shortlisted across {activeArea} and nearby. Suites and masters held
                    privately for the next 30 minutes.
                  </p>
                </div>
                <button
                  onClick={() => setConciergeQuery(null)}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-gold"
                >
                  ← Back to all rituals
                </button>
              </div>

              <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {visibleResults.map((r) => (
                  <article
                    key={r.id}
                    className="group relative flex flex-col overflow-hidden rounded-sm border border-gold/30 bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-gold"
                  >
                    <div className="absolute -inset-px rounded-sm bg-[var(--gradient-gold)] opacity-0 blur-sm transition-opacity group-hover:opacity-30" />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                          <MapPin className="h-3 w-3" /> {r.area}
                        </div>
                        <h3 className="mt-2 font-display text-2xl leading-tight">{r.salon}</h3>
                      </div>
                      <div className="border-gold-hairline rounded-full bg-onyx/80 px-3 py-1.5 text-center backdrop-blur">
                        <div className="font-display text-base text-gold leading-none">{r.match}%</div>
                        <div className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                          Match
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-5 border-t border-border/60 pt-4">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        Assigned master
                      </div>
                      <div className="mt-1 font-display text-lg text-foreground">{r.stylist}</div>
                      <div className="text-xs text-muted-foreground">{r.stylistNote}</div>
                    </div>

                    <div className="relative mt-4 flex flex-wrap gap-1.5">
                      {r.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-gold/30 bg-gold/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-soft"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="relative mt-5 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gold" /> {r.slot}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gold" /> {r.duration}
                      </span>
                    </div>

                    <div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-5">
                      <span className="font-display text-2xl text-gold">{formatINR(r.price)}</span>
                      <button
                        onClick={() =>
                          addToCart({
                            id: r.id,
                            title: `${r.salon} — ${r.area}`,
                            meta: `${r.stylist} · ${r.slot}`,
                            duration: r.duration,
                            price: r.price,
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
                      >
                        Reserve via Concierge <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
          <>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-gold">01 — The treatments</div>
              <h2 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
                Rituals from the city's<br />
                most discerning ateliers.
              </h2>
            </div>
            <a
              href="#"
              className="hidden items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold md:inline-flex"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TREATMENTS.map((t) => (
              <article
                key={t.title}
                className="group relative overflow-hidden rounded-sm border-gold-hairline bg-card transition-all hover:-translate-y-1 hover:shadow-gold"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.title}
                    width={1024}
                    height={1280}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute left-4 top-4 rounded-full border border-gold/40 bg-onyx/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold backdrop-blur">
                  {t.tag}
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <h3 className="font-display text-2xl">{t.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gold" /> {t.duration}
                      </span>
                      <span className="font-display text-lg text-gold">{formatINR(t.price)}</span>
                    </div>
                    <button
                      onClick={() =>
                        addToCart({
                          id: t.title,
                          title: t.title,
                          meta: t.subtitle,
                          duration: t.duration,
                          price: t.price,
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-sm border border-gold/40 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
                    >
                      Reserve <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          </>
          )}
        </div>
      </section>

      {/* Tollywood Looks */}
      <section id="looks" className="relative border-t border-border/60 bg-onyx/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold">02 — The icons</div>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
              Get the <em className="text-gold-gradient italic">Tollywood</em> look.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              A house of stylists who've shaped silver-screen icons. Choose a hero —
              we will choreograph cut, beard, skin and scent to match.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
            {LOOKS.map((l, i) => (
              <button
                key={l.name}
                onClick={() =>
                  addToCart({
                    id: `look-${l.name}`,
                    title: l.name + " — Full transformation",
                    meta: l.inspo,
                    duration: l.duration,
                    price: l.price,
                  })
                }
                className={`group relative overflow-hidden rounded-sm border-gold-hairline text-left transition-all hover:-translate-y-1 hover:shadow-gold ${
                  i === 0 ? "col-span-2 row-span-2 lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <div className={`${i === 0 ? "aspect-[4/5]" : "aspect-[3/4]"} overflow-hidden`}>
                  <img
                    src={l.image}
                    alt={l.name}
                    width={1024}
                    height={1280}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{l.inspo}</div>
                  <div className="mt-1 font-display text-xl md:text-2xl">{l.name}</div>
                  <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{l.detail}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-base text-gold">{formatINR(l.price)}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
                      Book <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Concierge promise / footer */}
      <section id="concierge" className="relative border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="text-[11px] uppercase tracking-[0.3em] text-gold">03 — The promise</div>
              <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
                A private grooming concierge,<br />
                guided by an exacting AI.
              </h2>
              <p className="mt-5 max-w-xl text-muted-foreground">
                Every booking is curated, vetted and reconfirmed by a human stylist
                within ten minutes. Cancel without question. Reschedule with a whisper.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-sm bg-[var(--gradient-gold)] px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground shadow-gold">
                  Become a member
                </button>
                <button className="border-gold-hairline rounded-sm px-6 py-3 text-xs uppercase tracking-[0.25em] text-foreground hover:bg-gold/10">
                  WhatsApp the concierge
                </button>
              </div>
            </div>
            <div className="border-gold-hairline space-y-5 rounded-sm bg-card/60 p-8">
              {[
                { icon: Scissors, t: "House masters only", d: "≤ 1% of Hyderabad's stylists curated." },
                { icon: MapPin, t: "Door-step possible", d: "Mobile suite to Jubilee, Banjara, HITEC." },
                { icon: Calendar, t: "Held in 60 seconds", d: "Confirmed slots, never waitlists." },
              ].map((f) => (
                <div key={f.t} className="flex items-start gap-4">
                  <div className="border-gold-hairline rounded-sm p-2.5">
                    <f.icon className="h-4 w-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-display text-lg">{f.t}</div>
                    <div className="mt-0.5 text-sm text-muted-foreground">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-gold" />
              <span>© {new Date().getFullYear()} Nizams.ai · Hyderabad, India</span>
            </div>
            <div className="flex gap-6 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-gold">Privacy</a>
              <a href="#" className="hover:text-gold">Press</a>
              <a href="#" className="hover:text-gold">Careers</a>
            </div>
          </div>
        </div>
      </section>

      </>
      )}

      {/* Floating booking summary */}
      <BookingDrawer
        cart={cart}
        total={total}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        remove={(id) => setCart((p) => p.filter((c) => c.id !== id))}
        area={activeArea}
      />
    </div>
  );
}

function BookingDrawer({
  cart,
  total,
  open,
  setOpen,
  remove,
  area,
}: {
  cart: CartItem[];
  total: number;
  open: boolean;
  setOpen: (b: boolean) => void;
  remove: (id: string) => void;
  area: string;
}) {
  const count = cart.length;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [passId] = useState(
    () => "NZ-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
  );

  // Reset wizard each time the drawer is reopened
  useEffect(() => {
    if (open) {
      setStep(1);
      setConfirmed(false);
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const slot = "Saturday · 7:30 PM";
  const stylist = "Master Imran Qureshi";
  const atelier = `Mirrors Luxury Salon · ${area}`;

  const canProceed1 = cart.length > 0;
  const canProceed2 = name.trim().length > 1 && phone.trim().length >= 10;

  const headline =
    step === 1
      ? "Review your curated experience"
      : step === 2
        ? "VIP guestlist details"
        : "Final flourish";

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-gold/50 bg-onyx/90 px-5 py-3.5 shadow-gold backdrop-blur-xl transition-all hover:-translate-y-0.5 ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-label="Open booking"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gradient-gold)] text-primary-foreground">
          <Calendar className="h-4 w-4" strokeWidth={2} />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-onyx bg-gold-deep px-1 text-[10px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </span>
        <div className="text-left">
          <div className="text-[9px] uppercase tracking-[0.25em] text-gold-soft">Your suite</div>
          <div className="font-display text-base leading-tight">
            {count === 0
              ? "Begin booking"
              : `${count} ritual${count > 1 ? "s" : ""} · ${formatINR(total)}`}
          </div>
        </div>
      </button>

      {/* Modal wizard */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        {/* backdrop */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute inset-0 h-full w-full cursor-default bg-onyx/80 backdrop-blur-md"
        />

        {/* dialog */}
        <div
          className={`absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl transition-all duration-500 md:bottom-auto md:top-1/2 md:-translate-y-1/2 ${
            open ? "translate-y-0" : "translate-y-full md:translate-y-[calc(-50%+40px)]"
          }`}
        >
          <div className="relative overflow-hidden rounded-t-2xl border border-gold/40 bg-onyx/95 shadow-elegant backdrop-blur-2xl md:rounded-2xl">
            {/* gold halo */}
            <div className="pointer-events-none absolute -inset-px rounded-t-2xl bg-[var(--gradient-gold)] opacity-20 blur md:rounded-2xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-gold/20 px-6 py-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  {confirmed ? "Royal Pass issued" : `Step ${step} of 3`}
                </div>
                <div className="mt-1 font-display text-2xl">
                  {confirmed ? "Welcome to Nizams.ai" : headline}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-gold"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Stepper */}
            {!confirmed && (
              <div className="relative flex items-center gap-2 border-b border-gold/10 px-6 py-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex flex-1 items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-medium transition-all ${
                        step >= n
                          ? "border-gold bg-[var(--gradient-gold)] text-primary-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {step > n ? <Check className="h-3 w-3" strokeWidth={3} /> : n}
                    </div>
                    {n < 3 && (
                      <div
                        className={`h-px flex-1 transition-colors ${
                          step > n ? "bg-gold" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Body */}
            <div className="relative max-h-[65vh] overflow-y-auto px-6 py-6">
              {step === 1 && !confirmed && (
                <div className="space-y-5">
                  <div className="border-gold-hairline rounded-md bg-card/40 p-5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                      <MapPin className="h-3 w-3" /> Assigned atelier
                    </div>
                    <div className="mt-2 font-display text-xl">{atelier}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      With {stylist} · Private suite reserved
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-gold">
                        <Calendar className="h-3 w-3" /> {slot}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-muted-foreground">
                        <Sparkles className="h-3 w-3 text-gold" /> Pre-selected by AI
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      Your rituals
                    </div>
                    {cart.length === 0 ? (
                      <div className="mt-3 rounded-md border border-dashed border-gold/30 px-5 py-8 text-center">
                        <Sparkles className="mx-auto h-5 w-5 text-gold" />
                        <p className="mt-2 font-display text-base">Your suite is empty.</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Pick a ritual or Tollywood look to begin.
                        </p>
                      </div>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {cart.map((c) => (
                          <li
                            key={c.id}
                            className="flex items-start justify-between gap-3 rounded-sm border border-border/60 bg-card/60 p-3"
                          >
                            <div className="min-w-0">
                              <div className="truncate font-display text-base">{c.title}</div>
                              <div className="mt-0.5 truncate text-xs text-muted-foreground">
                                {c.meta}
                              </div>
                              <div className="mt-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold">
                                <Clock className="h-3 w-3" /> {c.duration}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="font-display text-base text-gold">
                                {formatINR(c.price)}
                              </div>
                              <button
                                onClick={() => remove(c.id)}
                                className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && !confirmed && (
                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    A whisper to the maître. We'll text a discreet confirmation within sixty seconds.
                  </p>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                      Full name
                    </span>
                    <div className="mt-2 flex items-center gap-3 rounded-sm border border-gold/30 bg-card/60 px-4 py-3 transition-colors focus-within:border-gold">
                      <User className="h-4 w-4 text-gold" />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="As it should appear on the pass"
                        className="w-full bg-transparent font-display text-lg focus:outline-none"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                      Phone number
                    </span>
                    <div className="mt-2 flex items-center gap-3 rounded-sm border border-gold/30 bg-card/60 px-4 py-3 transition-colors focus-within:border-gold">
                      <Phone className="h-4 w-4 text-gold" />
                      <span className="font-display text-lg text-muted-foreground">+91</span>
                      <input
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/[^\d\s]/g, "").slice(0, 12))
                        }
                        inputMode="numeric"
                        placeholder="98XXX XXXXX"
                        className="w-full bg-transparent font-display text-lg focus:outline-none"
                      />
                    </div>
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    Stored privately. Used only by the concierge to reach you.
                  </p>
                </div>
              )}

              {step === 3 && !confirmed && (
                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    A final glance before we dispatch the master.
                  </p>
                  <div className="border-gold-hairline space-y-3 rounded-md bg-card/40 p-5 text-sm">
                    <Row label="Guest" value={name || "—"} />
                    <Row label="Phone" value={phone ? `+91 ${phone}` : "—"} />
                    <Row label="Atelier" value={atelier} />
                    <Row label="Master" value={stylist} />
                    <Row label="Slot" value={slot} />
                    <Row label="Rituals" value={`${count}`} />
                    <div className="border-t border-gold/20 pt-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        Total
                      </span>
                      <span className="font-display text-2xl text-gold">{formatINR(total)}</span>
                    </div>
                  </div>
                </div>
              )}

              {confirmed && (
                <RoyalPass
                  passId={passId}
                  name={name || "Esteemed guest"}
                  atelier={atelier}
                  stylist={stylist}
                  slot={slot}
                  total={total}
                />
              )}
            </div>

            {/* Footer / actions */}
            {!confirmed ? (
              <div className="relative flex items-center justify-between gap-3 border-t border-gold/20 bg-onyx/80 px-6 py-4">
                <button
                  onClick={() => (step === 1 ? setOpen(false) : setStep((s) => (s - 1) as 1 | 2))}
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-gold"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {step === 1 ? "Close" : "Back"}
                </button>

                {step < 3 ? (
                  <button
                    onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                    disabled={step === 1 ? !canProceed1 : !canProceed2}
                    className="inline-flex items-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
                  >
                    Continue <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmed(true)}
                    className="inline-flex items-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
                  >
                    Confirm appointment <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                )}
              </div>
            ) : (
              <div className="relative flex items-center justify-end gap-3 border-t border-gold/20 bg-onyx/80 px-6 py-4">
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-primary-foreground shadow-gold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <span className="truncate text-right font-display text-base text-foreground">{value}</span>
    </div>
  );
}

function RoyalPass({
  passId,
  name,
  atelier,
  stylist,
  slot,
  total,
}: {
  passId: string;
  name: string;
  atelier: string;
  stylist: string;
  slot: string;
  total: number;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* checkmark */}
      <div className="animate-ring-pop relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gradient-gold)] shadow-gold">
        <svg viewBox="0 0 52 52" className="h-10 w-10">
          <path
            className="animate-draw-check"
            d="M14 27 l8 8 l16 -18"
            fill="none"
            stroke="oklch(0.14 0.008 60)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mt-5 text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Confirmed</div>
        <h3 className="mt-1 font-display text-3xl">Your Royal Pass is ready.</h3>
      </div>

      {/* Ticket */}
      <div className="relative mt-7 w-full max-w-md">
        <div className="absolute -inset-1 rounded-lg bg-[var(--gradient-gold)] opacity-40 blur" />
        <div className="relative overflow-hidden rounded-lg border border-gold/50 bg-gradient-to-br from-onyx via-charcoal to-onyx p-6">
          <div className="gold-shimmer pointer-events-none absolute inset-x-0 top-0 h-px" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-gold" />
              <span className="font-display text-lg">
                Nizams<span className="text-gold">.ai</span>
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-soft">
              Royal Pass
            </span>
          </div>

          <div className="mt-5 border-t border-dashed border-gold/30 pt-5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Guest
            </div>
            <div className="mt-1 font-display text-2xl text-gold-gradient">{name}</div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Atelier
              </div>
              <div className="mt-1 font-display text-base leading-tight">{atelier}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Master
              </div>
              <div className="mt-1 font-display text-base leading-tight">{stylist}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Slot
              </div>
              <div className="mt-1 font-display text-base leading-tight">{slot}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Total
              </div>
              <div className="mt-1 font-display text-base text-gold">{formatINR(total)}</div>
            </div>
          </div>

          {/* perforation */}
          <div className="relative my-6 h-px border-t border-dashed border-gold/30">
            <span className="absolute -left-9 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-background" />
            <span className="absolute -right-9 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-background" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Pass No.
              </div>
              <div className="mt-1 font-display text-lg tracking-[0.2em] text-gold">{passId}</div>
            </div>
            <Star className="h-5 w-5 fill-gold text-gold" />
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-sm text-center text-xs text-muted-foreground">
        A concierge will reconfirm by WhatsApp within ten minutes. Reschedule with a whisper.
      </p>
    </div>
  );
}

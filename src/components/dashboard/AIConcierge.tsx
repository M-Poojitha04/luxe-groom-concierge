import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Sparkles, Bot, User as UserIcon, ClipboardList } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const QUESTIONNAIRE = [
  "What's the occasion — wedding, shoot, date night, or business?",
  "Your hair texture: straight, wavy, curly or coily?",
  "Skin sensitivity (1–5) and any allergens we should avoid?",
  "Preferred neighbourhood — Jubilee, Banjara, Gachibowli or HITEC?",
  "Budget band for this experience (₹)?",
] as const;

const SEED: Msg[] = [
  {
    role: "ai",
    text: "Aadab. I'm your Nizams.ai grooming concierge. Ask me anything — or begin the Virtual Beauty Consultation to receive a fully tailored ritual.",
  },
];

export function AIConcierge() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [qIndex, setQIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const recRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const reply = (text: string) => {
    // Lightweight scripted concierge response
    const lower = text.toLowerCase();
    let r = "Noted. I'll shortlist three ateliers and hold a private suite within the hour.";
    if (lower.includes("wedding")) r = "Beautiful — I'll plan a 30-day groom timeline with skin, hair and grooming milestones.";
    else if (lower.includes("fade") || lower.includes("cut")) r = "A precision fade suits you. Master Karthik at BBlunt Gachibowli has Friday 6:15 PM open.";
    else if (lower.includes("facial")) r = "Try the Nizam Gold Facial — 24K leaf, kumkumadi, lymphatic sculpt. 1h 40m at Mirrors Jubilee.";
    else if (lower.includes("shave")) r = "The Royal Straight Shave at Truefitt & Hill Banjara — single-blade, hot towel, cognac service.";
    return r;
  };

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", text: value }];
    if (qIndex !== null) {
      const nextAnswers = [...answers, value];
      setAnswers(nextAnswers);
      const ni = qIndex + 1;
      if (ni < QUESTIONNAIRE.length) {
        setQIndex(ni);
        setMessages([...next, { role: "ai", text: QUESTIONNAIRE[ni] }]);
      } else {
        setQIndex(null);
        setMessages([
          ...next,
          {
            role: "ai",
            text: `Profile curated. Based on your answers I recommend: Atelier Precision Cut + Nizam Gold Facial at Mirrors Luxury Salon, Jubilee Hills. Estimated investment ₹13,300 — held privately for 30 minutes.`,
          },
        ]);
      }
      return;
    }
    setMessages([...next, { role: "ai", text: reply(value) }]);
  };

  const startQuestionnaire = () => {
    setQIndex(0);
    setAnswers([]);
    setMessages((m) => [...m, { role: "ai", text: QUESTIONNAIRE[0] }]);
  };

  const toggleVoice = () => {
    if (typeof window === "undefined") return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [...m, { role: "ai", text: "Voice concierge requires a supported browser (Chrome/Edge). Please type instead." }]);
      return;
    }
    if (listening && recRef.current) {
      recRef.current.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      setTimeout(() => send(transcript), 200);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="text-[11px] uppercase tracking-[0.3em] text-gold">AI Grooming Concierge</div>
        <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          Converse with your <em className="text-gold-gradient italic">private stylist</em>.
        </h2>

        <div className="mt-8 overflow-hidden rounded-md border border-gold/30 bg-onyx/70 shadow-elegant backdrop-blur">
          <div ref={scrollRef} className="h-[440px] space-y-4 overflow-y-auto p-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    m.role === "ai" ? "bg-[var(--gradient-gold)] text-primary-foreground" : "border border-border bg-card text-foreground"
                  }`}
                >
                  {m.role === "ai" ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-md px-4 py-3 text-sm leading-relaxed ${
                    m.role === "ai"
                      ? "border border-gold/20 bg-card/60 text-foreground"
                      : "bg-gold/15 text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gold/20 p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoice}
                aria-label="Voice concierge"
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all ${
                  listening
                    ? "border-gold bg-[var(--gradient-gold)] text-primary-foreground shadow-gold"
                    : "border-gold/40 text-gold hover:bg-gold/10"
                }`}
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {listening && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold/40" />}
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={listening ? "Listening…" : "Speak or type to your concierge"}
                className="flex-1 bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                onClick={() => send()}
                className="inline-flex items-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-primary-foreground shadow-gold"
              >
                Send <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-md border border-gold/30 bg-card/60 p-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold">
            <ClipboardList className="h-3.5 w-3.5" /> Virtual Beauty Consultation
          </div>
          <h3 className="mt-3 font-display text-xl">A 5-question profile</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Skin, hair, occasion and budget — your bespoke ritual in under a minute.
          </p>
          <button
            onClick={startQuestionnaire}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--gradient-gold)] px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-primary-foreground shadow-gold"
          >
            Begin consultation
          </button>
          {qIndex !== null && (
            <div className="mt-4 text-[10px] uppercase tracking-[0.25em] text-gold-soft">
              Question {qIndex + 1} of {QUESTIONNAIRE.length}
            </div>
          )}
        </div>

        <div className="rounded-md border-gold-hairline bg-onyx/40 p-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold">
            <Sparkles className="h-3.5 w-3.5" /> Try asking
          </div>
          <div className="mt-4 space-y-2">
            {[
              "Wedding-ready beard near Jubilee Hills",
              "Get me the Mahesh Babu fade",
              "90-minute facial in Banjara Hills",
            ].map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full rounded-sm border border-border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
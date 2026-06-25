import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Sparkles, Bot, User as UserIcon, ClipboardList, Loader2, Scissors, Sparkle } from "lucide-react";
import { handleConciergeChat } from "@/lib/aiServices";

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

function FormattedAiMessage({ text }: { text: string }) {
  try {
    const trimmed = text.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const data = JSON.parse(trimmed);

      return (
        <div className="space-y-4 min-w-[280px]">
          <div className="text-amber-500 font-display text-sm tracking-wide border-b border-gold/15 pb-1 flex items-center gap-2">
            <Sparkle className="h-3.5 w-3.5 animate-spin-slow" /> Your Bespoke Grooming Prescription
          </div>

          {data.beard_suggestion && (
            <div className="p-3 rounded bg-onyx/60 border border-gold/10 space-y-1 shadow-sm">
              <div className="text-[11px] uppercase tracking-wider text-gold font-semibold">
                🧔 Beard Architecture
              </div>
              <div className="text-xs font-bold text-foreground mb-1">{data.beard_suggestion.style}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{data.beard_suggestion.details}</p>
            </div>
          )}

          {data.hair_suggestion && (
            <div className="p-3 rounded bg-onyx/60 border border-gold/10 space-y-1 shadow-sm">
              <div className="text-[11px] uppercase tracking-wider text-gold font-semibold flex items-center gap-1">
                <Scissors className="h-3 w-3" /> Crown Hairstyle
              </div>
              <div className="text-xs font-bold text-foreground mb-1">{data.hair_suggestion.style}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{data.hair_suggestion.details}</p>
            </div>
          )}

          {data.text && <p className="text-xs text-muted-foreground leading-relaxed">{data.text}</p>}
        </div>
      );
    }
  } catch (e) {
  }

  return <div className="whitespace-pre-wrap">{text}</div>;
}

export function AIConcierge() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [qIndex, setQIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const recRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const send = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;

    setInput("");
    const nextMessages: Msg[] = [...messages, { role: "user", text: value }];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      if (qIndex !== null) {
        const nextAnswers = [...answers, value];
        setAnswers(nextAnswers);
        const ni = qIndex + 1;

        if (ni < QUESTIONNAIRE.length) {
          setQIndex(ni);
          setMessages([...nextMessages, { role: "ai", text: QUESTIONNAIRE[ni] }]);
          setIsLoading(false);
        } else {
          setQIndex(null);
          const generationPrompt = `The user has completed their luxury consultation questionnaire. Summary of responses:\n${QUESTIONNAIRE.map((q, idx) => `- ${q}: ${nextAnswers[idx]}`).join("\n")}\n\nGenerate a highly customized royal grooming summary report suggesting a specific combination package and assigned ateliers in Hyderabad. Enforce JSON format output with exact keys 'beard_suggestion': {'style': '', 'details': ''} and 'hair_suggestion': {'style': '', 'details': ''}.`;

          const aiResponse = await handleConciergeChat(generationPrompt, []);
          const finalReport = typeof aiResponse === "object" ? JSON.stringify(aiResponse) : aiResponse;

          setMessages([...nextMessages, { role: "ai", text: finalReport }]);
          setIsLoading(false);
        }
        return;
      }

      const chatHistoryContext = messages.map(msg => ({
        role: msg.role === "ai" ? "assistant" : "user",
        parts: [{ text: msg.text }]
      }));

      const aiResponse = await handleConciergeChat(value, chatHistoryContext);
      const replyText = typeof aiResponse === "object" ? JSON.stringify(aiResponse) : aiResponse;

      setMessages([...nextMessages, { role: "ai", text: replyText }]);
    } catch (error) {
      console.error("AI Concierge Transaction Block Crashed:", error);
      setMessages([...nextMessages, { role: "ai", text: "An error occurred while contacting your concierge pool. Please check your network configuration." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuestionnaire = () => {
    setQIndex(0);
    setAnswers([]);
    setMessages((m) => [...m, { role: "ai", text: `Virtual Consultation Initiated.\n\n${QUESTIONNAIRE[0]}` }]);
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
          <div ref={scrollRef} className="h-[440px] space-y-4 overflow-y-auto p-6 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${m.role === "ai" ? "bg-amber-500/10 border-amber-500/20 text-gold" : "border-border bg-card text-foreground"
                    }`}
                >
                  {m.role === "ai" ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-md px-4 py-3 text-sm leading-relaxed ${m.role === "ai"
                    ? "border border-gold/20 bg-card/60 text-foreground"
                    : "bg-amber-500/10 border border-amber-500/20 text-foreground"
                    }`}
                >
                  {m.role === "ai" ? <FormattedAiMessage text={m.text} /> : m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-gold/60 animate-pulse pl-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Nizam Concierge is tailoring your assessment response...</span>
              </div>
            )}
          </div>

          <div className="border-t border-gold/20 p-3 bg-onyx/40">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoice}
                aria-label="Voice concierge"
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all cursor-pointer ${listening
                  ? "border-amber-500 bg-amber-500 text-black shadow-gold"
                  : "border-gold/40 text-gold hover:bg-gold/10"
                  }`}
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {listening && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-amber-500/40" />}
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={isLoading}
                placeholder={listening ? "Listening…" : "Speak or type to your concierge"}
                className="flex-1 bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => send()}
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center gap-2 rounded-sm border border-gold/40 text-gold bg-transparent hover:bg-gold hover:text-black text-xs font-bold uppercase tracking-[0.2em] px-6 py-3.5 transition-all duration-300 cursor-pointer"              >
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
            type="button"
            onClick={startQuestionnaire}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-sm border border-gold/40 text-gold bg-transparent hover:bg-gold hover:text-black text-xs font-bold uppercase tracking-[0.2em] px-6 py-3.5 transition-all duration-300 cursor-pointer"          >
            Begin consultation
          </button>
          {qIndex !== null && (
            <div className="mt-4 text-[10px] uppercase tracking-[0.25em] text-gold-soft text-center animate-pulse">
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
                type="button"
                key={s}
                disabled={isLoading}
                onClick={() => send(s)}
                className="w-full rounded-sm border border-border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground disabled:opacity-40 cursor-pointer"
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
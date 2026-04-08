import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ShieldCheck, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { SuggestedQuestions } from "@/components/SuggestedQuestions";

const API_URL = import.meta.env.VITE_API_URL;


interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

const baseQuestions = [
  "I have a headache",
  "Fever and cough",
  "Chest pain what to do?",
  "Cold vs flu",
  "Stomach pain help",
  "Skin rash causes",
];

function buildDynamicQuestions(context: string): string[] {
  const text = context.toLowerCase();

  if (text.includes("headache") || text.includes("migraine")) {
    return [
      "Since when do you have headache?",
      "Is it one side or full head pain?",
      "Any nausea or light sensitivity?",
      "Can I take paracetamol now?",
      "Which doctor for migraine?",
      "When should I go to hospital for headache?",
    ];
  }

  if (text.includes("fever") || text.includes("cough") || text.includes("cold") || text.includes("flu")) {
    return [
      "How to reduce fever at home?",
      "Do I need COVID or flu test?",
      "Which syrup is safe for dry cough?",
      "When is fever considered serious?",
      "Should I visit a general physician?",
      "How much water should I drink during fever?",
    ];
  }

  if (text.includes("chest") || text.includes("breath") || text.includes("heart")) {
    return [
      "Is chest pain an emergency?",
      "Can anxiety cause chest pain?",
      "Should I go to ER now?",
      "Which doctor for chest discomfort?",
      "What warning signs should I watch?",
      "Can gas pain feel like chest pain?",
    ];
  }

  if (text.includes("stomach") || text.includes("acidity") || text.includes("vomit") || text.includes("nausea")) {
    return [
      "What to eat during stomach pain?",
      "Home remedy for acidity?",
      "When should I see gastroenterologist?",
      "Can infection cause stomach cramps?",
      "Is this food poisoning?",
      "How long should I wait before doctor visit?",
    ];
  }

  if (text.includes("rash") || text.includes("skin") || text.includes("itch")) {
    return [
      "Can this be an allergy rash?",
      "What cream is safe for rash?",
      "Should I avoid specific foods?",
      "When to consult dermatologist?",
      "Can heat cause skin rash?",
      "How to reduce itching quickly?",
    ];
  }

  return baseQuestions;
}

export default function SymptomChecker() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "ai", text: "Hi! I'm your AI health assistant. Describe your symptoms and I'll suggest the right specialist for you." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedQuestions = useMemo(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const fromContext = buildDynamicQuestions(lastUser?.text || input);
    const merged = [...fromContext, ...baseQuestions];
    return Array.from(new Set(merged)).slice(0, 8);
  }, [messages, input]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (prefillText?: string) => {
    const finalText = (prefillText ?? input).trim();
    if (!finalText) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: finalText,
    };

    setMessages((prev) => [...prev, userMsg]);
    const userInput = finalText;
    setInput("");
    setTyping(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          role: "patient",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.detail || "Server error. Please try again later.");
      }

      const reply = typeof data?.response === "string" && data.response.trim().length > 0
        ? data.response
        : "⚠️ The AI service returned an empty response. Please try again.";

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: reply,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: err instanceof Error ? `⚠️ ${err.message}` : "⚠️ Server error. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-20 pb-4 min-h-screen flex flex-col">
          <div className="container max-w-2xl flex-1 flex flex-col">
            <div className="mb-4">
              <h1 className="font-heading font-bold text-2xl">AI Symptom Checker</h1>
              <p className="text-muted-foreground text-sm mt-1">Describe your symptoms for specialist recommendations</p>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[60vh] pr-1">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                        }`}
                      dangerouslySetInnerHTML={{
                        __html: (msg.text || "")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n\d\.\s/g, (match) => `<br /><strong>${match.trim()}</strong> `)
                          .replace(/\n/g, "<br />")
                      }}
                    />
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-muted-foreground/40"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 text-xs mb-3">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Symptom Checker provides guidance only. For diagnosis and treatment, consult a qualified doctor.
              </span>
            </div>

            {/* Input */}
            <SuggestedQuestions
              questions={suggestedQuestions}
              onSelect={(question) => {
                setInput(question);
                inputRef.current?.focus();
              }}
              onSendNow={(question) => send(question)}
            />

            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Describe your symptoms..."
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Button onClick={send} className="rounded-xl px-4" disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
}

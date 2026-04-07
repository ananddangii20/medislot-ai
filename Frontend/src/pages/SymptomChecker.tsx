import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, AlertTriangle, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

export default function SymptomChecker() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "ai", text: "Hi! I'm your AI health assistant. Describe your symptoms and I'll suggest the right specialist for you." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
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
                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
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
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs mb-3">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              This is not medical advice. Please consult a doctor for proper diagnosis.
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
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

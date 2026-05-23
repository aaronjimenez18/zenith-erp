"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Zap, TrendingUp, Package, Receipt, BrainCircuit, FileText, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Stats {
  revenue: number;
  revenueChange: number;
  salesCount: number;
  todayRevenue: number;
  expenses: number;
  expensesChange: number;
  productsCount: number;
}

export default function AIAssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "model"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentChats, setRecentChats] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { text: "¿Qué productos están en riesgo de ruptura de stock?", icon: TrendingUp, color: "text-slate-500", bg: "bg-slate-500/10" },
    { text: "¿Qué productos tienen el mayor margen de contribución hoy?", icon: Package, color: "text-slate-500", bg: "bg-slate-500/10" },
    { text: "¿Qué productos están estancados?", icon: Receipt, color: "text-slate-500", bg: "bg-slate-500/10" },
    { text: "¿Cuál es el producto con mayor impacto en nuestra ganancia?", icon: Zap, color: "text-slate-500", bg: "bg-slate-500/10" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("ai-recent-chats");
    if (saved) {
      setRecentChats(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/chat", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error(err);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const addToRecent = (message: string) => {
    setRecentChats((prev) => {
      const updated = [message, ...prev.filter((c) => c !== message)].slice(0, 5);
      if (typeof window !== "undefined") {
        localStorage.setItem("ai-recent-chats", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const sendMessage = async (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;

    addToRecent(message);

    const userMessage = { role: "user" as const, content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: messages.slice(-10) }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "model", content: data.text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "No se pudo conectar con el asistente. Intenta de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-700 font-sans relative z-10">
      <div className="flex h-[calc(100vh-theme(spacing.16))] md:h-screen w-full overflow-hidden">
        
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className="flex-1 flex flex-col relative z-10 pt-16 md:pt-0">
          <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/30 backdrop-blur-xl border-b border-white/40 sticky top-0 z-10 hidden md:flex">
            <div>
              <h1 className="text-slate-800 text-xl font-extrabold">Asistente IA</h1>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
                <h2 className="text-slate-800 text-4xl font-extrabold mb-4 tracking-tight">
                  ¿En qué puedo ayudarte hoy?
                </h2>
                <p className="text-slate-600 font-medium text-base max-w-md mb-12 leading-relaxed">
                  Consulta reportes de ventas, genera facturas o analiza tu inventario en tiempo real.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s.text)}
                      className="flex items-center gap-4 p-5 rounded-3xl glass-card border border-white/50 hover:bg-white/60 transition-all group text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl ${s.bg} flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <s.icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full p-6 space-y-8">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm backdrop-blur-sm border ${
                      msg.role === "user" ? "bg-white/60 border-white/50" : "bg-slate-700 border-white/20"
                    }`}>
                      {msg.role === "user" ? <User className="w-5 h-5 text-slate-700" /> : <Bot className="w-5 h-5 text-white" />}
                    </div>
                    
                    <div className={`group relative max-w-[85%] ${msg.role === "user" ? "text-right" : ""}`}>
                        <div className={`inline-block px-5 py-4 rounded-3xl text-[15px] font-medium leading-relaxed float-shadow ${
                        msg.role === "user" 
                            ? "glass-card border-0 text-slate-800 rounded-tr-none" 
                            : "bg-white/60 backdrop-blur-md shadow-sm border border-white/50 text-slate-800 rounded-tl-none"
                        }`}>
                        {msg.content}
                        
                        </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-700 flex items-center justify-center shadow-sm">
                      <Bot className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="bg-white/60 backdrop-blur-md border border-white/50 px-6 py-5 rounded-3xl rounded-tl-none shadow-sm">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} className="h-4" />
              </div>
            )}
          </main>

          {/* INPUT */}
          <footer className="p-4 md:p-6 bg-white/30 backdrop-blur-xl border-t border-white/40">
            <div className="max-w-4xl mx-auto relative">
              <div className="flex items-center gap-3 glass-input rounded-3xl p-1.5 pl-6 focus-within:bg-white/60 transition-all shadow-sm">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Escribe tu consulta a la IA..."
                  className="flex-1 bg-transparent py-4 text-base font-medium text-slate-800 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-xl"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
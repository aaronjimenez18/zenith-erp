"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Zap, TrendingUp, Package, Receipt, BrainCircuit, FileText, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Menu, X } from "lucide-react";

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
    { text: "¿Cuál es mi ganancia este mes?", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { text: "¿Qué productos debo reponer?", icon: Package, color: "text-amber-400", bg: "bg-amber-500/10" },
    { text: "Dame un resumen de ventas", icon: Receipt, color: "text-blue-400", bg: "bg-blue-500/10" },
    { text: "¿Tengo gastos muy altos?", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("ai-recent-chats");
    if (saved) {
      setRecentChats(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(console.error);
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
        { role: "model", content: "Error al conectar con Zenith AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans">
      <div className="flex h-screen w-full bg-white overflow-hidden">
        
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`w-64 border-r border-slate-200 bg-[#fcfdfe] flex flex-col fixed lg:relative inset-y-0 left-0 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-6">
             <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-slate-800 tracking-tight">AI Asistent</span>
             </div>
              
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Recientes</p>
                 {recentChats.length > 0 ? (
                   recentChats.map((item, i) => (
                       <div 
                        key={i} 
                        onClick={() => sendMessage(item)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-colors ${i === 0 ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-500 hover:bg-slate-100"}`}>
                           <FileText className="w-4 h-4 opacity-70" />
                           <span className="truncate">{item}</span>
                       </div>
                   ))
                 ) : (
                   <p className="text-xs text-slate-400 px-3">Sin conversaciones recientes</p>
                 )}
              </div>

              {stats && (
                <div className="mt-8 px-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Este mes</p>
                  <div className="space-y-3">
                    <div className="bg-emerald-50 rounded-xl p-3">
                      <div className="flex items-center justify-between text-emerald-600 text-xs font-medium mb-1">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3 h-3" />
                          Ingresos
                        </div>
                        {stats.revenueChange !== 0 && (
                          <div className={`flex items-center gap-0.5 ${stats.revenueChange > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {stats.revenueChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(stats.revenueChange).toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <div className="text-xl font-bold text-emerald-700">${stats.revenue.toLocaleString()}</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-blue-600 text-xs font-medium mb-1">
                        <Receipt className="w-3 h-3" />
                        Ventas
                      </div>
                      <div className="text-xl font-bold text-blue-700">{stats.salesCount}</div>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-3">
                      <div className="flex items-center justify-between text-rose-600 text-xs font-medium mb-1">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-3 h-3" />
                          Gastos
                        </div>
                        {stats.expensesChange !== 0 && (
                          <div className={`flex items-center gap-0.5 ${stats.expensesChange < 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {stats.expensesChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(stats.expensesChange).toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <div className="text-xl font-bold text-rose-700">${stats.expenses.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </aside>

        <div className="flex-1 flex flex-col relative">
          <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-md mr-2"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-slate-800 text-lg font-bold">Asistente ERP Inteligente</h1>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc]/50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
                <h2 className="text-slate-800 text-3xl font-extrabold mb-3 tracking-tight">
                  ¿En qué puedo ayudarte hoy?
                </h2>
                <p className="text-slate-500 text-base max-w-md mb-10 leading-relaxed">
                  Consulta reportes de ventas, genera facturas o analiza tu inventario en tiempo real.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s.text)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 transition-all group text-left"
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
                    <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                      msg.role === "user" ? "bg-slate-200" : "bg-indigo-600"
                    }`}>
                      {msg.role === "user" ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-white" />}
                    </div>
                    
                    <div className={`group relative max-w-[85%] ${msg.role === "user" ? "text-right" : ""}`}>
                        <div className={`inline-block px-5 py-3 rounded-2xl text-[14.5px] leading-relaxed shadow-sm border ${
                        msg.role === "user" 
                            ? "bg-white border-slate-200 text-slate-700 rounded-tr-none" 
                            : "bg-white border-slate-100 text-slate-700 rounded-tl-none"
                        }`}>
                        {msg.content}
                        
                        </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="bg-white border border-slate-100 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm">
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} className="h-4" />
              </div>
            )}
          </main>

          {/* INPUT */}
          <footer className="p-6 bg-white border-t border-slate-100">
            <div className="max-w-4xl mx-auto relative">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pl-5 focus-within:bg-white focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-sm">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Escribe tu consulta al ERP..."
                  className="flex-1 bg-transparent py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center active:scale-95 shadow-lg shadow-indigo-600/20"
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
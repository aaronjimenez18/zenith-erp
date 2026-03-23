"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function AIAssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "model"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Cual es mi ganancia este mes?",
    "Que productos debo reponer pronto?",
    "Dame un resumen de mis ventas",
    "Cual es mi producto estrella?",
    "Tengo gastos muy altos?",
    "Que me recomiendas vender mas?",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages.slice(-10),
        }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "model", content: data.text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Error al conectar con Zenith AI" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-gradient-to-r from-purple-900/40 to-slate-900">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <div>
          <h1 className="text-white font-semibold">Zenith AI Copilot</h1>
          <p className="text-xs text-slate-400">
            Tu asistente inteligente de negocio
          </p>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center max-w-xl mx-auto mt-10">
            <Bot className="w-16 h-16 mx-auto mb-6 text-purple-400 opacity-80" />
            <h2 className="text-white text-lg font-semibold mb-2">
              Hola, soy Zenith AI
            </h2>
            <p className="text-slate-400 text-sm">
              Puedo ayudarte a analizar tu inventario, ventas y rendimiento de
              tu negocio.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : ""
            }`}
          >
            {msg.role === "model" && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`px-4 py-3 rounded-xl text-sm shadow-md max-w-[70%] whitespace-pre-line
              ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Bot className="w-4 h-4 text-purple-400" />
            Zenith AI está pensando
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </div>
        )}

        {/* SUGERENCIAS */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-3">Sugerencias:</p>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="px-3 py-1 text-xs bg-slate-900 border border-slate-800 rounded-full text-slate-300 hover:bg-slate-800 hover:border-purple-500 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Pregúntame sobre tu negocio..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

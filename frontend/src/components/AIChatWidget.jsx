import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Copy, RotateCcw, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const AIChatWidget = ({ testId, testLabel }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI learning assistant. Ask me anything about your test, a concept, or a coding problem." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!user) return null;

  const send = async (overrideText) => {
    const text = overrideText ?? input;
    if (!text.trim() || sending) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setSending(true);
    try {
      const { data } = await api.post("/ai/chat", { message: text, testId });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I ran into an error reaching the AI service. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const regenerate = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) send(lastUser.content);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/30 p-4"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[92vw] h-[520px] glass rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <Bot size={18} className="text-brand-400" />
              <div>
                <p className="font-semibold text-sm">AI Learning Assistant</p>
                {testLabel && <p className="text-xs text-slate-400">Context: {testLabel}</p>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-xl px-3 py-2 max-w-[85%] ${
                      m.role === "user" ? "bg-brand-600 text-white" : "bg-white/5 text-slate-100"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        code: ({ inline, children, ...props }) =>
                          inline ? (
                            <code className="bg-black/30 px-1 rounded" {...props}>{children}</code>
                          ) : (
                            <pre className="bg-black/40 p-2 rounded-lg overflow-x-auto my-1">
                              <code {...props}>{children}</code>
                            </pre>
                          ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                    {m.role === "assistant" && (
                      <div className="flex gap-2 mt-1 opacity-60">
                        <button onClick={() => navigator.clipboard.writeText(m.content)} title="Copy">
                          <Copy size={12} />
                        </button>
                        {i === messages.length - 1 && (
                          <button onClick={regenerate} title="Regenerate">
                            <RotateCcw size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {sending && <div className="text-xs text-slate-400 animate-pulse">AI is typing...</div>}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask a question..."
                className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-400"
              />
              <button onClick={() => send()} className="bg-brand-500 hover:bg-brand-600 rounded-lg px-3">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;

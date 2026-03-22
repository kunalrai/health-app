'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Bot, ChevronDown, Sparkles, Phone } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ts: number;
}

const SESSION_KEY = 'kira_session';

function generateSessionId() {
  return `kira_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const GREETING =
  "Hi! I'm **Kira**, Dr. Veenoo Agarwal's AI assistant 👋\n\nI can help you:\n• Book an appointment\n• Check your upcoming appointments\n• Share diet or care advice from the doctor\n• Answer questions about our services\n\nHow can I help you today?";

export default function KiraWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING, ts: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(SESSION_KEY) || generateSessionId();
    }
    return generateSessionId();
  });
  const [convDbId, setConvDbId] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist session
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }, [sessionId]);

  // Init conversation in Convex
  useEffect(() => {
    fetch('/api/kira/conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => r.json())
      .then((d) => d.conversationId && setConvDbId(d.conversationId))
      .catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (open) setUnread(0);
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setUnread(0);
    }
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: Message = { role: 'user', content: text, ts: Date.now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch('/api/kira/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          sessionId,
          conversationDbId: convDbId,
        }),
      });
      const data = await res.json();
      const reply: Message = {
        role: 'assistant',
        content: data.reply || 'Sorry, something went wrong. Please try again.',
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, reply]);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I had trouble connecting. Please try again or call +91-9667769023.',
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, sessionId, convDbId, open]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Render markdown-lite (bold, bullet, newline)
  function renderContent(text: string) {
    return text
      .split('\n')
      .map((line, i) => {
        const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        const bullet = bold.startsWith('•') ? `<span style="padding-left:8px">${bold}</span>` : bold;
        return <p key={i} dangerouslySetInnerHTML={{ __html: bullet }} className="leading-relaxed" />;
      });
  }

  return (
    <>
      {/* ── Floating button ──────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-bg shadow-[0_4px_20px_rgba(13,115,119,0.4)] flex items-center justify-center hover:scale-105 transition-transform duration-200 group"
        aria-label="Chat with Kira"
      >
        {open ? (
          <ChevronDown className="w-6 h-6 text-white" />
        ) : (
          <>
            <Bot className="w-6 h-6 text-white" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </>
        )}
      </button>

      {/* ── Chat window ──────────────────────────────── */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[370px] max-h-[600px] flex flex-col rounded-2xl shadow-2xl border border-gray-100 bg-white overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="gradient-bg px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm leading-none">Kira</p>
              <p className="text-white/75 text-xs mt-0.5">Dr. Veenoo Agarwal's AI Assistant</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="tel:+919667769023"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                title="Call clinic"
              >
                <Phone className="w-4 h-4 text-white" />
              </a>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Powered-by bar */}
          <div className="bg-primary/5 border-b border-gray-100 px-4 py-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-primary font-medium">Powered by Claude AI</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm space-y-1 ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-gray-50 text-text-primary rounded-tl-sm border border-gray-100'
                  }`}
                >
                  {renderContent(m.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
            {['Book appointment', 'My appointments', 'Diet advice', 'Contact clinic'].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); setTimeout(send, 50); }}
                className="flex-shrink-0 text-[11px] font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 rounded-full px-3 py-1 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary/50 focus-within:bg-white transition-colors">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message…"
                className="flex-1 bg-transparent text-sm text-text-primary placeholder-gray-400 outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

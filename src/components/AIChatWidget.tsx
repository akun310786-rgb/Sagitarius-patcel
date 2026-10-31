import React, { useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

type ChatMessage = { role: 'user' | 'model'; text: string };

const starterMessage: ChatMessage = {
  role: 'model',
  text: 'Halo! Saya asisten Sagitarius Parcel. Silakan tanya tentang paket, cara mendaftar, atau cara menabung. Saya AI, jadi informasi penting tetap bisa dikonfirmasi ke tim kami.'
};

const suggestions = ['Bagaimana cara mendaftar?', 'Apa isi paket parcel?', 'Bagaimana cara setor tabungan?'];

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [isOpen, messages, isSending]);

  const sendMessage = async (value = draft) => {
    const text = value.trim();
    if (!text || isSending) return;

    const userMessage: ChatMessage = { role: 'user', text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft('');
    setError('');
    setIsSending(true);

    try {
      const history = nextMessages.slice(1).slice(-10);
      if (history[0]?.role === 'model') history.shift();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || typeof result.reply !== 'string') {
        throw new Error(result.error || 'Asisten sedang tidak dapat menjawab. Silakan coba lagi.');
      }
      setMessages((current) => [...current, { role: 'model', text: result.reply }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Pesan belum terkirim. Silakan coba lagi.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <section className="w-[min(22rem,calc(100vw-2rem))] h-[min(34rem,calc(100dvh-7rem))] bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col" aria-label="Chat asisten Sagitarius Parcel">
          <header className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center"><Bot className="w-5 h-5" /></span>
              <div>
                <h2 className="font-bold text-sm">Asisten Sagitarius</h2>
                <p className="text-[10px] text-purple-200 flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-300" /> Dijawab dengan AI</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Tutup chat" className="p-2 rounded-xl hover:bg-white/10"><X className="w-4 h-4" /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-gradient-to-b from-purple-50/70 to-white" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${message.role === 'user' ? 'bg-purple-900 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-md'}`}>
                  {message.text}
                </p>
              </div>
            ))}
            {messages.length === 1 && !isSending && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} className="text-left text-[10px] font-medium text-purple-800 bg-white border border-purple-200 hover:border-purple-500 rounded-full px-3 py-2 transition">
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {isSending && <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle className="w-4 h-4 animate-spin text-purple-700" /> Menyiapkan jawaban…</div>}
            {error && <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-2.5" role="alert">{error}</div>}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={(event) => { event.preventDefault(); void sendMessage(); }} className="p-3 border-t border-slate-100 bg-white">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100">
              <label className="sr-only" htmlFor="visitor-chat-message">Tulis pertanyaan</label>
              <textarea id="visitor-chat-message" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={500} rows={1} placeholder="Tulis pertanyaan Anda…" className="max-h-24 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-xs outline-none" disabled={isSending} />
              <button type="submit" disabled={!draft.trim() || isSending} aria-label="Kirim pesan" className="w-10 h-10 shrink-0 rounded-xl bg-purple-900 text-white flex items-center justify-center hover:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed"><Send className="w-4 h-4" /></button>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 text-center">Pesan diproses AI Google. Jangan kirim password atau informasi pribadi.</p>
            <a href={`https://wa.me/62${COMPANY_INFO.phone.replace(/^0/, '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="block text-center text-[10px] font-semibold text-purple-800 hover:underline mt-1">Perlu bantuan tim? Hubungi WhatsApp resmi</a>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? 'Tutup chat asisten' : 'Tanya asisten Sagitarius Parcel'} aria-expanded={isOpen} className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 px-4 py-3 shadow-xl shadow-purple-950/25 border border-white font-bold transition hover:-translate-y-0.5">
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        <span className="text-xs">{isOpen ? 'Tutup chat' : 'Tanya AI'}</span>
      </button>
    </div>
  );
};

'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  const handleChipClick = (text: string) => {
    sendMessage({ text });
  };

  const suggestionChips = [
    "What services does Globency Media offer?",
    "How can custom AI agents help my business?",
    "Book a discovery call with Sunny Aulakh",
  ];

  return (
    <main className="flex flex-col h-screen max-w-4xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-slate-100">Globency AI Agent</h1>
            <p className="text-xs text-slate-400">Powered by Globency Media</p>
          </div>
        </div>
        <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </span>
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-slate-900 rounded-full border border-slate-800 text-indigo-400">
              <Sparkles size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-200">Welcome to Globency Media</h2>
              <p className="text-sm text-slate-400 max-w-md mt-1">
                Ask about our performance marketing, web development, custom AI solutions, or founder Sunny Aulakh.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-lg pt-4">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(chip)}
                  className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-2 rounded-lg transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const messageText = m.parts
              ? m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')
              : '';

            return (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role !== 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {messageText}
                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="pt-2">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Globency AI..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </main>
  );
}
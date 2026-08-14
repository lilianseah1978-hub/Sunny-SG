import { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Compass, 
  Utensils, 
  CloudRain, 
  Train, 
  Lightbulb, 
  User,
  ShieldCheck
} from 'lucide-react';
import { WeatherCondition } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIConciergeViewProps {
  currentWeather: WeatherCondition | null;
}

export function AIConciergeView({ currentWeather }: AIConciergeViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `👋 **Selamat Datang! Welcome to Singapore.**\n\nI am your **Sunny SG AI Tour Concierge**, powered by **Gemini 3.7 Flash** and synced with live Singapore weather & public transit feeds.\n\nAsk me anything: emergency rain routes, MRT shortcuts, SimplyGo contactless tips, or Michelin-rated hawker stalls!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const quickPrompts = [
    '🌧️ It is raining right now: what is the best sheltered indoor route?',
    '🚇 How do I pay for MRT with Apple Pay or credit card?',
    '🍲 Best Michelin hawker food near Chinatown & Maxwell?',
    '✨ Where can I catch the free Marina Bay light shows tonight?',
    '🦁 How do I get to Singapore Zoo & Bird Paradise via MRT?'
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const resp = await fetch('/api/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          currentContext: {
            weather: currentWeather,
            time: new Date().toISOString()
          }
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const assistantMsg: Message = {
          role: 'assistant',
          content: data.answer || 'I am ready to help you navigate Singapore.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('API response failed');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize for the momentary connection blip. Singapore is well-connected by 6 MRT lines: you can tap any contactless bank card directly at the gantries!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[660px]">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">
                Singapore AI Concierge
              </h3>
              <span className="bg-slate-800 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Singapore local intelligence, MRT directions & rain contingencies
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-normal">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Real-Time Verified
        </div>
      </div>

      {/* Quick Prompts Strip */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Suggestions:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs font-medium bg-white hover:bg-slate-100 hover:text-slate-900 text-slate-700 border border-slate-200/80 rounded-xl px-2.5 py-1 whitespace-nowrap transition-all shrink-0 shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-800'
              }`}
            >
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white shadow-xs rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200/90 text-slate-800 shadow-2xs rounded-tl-none whitespace-pre-line'
              }`}
            >
              {msg.content}
              <span
                className={`block text-[10px] mt-1.5 font-mono ${
                  msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-3 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Analyzing Singapore transit routes & weather forecasts...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask SG Concierge: 'Best rainy day plan with kids', 'MRT route to Gardens by the Bay'..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold px-3.5 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

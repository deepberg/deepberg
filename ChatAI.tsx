
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, User, Bot, Loader2, Globe, MapPin, ExternalLink, 
  Brain, Zap, Plus, ChevronLeft, ChevronRight, MessageSquare,
  Copy, Check, Clock, Paperclip, X, Eye, FileVideo, Bolt
} from 'lucide-react';
import { gemini } from '../services/geminiService';
import { UserState, GenerationRecord, ChatSession, ChatMessage } from '../types';

interface ChatAIProps {
  user: UserState;
  onHistoryAdd: (record: GenerationRecord) => void;
  onChatUpdate: (session: ChatSession) => void;
  initialPrompt?: string;
  systemInstruction?: string;
}

const ChatAI: React.FC<ChatAIProps> = ({ user, onHistoryAdd, onChatUpdate, initialPrompt, systemInstruction }) => {
  const [currentSessionId, setCurrentSessionId] = useState<string>(Math.random().toString(36).substring(7));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [mode, setMode] = useState<'LITE' | 'TURBO' | 'BRAIN' | 'THINKING'>('BRAIN');
  const [showHistory, setShowHistory] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [attachments, setAttachments] = useState<{ type: 'image' | 'video', url: string, base64: string, mime: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => { if (initialPrompt) setInput(initialPrompt); }, [initialPrompt]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      setAttachments(prev => [...prev, {
        type,
        url: URL.createObjectURL(file),
        base64: (reader.result as string).split(',')[1],
        mime: file.type
      }]);
    };
    reader.readAsDataURL(file);
  };

  const handleNewChat = () => {
    setCurrentSessionId(Math.random().toString(36).substring(7));
    setMessages([]);
    setAttachments([]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && attachments.length === 0) || loading) return;

    const userMsgContent = input.trim();
    const newUserMsg: ChatMessage = { 
      role: 'user', 
      content: userMsgContent, 
      timestamp: Date.now(),
      attachments: attachments.map(a => ({ type: a.type, url: a.url }))
    };

    setInput('');
    const updatedMessagesWithUser = [...messages, newUserMsg];
    setMessages(updatedMessagesWithUser);
    setLoading(true);

    try {
      const media = attachments.map(a => ({ data: a.base64, mimeType: a.mime }));
      const { text, sources } = await gemini.generateText(
        userMsgContent || "Analyze this media", 
        useSearch, useMaps, undefined, mode, systemInstruction,
        currentSessionId, media
      );
      
      const newAssistantMsg: ChatMessage = { 
        role: 'assistant', content: text, sources,
        model: `Deepberg ${mode}`, timestamp: Date.now()
      };

      setMessages(prev => [...prev, newAssistantMsg]);
      setAttachments([]);
      onChatUpdate({
        id: currentSessionId,
        title: userMsgContent.substring(0, 30) || "Media Analysis",
        messages: [...updatedMessagesWithUser, newAssistantMsg],
        lastUpdated: Date.now(), isPro: mode !== 'LITE', mode
      });
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Intelligence engine error.", timestamp: Date.now() }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex-1 flex flex-col relative h-full">
      <div className="flex h-full gap-6">
        <div className={`${showHistory ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden glass rounded-3xl border border-white/5 flex flex-col`}>
          <div className="p-6 border-b border-white/5">
            <button onClick={handleNewChat} className="w-full py-3 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition text-sm">
              <Plus size={16} /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {user.chatSessions.map(session => (
              <button key={session.id} onClick={() => { setMessages(session.messages); setCurrentSessionId(session.id); setMode(session.mode || 'BRAIN'); }}
                className={`w-full text-left p-3 rounded-xl transition text-sm flex items-center gap-3 ${currentSessionId === session.id ? 'bg-white/10 text-white font-bold' : 'text-gray-500 hover:text-white'}`}>
                <MessageSquare size={14} /> <span className="truncate">{session.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="mb-8 flex flex-col lg:flex-row justify-between items-start gap-6">
            <div>
              <h2 className="text-4xl font-black mb-2 tracking-tight uppercase flex items-center gap-3">
                Chat AI
                <span className={`text-[9px] px-3 py-1 rounded-full border font-black ${
                  mode === 'THINKING' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                  mode === 'BRAIN' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' :
                  mode === 'LITE' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-green-500/20 text-green-400'
                }`}>
                  {mode}
                </span>
              </h2>
              <p className="text-gray-500 text-sm">Reason, analyze, and create with Gemini 3.</p>
            </div>
            <div className="flex gap-2 flex-wrap bg-white/5 p-1 rounded-2xl border border-white/5">
              {[
                { id: 'LITE', label: 'Lite', icon: <Bolt size={14} /> },
                { id: 'TURBO', label: 'Turbo', icon: <Zap size={14} /> },
                { id: 'BRAIN', label: 'Brain', icon: <Brain size={14} /> },
                { id: 'THINKING', label: 'Think', icon: <Eye size={14} /> }
              ].map(m => (
                <button key={m.id} onClick={() => setMode(m.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${mode === m.id ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
            {messages.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
                {["Summarize this video file", "Analyze the architecture in this photo", "Explain quantum theory", "Write a marketing script"].map(s => (
                  <button key={s} onClick={() => setInput(s)} className="p-8 glass rounded-[2.5rem] text-left border border-white/5 hover:bg-white/5 transition">
                    <p className="text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Suggestion</p>
                    <p className="text-white font-medium text-lg leading-tight">{s}</p>
                  </button>
                ))}
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-6 ${msg.role === 'assistant' ? 'bg-white/[0.03] p-8 rounded-[3rem] border border-white/5' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-gradient-to-br from-purple-600 to-indigo-700' : 'bg-zinc-800'}`}>
                  {msg.role === 'assistant' ? <Bot size={24} /> : <User size={24} />}
                </div>
                <div className="flex-1 pt-1 min-w-0">
                  <div className="flex justify-between mb-3 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    <span>{msg.model || 'USER'}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {msg.attachments?.map((a, idx) => (
                    <div key={idx} className="mb-4 rounded-2xl overflow-hidden border border-white/10 max-w-sm">
                      {a.type === 'image' ? <img src={a.url} className="w-full" /> : <div className="p-4 bg-zinc-900 flex items-center gap-3"><FileVideo className="text-purple-400" /> Video Analysis active</div>}
                    </div>
                  ))}
                  <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.sources.map((s, idx) => (
                        <a key={idx} href={s.uri} target="_blank" className="text-xs bg-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/10">
                          <span className="truncate pr-2">{s.title}</span> <ExternalLink size={14} className="text-blue-400" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="flex gap-6 bg-white/[0.03] p-8 rounded-[3rem] border border-white/5 animate-pulse"><Loader2 className="animate-spin" /> Deepberg is thinking...</div>}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-auto relative pt-8">
            {attachments.length > 0 && (
              <div className="flex gap-3 mb-4 flex-wrap">
                {attachments.map((a, i) => (
                  <div key={i} className="relative group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-purple-500/50">
                      {a.type === 'image' ? <img src={a.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-900 flex items-center justify-center"><FileVideo size={20} /></div>}
                    </div>
                    <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="relative">
              <textarea 
                rows={1} value={input}
                onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`; }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                placeholder={`Deepberg ${mode}...`}
                className="w-full bg-white/[0.04] border border-white/10 rounded-[2.5rem] py-6 pl-8 pr-32 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none min-h-[72px]"
              />
              <div className="absolute right-4 bottom-4 flex gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition"><Paperclip size={20} /></button>
                <button type="submit" disabled={loading} className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 transition disabled:opacity-50"><Send size={20} /></button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
            </div>
            <div className="flex justify-between items-center px-8 mt-2">
              <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                Unlimited Usage
              </span>
              <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                Deepberg AI v3.0
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;

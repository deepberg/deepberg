
import React, { useState } from 'react';
import { Video, Loader2, Download, Play, Zap, Monitor, Smartphone } from 'lucide-react';
import { gemini } from '../services/geminiService';
import { UserState, GenerationRecord } from '../types';

const VideoStudio: React.FC<{ user: UserState, onHistoryAdd: any }> = ({ user, onHistoryAdd }) => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const handleGenerate = async () => {
    if (loading || !prompt.trim()) return;
    setLoading(true);
    try {
      const result = await gemini.generateVideo(prompt, aspectRatio, setStatus);
      setVideoUrl(result);
      onHistoryAdd({ id: Date.now().toString(), type: 'video', prompt, result, timestamp: Date.now() });
    } catch (err) { alert("Veo engine error."); }
    finally { setLoading(false); setStatus(''); }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="mb-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Video Studio</h2>
        <p className="text-gray-500">Veo 3.1 Fast Cinematic Generation.</p>
      </header>
      <div className="grid lg:grid-cols-2 gap-12 flex-1">
        <div className="space-y-8">
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A cinematic drone shot through..." className="w-full h-48 bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setAspectRatio('16:9')} className={`py-4 rounded-2xl border flex items-center justify-center gap-3 transition ${aspectRatio === '16:9' ? 'bg-blue-600 border-blue-400' : 'glass border-white/5 text-gray-500'}`}>
              <Monitor size={18} /> 16:9 Landscape
            </button>
            <button onClick={() => setAspectRatio('9:16')} className={`py-4 rounded-2xl border flex items-center justify-center gap-3 transition ${aspectRatio === '9:16' ? 'bg-blue-600 border-blue-400' : 'glass border-white/5 text-gray-500'}`}>
              <Smartphone size={18} /> 9:16 Portrait
            </button>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-blue-500 transition">
            {loading ? <Loader2 className="animate-spin" /> : <Play size={20} />} GENERATE CLIP
          </button>
          {loading && <p className="text-center text-blue-400 animate-pulse font-bold tracking-widest text-[10px] uppercase">{status}</p>}
        </div>
        <div className="glass rounded-[3rem] border border-white/5 flex items-center justify-center overflow-hidden relative min-h-[500px] bg-zinc-950/50">
          {videoUrl ? <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" /> : <Video size={64} className="text-zinc-800" />}
          {loading && <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center"><Loader2 className="animate-spin mb-4" size={48} /><p className="font-black text-blue-400">VE ENGINE ACTIVE</p></div>}
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;

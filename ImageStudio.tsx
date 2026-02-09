
import React, { useState, useRef } from 'react';
import { ImageIcon, Loader2, Download, Zap, Upload, Wand2, X, Star } from 'lucide-react';
import { gemini } from '../services/geminiService';
import { UserState, GenerationRecord } from '../types';

const RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];

const ImageStudio: React.FC<{ user: UserState, onHistoryAdd: any }> = ({ user, onHistoryAdd }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [res, setRes] = useState<"1K" | "2K" | "4K">("1K");

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      const result = await gemini.generateImage(prompt, true, aspectRatio, res);
      setImage(result);
      onHistoryAdd({ id: Date.now().toString(), type: 'image', prompt, result, timestamp: Date.now() });
    } catch (err) { alert("Generation failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="mb-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Image Studio</h2>
        <p className="text-gray-500">Gemini 3 Pro Photorealism Engine.</p>
      </header>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A hyper-detailed masterpiece..." className="w-full h-48 bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Aspect Ratio</label>
            <div className="grid grid-cols-4 gap-2">
              {RATIOS.map(r => (
                <button key={r} onClick={() => setAspectRatio(r)} className={`py-3 rounded-xl border text-[10px] font-bold ${aspectRatio === r ? 'bg-white text-black' : 'glass border-white/5 text-gray-500'}`}>{r}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["1K", "2K", "4K"].map(s => (
              <button key={s} onClick={() => setRes(s as any)} className={`py-3 rounded-xl border text-xs font-bold ${res === s ? 'bg-purple-600 border-purple-400' : 'glass border-white/5'}`}>{s}</button>
            ))}
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full py-6 bg-white text-black rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-gray-200 transition">
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />} GENERATE IMAGE
          </button>
        </div>
        <div className="glass rounded-[3rem] border border-white/5 flex items-center justify-center overflow-hidden relative min-h-[500px] bg-zinc-950/50">
          {image ? <img src={image} className="w-full h-full object-contain" /> : <ImageIcon size={64} className="text-zinc-800" />}
          {loading && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Loader2 className="animate-spin" size={48} /></div>}
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;

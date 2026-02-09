
import React, { useState, useRef } from 'react';
import { Music, Loader2, Play, Volume2, Mic2, Download } from 'lucide-react';
import { gemini } from '../services/geminiService';
import { UserState, GenerationRecord } from '../types';

interface AudioStudioProps {
  user: UserState;
  onHistoryAdd: (record: GenerationRecord) => void;
}

const AudioStudio: React.FC<AudioStudioProps> = ({ user, onHistoryAdd }) => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [loading, setLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleSynthesize = async () => {
    if (!text.trim() || loading) return;
    
    setLoading(true);
    try {
      const buffer = await gemini.generateSpeech(text, voice);
      setAudioBuffer(buffer);
      onHistoryAdd({
        id: Date.now().toString(),
        type: 'audio',
        prompt: text,
        result: 'Audio Content',
        timestamp: Date.now()
      });
    } catch (err) {
      console.error(err);
      alert("Audio synthesis failed.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (!audioBuffer) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtxRef.current.destination);
    source.start();
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="mb-12">
        <h2 className="text-4xl font-black mb-2 tracking-tight">AUDIO STUDIO</h2>
        <p className="text-gray-500">Professional AI voiceovers and text-to-speech synthesis.</p>
      </header>

      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Script</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type the words you want to bring to life..."
            className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-8 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Voice Model</label>
              <select 
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:outline-none"
              >
                <option value="Kore">Kore (Neutral Professional)</option>
                <option value="Puck">Puck (Energetic Youth)</option>
                <option value="Charon">Charon (Deep Narrator)</option>
                <option value="Fenrir">Fenrir (Bold & Powerful)</option>
                <option value="Zephyr">Zephyr (Friendly Assistant)</option>
              </select>
           </div>
           
           <div className="flex items-end">
             <button 
                onClick={handleSynthesize}
                disabled={loading || !text.trim()}
                className="w-full h-14 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-500 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Mic2 size={20} />}
                {loading ? "SYNTHESIZING..." : "GENERATE VOICE"}
              </button>
           </div>
        </div>

        {audioBuffer && (
          <div className="glass p-8 rounded-[2rem] border border-green-500/20 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
                 <Volume2 size={32} />
               </div>
               <div>
                 <p className="font-bold">Voice Synthesis Ready</p>
                 <p className="text-sm text-gray-400">Model: {voice}</p>
               </div>
            </div>
            <div className="flex gap-4">
               <button 
                 onClick={playAudio}
                 className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-110 transition"
               >
                 <Play size={24} fill="currentColor" />
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioStudio;

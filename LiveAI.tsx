
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Radio, Info } from 'lucide-react';
import { gemini, encode, decode, decodeAudioData } from '../services/geminiService';
import { UserState, GenerationRecord } from '../types';

interface LiveAIProps {
  user: UserState;
  onHistoryAdd: (record: GenerationRecord) => void;
}

const LiveAI: React.FC<LiveAIProps> = ({ user, onHistoryAdd }) => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<{ user: string; model: string }[]>([]);
  
  const currentInputRef = useRef('');
  const currentOutputRef = useRef('');
  const [displayInput, setDisplayInput] = useState('');
  const [displayOutput, setDisplayOutput] = useState('');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    for (const source of sourcesRef.current.values()) {
      source.stop();
    }
    sourcesRef.current.clear();
    setIsActive(false);
    setLoading(false);
  };

  const startSession = async () => {
    setLoading(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const sessionPromise = gemini.createLiveSession({
        onopen: () => {
          setIsActive(true);
          setLoading(false);
          const source = inputCtx.createMediaStreamSource(stream);
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const pcmBlob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };
            
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtx.destination);
        },
        onmessage: async (message) => {
          const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64Audio && outputAudioContextRef.current) {
            const ctx = outputAudioContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            
            const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.addEventListener('ended', () => sourcesRef.current.delete(source));
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }

          if (message.serverContent?.inputTranscription) {
            const text = message.serverContent.inputTranscription.text;
            currentInputRef.current += text;
            setDisplayInput(currentInputRef.current);
          }
          if (message.serverContent?.outputTranscription) {
            const text = message.serverContent.outputTranscription.text;
            currentOutputRef.current += text;
            setDisplayOutput(currentOutputRef.current);
          }

          if (message.serverContent?.turnComplete) {
            const finalInput = currentInputRef.current;
            const finalOutput = currentOutputRef.current;
            setTranscript(prev => [...prev, { user: finalInput, model: finalOutput }]);
            currentInputRef.current = '';
            currentOutputRef.current = '';
            setDisplayInput('');
            setDisplayOutput('');
          }

          if (message.serverContent?.interrupted) {
            for (const s of sourcesRef.current.values()) {
              s.stop();
              sourcesRef.current.delete(s);
            }
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e) => {
          console.error("Live AI error:", e);
          stopSession();
        },
        onclose: () => {
          stopSession();
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start Live AI:", err);
      stopSession();
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <header className="mb-12">
        <h2 className="text-4xl font-black mb-2 tracking-tight uppercase flex items-center gap-4">
          Deepberg Live
          <span className="flex h-3 w-3 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? 'bg-red-400' : 'bg-gray-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isActive ? 'bg-red-500' : 'bg-gray-500'}`}></span>
          </span>
        </h2>
        <p className="text-gray-500">Multimodal real-time audio interaction with native synthesis.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
        <div className="flex flex-col justify-center items-center glass rounded-[3rem] p-12 border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className={`w-64 h-64 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative z-10 ${
            isActive ? 'border-purple-500 shadow-[0_0_80px_rgba(168,85,247,0.3)]' : 'border-white/10'
          }`}>
             {isActive ? (
               <div className="flex gap-1 items-end h-12">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 bg-purple-400 rounded-full animate-pulse" 
                      style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
               </div>
             ) : (
               <Radio size={64} className="text-gray-700" />
             )}
          </div>

          <div className="mt-12 text-center space-y-6 relative z-10">
            <h3 className="text-2xl font-black tracking-tight">{isActive ? "LISTENING..." : "READY TO TALK?"}</h3>
            <p className="text-gray-500 max-w-xs">Experience low-latency conversational AI. Audio is streamed in real-time.</p>
            
            <button 
              onClick={isActive ? stopSession : startSession}
              disabled={loading}
              className={`px-12 py-5 rounded-full font-black text-lg flex items-center gap-3 transition-all hover:scale-105 active:scale-95 ${
                isActive 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                : 'bg-white text-black hover:bg-gray-200 shadow-xl'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : isActive ? (
                <MicOff size={24} />
              ) : (
                <Mic size={24} />
              )}
              {loading ? "CONNECTING..." : isActive ? "END SESSION" : "START CONVERSATION"}
            </button>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Free Unrestricted Access</p>
          </div>
        </div>

        <div className="flex flex-col glass rounded-[3rem] p-8 border-white/5 bg-zinc-950/50">
          <div className="flex items-center gap-2 mb-6 text-gray-500 border-b border-white/5 pb-4">
             <span className="text-xs font-black tracking-widest uppercase">Live Transcript</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-6 px-2">
            {transcript.length === 0 && !isActive && (
              <p className="text-gray-700 italic text-sm text-center mt-20">Your conversation history will appear here.</p>
            )}
            
            {transcript.map((t, i) => (
              <div key={i} className="space-y-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-bold text-gray-600 mb-1">You</span>
                  <p className="bg-white/5 text-gray-300 py-3 px-5 rounded-2xl rounded-tr-none text-sm max-w-[85%]">{t.user}</p>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[9px] uppercase font-bold text-purple-600 mb-1">Deepberg</span>
                  <p className="bg-purple-600/10 text-gray-200 py-3 px-5 rounded-2xl rounded-tl-none text-sm border border-purple-500/10 max-w-[85%]">{t.model}</p>
                </div>
              </div>
            ))}
            
            {isActive && displayInput && (
              <div className="flex flex-col items-end opacity-50">
                <span className="text-[9px] uppercase font-bold text-gray-600 mb-1">Typing...</span>
                <p className="bg-white/5 text-gray-300 py-3 px-5 rounded-2xl rounded-tr-none text-sm">{displayInput}</p>
              </div>
            )}
            
            {isActive && displayOutput && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] uppercase font-bold text-purple-600 mb-1">Deepberg is speaking</span>
                <p className="bg-purple-600/10 text-gray-200 py-3 px-5 rounded-2xl rounded-tl-none text-sm border border-purple-500/10 animate-pulse">{displayOutput}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAI;

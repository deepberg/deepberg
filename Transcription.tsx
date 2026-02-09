
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2, Copy, Check, FileAudio } from 'lucide-react';
import { gemini, encode } from '../services/geminiService';
import { UserState } from '../types';

const TranscriptionAI: React.FC<{ user: UserState, onHistoryAdd: any }> = ({ user, onHistoryAdd }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          setLoading(true);
          try {
            const text = await gemini.transcribeAudio(base64);
            setResult(text);
            onHistoryAdd({ id: Date.now().toString(), type: 'transcription', prompt: "Microphone Input", result: text, timestamp: Date.now() });
          } catch (err) { setResult("Transcription failed."); }
          finally { setLoading(false); }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) { alert("Microphone access denied."); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl">
      <header className="mb-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Transcription AI</h2>
        <p className="text-gray-500">Crystal clear speech-to-text with Gemini 3 Flash.</p>
      </header>
      <div className="glass p-12 rounded-[3rem] border border-white/5 flex flex-col items-center gap-8">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isRecording ? 'border-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-white/10'}`}>
          <FileAudio size={48} className={isRecording ? 'text-red-500' : 'text-gray-700'} />
        </div>
        <button onClick={isRecording ? stopRecording : startRecording} disabled={loading} className={`px-12 py-5 rounded-full font-black text-xl transition flex items-center gap-3 ${isRecording ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-gray-200'}`}>
          {isRecording ? <MicOff size={24} /> : <Mic size={24} />} {isRecording ? 'STOP & TRANSCRIBE' : 'START RECORDING'}
        </button>
        <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">Unlimited High-Fidelity Capture</p>
      </div>
      {loading && <div className="mt-8 flex justify-center items-center gap-3 text-purple-400 font-bold animate-pulse"><Loader2 className="animate-spin" /> Deepberg is transcribing...</div>}
      {result && (
        <div className="mt-8 glass p-8 rounded-[2rem] border-white/5 relative group">
          <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="absolute top-6 right-6 p-3 glass rounded-xl text-gray-500 hover:text-white transition">
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
          <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">Transcript</h4>
          <p className="text-xl leading-relaxed text-gray-200">{result}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptionAI;


import React from 'react';
import { GenerationRecord } from '../types';
import { Clock, ExternalLink, Image as ImageIcon, Video, Music, FileText, Radio } from 'lucide-react';

interface HistoryProps {
  history: GenerationRecord[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={18} />;
      case 'video': return <Video size={18} />;
      case 'audio': return <Music size={18} />;
      case 'live': return <Radio size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="mb-12">
        <h2 className="text-4xl font-black mb-2 tracking-tight">HISTORY</h2>
        <p className="text-gray-500">Your past creations and explorations on Deepberg.</p>
      </header>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 glass rounded-[3rem]">
          <Clock size={48} className="text-gray-700 mb-4" />
          <h3 className="text-xl font-bold">No history yet</h3>
          <p className="text-gray-500 mt-2">Start generating to see your record here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="glass p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-purple-400 border border-white/5">
                      {getIcon(item.type)}
                  </div>
                  <div>
                      <h4 className="font-bold truncate max-w-md">{item.prompt}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        {new Date(item.timestamp).toLocaleDateString()} • {item.type.toUpperCase()}
                      </p>
                  </div>
                </div>
                <button className="p-3 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition hover:bg-white/10">
                  <ExternalLink size={18} />
                </button>
              </div>

              {item.sources && item.sources.length > 0 && (
                <div className="ml-16 mt-4 flex flex-wrap gap-2">
                  {item.sources.map((s, idx) => (
                    <a 
                      key={idx} 
                      href={s.uri} 
                      target="_blank" 
                      className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 hover:bg-blue-500/20 transition"
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;


import React, { useState } from 'react';
import { TEMPLATES } from '../constants';
import { 
  PenTool, 
  Film, 
  Megaphone, 
  Search, 
  ArrowUpRight, 
  FileSearch, 
  Wand2, 
  ArrowLeft,
  Lightbulb,
  Share2,
  BookOpen,
  Sparkles
} from 'lucide-react';
import ChatAI from './ChatAI';
import { UserState, GenerationRecord, ChatSession } from '../types';

interface TemplatesProps {
  user: UserState;
  onHistoryAdd: (record: GenerationRecord) => void;
  onChatUpdate: (session: ChatSession) => void;
}

const iconMap: any = {
  PenTool: <PenTool size={24} />,
  Film: <Film size={24} />,
  Megaphone: <Megaphone size={24} />,
  Search: <Search size={24} />,
  FileSearch: <FileSearch size={24} />,
  Wand2: <Wand2 size={24} />,
  Lightbulb: <Lightbulb size={24} />,
  Share2: <Share2 size={24} />,
  BookOpen: <BookOpen size={24} />
};

const Templates: React.FC<TemplatesProps> = ({ user, onHistoryAdd, onChatUpdate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

  const filteredTemplates = activeCategory === 'All' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === activeCategory);

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
  };

  if (selectedTemplate) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="mb-6">
          <button 
            onClick={() => setSelectedTemplate(null)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition"
          >
            <ArrowLeft size={14} /> Back to Tools
          </button>
        </div>
        <div className="mb-8 p-6 glass border-purple-500/20 rounded-[2rem] flex items-center gap-6">
            <div className="w-16 h-16 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center">
                {iconMap[selectedTemplate.icon]}
            </div>
            <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{selectedTemplate.title}</h3>
                <p className="text-gray-500 text-sm">{selectedTemplate.description}</p>
            </div>
        </div>
        <ChatAI 
          user={user}
          onHistoryAdd={onHistoryAdd}
          onChatUpdate={onChatUpdate}
          initialPrompt={selectedTemplate.promptPrefix}
          systemInstruction={selectedTemplate.systemInstruction}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-purple-400" size={20} />
            <h2 className="text-4xl font-black tracking-tight uppercase">Creative Tools</h2>
        </div>
        <p className="text-gray-500">Professional AI-powered engines specialized for high-impact content generation.</p>
      </header>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === cat 
              ? 'bg-white text-black border-white' 
              : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((t) => (
          <div 
            key={t.id}
            className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full"
            onClick={() => handleUseTemplate(t)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-8 relative z-10">
               <div className={`p-4 rounded-2xl ${t.category === 'Intelligence' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-purple-400'}`}>
                 {iconMap[t.icon]}
               </div>
               <div className="p-2 bg-white/5 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 transition scale-75 group-hover:scale-100">
                 <ArrowUpRight size={20} />
               </div>
            </div>
            <h3 className="text-xl font-bold mb-2 relative z-10">{t.title}</h3>
            <p className="text-gray-400 mb-6 relative z-10 text-xs leading-relaxed flex-1">{t.description}</p>
            <div className="flex items-center gap-3 relative z-10">
              <div className="text-[9px] font-black tracking-widest uppercase py-1.5 px-3 bg-white/5 rounded-full border border-white/10">
                {t.category}
              </div>
              {t.modelType === 'PRO' && (
                <div className="text-[9px] font-black tracking-widest uppercase py-1.5 px-3 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/20">
                  BRAIN
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;


import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { UserState, GenerationRecord, ChatSession } from '../types';
import { NAV_ITEMS } from '../constants';
import ChatAI from './ChatAI';
import LiveAI from './LiveAI';
import ImageStudio from './ImageStudio';
import VideoStudio from './VideoStudio';
import AudioStudio from './AudioStudio';
import TranscriptionAI from './Transcription';
import Templates from './Templates';
import History from './History';
import { LogOut, User, Settings } from 'lucide-react';

interface DashboardProps {
  user: UserState;
  onLogout: () => void;
  onHistoryAdd: (record: GenerationRecord) => void;
  onChatUpdate: (session: ChatSession) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onHistoryAdd, onChatUpdate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/').pop() || 'chat';

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-950 border-r border-white/5 flex flex-col">
        <div className="p-8">
          <div className="text-xl font-black tracking-tighter flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-black rotate-45"></div>
            </div>
            DEEPBERG
          </div>
          
          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/dashboard/${item.id}`)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
                  activeTab === item.id 
                  ? 'bg-white text-black font-bold shadow-lg shadow-white/5' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-zinc-900">
               {user.profile?.avatar ? (
                 <img src={user.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <User size={20} />
                 </div>
               )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate text-white uppercase tracking-tight">
                {user.profile?.name || 'Explorer'}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {user.profile?.email || 'Guest Session'}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition text-[10px] font-black uppercase tracking-widest"
            >
              <Settings size={14} />
              Account Settings
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 transition text-[10px] font-black uppercase tracking-widest"
            >
              <LogOut size={14} />
              Logout Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black relative">
        <div className="max-w-5xl mx-auto p-8 lg:p-12 min-h-full flex flex-col">
          <Routes>
            <Route index element={<Navigate to="chat" replace />} />
            <Route path="chat" element={<ChatAI user={user} onHistoryAdd={onHistoryAdd} onChatUpdate={onChatUpdate} />} />
            <Route path="live" element={<LiveAI user={user} onHistoryAdd={onHistoryAdd} />} />
            <Route path="image" element={<ImageStudio user={user} onHistoryAdd={onHistoryAdd} />} />
            <Route path="video" element={<VideoStudio user={user} onHistoryAdd={onHistoryAdd} />} />
            <Route path="audio" element={<AudioStudio user={user} onHistoryAdd={onHistoryAdd} />} />
            <Route path="transcription" element={<TranscriptionAI user={user} onHistoryAdd={onHistoryAdd} />} />
            <Route path="templates" element={<Templates user={user} onHistoryAdd={onHistoryAdd} onChatUpdate={onChatUpdate} />} />
            <Route path="history" element={<History history={user.history} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

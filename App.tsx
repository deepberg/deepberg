
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import { UserState, GenerationRecord, ChatSession, UserProfile } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('deepberg_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, isLoggedIn: true };
      } catch (e) {
        console.error("Failed to load user state", e);
      }
    }
    return {
      history: [],
      chatSessions: [],
      isLoggedIn: false
    };
  });

  useEffect(() => {
    if (user.isLoggedIn) {
      localStorage.setItem('deepberg_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('deepberg_user');
    }
  }, [user]);

  const handleLogin = (profile: UserProfile) => {
    setUser(prev => ({ 
      ...prev, 
      profile,
      isLoggedIn: true 
    }));
  };

  const handleLogout = () => {
    setUser({ history: [], chatSessions: [], isLoggedIn: false });
  };

  const addHistory = (record: GenerationRecord) => {
    setUser(prev => ({ ...prev, history: [record, ...prev.history] }));
  };

  const updateChatSession = (session: ChatSession) => {
    setUser(prev => {
      const exists = prev.chatSessions.find(s => s.id === session.id);
      if (exists) {
        return {
          ...prev,
          chatSessions: prev.chatSessions.map(s => s.id === session.id ? session : s)
        };
      }
      return {
        ...prev,
        chatSessions: [session, ...prev.chatSessions]
      };
    });
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
        <Routes>
          <Route 
            path="/" 
            element={!user.isLoggedIn ? <LandingPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/login" 
            element={!user.isLoggedIn ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/signup" 
            element={!user.isLoggedIn ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard/*" 
            element={
              user.isLoggedIn ? (
                <Dashboard 
                  user={user} 
                  onLogout={handleLogout} 
                  onHistoryAdd={addHistory}
                  onChatUpdate={updateChatSession}
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthPageProps {
  onLogin: (profile: UserProfile) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.pathname === '/signup';
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin({
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
      });
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: "Google Explorer",
        email: "explorer@google.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google"
      });
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-white rounded-2xl items-center justify-center mb-6 rotate-12">
            <div className="w-8 h-8 bg-black rotate-45"></div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
            {isSignUp ? 'Join Deepberg' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">
            {isSignUp ? 'Start your creative journey today' : 'Log in to your creative studio'}
          </p>
        </div>

        <div className="glass rounded-[3rem] p-10 border-white/10 shadow-2xl">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
          >
            <Chrome size={20} />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Or continue with mail</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-500 transition-all active:scale-95 mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Log In'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => navigate(isSignUp ? '/login' : '/signup')}
                className="text-white font-bold hover:underline"
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-600 px-10 leading-relaxed">
          By continuing, you agree to Deepberg's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

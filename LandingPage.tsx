
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Sparkles, Box, Shield, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-8 md:px-12">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rotate-45"></div>
          </div>
          DEEPBERG AI
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase">
          <a href="#" className="hover:text-purple-400 transition">Features</a>
          <a href="#" className="hover:text-purple-400 transition">Models</a>
          <a href="#" className="hover:text-purple-400 transition">Enterprise</a>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition active:scale-95"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-20 pb-32 max-w-7xl mx-auto text-center md:text-left">
        <h1 className="text-6xl md:text-9xl font-black leading-none tracking-tight mb-12">
          CREATIVE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            INTELLIGENCE
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Deepberg AI is the next-generation platform for multimodal generation. 
          Text, image, video, and audio—integrated into a single workspace.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-5 bg-white text-black text-lg font-bold rounded-full flex items-center justify-center gap-2 hover:scale-105 transition"
          >
            Start Creating <ArrowRight size={20} />
          </button>
          <button className="px-8 py-5 glass text-lg font-bold rounded-full hover:bg-white/10 transition">
            View Showcases
          </button>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="px-6 md:px-12 py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 glass p-12 rounded-[3rem] relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-4xl font-bold mb-4">Ultra-Fast Chat</h3>
                  <p className="text-gray-400 text-lg mb-8 max-w-md">Reason, code, and brainstorm with the world's most advanced text engine.</p>
                  <div className="h-40 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <div className="w-1/2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] -z-10 group-hover:bg-purple-600/30 transition duration-700"></div>
            </div>
            
            <div className="md:col-span-4 bg-purple-600 p-12 rounded-[3rem] flex flex-col justify-between">
               <div className="bg-white/20 p-4 w-16 h-16 rounded-2xl flex items-center justify-center">
                 <Sparkles size={32} />
               </div>
               <div>
                 <h3 className="text-3xl font-bold mb-2">Image Studio</h3>
                 <p className="text-purple-100">Photorealistic generations in seconds.</p>
               </div>
            </div>

            <div className="md:col-span-4 glass p-12 rounded-[3rem] flex flex-col justify-between">
               <div className="bg-white/5 p-4 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10">
                 <Zap size={32} />
               </div>
               <div>
                 <h3 className="text-3xl font-bold mb-2">Real-time Video</h3>
                 <p className="text-gray-400">Cinematic motion controlled by text.</p>
               </div>
            </div>

            <div className="md:col-span-8 glass p-12 rounded-[3rem] relative overflow-hidden">
               <div className="flex flex-col md:flex-row gap-8 items-center">
                 <div className="flex-1">
                   <h3 className="text-4xl font-bold mb-4">Global Reach</h3>
                   <p className="text-gray-400 text-lg">Support for 40+ languages and high-fidelity audio synthesis.</p>
                 </div>
                 <div className="flex-1 grid grid-cols-2 gap-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-20 bg-white/5 rounded-xl border border-white/10"></div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-xl font-bold tracking-tighter">DEEPBERG AI</div>
           <div className="flex gap-8 text-sm text-gray-500">
             <a href="#">Privacy</a>
             <a href="#">Terms</a>
             <a href="#">Security</a>
             <a href="#">Contact</a>
           </div>
           <p className="text-sm text-gray-600">© 2024 Deepberg AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

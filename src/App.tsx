import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Activity, Gamepad2, Radio } from 'lucide-react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500 selection:text-black overflow-hidden relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none transition-opacity duration-300" />
      </div>

      {/* Decorative Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Header Container */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 rounded flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <div className="w-full h-full bg-black rounded-[3px] flex items-center justify-center">
                <Activity size={16} className="text-cyan-400" />
              </div>
            </div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter">
              Neon <span className="text-cyan-400">Snake</span>
            </h1>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Global Rank</span>
              <span className="text-sm font-mono text-fuchsia-400">#0422-BETA</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          {/* Game Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <Gamepad2 size={24} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight">Battle Station</h2>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Arena Sector 7G</p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SnakeGame onScoreChange={setCurrentScore} />
            </motion.div>
          </section>

          {/* Player Section */}
          <aside className="space-y-8 flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-4 mb-2 w-full">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <Radio size={24} className="text-fuchsia-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight">Audio Link</h2>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Syncing with GenAI Core</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <MusicPlayer />
            </motion.div>

            {/* Score HUD Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full bg-[#111] border border-white/5 rounded-xl p-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Trophy size={80} className="text-cyan-400" />
              </div>
              <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] mb-2">Active Session Score</h4>
              <div className="text-5xl font-black text-white italic tracking-tighter flex items-baseline gap-2">
                {currentScore.toLocaleString()}
                <span className="text-xs font-mono text-cyan-400 not-italic uppercase tracking-widest ml-auto">PTS</span>
              </div>
              <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(currentScore / 10, 100)}%` }}
                  className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                />
              </div>
              <p className="mt-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">Level 1 - Initiated</p>
            </motion.div>
          </aside>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full mt-auto border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-12">
            <div>
              <div className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-1">Latency</div>
              <div className="text-xs font-mono text-green-500/80">0.42ms -- NOMINAL</div>
            </div>
            <div>
              <div className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em] mb-1">Bitrate</div>
              <div className="text-xs font-mono text-fuchsia-500/80">320kbps -- OPTIMIZED</div>
            </div>
          </div>
          
          <div className="text-[10px] font-mono text-gray-700 uppercase tracking-[0.3em]">
            © 2026 NEON_SNAKE_OS // ACCESS_LEVEL_S
          </div>
        </div>
      </footer>
    </div>
  );
}

const Trophy = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);


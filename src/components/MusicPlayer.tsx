import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background Pulse */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-lg flex items-center justify-center p-0.5">
          <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center">
            <Music className="text-cyan-400" size={24} />
          </div>
          {isPlaying && (
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-2 bg-cyan-500/20 rounded-xl blur-lg -z-10"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold truncate text-lg tracking-tight uppercase italic">{currentTrack.title}</h3>
          <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.2em]">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 group">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-mono text-gray-500 tracking-wider">LIVE STREAM</span>
          <div className="flex gap-1 h-3 items-end">
            {[1,2,3,4,5,6].map(i => (
              <motion.div
                key={i}
                animate={isPlaying ? { height: [4, 12, 6, 12, 4] } : { height: 4 }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                className="w-[3px] bg-cyan-400/60 rounded-full"
              />
            ))}
          </div>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden relative cursor-pointer">
          <motion.div 
            className="absolute h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Volume2 size={16} className="text-gray-600" />
          <div className="w-12 h-[2px] bg-white/10 rounded-full overflow-hidden">
             <div className="w-2/3 h-full bg-gray-500" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.2, color: '#fff' }}
            whileTap={{ scale: 0.9 }}
            onClick={prevTrack}
            className="text-gray-500 transition-colors"
          >
            <SkipBack size={24} fill="currentColor" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-14 h-14 bg-white text-black flex items-center justify-center rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.2, color: '#fff' }}
            whileTap={{ scale: 0.9 }}
            onClick={nextTrack}
            className="text-gray-500 transition-colors"
          >
            <SkipForward size={24} fill="currentColor" />
          </motion.button>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Track info overlay in background */}
      <div className="absolute -bottom-10 -left-10 text-[100px] font-black text-white/[0.02] select-none pointer-events-none uppercase italic">
        {currentTrackIndex + 1}
      </div>
    </div>
  );
}

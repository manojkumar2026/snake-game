import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Point, Direction } from '../types';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const lastUpdateRef = useRef<number>(0);

  const spawnFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on snake
    if (snake.some(p => p.x === newFood.x && p.y === newFood.y)) {
      return spawnFood();
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback((time: number) => {
    if (isPaused || isGameOver) return;

    if (time - lastUpdateRef.current > GAME_SPEED) {
      lastUpdateRef.current = time;

      setDirection(nextDirection);
      const head = { ...snake[0] };

      switch (nextDirection) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE || 
        head.y < 0 || head.y >= GRID_SIZE ||
        snake.some(p => p.x === head.x && p.y === head.y)
      ) {
        setIsGameOver(true);
        return;
      }

      const newSnake = [head, ...snake];

      // Check food
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(spawnFood());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    }
    requestAnimationFrame(update);
  }, [snake, nextDirection, food, isPaused, isGameOver, score, onScoreChange, spawnFood]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      const animId = requestAnimationFrame(update);
      return () => cancelAnimationFrame(animId);
    }
  }, [isPaused, isGameOver, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * size + size/2, food.y * size + size/2, size/3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? '#00ffff' : '#009999';
      if (i === 0) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
      }
      ctx.fillRect(p.x * size + 2, p.y * size + 2, size - 4, size - 4);
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-black rounded-lg p-4 flex flex-col items-center gap-6">
        <div className="flex justify-between w-full items-center px-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Trophy size={20} />
            <span className="font-mono text-xl tracking-widest">{score.toString().padStart(4, '0')}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPaused(!isPaused)}
            className="text-fuchsia-400 hover:text-white transition-colors"
          >
            {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
          </motion.button>
        </div>

        <div className="relative aspect-square w-full max-w-[400px]">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-full rounded border border-gray-800"
          />
          
          <AnimatePresence>
            {(isGameOver || (isPaused && snake.length > 0)) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm rounded"
              >
                {isGameOver ? (
                  <>
                    <h2 className="text-4xl font-black text-rose-500 uppercase tracking-tighter mb-4 italic">System Crash</h2>
                    <p className="text-gray-400 font-mono mb-8 uppercase text-xs tracking-[0.2em]">Corruption detected in core logic</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetGame}
                      className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-sm uppercase tracking-wider hover:bg-cyan-400 transition-colors"
                    >
                      <RefreshCw size={20} />
                      Initialize Restart
                    </motion.button>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-black text-cyan-400 uppercase tracking-tighter mb-4 italic">Frozen State</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPaused(false)}
                      className="flex items-center gap-2 px-6 py-3 bg-fuchsia-500 text-white font-bold rounded-sm uppercase tracking-wider hover:bg-fuchsia-400 transition-colors"
                    >
                      <Play size={20} fill="currentColor" />
                      Resume Execution
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-4 text-[10px] text-gray-500 font-mono uppercase tracking-[0.25em]">
          <span>Move: ARROW KEYS</span>
          <span className="w-1 h-1 rounded-full bg-gray-700 self-center"></span>
          <span>Pause: CLICK PLAY/PAUSE</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, RotateCcw, X } from "lucide-react";

export function DinoGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const retryBtnRef = useRef<HTMLButtonElement>(null);
  const exitBtnRef = useRef<HTMLButtonElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game states stored in refs to avoid React re-render overhead in the animation loop
  const stateRef = useRef({
    gameState: "idle" as "idle" | "playing" | "gameover",
    dino: { y: 0, vy: 0, width: 20, height: 24, isJumping: false },
    obstacles: [] as Array<{ x: number; width: number; height: number; speed: number }>,
    score: 0,
    highScore: 0,
    speedMultiplier: 1,
    frameCount: 0,
    lastTime: 0,
  });

  // Lock scrolling when game is playing
  useEffect(() => {
    if (gameState === "playing") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [gameState]);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("dino-high-score");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) {
        setHighScore(parsed);
        stateRef.current.highScore = parsed;
      }
    }
  }, []);

  // Sync state ref with React state
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  const startGame = useCallback(() => {
    const state = stateRef.current;
    setGameState("playing");
    state.score = 0;
    setScore(0);
    state.obstacles = [];
    state.speedMultiplier = 1;
    state.dino.y = 0;
    state.dino.vy = 0;
    state.frameCount = 0;
  }, []);

  const exitGame = useCallback(() => {
    setGameState("idle");
    stateRef.current.score = 0;
    setScore(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const jump = () => {
      const state = stateRef.current;
      if (state.gameState === "playing" && !state.dino.isJumping) {
        state.dino.vy = -6.5;
        state.dino.isJumping = true;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.gameState === "playing") {
        if (e.code === "Space" || e.code === "ArrowUp") {
          e.preventDefault();
          jump();
        }
      } else if (stateRef.current.gameState === "idle") {
        if (e.code === "Space") {
          e.preventDefault();
          startGame();
        }
      } else if (stateRef.current.gameState === "gameover") {
        if (e.code === "ArrowRight") {
          e.preventDefault();
          exitBtnRef.current?.focus();
        } else if (e.code === "ArrowLeft") {
          e.preventDefault();
          retryBtnRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Main Game Loop
    const loop = (timestamp: number) => {
      const state = stateRef.current;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const groundY = height - 15;

      const isDark = document.documentElement.classList.contains("dark");
      const bgColor = isDark ? "#080605" : "#ffffff";
      const fgColor = isDark ? "#e5e5e5" : "#171717";
      const accentColor = isDark ? "#be185d" : "#f9a8d4"; // pink-700 in dark, pink-300 in light

      // Clear Canvas
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw Ground
      ctx.strokeStyle = isDark ? "rgba(229, 229, 229, 0.2)" : "rgba(23, 23, 23, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Update Physics if playing
      if (state.gameState === "playing") {
        state.frameCount++;
        state.dino.vy += 0.35;
        state.dino.y += state.dino.vy;

        if (state.dino.y >= 0) {
          state.dino.y = 0;
          state.dino.vy = 0;
          state.dino.isJumping = false;
        }

        if (state.frameCount % Math.max(80, Math.floor(120 / state.speedMultiplier)) === 0 || state.obstacles.length === 0) {
          const obstacleHeight = 15 + Math.random() * 20;
          state.obstacles.push({
            x: width + 20,
            width: 12 + Math.random() * 8,
            height: obstacleHeight,
            speed: (3 + Math.random() * 1.5) * state.speedMultiplier,
          });
        }

        state.obstacles = state.obstacles.filter((obs) => {
          obs.x -= obs.speed;
          return obs.x + obs.width > 0;
        });

        state.speedMultiplier = 1 + state.score * 0.001;

        if (state.frameCount % 5 === 0) {
          state.score += 1;
          setScore(state.score);
        }

        const dinoBox = {
          x: 30,
          y: groundY - state.dino.height + state.dino.y,
          width: state.dino.width,
          height: state.dino.height,
        };

        for (const obs of state.obstacles) {
          const obsBox = {
            x: obs.x,
            y: groundY - obs.height,
            width: obs.width,
            height: obs.height,
          };

          if (
            dinoBox.x < obsBox.x + obsBox.width &&
            dinoBox.x + dinoBox.width > obsBox.x &&
            dinoBox.y < obsBox.y + obsBox.height &&
            dinoBox.y + dinoBox.height > obsBox.y
          ) {
            setGameState("gameover");
            if (state.score > state.highScore) {
              state.highScore = state.score;
              setHighScore(state.score);
              localStorage.setItem("dino-high-score", state.score.toString());
            }
            break;
          }
        }
      }

      // Draw Dino
      const dinoX = 30;
      const dinoY = groundY - state.dino.height + state.dino.y;
      ctx.fillStyle = fgColor;
      ctx.beginPath();
      ctx.fillRect(dinoX + 4, dinoY, 12, 10);
      ctx.fillRect(dinoX, dinoY + 8, 14, 10);
      ctx.fillRect(dinoX + 2, dinoY + 18, 10, 2);
      ctx.fillStyle = bgColor;
      ctx.fillRect(dinoX + 12, dinoY + 2, 2, 2);
      
      ctx.fillStyle = fgColor;
      if (state.gameState === "playing" && !state.dino.isJumping && Math.floor(state.frameCount / 6) % 2 === 0) {
        ctx.fillRect(dinoX + 3, dinoY + 20, 2, 4);
        ctx.fillRect(dinoX + 9, dinoY + 20, 2, 2);
      } else {
        ctx.fillRect(dinoX + 3, dinoY + 20, 2, 4);
        ctx.fillRect(dinoX + 9, dinoY + 20, 2, 4);
      }

      // Draw Obstacles
      ctx.fillStyle = accentColor;
      for (const obs of state.obstacles) {
        ctx.beginPath();
        ctx.fillRect(obs.x, groundY - obs.height, obs.width, obs.height);
        if (obs.height > 20) {
          ctx.fillRect(obs.x - 4, groundY - obs.height + 6, 4, 3);
          ctx.fillRect(obs.x - 4, groundY - obs.height + 6, 2, 6);
          ctx.fillRect(obs.x + obs.width, groundY - obs.height + 10, 4, 3);
          ctx.fillRect(obs.x + obs.width + 2, groundY - obs.height + 10, 2, 8);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      resizeObserver.disconnect();
    };
  }, [gameState, startGame]);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center overflow-hidden select-none group">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block" 
        onClick={() => {
          if (gameState === "playing") {
            const state = stateRef.current;
            if (!state.dino.isJumping) {
              state.dino.vy = -6.5;
              state.dino.isJumping = true;
            }
          }
        }} 
      />

      {/* Start Screen Overlay */}
      {gameState === "idle" && (
        <div className="absolute inset-0 bg-white/40 dark:bg-[#080605]/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={startGame}
            className="flex items-center gap-2 px-2 py-2 bg-neutral-600 text-white dark:bg-white dark:text-neutral-600 rounded-sm font-medium text-sm hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-neutral-500/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-white/60 dark:bg-[#080605]/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
          <div className="text-sm font-bold text-neutral-900 dark:text-white tracking-widest">GAME OVER</div>
          <div className="flex gap-2">
            <button 
              ref={retryBtnRef}
              autoFocus
              onClick={startGame}
              className="flex items-center justify-center p-2 bg-neutral-600 text-white dark:bg-white dark:text-neutral-600 rounded-sm hover:scale-110 active:scale-90 transition-all shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400"
              title="Retry"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              ref={exitBtnRef}
              onClick={exitGame}
              className="flex items-center justify-center p-2 bg-neutral-200 text-neutral-600 dark:bg-neutral-600 dark:text-neutral-400 rounded-sm hover:scale-110 hover:bg-pink-300 hover:text-neutral-600 dark:hover:bg-pink-700 dark:hover:text-white active:scale-90 transition-all shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400"
              title="Exit"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Score Overlay */}
      {(gameState === "playing" || gameState === "gameover") && (
        <div className="absolute top-2 right-4 flex gap-4 text-[10px] font-mono select-none pointer-events-none text-neutral-500 dark:text-neutral-400">
          <div>HI {highScore.toString().padStart(5, "0")}</div>
          <div className="text-neutral-800 dark:text-neutral-200">{score.toString().padStart(5, "0")}</div>
        </div>
      )}
    </div>
  );
}

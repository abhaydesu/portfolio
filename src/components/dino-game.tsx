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
    obstacles: [] as Array<{ x: number; width: number; height: number; type: number }>,
    clouds: [
      { x: 100, y: 12, width: 24 },
      { x: 260, y: 22, width: 32 },
    ] as Array<{ x: number; y: number; width: number }>,
    groundOffset: 0,
    terrainOpacity: 0,
    nextGap: 180,
    score: 0,
    highScore: 0,
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
    state.clouds = [
      { x: 100, y: 12, width: 24 },
      { x: 260, y: 22, width: 32 },
    ];
    state.groundOffset = 0;
    state.terrainOpacity = 0;
    state.nextGap = 160;
    state.dino.y = 0;
    state.dino.vy = 0;
    state.frameCount = 0;
  }, []);

  const exitGame = useCallback(() => {
    const state = stateRef.current;
    setGameState("idle");
    state.score = 0;
    setScore(0);
    state.obstacles = [];
    state.terrainOpacity = 0;
    state.dino.y = 0;
    state.dino.vy = 0;
    state.frameCount = 0;
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
        state.dino.vy = -7.2;
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
      const fgColor = isDark ? "#e5e5e5" : "#171717";
      const accentColor = isDark ? "#be185d" : "#f9a8d4"; // pink-700 in dark, pink-300 in light
      const groundLineColor = isDark ? "rgba(229, 229, 229, 0.2)" : "rgba(23, 23, 23, 0.15)";
      const groundDotColor = isDark ? "rgba(229, 229, 229, 0.3)" : "rgba(23, 23, 23, 0.25)";
      const cloudColor = isDark ? "rgba(229, 229, 229, 0.12)" : "rgba(23, 23, 23, 0.12)";

      // Clear Canvas transparently so underlying CSS transition background shines through seamlessly
      ctx.clearRect(0, 0, width, height);

      // Smooth terrain/cloud opacity transition (fades in when game starts, hidden in idle)
      if (state.gameState === "playing" || state.gameState === "gameover") {
        state.terrainOpacity = Math.min(1, state.terrainOpacity + 0.05);
      } else {
        state.terrainOpacity = Math.max(0, state.terrainOpacity - 0.1);
      }

      // Current uniform game speed
      const currentSpeed = state.gameState === "playing" 
        ? 3.8 + Math.min(state.score * 0.003, 4.2)
        : 1.0;

      // Update Ground Offset for scrolling illusion
      state.groundOffset = (state.groundOffset + currentSpeed) % 60;

      // Draw Parallax Clouds (only visible when playing / transition opacity > 0)
      if (state.terrainOpacity > 0) {
        ctx.globalAlpha = state.terrainOpacity;
        ctx.fillStyle = cloudColor;
        for (const cloud of state.clouds) {
          if (state.gameState === "playing" || state.gameState === "idle") {
            cloud.x -= currentSpeed * 0.25;
            if (cloud.x + cloud.width < 0) {
              cloud.x = width + 20 + Math.random() * 50;
              cloud.y = 8 + Math.random() * 18;
            }
          }
          ctx.fillRect(cloud.x, cloud.y, cloud.width, 5);
          ctx.fillRect(cloud.x + 4, cloud.y - 3, cloud.width - 8, 3);
        }
        ctx.globalAlpha = 1;
      }

      // Draw Main Ground Line
      ctx.strokeStyle = groundLineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Draw Scrolling Terrain Dots / Ticks (fades in when game starts)
      if (state.terrainOpacity > 0) {
        ctx.globalAlpha = state.terrainOpacity;
        ctx.fillStyle = groundDotColor;
        for (let x = -state.groundOffset; x < width; x += 30) {
          if (x >= 0) {
            ctx.fillRect(x, groundY + 3, 3, 1);
            if (Math.floor(x * 10) % 60 === 0) {
              ctx.fillRect(x + 12, groundY + 5, 2, 1);
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      // Update Physics if playing
      if (state.gameState === "playing") {
        state.frameCount++;
        state.dino.vy += 0.42;
        state.dino.y += state.dino.vy;

        if (state.dino.y >= 0) {
          state.dino.y = 0;
          state.dino.vy = 0;
          state.dino.isJumping = false;
        }

        // Varied wave spawning using single-assignment nextGap per spawn
        const rightmostX = state.obstacles.length > 0 
          ? Math.max(...state.obstacles.map(o => o.x + o.width)) 
          : 0;

        if (state.obstacles.length === 0 || width - rightmostX >= state.nextGap) {
          const rand = Math.random();
          let obstacleWidth = 10;
          let obstacleHeight = 18;
          let type = 1; // 1: single tall, 2: double cluster, 3: triple cluster, 4: pterodactyl low, 5: pterodactyl high

          if (state.score > 80 && rand < 0.20) {
            type = 4; // Pterodactyl low
            obstacleWidth = 22;
            obstacleHeight = 14;
          } else if (state.score > 120 && rand < 0.35) {
            type = 5; // Pterodactyl high
            obstacleWidth = 22;
            obstacleHeight = 14;
          } else if (rand < 0.50) {
            type = 1; // Single tall cactus
            obstacleWidth = 10;
            obstacleHeight = 18 + Math.floor(Math.random() * 6);
          } else if (rand < 0.80) {
            type = 2; // Double cactus cluster
            obstacleWidth = 22;
            obstacleHeight = 16 + Math.floor(Math.random() * 6);
          } else {
            type = 3; // Triple cactus cluster
            obstacleWidth = 34;
            obstacleHeight = 18 + Math.floor(Math.random() * 6);
          }

          state.obstacles.push({
            x: width + 10,
            width: obstacleWidth,
            height: obstacleHeight,
            type,
          });

          // Assign nextGap ONCE per spawn event (mix of short, medium, and long gaps)
          const gapRand = Math.random();
          if (gapRand < 0.30) {
            state.nextGap = 130 + Math.random() * 40 + currentSpeed * 6; // Short reaction gap
          } else if (gapRand < 0.75) {
            state.nextGap = 190 + Math.random() * 80 + currentSpeed * 10; // Medium gap
          } else {
            state.nextGap = 300 + Math.random() * 120 + currentSpeed * 12; // Long breathing stretch
          }
        }

        // Move all obstacles at current uniform speed
        state.obstacles.forEach((obs) => {
          obs.x -= currentSpeed;
        });

        state.obstacles = state.obstacles.filter((obs) => obs.x + obs.width > 0);

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
          const obsY = obs.type === 4 
            ? groundY - 24 
            : obs.type === 5 
            ? groundY - 44 
            : groundY - obs.height;

          const obsBox = {
            x: obs.x,
            y: obsY,
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
      } else if (state.gameState === "idle") {
        state.frameCount++;
      }

      // Draw Dino (with subtle idle wobble)
      let wobbleX = 0;
      let wobbleY = 0;
      if (state.gameState === "idle") {
        wobbleX = Math.sin(state.frameCount * 0.05) * 1.5;
        wobbleY = Math.abs(Math.sin(state.frameCount * 0.08)) * -1;
      }

      const dinoX = 30 + wobbleX;
      const dinoY = groundY - state.dino.height + state.dino.y + wobbleY;

      ctx.fillStyle = fgColor;
      ctx.beginPath();
      ctx.fillRect(dinoX + 4, dinoY, 12, 10);
      ctx.fillRect(dinoX, dinoY + 8, 14, 10);
      ctx.fillRect(dinoX + 2, dinoY + 18, 10, 2);

      // Eye (blinks periodically in idle state)
      const isBlinking = state.gameState === "idle" && (state.frameCount % 120 > 114);
      if (!isBlinking) {
        ctx.clearRect(dinoX + 12, dinoY + 2, 2, 2);
      }

      // Alternating legs animation while running
      ctx.fillStyle = fgColor;
      if (state.gameState === "playing" && !state.dino.isJumping && Math.floor(state.frameCount / 4) % 2 === 0) {
        ctx.fillRect(dinoX + 3, dinoY + 20, 2, 4);
        ctx.fillRect(dinoX + 9, dinoY + 20, 2, 2);
      } else if (state.gameState === "playing" && !state.dino.isJumping) {
        ctx.fillRect(dinoX + 3, dinoY + 20, 2, 2);
        ctx.fillRect(dinoX + 9, dinoY + 20, 2, 4);
      } else {
        ctx.fillRect(dinoX + 3, dinoY + 20, 2, 4);
        ctx.fillRect(dinoX + 9, dinoY + 20, 2, 4);
      }

      // Draw Cacti & Pterodactyl Obstacles
      ctx.fillStyle = accentColor;
      for (const obs of state.obstacles) {
        ctx.beginPath();
        if (obs.type === 4 || obs.type === 5) {
          // Pterodactyl flying bird (animates wings!)
          const birdY = obs.type === 4 ? groundY - 24 : groundY - 44;
          const wingUp = Math.floor(state.frameCount / 8) % 2 === 0;
          ctx.fillRect(obs.x + 4, birdY, 12, 6);
          ctx.fillRect(obs.x + 14, birdY + 2, 6, 3);
          ctx.fillRect(obs.x, birdY + 3, 4, 3);
          if (wingUp) {
            ctx.fillRect(obs.x + 6, birdY - 8, 4, 8);
          } else {
            ctx.fillRect(obs.x + 6, birdY + 6, 4, 8);
          }
        } else if (obs.type === 1) { // Single tall cactus
          ctx.fillRect(obs.x, groundY - obs.height, obs.width, obs.height);
          ctx.fillRect(obs.x - 3, groundY - obs.height + 4, 3, 3);
          ctx.fillRect(obs.x - 3, groundY - obs.height + 4, 2, 6);
          ctx.fillRect(obs.x + obs.width, groundY - obs.height + 7, 3, 3);
          ctx.fillRect(obs.x + obs.width + 1, groundY - obs.height + 7, 2, 7);
        } else if (obs.type === 2) { // Double cactus cluster
          ctx.fillRect(obs.x, groundY - obs.height, 9, obs.height);
          ctx.fillRect(obs.x + 12, groundY - obs.height + 2, 9, obs.height - 2);
          ctx.fillRect(obs.x - 3, groundY - obs.height + 4, 3, 3);
          ctx.fillRect(obs.x + 21, groundY - obs.height + 6, 3, 3);
        } else { // Triple cactus cluster
          ctx.fillRect(obs.x, groundY - obs.height + 4, 8, obs.height - 4);
          ctx.fillRect(obs.x + 10, groundY - obs.height, 10, obs.height);
          ctx.fillRect(obs.x + 22, groundY - obs.height + 2, 8, obs.height - 2);
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
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center overflow-hidden select-none group cursor-pointer transition-colors duration-500">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block" 
        onClick={() => {
          if (gameState === "idle") {
            startGame();
          } else if (gameState === "playing") {
            const state = stateRef.current;
            if (!state.dino.isJumping) {
              state.dino.vy = -6.5;
              state.dino.isJumping = true;
            }
          }
        }} 
      />

      {/* Speech Bubble from Dino in Idle Mode */}
      {gameState === "idle" && (
        <div className="absolute left-[24px] bottom-[52px] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
          <div className="relative font-pixel text-[7px] text-neutral-900 dark:text-neutral-100 bg-white dark:bg-[#080605] px-2 py-1 border-2 border-neutral-900 dark:border-neutral-100 shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff] whitespace-nowrap transition-colors duration-500">
            press space
            {/* Speech bubble tail pointing down to dino */}
            <div className="absolute left-2.5 -bottom-[6px] w-0 h-0 border-x-[4px] border-x-transparent border-t-[6px] border-t-neutral-900 dark:border-t-neutral-100 transition-colors duration-500" />
            <div className="absolute left-[11px] -bottom-[4px] w-0 h-0 border-x-[3px] border-x-transparent border-t-[5px] border-t-white dark:border-t-[#080605] transition-colors duration-500" />
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-white/80 dark:bg-[#080605]/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200 transition-colors duration-500">
          <div className="font-pixel text-[11px] text-neutral-900 dark:text-white tracking-widest uppercase animate-pulse transition-colors duration-500">
            GAME OVER
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button 
              ref={retryBtnRef}
              autoFocus
              onClick={startGame}
              className="p-2 border-2 border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-500 shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pink-400"
              title="Play Again"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              ref={exitBtnRef}
              onClick={exitGame}
              className="p-2 border-2 border-neutral-400 dark:border-neutral-600 bg-transparent text-neutral-600 dark:text-neutral-300 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white transition-all duration-500 shadow-[2px_2px_0px_rgba(0,0,0,0.2)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.2)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pink-400"
              title="Exit"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Score Overlay */}
      {(gameState === "playing" || gameState === "gameover") && (
        <div className="absolute top-2 right-4 flex gap-4 text-[9px] font-pixel select-none pointer-events-none text-neutral-500 dark:text-neutral-400 transition-colors duration-500">
          <div>HI {highScore.toString().padStart(5, "0")}</div>
          <div className="text-neutral-900 dark:text-neutral-100 transition-colors duration-500">{score.toString().padStart(5, "0")}</div>
        </div>
      )}
    </div>
  );
}

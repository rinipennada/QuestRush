import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { GemHeader } from '../components/GemHeader';
import { GAME_STAGES } from '../data/stages';
import { GameStage } from '../types';
import { sound } from '../utils/audio';
import {
  Play,
  RotateCcw,
  ShoppingBag,
  ArrowRight,
  Flame,
  CheckCircle2,
  Shield,
  Heart,
  Zap,
  Sparkles,
  Lock,
  Star,
  Award,
  ChevronRight,
  Skull,
  Crosshair,
  ArrowLeft,
  Volume2,
  VolumeX,
  Bomb,
  Radio,
  Trophy
} from 'lucide-react';

interface Bullet {
  id: number;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  vx?: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  type: 'drone' | 'fast_scout' | 'heavy_cruiser' | 'boss_minion' | 'splitter';
  width: number;
  color: string;
  points: number;
  gemReward: number;
}

interface DropItem {
  id: number;
  x: number;
  y: number;
  type: 'gem' | 'gold_gem' | 'triple_shot' | 'shield' | 'magnet' | 'nuke';
  speed: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  text?: string;
}

export const PlayMiniGameScreen: React.FC = () => {
  const {
    playerProfile,
    earnGemsFromPlay,
    navigateTo,
    selectedStage,
    setSelectedStage,
    unlockedStage,
    stageRecords,
    completeStageProgress,
    selectedProduct,
    selectProduct
  } = useGame();

  // Screen View: 'stage_select' | 'playing' | 'stage_result' | 'lucky_wheel'
  const [viewMode, setViewMode] = useState<'stage_select' | 'playing' | 'stage_result' | 'lucky_wheel'>('stage_select');
  const [activeStage, setActiveStage] = useState<GameStage>(GAME_STAGES[0]);

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  // Player position (smooth horizontal 0 to 100%)
  const [playerX, setPlayerX] = useState(50);
  const targetXRef = useRef(50);
  const playerXRef = useRef(50);
  
  // Game stats
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [maxHealth] = useState(3);
  const [combo, setCombo] = useState(0);
  const [stageTimeLeft, setStageTimeLeft] = useState(35);
  const [nukesAvailable, setNukesAvailable] = useState(1);
  const [screenShake, setScreenShake] = useState(false);

  // Power-up timers
  const [tripleShotTimer, setTripleShotTimer] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);
  const [magnetTimer, setMagnetTimer] = useState(0);

  // Boss stats
  const [isBossStage, setIsBossStage] = useState(false);
  const [bossHp, setBossHp] = useState(100);
  const [bossMaxHp, setBossMaxHp] = useState(100);
  const [bossX, setBossX] = useState(50);

  // Results
  const [stageWon, setStageWon] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [gemsWon, setGemsWon] = useState(0);

  // Lucky wheel states
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelDegree, setWheelDegree] = useState(0);
  const [wheelPrize, setWheelPrize] = useState<string | null>(null);

  // Game Engine Entities
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [drops, setDrops] = useState<DropItem[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Refs for requestAnimationFrame loop
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const dropsRef = useRef<DropItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const healthRef = useRef(3);
  const comboRef = useRef(0);
  const isPlayingRef = useRef(false);
  const lastShotTimeRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const bossDirRef = useRef(1);

  const arenaRef = useRef<HTMLDivElement | null>(null);

  // Sync state & refs
  useEffect(() => {
    sound.enabled = !isMuted;
  }, [isMuted]);

  useEffect(() => {
    scoreRef.current = score;
    healthRef.current = health;
    comboRef.current = combo;
  }, [score, health, combo]);

  // Screen shake trigger
  const triggerShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 200);
  }, []);

  // Spawn explosion particles
  const spawnExplosion = useCallback((x: number, y: number, color: string = '#06b6d4', count = 8, text?: string) => {
    const newParticles: Particle[] = [];
    if (text) {
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: 0,
        vy: -1.2,
        life: 1,
        maxLife: 1,
        color: '#fef08a',
        size: 14,
        text
      });
    }

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
      const speed = Math.random() * 2.5 + 1;
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        color,
        size: Math.random() * 6 + 3
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  }, []);

  // Fire Smart Bomb (Nuke)
  const handleFireNuke = useCallback(() => {
    if (nukesAvailable <= 0 || viewMode !== 'playing') return;
    setNukesAvailable(n => n - 1);
    triggerShake();
    sound.playExplosion(true);

    // Blast all active enemies
    enemiesRef.current.forEach(e => {
      spawnExplosion(e.x, e.y, '#ef4444', 12, '💥 DESTROYED!');
      // Drop gems
      dropsRef.current.push({
        id: Math.random(),
        x: e.x,
        y: e.y,
        type: 'gold_gem',
        speed: 1.5
      });
      scoreRef.current += e.points * 2;
    });

    if (isBossStage) {
      setBossHp(prev => Math.max(0, prev - 35));
    }

    enemiesRef.current = [];
    setScore(scoreRef.current);
  }, [nukesAvailable, viewMode, isBossStage, triggerShake, spawnExplosion]);

  // Steer left or right continuously
  const handleSteer = (direction: 'left' | 'right') => {
    sound.playTap();
    targetXRef.current = direction === 'left'
      ? Math.max(10, targetXRef.current - 22)
      : Math.min(90, targetXRef.current + 22);
  };

  // Keyboard navigation
  useEffect(() => {
    if (viewMode !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        targetXRef.current = Math.max(10, targetXRef.current - 18);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        targetXRef.current = Math.min(90, targetXRef.current + 18);
      } else if (e.key === ' ' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        handleFireNuke();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleFireNuke]);

  // Direct touch/mouse dragging on arena
  const handleArenaPointer = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (viewMode !== 'playing') return;
    const arena = arenaRef.current;
    if (!arena) return;

    const rect = arena.getBoundingClientRect();
    const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    if (clientX === undefined) return;

    const relX = ((clientX - rect.left) / rect.width) * 100;
    targetXRef.current = Math.max(8, Math.min(92, relX));
  };

  // START STAGE
  const startStage = useCallback((stage: GameStage) => {
    setActiveStage(stage);
    setIsBossStage(stage.level === 6 || stage.level === 8);
    
    // Reset state
    setScore(0);
    setHealth(3);
    setCombo(0);
    setStageTimeLeft(stage.level === 6 || stage.level === 8 ? 45 : 32);
    setNukesAvailable(stage.level >= 5 ? 2 : 1);
    setTripleShotTimer(0);
    setShieldActive(false);
    setMagnetTimer(0);
    
    const bossHealthVal = stage.level === 8 ? 250 : 150;
    setBossHp(bossHealthVal);
    setBossMaxHp(bossHealthVal);
    setBossX(50);

    targetXRef.current = 50;
    playerXRef.current = 50;
    setPlayerX(50);

    bulletsRef.current = [];
    enemiesRef.current = [];
    dropsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    healthRef.current = 3;
    comboRef.current = 0;
    lastShotTimeRef.current = 0;
    lastSpawnTimeRef.current = 0;
    isPlayingRef.current = true;

    setViewMode('playing');
    sound.playPowerup();
  }, []);

  // Automatically start or switch to selected stage when entering Play screen
  useEffect(() => {
    if (selectedStage) {
      const stage = GAME_STAGES.find(s => s.level === selectedStage) || GAME_STAGES[0];
      startStage(stage);
    }
  }, [selectedStage, startStage]);

  // MAIN GAME LOOP (60FPS)
  useEffect(() => {
    if (viewMode !== 'playing') return;

    let animFrameId: number;
    let lastTimestamp = performance.now();

    const gameLoop = (timestamp: number) => {
      const dt = Math.min(50, timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // 1. Smooth Player Position Interpolation
      playerXRef.current += (targetXRef.current - playerXRef.current) * 0.22;
      setPlayerX(playerXRef.current);

      // 2. Auto Laser Blaster (Fires every 180ms)
      if (timestamp - lastShotTimeRef.current > (tripleShotTimer > 0 ? 140 : 190)) {
        lastShotTimeRef.current = timestamp;
        sound.playLaser();

        const currentPx = playerXRef.current;
        if (tripleShotTimer > 0) {
          // Triple Shot Spread
          bulletsRef.current.push(
            { id: Math.random(), x: currentPx, y: 82, vx: 0 },
            { id: Math.random(), x: currentPx - 4, y: 82, vx: -0.6 },
            { id: Math.random(), x: currentPx + 4, y: 82, vx: 0.6 }
          );
        } else {
          // Standard Dual Stream
          bulletsRef.current.push(
            { id: Math.random(), x: currentPx - 2.5, y: 82, vx: 0 },
            { id: Math.random(), x: currentPx + 2.5, y: 82, vx: 0 }
          );
        }
      }

      // 3. Move Bullets Upwards
      bulletsRef.current = bulletsRef.current
        .map(b => ({
          ...b,
          y: b.y - 75 * dt,
          x: b.x + (b.vx ? b.vx * 30 * dt : 0)
        }))
        .filter(b => b.y > 0 && b.x > 0 && b.x < 100);

      // 4. Spawn Enemies
      const spawnRate = activeStage.gemSpawnRate || 800;
      if (timestamp - lastSpawnTimeRef.current > spawnRate * 0.7) {
        lastSpawnTimeRef.current = timestamp;
        
        const enemyTypes: Array<Enemy['type']> = ['drone', 'drone', 'fast_scout', 'heavy_cruiser'];
        const randType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        const speed = (activeStage.hazardSpeed || 2.5) * (randType === 'fast_scout' ? 1.4 : randType === 'heavy_cruiser' ? 0.7 : 1);
        const hp = randType === 'heavy_cruiser' ? 3 : 1;
        const color = randType === 'fast_scout' ? '#f43f5e' : randType === 'heavy_cruiser' ? '#a855f7' : '#06b6d4';

        enemiesRef.current.push({
          id: Math.random(),
          x: Math.random() * 80 + 10,
          y: -5,
          hp,
          maxHp: hp,
          speed,
          type: randType,
          width: randType === 'heavy_cruiser' ? 12 : 8,
          color,
          points: randType === 'heavy_cruiser' ? 300 : 150,
          gemReward: randType === 'heavy_cruiser' ? 25 : 10
        });
      }

      // 5. Move Boss (if active)
      if (isBossStage) {
        setBossX(prev => {
          let next = prev + bossDirRef.current * 25 * dt;
          if (next > 75) bossDirRef.current = -1;
          if (next < 25) bossDirRef.current = 1;
          return next;
        });
      }

      // 6. Update Enemies & Check Bullet Collisions
      const updatedEnemies: Enemy[] = [];
      const activeBullets = [...bulletsRef.current];

      for (const enemy of enemiesRef.current) {
        let currentHp = enemy.hp;
        let isAlive = true;
        const enemyY = enemy.y + enemy.speed * 20 * dt;

        // Check collision with bullets
        for (let bIdx = activeBullets.length - 1; bIdx >= 0; bIdx--) {
          const bullet = activeBullets[bIdx];
          const distX = Math.abs(bullet.x - enemy.x);
          const distY = Math.abs(bullet.y - enemyY);

          if (distX < 6 && distY < 6) {
            // Hit!
            activeBullets.splice(bIdx, 1);
            currentHp -= 1;
            spawnExplosion(enemy.x, enemyY, enemy.color, 3);

            if (currentHp <= 0) {
              isAlive = false;
              sound.playExplosion();
              triggerShake();
              scoreRef.current += enemy.points * (comboRef.current >= 5 ? 2 : 1);
              comboRef.current += 1;
              setCombo(comboRef.current);
              setScore(scoreRef.current);

              spawnExplosion(enemy.x, enemyY, enemy.color, 10, `+${enemy.points}`);

              // Chance to spawn Drops (Gems, Stars, Power-ups)
              const dropRand = Math.random();
              if (dropRand < 0.35) {
                dropsRef.current.push({
                  id: Math.random(),
                  x: enemy.x,
                  y: enemyY,
                  type: 'gem',
                  speed: 2.2
                });
              } else if (dropRand < 0.55) {
                dropsRef.current.push({
                  id: Math.random(),
                  x: enemy.x,
                  y: enemyY,
                  type: 'gold_gem',
                  speed: 2.4
                });
              } else if (dropRand < 0.65) {
                dropsRef.current.push({
                  id: Math.random(),
                  x: enemy.x,
                  y: enemyY,
                  type: 'triple_shot',
                  speed: 2.0
                });
              } else if (dropRand < 0.73) {
                dropsRef.current.push({
                  id: Math.random(),
                  x: enemy.x,
                  y: enemyY,
                  type: 'magnet',
                  speed: 2.0
                });
              } else if (dropRand < 0.80) {
                dropsRef.current.push({
                  id: Math.random(),
                  x: enemy.x,
                  y: enemyY,
                  type: 'shield',
                  speed: 2.0
                });
              }
              break;
            }
          }
        }

        // Check if enemy hits player ship
        if (isAlive) {
          const distToPlayerX = Math.abs(enemy.x - playerXRef.current);
          const distToPlayerY = Math.abs(enemyY - 82);

          if (distToPlayerX < 7 && distToPlayerY < 6) {
            // Player hit!
            isAlive = false;
            if (shieldActive) {
              setShieldActive(false);
              sound.playPowerup();
              spawnExplosion(playerXRef.current, 82, '#06b6d4', 12, 'SHIELD BROKEN!');
            } else {
              healthRef.current -= 1;
              setHealth(healthRef.current);
              comboRef.current = 0;
              setCombo(0);
              sound.playHurt();
              triggerShake();
              spawnExplosion(playerXRef.current, 82, '#ef4444', 14, '-1 LIFE');

              if (healthRef.current <= 0) {
                // Game Over
                handleStageFinished(false);
                return;
              }
            }
          }
        }

        // Keep enemy if still on screen and alive
        if (isAlive && enemyY < 100) {
          updatedEnemies.push({ ...enemy, y: enemyY, hp: currentHp });
        }
      }

      bulletsRef.current = activeBullets;
      enemiesRef.current = updatedEnemies;

      // 7. Check Boss Hit by bullets
      if (isBossStage) {
        for (let bIdx = bulletsRef.current.length - 1; bIdx >= 0; bIdx--) {
          const bullet = bulletsRef.current[bIdx];
          if (Math.abs(bullet.x - bossX) < 14 && bullet.y < 25) {
            bulletsRef.current.splice(bIdx, 1);
            spawnExplosion(bullet.x, bullet.y, '#f59e0b', 3);
            setBossHp(prev => {
              const nextHp = prev - 1;
              if (nextHp <= 0) {
                // Boss Defeated!
                sound.playExplosion(true);
                triggerShake();
                scoreRef.current += 3000;
                setScore(scoreRef.current);
                spawnExplosion(bossX, 20, '#fbbf24', 25, '👑 BOSS DEFEATED!');
                handleStageFinished(true);
              }
              return Math.max(0, nextHp);
            });
          }
        }
      }

      // 8. Update Falling Drops (Gems & Powerups)
      const currentMagnet = magnetTimer > 0;
      const updatedDrops: DropItem[] = [];

      for (const drop of dropsRef.current) {
        let dx = drop.x;
        let dy = drop.y + drop.speed * 22 * dt;

        // Magnet attraction
        if (currentMagnet) {
          const angle = Math.atan2(82 - dy, playerXRef.current - dx);
          dx += Math.cos(angle) * 45 * dt;
          dy += Math.sin(angle) * 45 * dt;
        }

        // Check collection
        const distToPlayer = Math.hypot(dx - playerXRef.current, dy - 82);
        if (distToPlayer < 8) {
          // Collected!
          if (drop.type === 'gem') {
            sound.playGem();
            scoreRef.current += 100;
            spawnExplosion(dx, dy, '#06b6d4', 4, '+100 💎');
          } else if (drop.type === 'gold_gem') {
            sound.playGem();
            scoreRef.current += 300;
            spawnExplosion(dx, dy, '#fbbf24', 6, '+300 ⭐');
          } else if (drop.type === 'triple_shot') {
            sound.playPowerup();
            setTripleShotTimer(8);
            spawnExplosion(dx, dy, '#a855f7', 8, '⚡ TRIPLE LASER!');
          } else if (drop.type === 'shield') {
            sound.playPowerup();
            setShieldActive(true);
            spawnExplosion(dx, dy, '#3b82f6', 8, '🛡️ FORCE SHIELD!');
          } else if (drop.type === 'magnet') {
            sound.playPowerup();
            setMagnetTimer(8);
            spawnExplosion(dx, dy, '#10b981', 8, '🧲 GEM MAGNET!');
          }

          setScore(scoreRef.current);
        } else if (dy < 100) {
          updatedDrops.push({ ...drop, x: dx, y: dy });
        }
      }
      dropsRef.current = updatedDrops;

      // 9. Update Particles
      particlesRef.current = particlesRef.current
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - dt * 2.2
        }))
        .filter(p => p.life > 0);

      // Trigger state sync for UI rendering
      setBullets([...bulletsRef.current]);
      setEnemies([...enemiesRef.current]);
      setDrops([...dropsRef.current]);
      setParticles([...particlesRef.current]);

      // Power-up timers countdown
      setTripleShotTimer(t => Math.max(0, t - dt));
      setMagnetTimer(m => Math.max(0, m - dt));

      animFrameId = requestAnimationFrame(gameLoop);
    };

    animFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [viewMode, activeStage, isBossStage, bossX, tripleShotTimer, magnetTimer, shieldActive, triggerShake, spawnExplosion]);

  // Stage timer countdown
  useEffect(() => {
    if (viewMode !== 'playing') return;

    const timer = setInterval(() => {
      setStageTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleStageFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode]);

  // Handle stage completion
  const handleStageFinished = (victory: boolean) => {
    isPlayingRef.current = false;
    setStageWon(victory);

    if (victory) {
      sound.playVictory();
      const stars = scoreRef.current >= activeStage.targetScore * 1.4 ? 3 : scoreRef.current >= activeStage.targetScore ? 2 : 1;
      setStarsEarned(stars);

      const bonusGems = activeStage.gemReward + (stars === 3 ? 250 : stars === 2 ? 100 : 50);
      setGemsWon(bonusGems);

      completeStageProgress(activeStage.level, scoreRef.current, stars, bonusGems, activeStage.xpReward);
    } else {
      sound.playHurt();
      setStarsEarned(0);
      setGemsWon(50);
      earnGemsFromPlay(50, 'Stage Participation');
    }

    setViewMode('stage_result');
  };

  // LUCKY WHEEL SPIN
  const spinLuckyWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelPrize(null);
    sound.playPowerup();

    const randomDegrees = 1440 + Math.floor(Math.random() * 360);
    setWheelDegree(randomDegrees);

    setTimeout(() => {
      setWheelSpinning(false);
      const prizes = [
        { label: '+500 💎 GEMS', gems: 500 },
        { label: '+1,000 💎 MEGA WIN', gems: 1000 },
        { label: '+250 💎 GEMS', gems: 250 },
        { label: '+750 💎 JACKPOT', gems: 750 },
        { label: '+300 💎 GEMS', gems: 300 },
        { label: '+1,500 💎 SUPER PRIZE', gems: 1500 }
      ];
      const win = prizes[Math.floor(Math.random() * prizes.length)];
      setWheelPrize(win.label);
      earnGemsFromPlay(win.gems, 'Lucky Spin Prize Wheel');
      sound.playVictory();
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 flex flex-col select-none">
      <GemHeader />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-2 space-y-3">
        {/* Navigation Tabs between Arcade Campaign & Lucky Wheel */}
        <div className="flex items-center justify-between gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            id="tab-arcade-campaign"
            onClick={() => setViewMode('stage_select')}
            className={`flex-1 py-2 px-3 rounded-xl font-black text-xs font-display flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'stage_select' || viewMode === 'playing' || viewMode === 'stage_result'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>8-STAGE CAMPAIGN</span>
          </button>

          <button
            id="tab-lucky-wheel"
            onClick={() => setViewMode('lucky_wheel')}
            className={`flex-1 py-2 px-3 rounded-xl font-black text-xs font-display flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'lucky_wheel'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>LUCKY SPIN WHEEL</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: STAGE SELECTOR (Level 1 to 8) */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'stage_select' && (
          <section className="space-y-3 animate-in fade-in duration-200">
            {/* Header Gamer Card */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-purple-500/40 rounded-3xl p-4 shadow-lg flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 font-display">
                    ⚔️ {playerProfile.alias}
                  </span>
                  <span className="text-[11px] font-bold text-cyan-300">
                    Level {playerProfile.level}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white font-display mt-0.5">
                  CYBER STRIKE ARENA
                </h2>
                <p className="text-xs text-slate-300">
                  Steer with screen clicks, blast crystal drones & claim real vouchers!
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Unlocked</span>
                <span className="text-lg font-black text-amber-400 font-display">
                  {unlockedStage} / 8
                </span>
              </div>
            </div>

            {/* Stage Grid Cards (Levels 1 to 8) */}
            <div className="space-y-2">
              {GAME_STAGES.map((stage) => {
                const isLocked = stage.level > unlockedStage;
                const record = stageRecords[stage.level];
                const isBoss = stage.level === 6 || stage.level === 8;

                return (
                  <div
                    key={stage.level}
                    id={`stage-card-${stage.level}`}
                    onClick={() => !isLocked && startStage(stage)}
                    className={`relative overflow-hidden rounded-2xl border transition-all p-3.5 ${
                      isLocked
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                        : isBoss
                        ? 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border-rose-500/50 hover:border-rose-400 cursor-pointer hover:shadow-lg active:scale-[0.99]'
                        : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 cursor-pointer hover:shadow-md active:scale-[0.99]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Level Badge */}
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base font-display shrink-0 shadow-inner ${
                          isLocked
                            ? 'bg-slate-800 text-slate-500'
                            : isBoss
                            ? 'bg-gradient-to-br from-rose-500 to-amber-500 text-slate-950 animate-pulse'
                            : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950'
                        }`}>
                          {isLocked ? <Lock className="w-4 h-4" /> : isBoss ? <Skull className="w-5 h-5" /> : stage.level}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-extrabold text-white font-display">
                              {stage.name}
                            </h3>
                            {isBoss && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                BOSS FIGHT
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {stage.subtitle} • Target: {stage.targetScore.toLocaleString()} pts
                          </p>
                        </div>
                      </div>

                      {/* Stars & Launch Button */}
                      <div className="flex items-center gap-2">
                        {!isLocked && (
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  (record?.stars || 0) >= s
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        <div className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 ${
                          isLocked
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow'
                        }`}>
                          <span>+{stage.gemReward} 💎</span>
                          {!isLocked && <ChevronRight className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: ACTIVE 60FPS ARCADE GAMEPLAY */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'playing' && (
          <section className="space-y-2 animate-in fade-in duration-200">
            {/* Top In-Game Status Bar */}
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl px-3 py-2">
              <div className="flex items-center gap-2">
                {/* Health Hearts */}
                <div className="flex items-center gap-0.5">
                  {[...Array(maxHealth)].map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-4 h-4 transition-colors ${
                        i < health ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {shieldActive && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1 animate-pulse">
                    <Shield className="w-3 h-3" /> Shield
                  </span>
                )}

                {tripleShotTimer > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1 animate-pulse">
                    <Zap className="w-3 h-3" /> 3x Laser
                  </span>
                )}
              </div>

              {/* Score & Combo */}
              <div className="text-right flex items-center gap-2">
                {combo >= 3 && (
                  <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                    {combo}x STREAK
                  </span>
                )}
                <span className="text-sm font-black text-cyan-300 font-mono">
                  {score.toLocaleString()} PTS
                </span>
                <span className="text-xs font-bold text-slate-400">
                  ⏱️ {stageTimeLeft}s
                </span>
              </div>
            </div>

            {/* Boss Health Bar (If Boss Level) */}
            {isBossStage && (
              <div className="bg-slate-900 border border-rose-500/50 rounded-xl p-2 shadow">
                <div className="flex justify-between text-[11px] font-bold text-rose-300 mb-1">
                  <span>👑 {activeStage.level === 8 ? 'NEBULA EMPRESS MK.X' : 'GOLIATH WAR MECH'}</span>
                  <span>{bossHp} / {bossMaxHp} HP</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-rose-950">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-100"
                    style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* 60FPS ARCADE ARENA (DIRECT ON-SCREEN CLICK & TOUCH) */}
            <div
              ref={arenaRef}
              id="arcade-canvas"
              onClick={handleArenaPointer}
              onTouchStart={handleArenaPointer}
              onTouchMove={handleArenaPointer}
              className={`relative overflow-hidden rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl h-[380px] select-none cursor-pointer touch-none ${
                screenShake ? 'translate-x-1 translate-y-1' : ''
              }`}
            >
              {/* Starfield Particle Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

              {/* Screen Tap Steering Hint Arrows */}
              <div className="absolute inset-0 grid grid-cols-2 pointer-events-none z-0">
                <div className="flex items-center justify-start pl-3 opacity-15">
                  <span className="text-xs font-black tracking-widest text-cyan-400 font-display">
                    ◀ TAP LEFT
                  </span>
                </div>
                <div className="flex items-center justify-end pr-3 opacity-15">
                  <span className="text-xs font-black tracking-widest text-cyan-400 font-display">
                    TAP RIGHT ▶
                  </span>
                </div>
              </div>

              {/* Boss Entity on Screen */}
              {isBossStage && (
                <div
                  className="absolute -translate-x-1/2 top-4 transition-all duration-75 z-20"
                  style={{ left: `${bossX}%` }}
                >
                  <div className="relative">
                    <div className="w-16 h-12 rounded-2xl bg-gradient-to-b from-rose-600 to-amber-600 border-2 border-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.6)] flex items-center justify-center text-xl animate-bounce">
                      👾
                    </div>
                    {/* Boss Thrusters */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-amber-400 rounded-full blur-[2px]" />
                  </div>
                </div>
              )}

              {/* Floating Enemies */}
              {enemies.map((enemy) => (
                <div
                  key={enemy.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-transform"
                  style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
                >
                  <div
                    className="rounded-xl border shadow-lg flex items-center justify-center font-bold text-xs p-1"
                    style={{
                      backgroundColor: `${enemy.color}25`,
                      borderColor: enemy.color,
                      boxShadow: `0 0 12px ${enemy.color}60`,
                      width: `${enemy.width * 4.5}px`,
                      height: `${enemy.width * 4}px`
                    }}
                  >
                    <span className="text-sm">
                      {enemy.type === 'heavy_cruiser' ? '🛸' : enemy.type === 'fast_scout' ? '⚡' : '💎'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Laser Bullets */}
              {bullets.map((b) => (
                <div
                  key={b.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-4 bg-cyan-300 rounded-full shadow-[0_0_8px_#38bdf8] z-10"
                  style={{ left: `${b.x}%`, top: `${b.y}%` }}
                />
              ))}

              {/* Collectible Drops (Gems, Powerups) */}
              {drops.map((d) => (
                <div
                  key={d.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 animate-spin"
                  style={{ left: `${d.x}%`, top: `${d.y}%` }}
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center justify-center text-xs">
                    {d.type === 'gem' && '💎'}
                    {d.type === 'gold_gem' && '⭐'}
                    {d.type === 'triple_shot' && '⚡'}
                    {d.type === 'shield' && '🛡️'}
                    {d.type === 'magnet' && '🧲'}
                  </div>
                </div>
              ))}

              {/* Floating Explosion Particles & Text */}
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 font-black text-xs"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    opacity: p.life,
                    transform: `scale(${p.life + 0.3})`,
                    color: p.color
                  }}
                >
                  {p.text ? (
                    <span className="bg-slate-950/80 px-1.5 py-0.5 rounded border border-white/20 shadow">
                      {p.text}
                    </span>
                  ) : (
                    <div
                      className="rounded-full"
                      style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        boxShadow: `0 0 6px ${p.color}`
                      }}
                    />
                  )}
                </div>
              ))}

              {/* Player Vessel (Vixen Fighter Jet) */}
              <div
                className="absolute bottom-4 -translate-x-1/2 z-20 transition-all duration-75"
                style={{ left: `${playerX}%` }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Force Shield Bubble */}
                  {shieldActive && (
                    <div className="absolute -inset-3 rounded-full border-2 border-cyan-400 bg-cyan-400/20 animate-pulse shadow-[0_0_18px_rgba(6,182,212,0.6)]" />
                  )}

                  {/* Ship Body */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-500 border-2 border-white shadow-[0_0_20px_rgba(6,182,212,0.8)] flex items-center justify-center text-lg">
                    🚀
                  </div>

                  {/* Plasma Exhaust Glow */}
                  <div className="w-4 h-3 bg-cyan-400 rounded-b-full blur-[2px] animate-pulse" />
                </div>
              </div>
            </div>

            {/* STEERING TOUCH BARS & MEGA SMART BOMB */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              {/* Steer Left Touchpad */}
              <button
                id="steer-left-button"
                onClick={() => handleSteer('left')}
                className="col-span-2 py-3.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-cyan-950 border-2 border-cyan-500/40 hover:border-cyan-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
                <span>STEER LEFT</span>
              </button>

              {/* SMART BOMB BUTTON */}
              <button
                id="smart-bomb-button"
                onClick={handleFireNuke}
                disabled={nukesAvailable <= 0}
                className={`py-3.5 px-2 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 transition-all ${
                  nukesAvailable > 0
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 border-2 border-white animate-bounce'
                    : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Bomb className="w-4 h-4" />
                <span className="text-[10px]">NUKE ({nukesAvailable})</span>
              </button>

              {/* Steer Right Touchpad */}
              <button
                id="steer-right-button"
                onClick={() => handleSteer('right')}
                className="col-span-2 py-3.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-cyan-950 border-2 border-cyan-500/40 hover:border-cyan-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span>STEER RIGHT</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: STAGE RESULT & REWARD MODAL */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'stage_result' && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            {stageWon ? (
              <>
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg animate-bounce">
                  <Trophy className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                    VICTORY ACHIEVED!
                  </span>
                  <h2 className="text-2xl font-black text-white font-display">
                    Stage {activeStage.level} Cleared!
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Outstanding shooting, <strong className="text-white">{playerProfile.alias}</strong>!
                  </p>
                </div>

                {/* Stars */}
                <div className="flex justify-center items-center gap-2 py-1">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-7 h-7 ${
                        starsEarned >= s
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                          : 'text-slate-800'
                      }`}
                    />
                  ))}
                </div>

                {/* Reward Banner */}
                <div className="p-3.5 bg-gradient-to-r from-amber-500/20 via-slate-900 to-cyan-500/20 border border-amber-400/40 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Gems Claimed</span>
                    <span className="text-lg font-black text-amber-400 font-display flex items-center gap-1">
                      +{gemsWon} 💎
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold text-left pt-1 border-t border-slate-800/80 flex items-center justify-between">
                    <span>Real-world value offset:</span>
                    <span>Saves ~₹{Math.max(15, Math.round(gemsWon * 0.18))} on Loot Market</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                  <Skull className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white font-display">
                    Ship Destroyed!
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Hull breached in Stage {activeStage.level}. Practice steering & dodge hazards!
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl text-xs text-slate-400">
                  Earned +50 💎 participation bonus.
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {stageWon && activeStage.level < 8 && (
                <button
                  id="result-next-stage-button"
                  onClick={() => startStage(GAME_STAGES[activeStage.level])}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm font-display flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform"
                >
                  <span>NEXT STAGE {activeStage.level + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <button
                id="result-retry-button"
                onClick={() => startStage(activeStage)}
                className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Stage {activeStage.level}</span>
              </button>

              <button
                id="result-market-button"
                onClick={() => navigateTo('loot_market')}
                className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Redeem Vouchers in Loot Market</span>
              </button>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: LUCKY SPIN WHEEL (INSTANT BONUS REWARDS) */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'lucky_wheel' && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center space-y-4 shadow-xl animate-in fade-in duration-200">
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                DAILY BONUS RUSH
              </span>
              <h2 className="text-xl font-black text-white font-display mt-1">
                LUCKY PRIZE WHEEL
              </h2>
              <p className="text-xs text-slate-400">
                Spin the neon wheel to harvest extra Gems for real commerce vouchers!
              </p>
            </div>

            {/* Glowing Spin Wheel Component */}
            <div className="relative py-4 flex justify-center items-center">
              {/* Pointer Marker */}
              <div className="absolute top-2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-amber-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />

              {/* Wheel Disc */}
              <div
                className="w-52 h-52 rounded-full border-4 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.3)] bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 flex items-center justify-center transition-transform duration-[3200ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
                style={{ transform: `rotate(${wheelDegree}deg)` }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute text-xs font-black text-amber-300 -top-[-15px]">1,000💎</div>
                  <div className="absolute text-xs font-black text-cyan-300 -bottom-[-15px]">1,500💎</div>
                  <div className="absolute text-xs font-black text-purple-300 -left-[-15px]">500💎</div>
                  <div className="absolute text-xs font-black text-emerald-300 -right-[-15px]">750💎</div>
                  <div className="w-14 h-14 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center font-black text-xs text-amber-400 shadow-inner">
                    SPIN
                  </div>
                </div>
              </div>
            </div>

            {wheelPrize && (
              <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-black text-sm flex items-center justify-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4" />
                <span>Won: {wheelPrize}! Added to your wallet.</span>
              </div>
            )}

            <button
              id="spin-wheel-button"
              onClick={spinLuckyWheel}
              disabled={wheelSpinning}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm font-display tracking-wider uppercase shadow-xl transition-all ${
                wheelSpinning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-98'
              }`}
            >
              {wheelSpinning ? 'SPINNING WHEEL...' : '⚡ SPIN FREE LUCKY WHEEL'}
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

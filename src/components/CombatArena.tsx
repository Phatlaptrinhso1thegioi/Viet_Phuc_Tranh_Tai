import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PlayerProfile, Enemy } from '../types/game';
import { INITIAL_ENEMIES, INITIAL_VIET_PHUC_ITEMS } from '../data/gameData';
import { soundEngine } from '../utils/audio';
import { CharacterRenderer } from '../engine/CharacterRenderer';
import { VirusCharacterRenderer } from '../engine/VirusCharacterRenderer';

interface CombatArenaProps {
  player: PlayerProfile;
  enemyKey: string;
  onVictory: (expGained: number, goldGained: number, dropItemId?: string) => void;
  onDefeat: () => void;
  toast: (msg: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface DamageNum {
  x: number;
  y: number;
  val: number | string;
  color: string;
  life: number;
}

interface GhostTrail {
  x: number;
  y: number;
  alpha: number;
}

interface SlashArc {
  x: number;
  y: number;
  angle: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
}

interface DragonProjectile {
  x: number;
  y: number;
  vx: number;
  life: number;
  maxLife: number;
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  player,
  enemyKey,
  onVictory,
  onDefeat,
  toast,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stats in battle
  const [playerHp, setPlayerHp] = useState<number>(player.stats.hp);
  const [playerMp, setPlayerMp] = useState<number>(player.stats.mp);
  const [potions, setPotions] = useState<number>(3);

  const initialEnemy = INITIAL_ENEMIES[enemyKey] || INITIAL_ENEMIES['minion_north'];
  const [enemy, setEnemy] = useState<Enemy>({ ...initialEnemy });

  // Trùm Cuối 2 Mạng (2 Lives / 2 Phases) & Diệt Thế Chưởng
  const isFinalBoss = enemyKey === 'boss_virus';
  const [bossLives, setBossLives] = useState<number>(isFinalBoss ? 2 : 1);
  const [bossPhase, setBossPhase] = useState<number>(1);
  const [phaseTransitionText, setPhaseTransitionText] = useState<string | null>(null);

  // Cooldowns
  const [skill1Cd, setSkill1Cd] = useState<number>(0);
  const [skill2Cd, setSkill2Cd] = useState<number>(0);
  const [dashCd, setDashCd] = useState<number>(0);

  // Active key indicators for visual feedback
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Combat status flags
  const inActionRef = useRef<boolean>(false);
  const isDashingRef = useRef<boolean>(false);
  const shakeRef = useRef<number>(0);

  // Positions on 2D side-scroller line
  const playerPosRef = useRef<{ x: number; y: number }>({ x: 220, y: 380 });
  const enemyPosRef = useRef<{ x: number; y: number }>({ x: 620, y: 380 });
  const particlesRef = useRef<Particle[]>([]);
  const damageNumsRef = useRef<DamageNum[]>([]);
  const ghostTrailsRef = useRef<GhostTrail[]>([]);
  const slashArcsRef = useRef<SlashArc[]>([]);
  const dragonsRef = useRef<DragonProjectile[]>([]);

  // Enemy telegraph timer
  const enemyAttackTimerRef = useRef<number>(0);
  const enemyWarningRef = useRef<boolean>(false);

  // Lấy thông tin vũ khí đang trang bị
  const equippedWeapon = INITIAL_VIET_PHUC_ITEMS.find((i) => i.id === player.equippedWeaponId);

  useEffect(() => {
    soundEngine.playBGM(enemy.spriteType === 'boss_virus' ? 'boss' : 'combat');
  }, [enemy.spriteType]);

  // Main combat animation loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const loop = () => {
      tick++;

      // Shake decrement
      if (shakeRef.current > 0) shakeRef.current *= 0.88;

      // Update positions & AI
      updateBattlePhysics(canvas);

      // Render Dead Cells style scene
      renderScene(ctx, canvas, tick);

      animId = requestAnimationFrame(loop);
    };

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      playerPosRef.current.y = canvas.height * 0.68;
      enemyPosRef.current.y = canvas.height * 0.68;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [enemy.hp, playerHp]);

  // Battle Logic & Enemy AI
  const updateBattlePhysics = (canvas: HTMLCanvasElement) => {
    // Enemy attack cadence
    enemyAttackTimerRef.current += 0.016;

    // Telegraphed warning 0.5s before attack
    if (enemyAttackTimerRef.current > enemy.attackCooldown - 0.5 && !enemyWarningRef.current) {
      enemyWarningRef.current = true;
    }

    if (enemyAttackTimerRef.current >= enemy.attackCooldown) {
      enemyAttackTimerRef.current = 0;
      enemyWarningRef.current = false;
      enemyPerformAttack();
    }

    // Update ghost trails
    ghostTrailsRef.current.forEach((g) => {
      g.alpha -= 0.05;
    });
    ghostTrailsRef.current = ghostTrailsRef.current.filter((g) => g.alpha > 0);

    // Update slash arcs
    slashArcsRef.current.forEach((s) => {
      s.life--;
    });
    slashArcsRef.current = slashArcsRef.current.filter((s) => s.life > 0);

    // Update dragons
    dragonsRef.current.forEach((d) => {
      d.x += d.vx;
      d.life--;
    });
    dragonsRef.current = dragonsRef.current.filter((d) => d.life > 0);

    // Update particles
    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    });
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    // Update floating damage numbers
    damageNumsRef.current.forEach((d) => {
      d.y -= 1.2;
      d.life--;
    });
    damageNumsRef.current = damageNumsRef.current.filter((d) => d.life > 0);
  };

  // Áp dụng sát thương lên địch & Xử lý Trùm Cuối 2 Mạng
  const applyDamageToEnemy = (damage: number) => {
    setEnemy((prev) => {
      const newHp = Math.max(0, prev.hp - damage);
      if (newHp <= 0) {
        // Kiểm tra nếu là Trùm Cuối và còn Mạng thứ 2
        if (isFinalBoss && bossLives === 2) {
          setBossLives(1);
          setBossPhase(2);
          soundEngine.playBossRoar();
          shakeRef.current = 40;

          setPhaseTransitionText('⚠️ CẢNH BÁO: CHÚA TỂ VIRUS HỒI SINH PHA 2 - CUỒNG NỘ THỜI KHÔNG 2099!');
          setTimeout(() => setPhaseTransitionText(null), 3800);

          spawnSparks(enemyPosRef.current.x, enemyPosRef.current.y - 20, '#ef4444', 80);
          spawnSparks(enemyPosRef.current.x, enemyPosRef.current.y - 40, '#fde047', 50);
          addDamageNum(enemyPosRef.current.x, enemyPosRef.current.y - 70, '🔥 HỒI SINH PHA 2 (2000 HP)!', '#f43f5e');

          return {
            ...prev,
            name: '👑 CHÚA TỂ VIRUS CUỒNG BẠO (Phase 2 - Awakened)',
            title: 'Cuồng Nộ Diệt Thế 2099 - Hồi Sinh Toàn Lực',
            maxHp: 2000,
            hp: 2000,
            attack: 115,
            attackCooldown: 1.0,
          };
        } else {
          handleWin();
        }
      }
      return { ...prev, hp: newHp };
    });
  };

  const enemyPerformAttack = () => {
    // Nếu nhân vật đang Dash (lướt né đòn), hoàn toàn miễn nhiễm sát thương!
    if (isDashingRef.current) {
      addDamageNum(playerPosRef.current.x, playerPosRef.current.y - 45, '⚡ NÉ ĐÒN HOÀN HẢO!', '#34d399');
      soundEngine.playTone(600, 'sine', 0.12);
      spawnSparks(playerPosRef.current.x, playerPosRef.current.y - 20, '#6ee7b7', 15);
      return;
    }

    // Độc chiêu Phase 2 của Trùm Cuối: Sát thương siêu to (Diệt Thế Hư Không Lãng Quên)
    let isSuperAttack = false;
    let baseAtk = enemy.attack;
    if (isFinalBoss && bossPhase === 2) {
      isSuperAttack = Math.random() < 0.65;
      if (isSuperAttack) {
        baseAtk += 85 + Math.floor(Math.random() * 45); // Sát thương cực to từ 100 - 150!
      }
    }

    // Tính toán sát thương
    const rawDmg = baseAtk - Math.floor(player.stats.defense * 0.35);
    const dmg = Math.max(12, rawDmg + Math.floor(Math.random() * 12));

    soundEngine.playPlayerHurt();
    shakeRef.current = isSuperAttack ? 35 : 18;

    // Blood / spark particles
    spawnSparks(playerPosRef.current.x, playerPosRef.current.y, '#ef4444', isSuperAttack ? 45 : 18);
    addDamageNum(
      playerPosRef.current.x,
      playerPosRef.current.y - 30,
      `-${dmg}${isSuperAttack ? ' ☠️ [SIÊU SKILL DIỆT THẾ!]' : ''}`,
      isSuperAttack ? '#f43f5e' : '#ef4444'
    );

    setPlayerHp((prev) => {
      const next = Math.max(0, prev - dmg);
      if (next <= 0) {
        setTimeout(() => {
          onDefeat();
        }, 500);
      }
      return next;
    });
  };

  // =========================================================================
  // ĐÒN TẤN CÔNG THƯỜNG [J]: VUNG KIẾM / CHÉM RÌU VỚI VẾT CHÉM PHÁT SÁNG
  // =========================================================================
  const handleAttack = () => {
    if (inActionRef.current) return;
    inActionRef.current = true;
    soundEngine.playSlash();

    // Bước vọt tới tấn công
    const originalX = playerPosRef.current.x;
    playerPosRef.current.x += 45;

    // Màu sắc vệt chém theo vũ khí
    let slashColor = '#38bdf8';
    if (equippedWeapon?.id === 'riu_dong_dong_son') slashColor = '#f59e0b';
    if (equippedWeapon?.id === 'kiem_thuan_thien') slashColor = '#fde047';
    if (equippedWeapon?.id === 'no_than_kim_quy') slashColor = '#34d399';
    if (equippedWeapon?.id === 'thuong_bup_sen') slashColor = '#ef4444';
    if (equippedWeapon?.id === 'dai_dao_tay_son') slashColor = '#f97316';

    // Tạo vệt chém hình vòng cung phát sáng (Slash Arc FX)
    slashArcsRef.current.push({
      x: enemyPosRef.current.x - 20,
      y: enemyPosRef.current.y - 25,
      angle: -Math.PI / 4,
      radius: 55,
      color: slashColor,
      life: 14,
      maxLife: 14,
    });

    const baseDmg = player.stats.attack + Math.floor(Math.random() * 12);
    const isCrit = Math.random() < 0.28;
    const finalDmg = isCrit ? Math.floor(baseDmg * 1.85) : baseDmg;

    // Sparks & Slash arc
    spawnSparks(enemyPosRef.current.x, enemyPosRef.current.y - 15, isCrit ? '#fbe282' : slashColor, 22);
    addDamageNum(
      enemyPosRef.current.x,
      enemyPosRef.current.y - 45,
      `${finalDmg}${isCrit ? ' 💥 BẠO KÍCH!' : ''}`,
      isCrit ? '#fbbf24' : '#ffffff'
    );

    soundEngine.playEnemyHit();
    shakeRef.current = isCrit ? 12 : 5;

    applyDamageToEnemy(finalDmg);

    setTimeout(() => {
      playerPosRef.current.x = originalX;
      inActionRef.current = false;
    }, 180);
  };

  // =========================================================================
  // KỸ NĂNG LƯỚT NÉ ĐÒN [K] (DASH) VỚI GHOST TRAILS
  // =========================================================================
  const handleDash = () => {
    if (dashCd > 0) return;
    soundEngine.playTone(320, 'sawtooth', 0.16);
    isDashingRef.current = true;
    setDashCd(2.5);

    const origX = playerPosRef.current.x;

    // Tạo bóng mờ lướt (Ghost Trails)
    ghostTrailsRef.current.push(
      { x: origX, y: playerPosRef.current.y, alpha: 0.7 },
      { x: origX + 40, y: playerPosRef.current.y, alpha: 0.5 },
      { x: origX + 80, y: playerPosRef.current.y, alpha: 0.3 }
    );

    playerPosRef.current.x += 135;

    // Bụi khói đất khi lướt
    spawnSparks(origX, playerPosRef.current.y + 15, '#94a3b8', 12);

    const interval = setInterval(() => {
      setDashCd((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    setTimeout(() => {
      playerPosRef.current.x = origX;
      isDashingRef.current = false;
    }, 380);
  };

  // =========================================================================
  // CHIÊU 1 [U]: HÀO KHÍ ĐÔNG A (BÃO LỬA BÙNG NỔ)
  // =========================================================================
  const handleSkill1 = () => {
    if (skill1Cd > 0 || playerMp < 20) {
      if (playerMp < 20) toast('Không đủ MP!');
      return;
    }
    soundEngine.playHeavySlash();
    setPlayerMp((m) => Math.max(0, m - 20));
    setSkill1Cd(5);

    const interval = setInterval(() => {
      setSkill1Cd((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    // Cột lửa bùng nổ xoay quanh địch
    shakeRef.current = 20;
    const dmg = Math.floor(player.stats.attack * 2.5) + 35;
    spawnSparks(enemyPosRef.current.x, enemyPosRef.current.y - 20, '#f97316', 45);
    spawnSparks(enemyPosRef.current.x, enemyPosRef.current.y - 40, '#ef4444', 30);
    addDamageNum(enemyPosRef.current.x, enemyPosRef.current.y - 60, `🔥 HÀO KHÍ ĐÔNG A! -${dmg}`, '#ea580c');

    applyDamageToEnemy(dmg);
  };

  // =========================================================================
  // CHIÊU 2 [L]: LONG THẦN TRẢM (RỒNG VÀNG THẦN TỐC QUÉT MÀN HÌNH)
  // =========================================================================
  const handleSkill2 = () => {
    if (skill2Cd > 0 || playerMp < 35) {
      if (playerMp < 35) toast('Không đủ MP!');
      return;
    }
    soundEngine.playHeavySlash();
    setPlayerMp((m) => Math.max(0, m - 35));
    setSkill2Cd(8);

    // Phóng Rồng Vàng bay xuyên qua màn hình
    dragonsRef.current.push({
      x: playerPosRef.current.x,
      y: playerPosRef.current.y - 25,
      vx: 18,
      life: 35,
      maxLife: 35,
    });

    const interval = setInterval(() => {
      setSkill2Cd((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    // Huge damage & dragon slash
    shakeRef.current = 26;
    const dmg = Math.floor(player.stats.attack * 3.4) + 65;
    spawnSparks(enemyPosRef.current.x, enemyPosRef.current.y - 30, '#eab308', 60);
    spawnSparks(enemyPosRef.current.x, enemyPosRef.current.y - 10, '#fde047', 40);
    addDamageNum(enemyPosRef.current.x, enemyPosRef.current.y - 70, `🐉 LONG THẦN TRẢM! -${dmg}`, '#fde047');

    applyDamageToEnemy(dmg);
  };

  // =========================================================================
  // BÌNH THẢO DƯỢC [I / H]
  // =========================================================================
  const handlePotion = () => {
    if (potions <= 0) {
      toast('Hết bình thảo dược! Có thể mua thêm tại Tiệm Binh Khí.');
      return;
    }
    soundEngine.playLevelUp();
    setPotions((p) => p - 1);
    setPlayerHp((prev) => Math.min(player.stats.maxHp, prev + 120));
    setPlayerMp((prev) => Math.min(player.stats.maxMp, prev + 40));
    spawnSparks(playerPosRef.current.x, playerPosRef.current.y - 20, '#10b981', 25);
    addDamageNum(playerPosRef.current.x, playerPosRef.current.y - 45, '✨ +120 HP & +40 MP', '#34d399');
  };

  // =========================================================================
  // LẮNG NGHE BÀN PHÍM TOÀN DIỆN (J, K, U, L, I, H, SPACE)
  // =========================================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setActiveKey(key);

      if (key === 'j' || key === ' ') {
        e.preventDefault();
        handleAttack();
      } else if (key === 'k') {
        e.preventDefault();
        handleDash();
      } else if (key === 'u' || key === '1') {
        e.preventDefault();
        handleSkill1();
      } else if (key === 'l' || key === '2') {
        e.preventDefault();
        handleSkill2();
      } else if (key === 'i' || key === 'h' || key === '3') {
        e.preventDefault();
        handlePotion();
      }
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [skill1Cd, skill2Cd, dashCd, playerMp, potions, enemy.hp, playerHp]);

  const handleWin = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });
    soundEngine.playLevelUp();
    setTimeout(() => {
      onVictory(enemy.expReward, enemy.goldReward, enemy.dropItemId);
    }, 600);
  };

  const spawnSparks = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particlesRef.current.push({
        x,
        y: y - 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 15 + Math.floor(Math.random() * 15),
        maxLife: 30,
        color,
        size: 3 + Math.random() * 3,
      });
    }
  };

  const addDamageNum = (x: number, y: number, val: number | string, color: string) => {
    damageNumsRef.current.push({
      x,
      y,
      val,
      color,
      life: 45,
    });
  };

  // =========================================================================
  // VẼ BỐI CẢNH & HIỆU ỨNG TRẬN CHIẾN
  // =========================================================================
  const renderScene = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, tick: number) => {
    const W = canvas.width;
    const H = canvas.height;

    ctx.save();
    // Screen shake
    if (shakeRef.current > 0.5) {
      const sx = (Math.random() - 0.5) * shakeRef.current;
      const sy = (Math.random() - 0.5) * shakeRef.current;
      ctx.translate(sx, sy);
    }

    // 1. Nền Trận Đấu
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#241033');
    bg.addColorStop(0.5, '#170926');
    bg.addColorStop(1, '#07040a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 2. Trăng Máu / Mặt Trời Thời Không
    const moonGrad = ctx.createRadialGradient(W * 0.78, H * 0.28, 20, W * 0.78, H * 0.28, H * 0.35);
    moonGrad.addColorStop(0, 'rgba(235, 75, 110, 0.75)');
    moonGrad.addColorStop(0.7, 'rgba(168, 50, 100, 0.2)');
    moonGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(W * 0.78, H * 0.28, H * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // 3. Bia đá Cổ & Cột Thành
    ctx.fillStyle = '#0f0717';
    ctx.fillRect(W * 0.12, H * 0.42, 34, 90);
    ctx.fillRect(W * 0.52, H * 0.4, 28, 95);

    // 4. Sàn đấu Platform
    ctx.fillStyle = '#170d24';
    ctx.fillRect(0, H * 0.7, W, H * 0.3);
    ctx.fillStyle = '#3d1f5e';
    ctx.fillRect(0, H * 0.7, W, 8);

    // 5. Cảnh báo dấu chấm than đỏ nếu Enemy chuẩn bị ra đòn
    if (enemyWarningRef.current) {
      ctx.fillStyle = '#ef4444';
      ctx.font = '24px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('!', enemyPosRef.current.x, enemyPosRef.current.y - 75);
      ctx.textAlign = 'start';
    }

    // 6. Vẽ Ghost Trails khi Dash
    ghostTrailsRef.current.forEach((trail) => {
      ctx.save();
      ctx.globalAlpha = trail.alpha;
      drawSidePlayer(ctx, trail.x, trail.y, true);
      ctx.restore();
    });

    // 7. Vẽ Player
    drawSidePlayer(ctx, playerPosRef.current.x, playerPosRef.current.y, isDashingRef.current);

    // 8. Vẽ Enemy (Dùng VirusCharacterRenderer chuyên sâu)
    VirusCharacterRenderer.drawEnemy(
      ctx,
      enemyPosRef.current.x,
      enemyPosRef.current.y,
      enemy.spriteType,
      tick,
      enemyWarningRef.current
    );

    // 9. Vẽ Vệt Chém Vòng Cung Phát Sáng (Slash Arc FX)
    slashArcsRef.current.forEach((arc) => {
      ctx.save();
      ctx.translate(arc.x, arc.y);
      ctx.strokeStyle = arc.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = arc.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, 0, arc.radius, arc.angle - 0.7, arc.angle + 0.7);
      ctx.stroke();

      // Vệt sáng trắng tâm nhát chém
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, arc.radius, arc.angle - 0.4, arc.angle + 0.4);
      ctx.stroke();
      ctx.restore();
    });

    // 10. Vẽ Rồng Vàng Thần Tốc (Long Thần Trảm)
    dragonsRef.current.forEach((drag) => {
      ctx.save();
      ctx.translate(drag.x, drag.y);
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 20;

      // Đầu rồng thời Lý uốn lượn
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bờm rồng & Mắt rồng sáng
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-15, -14, 25, 6);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(10, -5, 8, 8);

      // Thân rồng uốn lượn phía sau
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.quadraticCurveTo(-60, Math.sin(tick * 0.3) * 20, -100, 0);
      ctx.stroke();
      ctx.restore();
    });

    // 11. Hạt tia lửa & máu
    particlesRef.current.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    // 12. Số sát thương nhảy lên
    damageNumsRef.current.forEach((d) => {
      ctx.fillStyle = d.color;
      ctx.font = '12px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(String(d.val), d.x, d.y);
      ctx.textAlign = 'start';
    });

    ctx.restore();
  };

  const drawSidePlayer = (ctx: CanvasRenderingContext2D, x: number, y: number, isDashing: boolean) => {
    const charClass = (player.avatarId as any) || 'general_armor';
    const isAttacking = inActionRef.current;

    CharacterRenderer.drawCharacter(ctx, x, y - 8, {
      characterClass: charClass,
      gender: player.gender,
      scale: 1.15,
      facing: 'right',
      action: isDashing ? 'dash' : isAttacking ? 'attack' : 'idle',
      tick: Date.now() / 40,
    });
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
      {/* TOP COMBAT HUD */}
      <div className="relative z-30 w-full bg-[#0a0710]/95 border-b-2 border-purple-900 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 font-pixel text-xs shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
        {/* Vital bars Player */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 bg-[#160b03] border border-[#d4af37] flex items-center justify-center text-2xl shadow-[2px_2px_0_#000]">
            <span>{player.gender === 'male' ? '🧑' : '👩'}</span>
          </div>

          <div className="space-y-1 w-full sm:w-56">
            <div className="flex justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">{player.name}</span>
                {equippedWeapon && (
                  <span className="bg-[#451a03] text-[#fde047] border border-[#d97706] text-[7px] px-1">
                    {equippedWeapon.name.slice(0, 10)}
                  </span>
                )}
              </div>
              <span className="text-white">{playerHp}/{player.stats.maxHp} HP</span>
            </div>

            <div className="w-full h-3 bg-black border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-200"
                style={{ width: `${Math.min(100, (playerHp / player.stats.maxHp) * 100)}%` }}
              />
            </div>

            {/* MP Bar */}
            <div className="w-full h-2 bg-black border border-slate-800">
              <div
                className="h-full bg-cyan-500 transition-all duration-200"
                style={{ width: `${Math.min(100, (playerMp / player.stats.maxMp) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Vital bars Mini Boss / Enemy */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="space-y-1 w-full sm:w-64 text-right">
            <div className="flex justify-between text-[10px]">
              <span className="text-red-400 font-bold tracking-wide">{enemy.name}</span>
              <span className="text-white">{enemy.hp}/{enemy.maxHp} HP</span>
            </div>

            <div className="w-full h-3 bg-black border border-red-900">
              <div
                className="h-full bg-gradient-to-r from-red-700 to-rose-500 transition-all duration-200"
                style={{ width: `${Math.min(100, (enemy.hp / enemy.maxHp) * 100)}%` }}
              />
            </div>

            <div className="text-[8px] text-amber-200/80 font-vt tracking-wider">
              {enemy.title}
            </div>

            {isFinalBoss && (
              <div className="flex items-center justify-end gap-1.5 text-[8px] font-pixel text-rose-400 mt-0.5">
                <span>MẠNG BOSS:</span>
                <span className="text-yellow-300 font-bold bg-[#3b0707] px-1 border border-red-700">
                  {bossLives === 2 ? '❤️❤️ 2/2 PHẦN HỒI SINH' : '❤️ 1/2 CUỒNG BẠO AWAKENED!'}
                </span>
              </div>
            )}
          </div>

          <div className="w-10 h-10 bg-[#2b0808] border border-red-500 flex items-center justify-center text-2xl shadow-[2px_2px_0_#000]">
            <span>👾</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Dead Cells View */}
      <div className="relative flex-1 w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Phase Transition Banner */}
        {phaseTransitionText && (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4 animate-pulse">
            <div className="bg-[#2a0505] border-3 border-red-600 p-6 max-w-lg text-center shadow-[0_0_50px_rgba(239,68,68,0.8),6px_6px_0_#000]">
              <span className="text-5xl block mb-2">☠️</span>
              <h3 className="font-pixel text-sm sm:text-base text-red-400 mb-2 font-bold tracking-wider">
                {phaseTransitionText}
              </h3>
              <p className="font-vt text-lg sm:text-xl text-amber-200 leading-relaxed">
                Chúa Tể Virus đã tiêu hao hạch tâm phản vật chất để hồi đầy sinh lực! Các đòn đánh bộc phát thành "Diệt Thế Hư Không Chưởng" sát thương cực lớn! Hãy nhanh tay nhấn [K] để Lướt Né kịp thời!
              </p>
            </div>
          </div>
        )}

        {/* BÀN PHÍM PHÍM TẮT & ACTION BUTTONS [J, K, U, L, I] */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-3 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {/* Nút Chém Kiếm / Rìu [J] */}
          <button
            onClick={handleAttack}
            className={`pixel-btn text-white border-2 border-black px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-pixel flex items-center gap-2 cursor-pointer shadow-[3px_3px_0_#000] active:translate-y-0.5 transition-all ${
              activeKey === 'j' || activeKey === ' '
                ? 'bg-yellow-500 scale-95 border-yellow-200'
                : 'bg-[#d13426] hover:bg-[#e04535]'
            }`}
          >
            <span>⚔️</span>
            <span>CHÉM [J]</span>
          </button>

          {/* Nút Lướt Né Đòn [K] (Dash) */}
          <button
            onClick={handleDash}
            disabled={dashCd > 0}
            className={`pixel-btn border-2 border-black px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs font-pixel flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0_#000] active:translate-y-0.5 transition-all ${
              dashCd > 0
                ? 'bg-slate-800 text-slate-500'
                : activeKey === 'k'
                ? 'bg-cyan-400 text-black scale-95'
                : 'bg-[#1e293b] hover:bg-[#334155] text-cyan-300'
            }`}
          >
            <span>💨</span>
            <span>LƯỚT [K] {dashCd > 0 ? `(${dashCd}s)` : ''}</span>
          </button>

          {/* Chiêu 1: Hào Khí Đông A [U] */}
          <button
            onClick={handleSkill1}
            disabled={skill1Cd > 0 || playerMp < 20}
            className={`pixel-btn border-2 border-black px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs font-pixel flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0_#000] active:translate-y-0.5 transition-all ${
              skill1Cd > 0 || playerMp < 20
                ? 'bg-slate-800 text-slate-500'
                : activeKey === 'u' || activeKey === '1'
                ? 'bg-amber-400 text-black scale-95'
                : 'bg-[#b45309] hover:bg-[#d97706] text-amber-200'
            }`}
          >
            <span>🔥</span>
            <span>ĐÔNG A [U] {skill1Cd > 0 ? `(${skill1Cd}s)` : ''}</span>
          </button>

          {/* Chiêu 2: Long Thần Trảm [L] */}
          <button
            onClick={handleSkill2}
            disabled={skill2Cd > 0 || playerMp < 35}
            className={`pixel-btn border-2 border-black px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs font-pixel flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0_#000] active:translate-y-0.5 transition-all ${
              skill2Cd > 0 || playerMp < 35
                ? 'bg-slate-800 text-slate-500'
                : activeKey === 'l' || activeKey === '2'
                ? 'bg-purple-400 text-black scale-95'
                : 'bg-[#7e22ce] hover:bg-[#9333ea] text-purple-200'
            }`}
          >
            <span>🐉</span>
            <span>LONG THẦN [L] {skill2Cd > 0 ? `(${skill2Cd}s)` : ''}</span>
          </button>

          {/* Bình Dược Thảo [I / H] */}
          <button
            onClick={handlePotion}
            className={`pixel-btn text-emerald-200 border-2 border-black px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs font-pixel flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0_#000] active:translate-y-0.5 transition-all ${
              activeKey === 'i' || activeKey === 'h' || activeKey === '3'
                ? 'bg-emerald-400 text-black scale-95'
                : 'bg-[#065f46] hover:bg-[#047857]'
            }`}
          >
            <span>🧪</span>
            <span>DƯỢC [I] ({potions})</span>
          </button>
        </div>

        {/* Hướng dẫn phím tắt bàn phím nhẹ nhàng */}
        <div className="absolute top-3 left-4 z-40 bg-black/60 border border-slate-700 px-2.5 py-1 text-[8px] font-pixel text-slate-300 rounded shadow">
          ⌨️ PHÍM TẮT: [J/Space] Chém • [K] Lướt Né • [U] Đông A • [L] Long Thần • [I] Uống Thuốc
        </div>
      </div>
    </div>
  );
};

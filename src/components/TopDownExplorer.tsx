import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, RegionLocation, Quest, SubAreaLocation } from '../types/game';
import { soundEngine } from '../utils/audio';
import { CharacterRenderer } from '../engine/CharacterRenderer';
import { RegionMapRenderers } from '../engine/RegionMapRenderers';
import { CollisionSystem } from '../engine/CollisionSystem';
import { VietnameseFeudalNPCRenderer } from '../engine/VietnameseFeudalNPCRenderer';
import { VirusCharacterRenderer } from '../engine/VirusCharacterRenderer';
import { AncientHeritageShop } from './AncientHeritageShop';
import { VietPhucStylingStudio } from './VietPhucStylingStudio';
import { INITIAL_ENEMIES } from '../data/gameData';

interface TopDownExplorerProps {
  player: PlayerProfile;
  region: RegionLocation;
  activeQuests: Quest[];
  savedPosition?: { x: number; y: number } | null;
  defeatedMonsterId?: string | null;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  onStartCombat: (enemyType: string, currentPos: { x: number; y: number }, monsterId: string) => void;
  onOpenChest: (chestId: string, itemId?: string, gold?: number) => void;
  onTalkNpc: (npcId: string) => void;
  onBackToMap: () => void;
  onOpenMenu: () => void;
  toast: (msg: string) => void;
}

export const TopDownExplorer: React.FC<TopDownExplorerProps> = ({
  player,
  region,
  activeQuests,
  savedPosition,
  defeatedMonsterId,
  onUpdatePlayer,
  onStartCombat,
  onOpenChest,
  onTalkNpc,
  onBackToMap,
  onOpenMenu,
  toast,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Shop modal state
  const [showShop, setShowShop] = useState<boolean>(false);
  // Viet Phuc Styling Studio modal state
  const [showStylingStudio, setShowStylingStudio] = useState<boolean>(false);
  const isInitialMount = useRef<boolean>(true);

  // Lấy Mini Boss độc đáo theo từng vùng đất
  const getMiniBossKeyForRegion = (regionId: string) => {
    switch (regionId) {
      case 'mien_bac':
        return 'miniboss_north';
      case 'mien_trung':
        return 'miniboss_central';
      case 'tay_nguyen':
        return 'miniboss_highland';
      case 'mien_nam':
        return 'miniboss_south';
      case 'hai_dao':
        return 'miniboss_islands';
      case 'tam_linh_virus':
        return 'boss_virus';
      default:
        return 'miniboss_north';
    }
  };

  const miniBossKey = getMiniBossKeyForRegion(region.id);
  const miniBossData = INITIAL_ENEMIES[miniBossKey] || INITIAL_ENEMIES['miniboss_north'];

  // Sub-area management within the current region
  const subAreas = region.subAreas && region.subAreas.length > 0 ? region.subAreas : [];
  const [currentSubAreaIndex, setCurrentSubAreaIndex] = useState<number>(0);

  const activeSubArea: SubAreaLocation | null = subAreas[currentSubAreaIndex] || null;
  const worldW = activeSubArea ? activeSubArea.width : 1200;
  const worldH = activeSubArea ? activeSubArea.height : 800;

  // Giữ nguyên vị trí sau trận chiến hoặc dùng spawnPoint mặc định
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>(() => {
    if (savedPosition) return savedPosition;
    return activeSubArea ? activeSubArea.spawnPoint : { x: 500, y: 450 };
  });
  const [facing, setFacing] = useState<'down' | 'up' | 'left' | 'right'>('down');

  // Dialogue & Interactivity
  const [dialogueOpen, setDialogueOpen] = useState<{
    npcName: string;
    avatar: string;
    text: string[];
    index: number;
    npcId: string;
    role?: string;
  } | null>(null);

  // Nearby context for Among Us style USE and REPORT buttons
  const [nearbyTarget, setNearbyTarget] = useState<{
    type: 'npc' | 'chest' | 'prop' | 'portal' | 'monster' | 'none';
    label: string;
    id?: string;
    data?: any;
  }>({ type: 'none', label: 'TƯƠNG TÁC' });

  // Cooldown timer (13s scanner recharge as shown in reference)
  const [scannerCooldown, setScannerCooldown] = useState<number>(0);

  // Transition banner
  const [transitionMsg, setTransitionMsg] = useState<string | null>(null);

  // Roaming monsters: Quái vừa bị hạ sẽ die khoảng 5s rồi hồi sinh lại tại chỗ
  const [monsters, setMonsters] = useState([
    {
      id: 'm1',
      x: 260,
      y: 550,
      alive: defeatedMonsterId !== 'm1',
      respawnTimer: defeatedMonsterId === 'm1' ? 5.0 : 0,
      dir: 1,
      type: 'minion',
      enemyKey: 'minion_north',
    },
    {
      id: 'm2',
      x: 880,
      y: 480,
      alive: defeatedMonsterId !== 'm2',
      respawnTimer: defeatedMonsterId === 'm2' ? 5.0 : 0,
      dir: -1,
      type: 'miniboss',
      enemyKey: miniBossKey,
    },
  ]);

  // Bộ đếm hồi sinh quái vật sau 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setMonsters((prev) =>
        prev.map((m) => {
          if (!m.alive && m.respawnTimer > 0) {
            const next = m.respawnTimer - 0.25;
            if (next <= 0) {
              soundEngine.playWarp();
              toast(`⚡ Quái vật [${m.type === 'miniboss' ? 'MINI BOSS' : 'MÃ ĐỘC'}] đã hồi sinh lại!`);
              return { ...m, alive: true, respawnTimer: 0 };
            }
            return { ...m, respawnTimer: next };
          }
          return m;
        })
      );
    }, 250);

    return () => clearInterval(interval);
  }, [toast]);

  // Keys tracking
  const keysRef = useRef<{ [k: string]: boolean }>({});

  // Reset player position when sub-area changes (không ghi đè vị trí ban đầu nếu vừa từ trận chiến trở lại)
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }
    if (activeSubArea) {
      setPlayerPos(activeSubArea.spawnPoint);
    }
  }, [currentSubAreaIndex]);

  // BGM theme
  useEffect(() => {
    soundEngine.playBGM(region.id === 'tam_linh_virus' ? 'boss' : 'peaceful');
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Cập nhật lại quái vật và Mini Boss của vùng này
    setMonsters([
      { id: 'm1', x: 260, y: 550, alive: true, respawnTimer: 0, dir: 1, type: 'minion', enemyKey: 'minion_north' },
      { id: 'm2', x: 880, y: 480, alive: true, respawnTimer: 0, dir: -1, type: 'miniboss', enemyKey: miniBossKey },
    ]);
  }, [region.id, miniBossKey]);

  // Scanner cooldown countdown
  useEffect(() => {
    if (scannerCooldown > 0) {
      const timer = setTimeout(() => setScannerCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [scannerCooldown]);

  // Check proximity for nearby action
  useEffect(() => {
    // 1. Check Monster proximity
    for (const m of monsters) {
      if (m.alive) {
        const d = Math.hypot(playerPos.x - m.x, playerPos.y - m.y);
        if (d < 70) {
          setNearbyTarget({
            type: 'monster',
            label: m.type === 'miniboss' ? `⚔️ QUYẾT ĐẤU MINI BOSS [J]!` : '⚔️ QUYẾT ĐẤU [J]!',
            id: m.enemyKey || m.id,
            data: m,
          });
          return;
        }
      }
    }

    // 2. Check Portal proximity
    if (activeSubArea?.portals) {
      for (const p of activeSubArea.portals) {
        const d = Math.hypot(playerPos.x - (p.x + p.w / 2), playerPos.y - (p.y + p.h / 2));
        if (d < 70) {
          setNearbyTarget({
            type: 'portal',
            label: p.portalName,
            id: p.targetSubAreaId,
          });
          return;
        }
      }
    }

    // 3. Check NPC proximity
    const npcs = activeSubArea?.npcs || region.npcs;
    for (const npc of npcs) {
      const d = Math.hypot(playerPos.x - npc.x, playerPos.y - npc.y);
      if (d < 55) {
        setNearbyTarget({
          type: 'npc',
          label: `💬 NÓI: ${npc.name.slice(0, 12)}`,
          id: npc.id,
          data: npc,
        });
        return;
      }
    }

    // 4. Check Chest proximity
    const chests = activeSubArea?.chests || region.chests;
    for (const chest of chests) {
      const opened = player.inventory.includes(chest.rewardItemId || '');
      const d = Math.hypot(playerPos.x - chest.x, playerPos.y - chest.y);
      if (d < 50) {
        setNearbyTarget({
          type: 'chest',
          label: opened ? '📦 ĐÃ MỞ RƯƠNG' : '✨ MỞ RƯƠNG CỔ',
          id: chest.id,
          data: chest,
        });
        return;
      }
    }

    // 5. Check Heritage Props proximity
    if (activeSubArea?.interactables) {
      for (const prop of activeSubArea.interactables) {
        const d = Math.hypot(playerPos.x - prop.x, playerPos.y - prop.y);
        if (d < 65) {
          setNearbyTarget({
            type: 'prop',
            label: prop.badge,
            id: prop.id,
            data: prop,
          });
          return;
        }
      }
    }

    setNearbyTarget({ type: 'none', label: 'TƯƠNG TÁC' });
  }, [playerPos, activeSubArea, monsters, player.inventory]);

  // Main game & movement loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMapDash = () => {
      soundEngine.playTone(360, 'sawtooth', 0.12);
      setPlayerPos((prev) => {
        let dx = 0;
        let dy = 0;
        const dashDist = 80;
        if (facing === 'up') dy -= dashDist;
        if (facing === 'down') dy += dashDist;
        if (facing === 'left') dx -= dashDist;
        if (facing === 'right') dx += dashDist;
        const scenery = activeSubArea ? activeSubArea.sceneryType : 'ancient_house';
        const npcs = activeSubArea?.npcs || region.npcs;
        const targetX = Math.max(35, Math.min(worldW - 35, prev.x + dx));
        const targetY = Math.max(45, Math.min(worldH - 45, prev.y + dy));
        if (!CollisionSystem.isBlocked(targetX, targetY, scenery, worldW, worldH, npcs)) {
          return { x: targetX, y: targetY };
        }
        return prev;
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = true;
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
        handleTriggerUse();
      }
      if (k === 'j') {
        if (nearbyTarget.type === 'monster') {
          triggerCombat(nearbyTarget.id);
        } else {
          soundEngine.playSlash();
          toast('⚔️ Bạn vung vũ khí! Lại gần quái vật hoặc Mini Boss để quyết đấu [J]!');
        }
      }
      if (k === 'k' || e.key === 'Shift') {
        handleMapDash();
      }
      if (k === 'b') {
        setShowShop((s) => !s);
      }
      if (k === 'p') {
        setShowStylingStudio((s) => !s);
      }
      if (e.key === 'r' || e.key === 'R' || e.key === 'q' || e.key === 'Q') {
        handleTriggerReport();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = () => {
      if (!dialogueOpen) {
        let dx = 0;
        let dy = 0;
        const speed = 4.2;

        if (keysRef.current['arrowup'] || keysRef.current['w']) {
          dy -= speed;
          setFacing('up');
        }
        if (keysRef.current['arrowdown'] || keysRef.current['s']) {
          dy += speed;
          setFacing('down');
        }
        if (keysRef.current['arrowleft'] || keysRef.current['a']) {
          dx -= speed;
          setFacing('left');
        }
        if (keysRef.current['arrowright'] || keysRef.current['d']) {
          dx += speed;
          setFacing('right');
        }

        if (dx !== 0 || dy !== 0) {
          setPlayerPos((prev) => {
            const scenery = activeSubArea ? activeSubArea.sceneryType : 'ancient_house';
            const npcs = activeSubArea?.npcs || region.npcs;

            let nx = prev.x;
            let ny = prev.y;

            // 1. Kiểm tra va chạm theo trục X (cho phép trượt mượt mà dọc theo tường/bờ hồ)
            const targetX = Math.max(35, Math.min(worldW - 35, prev.x + dx));
            if (!CollisionSystem.isBlocked(targetX, prev.y, scenery, worldW, worldH, npcs)) {
              nx = targetX;
            }

            // 2. Kiểm tra va chạm theo trục Y
            const targetY = Math.max(45, Math.min(worldH - 45, prev.y + dy));
            if (!CollisionSystem.isBlocked(nx, targetY, scenery, worldW, worldH, npcs)) {
              ny = targetY;
            }

            return { x: nx, y: ny };
          });
        }

        // Monsters movement
        setMonsters((prev) =>
          prev.map((m) => {
            if (!m.alive) return m;
            let nx = m.x + m.dir * 0.9;
            let ndir = m.dir;
            if (nx > worldW - 100 || nx < 100) ndir *= -1;
            return { ...m, x: nx, dir: ndir };
          })
        );
      }

      // Render World with dynamic camera follow
      renderWorld(ctx, canvas);

      animId = requestAnimationFrame(loop);
    };

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resize);
    };
  }, [dialogueOpen, playerPos, activeSubArea, monsters, worldW, worldH]);

  // Action: Trigger USE (Among Us Style)
  const handleTriggerUse = () => {
    soundEngine.playClick();

    // 1. If near portal -> Change sub-area
    if (nearbyTarget.type === 'portal' && nearbyTarget.id) {
      changeSubArea(nearbyTarget.id);
      return;
    }

    // 2. If near Monster -> Trigger combat
    if (nearbyTarget.type === 'monster') {
      triggerCombat();
      return;
    }

    // 3. If near NPC -> Talk
    if (nearbyTarget.type === 'npc' && nearbyTarget.data) {
      const npc = nearbyTarget.data;
      const quest = activeQuests.find((q) => q.npcName.includes(npc.name) || npc.name.includes(q.npcName));
      const texts = quest
        ? quest.npcDialogue
        : [
            `"Chào tráng sĩ! Đến với ${activeSubArea?.name || region.vietnameseName}, bạn đang đứng trên mảnh đất ngàn năm văn hiến."`,
            `"Hãy tìm kiếm và thu thập trang phục ${region.specialtyCloth} để đẩy lùi Virus Lãng Quên nhé!"`,
          ];

      setDialogueOpen({
        npcName: npc.name,
        avatar: npc.avatar || '👴',
        text: texts,
        index: 0,
        npcId: npc.id,
        role: npc.role,
      });
      onTalkNpc(npc.id);
      return;
    }

    // 4. If near Chest -> Open
    if (nearbyTarget.type === 'chest' && nearbyTarget.data) {
      const chest = nearbyTarget.data;
      const opened = player.inventory.includes(chest.rewardItemId || '');
      if (!opened) {
        soundEngine.playChestOpen();
        onOpenChest(chest.id, chest.rewardItemId, chest.gold);
      } else {
        toast('Rương cổ này đã được thu thập!');
      }
      return;
    }

    // 5. If near Heritage Prop -> Interact
    if (nearbyTarget.type === 'prop' && nearbyTarget.data) {
      const prop = nearbyTarget.data;
      soundEngine.playLevelUp();
      if (prop.healHp) {
        toast(`✨ Bạn đã được hồi phục +${prop.healHp} HP!`);
      }
      setDialogueOpen({
        npcName: prop.name,
        avatar: '🏺',
        text: prop.dialogue,
        index: 0,
        npcId: prop.id,
      });
      return;
    }

    toast('Di chuyển lại gần vật phẩm, NPC hoặc cổng chuyển vùng để tương tác!');
  };

  // Action: Trigger REPORT / SCAN (Among Us Style)
  const handleTriggerReport = () => {
    if (nearbyTarget.type === 'monster') {
      triggerCombat();
      return;
    }

    if (scannerCooldown > 0) {
      toast(`⏳ Quét di sản đang nạp lại (${scannerCooldown}s)!`);
      return;
    }

    soundEngine.playWarp();
    setScannerCooldown(13);

    // Scan for nearby chests or secret relics
    const chests = activeSubArea?.chests || region.chests;
    const unopened = chests.filter((c) => !player.inventory.includes(c.rewardItemId || ''));
    if (unopened.length > 0) {
      toast(`📡 QUÉT DI SẢN: Phát hiện ${unopened.length} rương cổ còn chưa mở trong khu vực này!`);
    } else {
      toast(`📡 QUÉT DI SẢN: Khu vực này đã được bảo tồn an toàn! Hãy di chuyển qua cổng làng tiếp theo.`);
    }
  };

  // Switch Sub-Area within the current Province
  const changeSubArea = (targetSubAreaId: string) => {
    soundEngine.playWarp();
    const idx = subAreas.findIndex((s) => s.id === targetSubAreaId);
    if (idx !== -1) {
      const targetSub = subAreas[idx];
      setTransitionMsg(`ĐANG DI CHUYỂN QUA: ${targetSub.name.toUpperCase()}...`);
      setTimeout(() => {
        setCurrentSubAreaIndex(idx);
        setTransitionMsg(null);
        toast(`📍 Đã đến: ${targetSub.name}`);
      }, 700);
    }
  };

  // Combat trigger
  const triggerCombat = (customEnemyKey?: string) => {
    soundEngine.playBossRoar();
    let enemyKey = customEnemyKey;
    let monsterId = 'm1';

    const nearM = monsters.find((m) => m.alive && Math.hypot(playerPos.x - m.x, playerPos.y - m.y) < 75);
    if (nearM) {
      monsterId = nearM.id;
      if (!enemyKey) {
        enemyKey = nearM.enemyKey || miniBossKey;
      }
    } else {
      if (!enemyKey) enemyKey = miniBossKey;
      monsterId = 'm2';
    }

    onStartCombat(enemyKey, playerPos, monsterId);
  };

  // Canvas drawing routine with smooth camera translation
  const renderWorld = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Camera follow smoothly centered on player
    const camX = Math.max(0, Math.min(worldW - W, playerPos.x - W * 0.5));
    const camY = Math.max(0, Math.min(worldH - H, playerPos.y - H * 0.5));

    ctx.save();
    ctx.translate(-camX, -camY);

    // 1. Dựng phối cảnh bản đồ đặc trưng của từng địa danh
    const scenery = activeSubArea ? activeSubArea.sceneryType : 'ancient_house';
    RegionMapRenderers.renderSubArea(scenery, {
      ctx,
      canvasW: W,
      canvasH: H,
      cameraX: camX,
      cameraY: camY,
      worldW,
      worldH,
      tick: Date.now() / 50,
      playerPos,
    });

    // 2. Vẽ các cổng di chuyển (Portals / Đường Đi Liên Thôn)
    if (activeSubArea?.portals) {
      activeSubArea.portals.forEach((p) => {
        drawPortalGate(ctx, p.x, p.y, p.w, p.h, p.portalName);
      });
    }

    // 3. Vẽ rương cổ
    const chests = activeSubArea?.chests || region.chests;
    chests.forEach((chest) => {
      const opened = player.inventory.includes(chest.rewardItemId || '');
      drawChest(ctx, chest.x, chest.y, opened);
    });

    // 4. Vẽ NPC phong kiến cổ truyền
    const npcs = activeSubArea?.npcs || region.npcs;
    npcs.forEach((npc) => {
      VietnameseFeudalNPCRenderer.drawNPC(ctx, npc.x, npc.y, npc, Date.now() / 50);
    });

    // 5. Vẽ Quái vật và Mini Boss (bao gồm quái đang đếm 5s hồi sinh)
    monsters.forEach((m) => {
      drawMonster(ctx, m);
    });

    // 6. Vẽ Nhân vật chính
    drawPlayer(ctx, playerPos.x, playerPos.y, facing);

    ctx.restore();

    // 7. Giao diện HUD tĩnh (Mini-map & Status bar đáy màn hình)
    drawMiniMapOverlay(ctx, W, H);
    drawBottomStatusHUD(ctx, W, H);
  };

  const drawPortalGate = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    name: string
  ) => {
    // Vòm cổng phát sáng năng lượng thời gian
    const pulse = Math.sin(Date.now() / 200) * 4;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.fillRect(x - pulse, y - pulse, w + pulse * 2, h + pulse * 2);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Mũi tên cổng
    ctx.fillStyle = '#fef08a';
    ctx.font = '8px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('CỔNG VÀO', x + w / 2, y + h / 2 - 10);
    ctx.fillText('▼', x + w / 2, y + h / 2 + 10);

    // Tên đích đến
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(x + w / 2 - 90, y - 24, 180, 20);
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(x + w / 2 - 90, y - 24, 180, 20);
    ctx.fillStyle = '#fef08a';
    ctx.font = '7px "Press Start 2P"';
    ctx.fillText(name.slice(0, 16), x + w / 2, y - 10);
    ctx.textAlign = 'start';
  };

  const drawChest = (ctx: CanvasRenderingContext2D, x: number, y: number, opened: boolean) => {
    ctx.fillStyle = opened ? '#555' : '#8b4513';
    ctx.fillRect(x - 14, y - 12, 28, 24);
    ctx.strokeStyle = opened ? '#777' : '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 14, y - 12, 28, 24);
    ctx.fillStyle = opened ? '#999' : '#f1c40f';
    ctx.fillRect(x - 4, y - 3, 8, 8);
  };

  const drawNPC = (ctx: CanvasRenderingContext2D, x: number, y: number, avatar: string, name: string) => {
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(x, y + 16, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d4af37';
    ctx.fillRect(x - 10, y - 10, 20, 22);

    ctx.font = '16px serif';
    ctx.fillText(avatar, x - 8, y - 14);

    ctx.fillStyle = '#fff';
    ctx.font = '7px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(name.slice(0, 10), x, y - 28);
    ctx.textAlign = 'start';
  };

  const drawMonster = (ctx: CanvasRenderingContext2D, m: any) => {
    const isMiniBoss = m.type === 'miniboss';
    const tick = Date.now() / 40;

    // Nếu quái đã bị hạ và đang đếm ngược 5 giây hồi sinh
    if (!m.alive) {
      ctx.save();
      // Vệt khói ma quang tan rã
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.ellipse(m.x, m.y + 12, 28, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hạt số hóa nhấp nháy
      const flicker = Math.sin(tick * 0.4);
      ctx.fillStyle = flicker > 0 ? '#ef4444' : '#a855f7';
      ctx.fillRect(m.x - 4, m.y - 10, 8, 8);

      // Hiển thị nhãn đếm ngược 5s
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde047';
      ctx.font = '8px "Press Start 2P"';
      ctx.fillText(`⏳ HỒI SINH: ${Math.ceil(m.respawnTimer || 0)}s`, m.x, m.y - 32);
      ctx.restore();
      return;
    }

    // Vòng hào quang nếu là Mini Boss
    if (isMiniBoss) {
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(m.x, m.y + 16, 40, 16, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Hạt lửa ma đỏ rực xoay quanh
      for (let i = 0; i < 4; i++) {
        const ang = tick * 0.12 + i * (Math.PI / 2);
        const fx = m.x + Math.cos(ang) * 36;
        const fy = m.y + Math.sin(ang) * 15;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(fx - 2, fy - 2, 5, 5);
      }
      ctx.restore();
    }

    // Vẽ Sprite chuẩn xác bằng VirusCharacterRenderer
    const sprite = isMiniBoss ? miniBossData.spriteType : 'glitch_minion';
    VirusCharacterRenderer.drawEnemy(ctx, m.x, m.y, sprite, tick, false);

    // Tên và nhãn trên đầu quái
    ctx.save();
    ctx.textAlign = 'center';
    if (isMiniBoss) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(m.x - 75, m.y - 72, 150, 24);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(m.x - 75, m.y - 72, 150, 24);

      ctx.fillStyle = '#fef08a';
      ctx.font = '8px "Press Start 2P"';
      ctx.fillText(`👑 ${miniBossData.name.slice(0, 16)}`, m.x, m.y - 56);
    } else {
      ctx.fillStyle = '#ff5555';
      ctx.font = '7px "Press Start 2P"';
      ctx.fillText('👾 BÀO TỬ MÃ ĐỘC', m.x, m.y - 48);
    }
    ctx.restore();
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number, dir: string) => {
    const charClass = (player.avatarId as any) || 'general_armor';
    const isMoving = Boolean(
      keysRef.current['arrowup'] || keysRef.current['arrowdown'] ||
      keysRef.current['arrowleft'] || keysRef.current['arrowright'] ||
      keysRef.current['w'] || keysRef.current['s'] || keysRef.current['a'] || keysRef.current['d']
    );

    CharacterRenderer.drawCharacter(ctx, x, y - 10, {
      characterClass: charClass,
      gender: player.gender,
      scale: 0.75,
      facing: dir === 'left' ? 'left' : 'right',
      action: isMoving ? 'walk' : 'idle',
      tick: Date.now() / 50,
    });

    ctx.fillStyle = '#fbe282';
    ctx.font = '7px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(player.name.slice(0, 12), x, y - 48);
    ctx.textAlign = 'start';
  };

  const drawMiniMapOverlay = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const mmW = 110;
    const mmH = 80;
    const mmX = W - mmW - 14;
    const mmY = H - mmH - 46;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(mmX - 2, mmY - 2, mmW + 4, mmH + 4);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(mmX - 2, mmY - 2, mmW + 4, mmH + 4);

    // Sân map thu nhỏ
    ctx.fillStyle = '#334155';
    ctx.fillRect(mmX, mmY, mmW, mmH);

    // Chấm vàng người chơi
    const px = mmX + (playerPos.x / worldW) * mmW;
    const py = mmY + (playerPos.y / worldH) * mmH;
    ctx.fillStyle = '#facc15';
    ctx.fillRect(px - 2, py - 2, 4, 4);

    // Chấm đỏ quái vật
    monsters.forEach((m) => {
      if (m.alive) {
        const mx = mmX + (m.x / worldW) * mmW;
        const my = mmY + (m.y / worldH) * mmH;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(mx - 1.5, my - 1.5, 3, 3);
      }
    });
  };

  const drawBottomStatusHUD = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const barH = 34;
    const barY = H - barH;

    ctx.fillStyle = '#0b0f17';
    ctx.fillRect(0, barY, W, barH);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, barY, W, barH);

    // Trái tim pixel đỏ
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(20, barY + 12, 12, 10);

    // Thanh HP
    const hpRatio = Math.max(0, Math.min(1, player.stats.hp / player.stats.maxHp));
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(38, barY + 11, 100, 12);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(39, barY + 12, 98 * hpRatio, 10);

    // Địa danh hiện tại
    const locText = activeSubArea ? activeSubArea.name : region.vietnameseName;
    ctx.fillStyle = '#f8fafc';
    ctx.font = '9px "Press Start 2P"';
    ctx.textAlign = 'right';
    ctx.fillText(`VỊ TRÍ: ${locText.toUpperCase()}`, W - 140, barY + 22);
    ctx.textAlign = 'start';
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col select-none">
      {/* Top Exploration Bar */}
      <div className="relative z-30 w-full bg-[#0d131d]/95 border-b-2 border-[#d4af37] px-3 py-2 flex flex-wrap items-center justify-between font-pixel text-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              onBackToMap();
            }}
            className="pixel-btn bg-[#18202c] hover:bg-[#253245] text-amber-300 border border-amber-500 px-3 py-1.5 text-[10px] cursor-pointer"
          >
            🗺 BẢN ĐỒ CHỮ S
          </button>

          {/* Sub-Area fast-travel dropdown / tabs */}
          {subAreas.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-[9px] hidden sm:inline">KHU VỰC:</span>
              <select
                value={currentSubAreaIndex}
                onChange={(e) => {
                  soundEngine.playClick();
                  setCurrentSubAreaIndex(parseInt(e.target.value));
                }}
                className="bg-[#1e293b] text-amber-300 border border-slate-700 px-2 py-1 text-[9px] font-pixel cursor-pointer rounded"
              >
                {subAreas.map((sa, i) => (
                  <option key={sa.id} value={i}>
                    {sa.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-amber-300">Lv {player.stats.level}</span>
          <span className="text-rose-400">HP {player.stats.hp}/{player.stats.maxHp}</span>
          <div className="flex items-center gap-1 text-amber-300 font-pixel text-[10px] bg-[#160b03] border border-[#d97706] px-2 py-0.5">
            <span>🪙</span>
            <span>{player.stats.gold}</span>
          </div>

          {/* Nút Mở Phòng Phối Đồ & Lookbook Cổ Phục */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowStylingStudio(true);
            }}
            className="pixel-btn bg-[#15803d] hover:bg-[#16a34a] text-[#bbf7d0] border-2 border-[#86efac] px-2.5 py-1 text-[10px] font-pixel flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_#000]"
            title="Mở Phòng Phối Đồ & Lookbook Cổ Phục [P]"
          >
            <span>👘</span>
            <span className="hidden sm:inline">PHỐI ĐỒ [P]</span>
            <span className="sm:hidden">[P]</span>
          </button>

          {/* Nút Mở Tiệm Binh Khí Cổ Truyền */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowShop(true);
            }}
            className="pixel-btn bg-[#b45309] hover:bg-[#d97706] text-[#fef08a] border-2 border-[#fde047] px-2.5 py-1 text-[10px] font-pixel flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_#000]"
            title="Mở Tiệm Rèn & Binh Khí Các [B]"
          >
            <span>⚔️</span>
            <span className="hidden sm:inline">TIỆM BINH KHÍ [B]</span>
            <span className="sm:hidden">TIỆM [B]</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenMenu();
            }}
            className="pixel-btn bg-[#d13426] text-white border border-black px-2.5 py-1 text-xs cursor-pointer shadow-[2px_2px_0_#000]"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Main Exploration Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Transition Overlay */}
        {transitionMsg && (
          <div className="absolute inset-0 bg-black/85 z-50 flex items-center justify-center font-pixel text-amber-300 text-sm animate-pulse">
            {transitionMsg}
          </div>
        )}

        {/* RETRO PIXEL RPG ACTION BUTTONS (CHUẨN THƯƠNG MẠI HOÁ VÀ ĐỒ HOẠ PIXEL) */}
        <div className="absolute bottom-14 right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto">
          {/* Nút Hành Động / Tương Tác Nhanh (E / Space) */}
          <button
            onClick={handleTriggerUse}
            className={`pixel-btn flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border-2 shadow-[3px_3px_0_#000] cursor-pointer active:translate-y-0.5 transition-all font-pixel text-[10px] sm:text-xs ${
              nearbyTarget.type === 'monster'
                ? 'bg-[#dc2626] hover:bg-[#ef4444] text-white border-white animate-bounce'
                : nearbyTarget.type !== 'none'
                ? 'bg-[#d97706] hover:bg-[#f59e0b] text-black border-yellow-200 animate-pulse font-bold'
                : 'bg-[#18202c]/90 hover:bg-[#253245] text-slate-300 border-slate-600'
            }`}
          >
            <span className="text-base sm:text-lg">
              {nearbyTarget.type === 'monster'
                ? '⚔'
                : nearbyTarget.type === 'portal'
                ? '⛩'
                : nearbyTarget.type === 'chest'
                ? '🎁'
                : nearbyTarget.type === 'npc'
                ? '💬'
                : '✋'}
            </span>
            <span>
              {nearbyTarget.type !== 'none' ? nearbyTarget.label : '[E] TƯƠNG TÁC'}
            </span>
          </button>

          {/* Nút Quét Di Sản / Radar Cổ Vật */}
          <button
            onClick={handleTriggerReport}
            className="pixel-btn bg-[#0f172a]/90 hover:bg-[#1e293b] text-cyan-300 border border-cyan-500/70 px-2.5 py-1.5 text-[9px] font-pixel flex items-center gap-1.5 shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <span>📡</span>
            <span>{scannerCooldown > 0 ? `QUÉT (${scannerCooldown}s)` : '[Q] QUÉT DI SẢN'}</span>
          </button>
        </div>

        {/* Mobile Virtual D-Pad on bottom-left */}
        <div className="absolute bottom-12 left-5 z-40 grid grid-cols-3 gap-1 w-36 h-36 sm:hidden pointer-events-auto">
          <div />
          <button
            onPointerDown={() => (keysRef.current['arrowup'] = true)}
            onPointerUp={() => (keysRef.current['arrowup'] = false)}
            className="bg-[#141a24]/90 border-2 border-[#d4af37] text-white font-pixel flex items-center justify-center text-lg active:bg-amber-600"
          >
            ▲
          </button>
          <div />
          <button
            onPointerDown={() => (keysRef.current['arrowleft'] = true)}
            onPointerUp={() => (keysRef.current['arrowleft'] = false)}
            className="bg-[#141a24]/90 border-2 border-[#d4af37] text-white font-pixel flex items-center justify-center text-lg active:bg-amber-600"
          >
            ◀
          </button>
          <div className="bg-[#0b0e14]/70 border border-slate-700 flex items-center justify-center font-pixel text-[8px] text-slate-400">
            D-PAD
          </div>
          <button
            onPointerDown={() => (keysRef.current['arrowright'] = true)}
            onPointerUp={() => (keysRef.current['arrowright'] = false)}
            className="bg-[#141a24]/90 border-2 border-[#d4af37] text-white font-pixel flex items-center justify-center text-lg active:bg-amber-600"
          >
            ▶
          </button>
          <div />
          <button
            onPointerDown={() => (keysRef.current['arrowdown'] = true)}
            onPointerUp={() => (keysRef.current['arrowdown'] = false)}
            className="bg-[#141a24]/90 border-2 border-[#d4af37] text-white font-pixel flex items-center justify-center text-lg active:bg-amber-600"
          >
            ▼
          </button>
          <div />
        </div>

        {/* DIALOGUE MODAL PHONG CÁCH CUỘN CHIẾU / SẮC PHONG TRIỀU ĐÌNH PHONG KIẾN */}
        {dialogueOpen && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-2xl p-4 sm:p-5 bg-gradient-to-b from-[#241508] via-[#1a0e04] to-[#120802] border-3 border-[#d4af37] shadow-[0_8px_25px_rgba(0,0,0,0.9),4px_4px_0_#000]">
            {/* Vân Mây Góc Hoàng Gia */}
            <div className="absolute top-1 left-2 text-[#d4af37] font-pixel text-xs opacity-75">✦ ╔══</div>
            <div className="absolute top-1 right-2 text-[#d4af37] font-pixel text-xs opacity-75">══╗ ✦</div>
            <div className="absolute bottom-1 left-2 text-[#d4af37] font-pixel text-xs opacity-75">✦ ╚══</div>
            <div className="absolute bottom-1 right-2 text-[#d4af37] font-pixel text-xs opacity-75">══╝ ✦</div>

            {/* Dấu Mộc Triện Son Đỏ Triều Đình (Imperial Seal) */}
            <div className="absolute top-2 right-8 bg-[#991b1b] border-2 border-[#ef4444] px-2 py-0.5 text-[#fef08a] font-pixel text-[8px] tracking-widest shadow-[2px_2px_0_#000] rotate-2">
              【 SẮC PHONG ĐẠI VIỆT 】
            </div>

            {/* Header: Chân dung và phẩm hàm quan viên / nhân sĩ */}
            <div className="flex items-center gap-3 sm:gap-4 mb-3 pb-2.5 border-b border-[#854d0e]/60">
              {/* Khung Chân Dung Cung Đình */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#160b03] border-2 border-[#d4af37] flex items-center justify-center text-3xl sm:text-4xl shadow-[2px_2px_0_#000] shrink-0">
                <span>{dialogueOpen.avatar}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-pixel text-xs sm:text-sm text-[#fbe282] tracking-wide">
                    {dialogueOpen.npcName}
                  </h3>
                  <span className="bg-[#451a03] text-[#fcd34d] border border-[#d97706] font-pixel text-[8px] px-1.5 py-0.5">
                    {dialogueOpen.role ? dialogueOpen.role.toUpperCase() : 'NHÂN SĨ ĐẠI VIỆT'}
                  </span>
                </div>
                <div className="font-vt text-sm sm:text-base text-amber-200/80 mt-0.5">
                  Khâm ban ký ức di sản • Dấu ấn ngàn năm văn hiến
                </div>
              </div>
            </div>

            {/* Khung Lời Thoại Cổ Phong */}
            <div className="bg-[#120803]/80 p-3 sm:p-4 border border-[#854d0e]/50 mb-3 min-h-[75px] flex items-center">
              <p className="font-vt text-xl sm:text-2xl text-[#fef3c7] leading-relaxed tracking-wide">
                「 {dialogueOpen.text[dialogueOpen.index]} 」
              </p>
            </div>

            {/* Footer hành động: Nút Lệnh Phong Kiến */}
            <div className="flex justify-between items-center pt-2 border-t border-[#854d0e]/40">
              <span className="font-pixel text-[9px] text-amber-300/80">
                Chiếu chỉ {dialogueOpen.index + 1} / {dialogueOpen.text.length}
              </span>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  if (dialogueOpen.index < dialogueOpen.text.length - 1) {
                    setDialogueOpen({
                      ...dialogueOpen,
                      index: dialogueOpen.index + 1,
                    });
                  } else {
                    setDialogueOpen(null);
                  }
                }}
                className="pixel-btn bg-[#991b1b] hover:bg-[#b91c1c] text-[#fef08a] border-2 border-[#d4af37] px-4 py-2 font-pixel text-xs cursor-pointer shadow-[3px_3px_0_#000] active:translate-y-0.5 flex items-center gap-1.5"
              >
                <span>{dialogueOpen.index < dialogueOpen.text.length - 1 ? '📜' : '⚔'}</span>
                <span>
                  {dialogueOpen.index < dialogueOpen.text.length - 1
                    ? 'PHỤNG MỆNH TIẾP BƯỚC ▶'
                    : 'TUÂN LỆNH (ĐÓNG CHIẾU)'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TIỆM RÈN & BINH KHÍ CÁC ĐẠI VIỆT MODAL */}
        {showShop && (
          <AncientHeritageShop
            player={player}
            onUpdatePlayer={onUpdatePlayer}
            onClose={() => setShowShop(false)}
            toast={toast}
          />
        )}

        {/* PHÒNG PHỐI ĐỒ CỔ PHỤC & LOOKBOOK STUDIO */}
        {showStylingStudio && (
          <VietPhucStylingStudio
            player={player}
            onEquipItem={(item) => {
              const isCostume = item.category === 'costume';
              onUpdatePlayer({
                ...player,
                equippedCostumeId: isCostume ? item.id : player.equippedCostumeId,
                equippedHatId: item.category === 'hat' ? item.id : player.equippedHatId,
              });
            }}
            onUpdatePlayer={onUpdatePlayer}
            onClose={() => setShowStylingStudio(false)}
            toast={toast}
          />
        )}
      </div>
    </div>
  );
};

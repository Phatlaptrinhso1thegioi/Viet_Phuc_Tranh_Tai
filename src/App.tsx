import React, { useState, useEffect } from 'react';
import { GameScreen, PlayerProfile, VietPhucItem } from './types/game';
import { REGIONS_DATA, INITIAL_QUESTS, INITIAL_VIET_PHUC_ITEMS } from './data/gameData';
import { soundEngine } from './utils/audio';

import { IntroCinematic } from './components/IntroCinematic';
import { MainMenu } from './components/MainMenu';
import { CharacterCreate } from './components/CharacterCreate';
import { VietnamMap } from './components/VietnamMap';
import { TopDownExplorer } from './components/TopDownExplorer';
import { CombatArena } from './components/CombatArena';
import { TriviaArena } from './components/TriviaArena';
import { VietPhucGallery } from './components/VietPhucGallery';
import { VietPhucStylingStudio } from './components/VietPhucStylingStudio';
import { OutroCinematic } from './components/OutroCinematic';
import { InGameMenuModal } from './components/InGameMenuModal';

import { StorageManager } from './engine/StorageManager';
import { globalStateManager, GameStateId } from './engine/StateManager';

const DEFAULT_PLAYER: PlayerProfile = {
  name: 'Trần Minh Quân',
  gender: 'male',
  title: 'Tướng Quân Thiết Giáp',
  avatarId: 'general_armor',
  stats: {
    hp: 120,
    maxHp: 120,
    mp: 60,
    maxMp: 60,
    attack: 25,
    defense: 18,
    level: 1,
    exp: 0,
    expToNext: 100,
    gold: 150,
  },
  equippedCostumeId: 'ao_tu_than',
  equippedHatId: 'non_la',
  equippedWeaponId: 'ancient_blade',
  inventory: ['non_la', 'ao_tu_than'],
  completedQuests: [],
  activeQuests: ['q_non_la_van_phuc'],
  unlockedRegions: ['mien_bac'], // Bắt đầu chỉ mở khóa Miền Bắc, các vùng khác khóa theo Level
  defeatedBosses: [],
  currentRegionId: 'mien_bac',
  triviaScore: 0,
  triviaStreak: 0,
};

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('intro');
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    return StorageManager.loadGame() || DEFAULT_PLAYER;
  });

  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [activeCombatEnemy, setActiveCombatEnemy] = useState<string>('minion_north');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lưu vị trí nhân vật khi đánh quái & Quái đếm ngược 5s hồi sinh
  const [lastExplorerPos, setLastExplorerPos] = useState<{ x: number; y: number } | null>(null);
  const [lastDefeatedMonsterId, setLastDefeatedMonsterId] = useState<string | null>(null);

  // Modal Xưởng Phối Cổ Phục & Lookbook
  const [isStylingStudioOpen, setIsStylingStudioOpen] = useState<boolean>(false);

  // Auto-save on state change
  useEffect(() => {
    StorageManager.saveGame(player);
  }, [player]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3200);
  };

  // Add EXP and handle Level Up
  const gainExp = (amount: number, goldAmount: number = 0) => {
    setPlayer((prev) => {
      let exp = prev.stats.exp + amount;
      let level = prev.stats.level;
      let expToNext = prev.stats.expToNext;
      let maxHp = prev.stats.maxHp;
      let maxMp = prev.stats.maxMp;
      let attack = prev.stats.attack;
      let defense = prev.stats.defense;
      let gold = prev.stats.gold + goldAmount;
      let leveledUp = false;

      while (exp >= expToNext) {
        exp -= expToNext;
        level += 1;
        expToNext = Math.floor(expToNext * 1.35);
        maxHp += 25;
        maxMp += 10;
        attack += 6;
        defense += 5;
        leveledUp = true;
      }

      let nextUnlocked = [...prev.unlockedRegions];
      if (leveledUp) {
        soundEngine.playLevelUp();
        showToast(`🎉 CHÚC MỪNG! Lên cấp ${level}! Chỉ số tăng vọt!`);
        
        // Kiểm tra và mở khóa các bản đồ tỉnh thành theo Cấp độ
        REGIONS_DATA.forEach((reg) => {
          if (level >= reg.recommendedLevel && !nextUnlocked.includes(reg.id)) {
            nextUnlocked.push(reg.id);
            showToast(`🔓 ĐẠT CẤP ${level}! ĐÃ MỞ KHÓA BẢN ĐỒ MỚI: ${reg.vietnameseName.toUpperCase()}!`);
          }
        });

        if (level >= 22) {
          showToast('⚡ CẢNH BÁO: Đạt Cấp 22! Cổng vào LÃNH ĐỊA VIRUS LÃNG QUÊN đã chính thức giải phong ấn!');
        }
      }

      return {
        ...prev,
        unlockedRegions: nextUnlocked,
        stats: {
          ...prev.stats,
          level,
          exp,
          expToNext,
          maxHp,
          maxMp,
          hp: maxHp, // Refill on level up
          mp: maxMp,
          attack,
          defense,
          gold,
        },
      };
    });
  };

  // Chest opened in exploration
  const handleOpenChest = (chestId: string, itemId?: string, gold: number = 50) => {
    if (itemId && !player.inventory.includes(itemId)) {
      const itemData = INITIAL_VIET_PHUC_ITEMS.find((i) => i.id === itemId);
      setPlayer((prev) => ({
        ...prev,
        inventory: [...prev.inventory, itemId],
        stats: { ...prev.stats, gold: prev.stats.gold + gold },
      }));
      showToast(`🎁 Mở rương thành công! Nhận được: ${itemData?.name || itemId} & +${gold} Vàng!`);
    } else {
      setPlayer((prev) => ({
        ...prev,
        stats: { ...prev.stats, gold: prev.stats.gold + gold },
      }));
      showToast(`🎁 Thu thập được +${gold} Vàng!`);
    }
  };

  // NPC dialogue / Quest trigger
  const handleTalkNpc = (npcId: string) => {
    // Check if an active quest needs completing
    const quest = quests.find((q) => !player.completedQuests.includes(q.id) && q.regionId === player.currentRegionId);
    if (quest && quest.type === 'talk') {
      completeQuest(quest.id);
    }
  };

  const completeQuest = (questId: string) => {
    const q = quests.find((item) => item.id === questId);
    if (!q || player.completedQuests.includes(questId)) return;

    soundEngine.playLevelUp();
    showToast(`🏆 HOÀN THÀNH NHIỆM VỤ: ${q.title}!`);

    setPlayer((prev) => {
      const newInventory = q.rewardItemId && !prev.inventory.includes(q.rewardItemId)
        ? [...prev.inventory, q.rewardItemId]
        : prev.inventory;

      return {
        ...prev,
        completedQuests: [...prev.completedQuests, questId],
        inventory: newInventory,
      };
    });

    gainExp(q.rewardExp, q.rewardGold);
  };

  // Equip item
  const handleEquipItem = (item: VietPhucItem) => {
    setPlayer((prev) => {
      const isCostume = item.category === 'costume';
      const prevCostume = INITIAL_VIET_PHUC_ITEMS.find((i) => i.id === prev.equippedCostumeId);

      // Recompute stats
      let hpBonus = item.statsBonus.hp || 0;
      let atkBonus = item.statsBonus.attack || 0;
      let defBonus = item.statsBonus.defense || 0;

      if (isCostume && prevCostume) {
        hpBonus -= (prevCostume.statsBonus.hp || 0);
        atkBonus -= (prevCostume.statsBonus.attack || 0);
        defBonus -= (prevCostume.statsBonus.defense || 0);
      }

      return {
        ...prev,
        equippedCostumeId: isCostume ? item.id : prev.equippedCostumeId,
        equippedHatId: item.category === 'hat' ? item.id : prev.equippedHatId,
        stats: {
          ...prev.stats,
          maxHp: Math.max(100, prev.stats.maxHp + hpBonus),
          hp: Math.max(100, prev.stats.hp + hpBonus),
          attack: Math.max(15, prev.stats.attack + atkBonus),
          defense: Math.max(10, prev.stats.defense + defBonus),
        },
      };
    });
  };

  // Combat victory
  const handleCombatVictory = (expGained: number, goldGained: number, dropItemId?: string) => {
    gainExp(expGained, goldGained);
    showToast(`⚔ CHIẾN THẮNG! +${expGained} EXP • +${goldGained} Vàng!`);

    // If final boss is defeated
    if (activeCombatEnemy === 'boss_virus') {
      soundEngine.playLevelUp();
      setPlayer((prev) => ({
        ...prev,
        inventory: [...prev.inventory, 'hoang_bao_long_van'],
        completedQuests: [...prev.completedQuests, 'q_boss_ultimate'],
      }));
      setScreen('outro');
      return;
    }

    // Check active quest completion
    const quest = quests.find(
      (q) => !player.completedQuests.includes(q.id) && q.regionId === player.currentRegionId && q.type === 'defeat_monsters'
    );
    if (quest) {
      completeQuest(quest.id);
    }

    // Return to exploration
    setScreen('overworld_explore');
  };

  const handleCombatDefeat = () => {
    soundEngine.playPlayerHurt();
    showToast('Bạn đã kiệt sức! Dưỡng thương và thử lại nhé.');
    // Restore partial HP and return to map
    setPlayer((prev) => ({
      ...prev,
      stats: { ...prev.stats, hp: Math.floor(prev.stats.maxHp * 0.6) },
    }));
    setScreen('vietnam_map');
  };

  // Reset entire game progress to start fresh
  const handleResetGame = () => {
    StorageManager.clearSave();
    setPlayer(DEFAULT_PLAYER);
    setQuests(INITIAL_QUESTS);
    soundEngine.playLevelUp();
    showToast('🔄 ĐÃ KHỞI TẠO LẠI TIẾN TRÌNH! Bắt đầu lại hành trình từ đầu.');
    setScreen('intro');
  };

  const currentRegion = REGIONS_DATA.find((r) => r.id === player.currentRegionId) || REGIONS_DATA[0];

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#0b0e14] text-[#f0e6d2]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-300">
          <div className="bg-[#d4af37] text-black border-3 border-black px-5 py-2.5 font-pixel text-xs sm:text-sm shadow-[5px_5px_0_#000] text-center max-w-md">
            {toastMessage}
          </div>
        </div>
      )}

      {/* SCREEN 1: INTRO CINEMATIC */}
      {screen === 'intro' && (
        <IntroCinematic onComplete={() => setScreen('menu')} />
      )}

      {/* SCREEN 2: MAIN MENU */}
      {screen === 'menu' && (
        <MainMenu
          player={player}
          hasSavedGame={player.stats.level > 1 || player.completedQuests.length > 0}
          onPlay={() => {
            if (player.name === 'Trần Minh Quân' && player.stats.level === 1 && player.stats.exp === 0) {
              setScreen('character_create');
            } else {
              setScreen('vietnam_map');
            }
          }}
          onResetGame={handleResetGame}
          onCharacterCreate={() => setScreen('character_create')}
          onOpenGallery={() => setScreen('gallery')}
          onOpenTrivia={() => setScreen('trivia_arena')}
          onOpenSettings={() => setIsMenuOpen(true)}
          onWatchIntro={() => setScreen('intro')}
          onWatchOutro={() => setScreen('outro')}
        />
      )}

      {/* SCREEN 3: CHARACTER PROFILE CREATION */}
      {screen === 'character_create' && (
        <CharacterCreate
          onConfirm={(updates) => {
            setPlayer((prev) => ({ ...prev, ...updates }));
            showToast('Hồ sơ nhân vật đã được thiết lập thành công!');
            setScreen('vietnam_map');
          }}
          onBack={() => setScreen('menu')}
        />
      )}

      {/* SCREEN 4: S-SHAPED VIETNAM MAP */}
      {screen === 'vietnam_map' && (
        <VietnamMap
          player={player}
          onSelectRegion={(regId) => {
            setPlayer((prev) => ({ ...prev, currentRegionId: regId }));
            setScreen('overworld_explore');
          }}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenTrivia={() => setScreen('trivia_arena')}
          onOpenGallery={() => setScreen('gallery')}
        />
      )}

      {/* SCREEN 5: TOP-DOWN REGION EXPLORATION */}
      {screen === 'overworld_explore' && (
        <TopDownExplorer
          player={player}
          region={currentRegion}
          activeQuests={quests.filter((q) => q.regionId === currentRegion.id)}
          onUpdatePlayer={setPlayer}
          onStartCombat={(enemyType) => {
            setActiveCombatEnemy(enemyType);
            setScreen('combat');
          }}
          onOpenChest={handleOpenChest}
          onTalkNpc={handleTalkNpc}
          onBackToMap={() => setScreen('vietnam_map')}
          onOpenMenu={() => setIsMenuOpen(true)}
          toast={showToast}
        />
      )}

      {/* SCREEN 6: DEAD CELLS COMBAT ARENA */}
      {screen === 'combat' && (
        <CombatArena
          player={player}
          enemyKey={activeCombatEnemy}
          onVictory={handleCombatVictory}
          onDefeat={handleCombatDefeat}
          toast={showToast}
        />
      )}

      {/* SCREEN 7: TRIVIA KNOWLEDGE ARENA */}
      {screen === 'trivia_arena' && (
        <TriviaArena
          player={player}
          onReward={(exp, gold, itemId) => {
            gainExp(exp, gold);
            if (itemId && !player.inventory.includes(itemId)) {
              setPlayer((prev) => ({
                ...prev,
                inventory: [...prev.inventory, itemId],
              }));
            }
          }}
          onBack={() => setScreen('vietnam_map')}
          toast={showToast}
        />
      )}

      {/* SCREEN 8: WARDROBE & VIET PHUC GALLERY */}
      {screen === 'gallery' && (
        <VietPhucGallery
          player={player}
          onEquipItem={handleEquipItem}
          onBack={() => setScreen('vietnam_map')}
          toast={showToast}
        />
      )}

      {/* SCREEN 9: OUTRO CINEMATIC */}
      {screen === 'outro' && (
        <OutroCinematic onBackToMenu={() => setScreen('menu')} />
      )}

      {/* IN-GAME MENU MODAL (Triggered via ☰) */}
      {isMenuOpen && (
        <InGameMenuModal
          player={player}
          quests={quests}
          onClose={() => setIsMenuOpen(false)}
          onUpdatePlayer={(updates) => setPlayer((prev) => ({ ...prev, ...updates }))}
          onGoToMap={() => setScreen('vietnam_map')}
          onGoToTitle={() => setScreen('menu')}
          onOpenGallery={() => setScreen('gallery')}
          onResetGame={handleResetGame}
          onWatchIntro={() => setScreen('intro')}
          onWatchOutro={() => setScreen('outro')}
          toast={showToast}
        />
      )}
    </main>
  );
}

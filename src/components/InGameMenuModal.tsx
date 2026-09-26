import React, { useState } from 'react';
import { PlayerProfile, Gender, Quest } from '../types/game';
import { soundEngine } from '../utils/audio';
import { StorageManager } from '../engine/StorageManager';
import { CharacterSpriteCanvas } from './CharacterSpriteCanvas';

interface InGameMenuModalProps {
  player: PlayerProfile;
  quests: Quest[];
  onClose: () => void;
  onUpdatePlayer: (updates: Partial<PlayerProfile>) => void;
  onGoToMap: () => void;
  onGoToTitle: () => void;
  onOpenGallery: () => void;
  onResetGame?: () => void;
  onWatchIntro?: () => void;
  onWatchOutro?: () => void;
  toast: (msg: string) => void;
}

export const InGameMenuModal: React.FC<InGameMenuModalProps> = ({
  player,
  quests,
  onClose,
  onUpdatePlayer,
  onGoToMap,
  onGoToTitle,
  onOpenGallery,
  onResetGame,
  onWatchIntro,
  onWatchOutro,
  toast,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'quests' | 'character'>('settings');
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [sfxVol, setSfxVol] = useState<number>(soundEngine.getVolume().sfx);
  const [bgmVol, setBgmVol] = useState<number>(soundEngine.getVolume().bgm);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);

  const toggleFullscreen = () => {
    soundEngine.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        toast('Trình duyệt chưa cho phép toàn màn hình!');
      });
      setIsFullscreen(true);
      toast('Đã bật chế độ Toàn Màn Hình ⛶');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
        toast('Đã thoát Toàn Màn Hình');
      }
    }
  };

  const handleMuteToggle = () => {
    soundEngine.playClick();
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    toast(next ? 'Đã tắt âm thanh 🔇' : 'Đã bật âm thanh 🔊');
  };

  const handleVolumeChange = (type: 'sfx' | 'bgm', val: number) => {
    if (type === 'sfx') {
      setSfxVol(val);
      soundEngine.setVolume(val, bgmVol);
      soundEngine.playClick();
    } else {
      setBgmVol(val);
      soundEngine.setVolume(sfxVol, val);
    }
  };

  const handleGenderSwitch = (gender: Gender) => {
    soundEngine.playClick();
    onUpdatePlayer({ gender });
    toast(`Đã đổi nhân vật sang: ${gender === 'male' ? 'Nam (Tráng Sĩ)' : 'Nữ (Nữ Hiệp)'}!`);
  };

  const handleSaveGame = () => {
    soundEngine.playLevelUp();
    const success = StorageManager.saveGame(player);
    if (success) {
      toast('Đã lưu dữ liệu trò chơi thành công! ⭐');
    } else {
      toast('Không thể lưu vào bộ nhớ trình duyệt!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-[#141a24] border-3 border-[#d4af37] shadow-[8px_8px_0_#000] p-4 sm:p-6 text-[#f0e6d2] max-h-[92vh] flex flex-col">
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-700 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙</span>
            <h2 className="font-pixel text-xs sm:text-base text-[#d4af37]">
              BẢNG ĐIỀU KHIỂN & CÀI ĐẶT
            </h2>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="pixel-btn bg-[#d13426] hover:bg-[#e04535] text-white px-3 py-1 font-pixel text-xs cursor-pointer shadow-[2px_2px_0_#000]"
          >
            ✕ ĐÓNG
          </button>
        </div>

        {/* Tab navigation */}
        <div className="grid grid-cols-3 gap-2 mb-4 font-pixel text-[10px] sm:text-xs">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('settings');
            }}
            className={`p-2 border-2 cursor-pointer transition-all ${
              activeTab === 'settings'
                ? 'border-[#d4af37] bg-[#222a3a] text-amber-300 shadow-[2px_2px_0_#d4af37]'
                : 'border-slate-700 bg-[#0e131b] text-slate-400'
            }`}
          >
            ⚙ HỆ THỐNG
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('quests');
            }}
            className={`p-2 border-2 cursor-pointer transition-all ${
              activeTab === 'quests'
                ? 'border-[#d4af37] bg-[#222a3a] text-amber-300 shadow-[2px_2px_0_#d4af37]'
                : 'border-slate-700 bg-[#0e131b] text-slate-400'
            }`}
          >
            📜 NHIỆM VỤ
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('character');
            }}
            className={`p-2 border-2 cursor-pointer transition-all ${
              activeTab === 'character'
                ? 'border-[#d4af37] bg-[#222a3a] text-amber-300 shadow-[2px_2px_0_#d4af37]'
                : 'border-slate-700 bg-[#0e131b] text-slate-400'
            }`}
          >
            👤 NHÂN VẬT
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* TAB 1: SETTINGS & AUDIO & FULLSCREEN */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Fullscreen Option */}
              <div className="bg-[#0e141f] p-4 border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-pixel text-xs text-white">CHẾ ĐỘ TOÀN MÀN HÌNH</h4>
                  <p className="font-vt text-lg text-slate-400">
                    Trải nghiệm game RPG trọn vẹn không viền
                  </p>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="pixel-btn bg-[#24334a] hover:bg-[#344866] text-cyan-300 border border-cyan-500 px-4 py-2 font-pixel text-xs cursor-pointer shadow-[3px_3px_0_#000]"
                >
                  {isFullscreen ? '⛶ THOÁT TOÀN MÀN HÌNH' : '⛶ BẬT TOÀN MÀN HÌNH'}
                </button>
              </div>

              {/* Sound & Music Controls */}
              <div className="bg-[#0e141f] p-4 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-pixel text-xs text-white">ÂM THANH & NHẠC NỀN 8-BIT</h4>
                  <button
                    onClick={handleMuteToggle}
                    className="pixel-btn bg-[#18202c] border border-slate-600 px-3 py-1 font-pixel text-xs cursor-pointer"
                  >
                    {isMuted ? '🔇 ĐANG TẮT TIẾNG' : '🔊 ĐANG BẬT'}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-vt text-lg text-slate-300">
                    <span>Âm lượng hiệu ứng (SFX):</span>
                    <span>{Math.round(sfxVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={sfxVol}
                    onChange={(e) => handleVolumeChange('sfx', parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-vt text-lg text-slate-300">
                    <span>Âm lượng nhạc nền (BGM):</span>
                    <span>{Math.round(bgmVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={bgmVol}
                    onChange={(e) => handleVolumeChange('bgm', parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Save Game */}
              <div className="bg-[#0e141f] p-4 border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-pixel text-xs text-white">LƯU TRỮ TIẾN TRÌNH</h4>
                  <p className="font-vt text-lg text-slate-400">
                    Lưu dữ liệu cấp độ, cổ phục và vàng vào bộ nhớ
                  </p>
                </div>
                <button
                  onClick={handleSaveGame}
                  className="pixel-btn bg-[#065f46] hover:bg-[#047857] text-white border border-emerald-400 px-4 py-2 font-pixel text-xs cursor-pointer shadow-[3px_3px_0_#000]"
                >
                  💾 LƯU GAME
                </button>
              </div>

              {/* Watch Cinematics */}
              <div className="bg-[#0e141f] p-4 border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-pixel text-xs text-white">XEM LẠI PHIM CỐT TRUYỆN</h4>
                  <p className="font-vt text-lg text-slate-400">
                    Xem lại đoạn phim Mở đầu hoặc Kết cục giải mã năm 2099
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (onWatchIntro) {
                        onWatchIntro();
                        onClose();
                      }
                    }}
                    className="pixel-btn bg-[#18202c] hover:bg-[#253245] text-amber-300 border border-amber-600 px-3 py-1.5 font-pixel text-[10px] cursor-pointer"
                  >
                    📜 INTRO
                  </button>
                  <button
                    onClick={() => {
                      if (onWatchOutro) {
                        onWatchOutro();
                        onClose();
                      }
                    }}
                    className="pixel-btn bg-[#18202c] hover:bg-[#253245] text-cyan-300 border border-cyan-600 px-3 py-1.5 font-pixel text-[10px] cursor-pointer"
                  >
                    👑 OUTRO
                  </button>
                </div>
              </div>

              {/* Reset Game */}
              <div className="bg-[#1f0e13] p-4 border border-rose-800/80 flex items-center justify-between">
                <div>
                  <h4 className="font-pixel text-xs text-rose-300">CHƠI LẠI TỪ ĐẦU</h4>
                  <p className="font-vt text-lg text-slate-400">
                    Xóa toàn bộ dữ liệu đã lưu để bắt đầu lại chuyến hành trình mới
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa tiến trình và cày lại game từ đầu không?')) {
                      if (onResetGame) {
                        onResetGame();
                        onClose();
                      }
                    }
                  }}
                  className="pixel-btn bg-[#7f1d1d] hover:bg-[#991b1b] text-rose-100 border border-rose-500 px-3 py-2 font-pixel text-[10px] cursor-pointer shadow-[3px_3px_0_#000]"
                >
                  🔄 RESET GAME
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: QUEST LOG */}
          {activeTab === 'quests' && (
            <div className="space-y-3">
              <div className="font-pixel text-[11px] text-amber-300 mb-2">
                NHẬT KÝ SỨ MỆNH TRÊN BẢN ĐỒ CHỮ S:
              </div>
              {quests.map((q) => {
                const isCompleted = player.completedQuests.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className={`p-3 border-2 ${
                      isCompleted
                        ? 'border-emerald-700 bg-emerald-950/40 text-slate-300'
                        : 'border-slate-700 bg-[#0d141e] text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{q.npcAvatar}</span>
                        <h4 className="font-pixel text-xs text-[#fbe282]">{q.title}</h4>
                      </div>
                      <span
                        className={`font-pixel text-[9px] px-2 py-0.5 border ${
                          isCompleted
                            ? 'bg-emerald-900 border-emerald-500 text-emerald-300'
                            : 'bg-amber-950 border-amber-600 text-amber-300'
                        }`}
                      >
                        {isCompleted ? '✓ HOÀN THÀNH' : 'ĐANG THỰC HIỆN'}
                      </span>
                    </div>

                    <p className="font-vt text-lg text-slate-300 mb-2">
                      Mục tiêu: {q.objective}
                    </p>

                    <div className="flex items-center justify-between font-pixel text-[9px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Người giao: {q.npcName}</span>
                      <span className="text-emerald-400">+{q.rewardExp} EXP • +{q.rewardGold} Vàng</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: CHARACTER PROFILE & GENDER SWITCH */}
          {activeTab === 'character' && (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="bg-[#0e141f] p-4 border border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-28 bg-black/50 border-2 border-[#d4af37] flex items-center justify-center overflow-hidden shrink-0">
                  <CharacterSpriteCanvas
                    characterClass={(player.avatarId as any) || 'general_armor'}
                    gender={player.gender}
                    scale={0.9}
                    facing="right"
                    action="idle"
                    width={90}
                    height={110}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h3 className="font-pixel text-sm text-[#d4af37]">{player.name}</h3>
                  <div className="font-vt text-xl text-cyan-300">{player.title}</div>
                  <div className="font-pixel text-[10px] text-slate-400">
                    CẤP ĐỘ: <span className="text-amber-300">Lv {player.stats.level}</span> • EXP: {player.stats.exp}/{player.stats.expToNext}
                  </div>
                </div>
              </div>

              {/* Gender Switch as requested */}
              <div className="bg-[#0e141f] p-4 border border-slate-700">
                <h4 className="font-pixel text-xs text-white mb-2">ĐỔI GIỚI TÍNH NHÂN VẬT:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleGenderSwitch('male')}
                    className={`p-3 border-2 font-pixel text-xs cursor-pointer flex items-center justify-center gap-2 ${
                      player.gender === 'male'
                        ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200'
                        : 'border-slate-700 bg-black/40 text-slate-400'
                    }`}
                  >
                    <span>🧑</span>
                    <span>NAM (TRÁNG SĨ)</span>
                  </button>

                  <button
                    onClick={() => handleGenderSwitch('female')}
                    className={`p-3 border-2 font-pixel text-xs cursor-pointer flex items-center justify-center gap-2 ${
                      player.gender === 'female'
                        ? 'border-pink-400 bg-pink-950/80 text-pink-200'
                        : 'border-slate-700 bg-black/40 text-slate-400'
                    }`}
                  >
                    <span>👩</span>
                    <span>NỮ (NỮ HIỆP)</span>
                  </button>
                </div>
              </div>

              {/* Character Class / Avatar Switcher */}
              <div className="bg-[#0e141f] p-4 border border-slate-700">
                <h4 className="font-pixel text-xs text-white mb-2">ĐỔI HÌNH TƯỢNG NHÂN VẬT:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'scholar_blue', name: 'Nho Sĩ Áo Tấc', desc: 'Áo xanh lam, tay cầm sách' },
                    { id: 'rustic_villager', name: 'Dân Làng Cổ', desc: 'Áo nâu sồng, khăn vấn' },
                    { id: 'general_armor', name: 'Tướng Thiết Giáp', desc: 'Mũ lông đỏ, giáp vảy đồng' },
                    { id: 'tuong_actor', name: 'Đại Thần Tuồng', desc: 'Mặt nạ tuồng, áo giao lĩnh' },
                    { id: 'archer_crossbow', name: 'Xạ Thủ Nỏ', desc: 'Nỏ thần, dải lụa đỏ' },
                    { id: 'claw_warrior', name: 'Chiến Binh Vuốt', desc: 'Móng vuốt, phi đao sen' },
                  ].map((cls) => {
                    const isSelected = player.avatarId === cls.id;
                    return (
                      <button
                        key={cls.id}
                        onClick={() => {
                          soundEngine.playClick();
                          onUpdatePlayer({ avatarId: cls.id });
                          toast(`Đã chọn hình tượng: ${cls.name}`);
                        }}
                        className={`p-2 border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#d4af37] bg-amber-950/60 shadow-[2px_2px_0_#d4af37]'
                            : 'border-slate-700 bg-black/40 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className={`font-pixel text-[10px] ${isSelected ? 'text-[#fbe282]' : 'text-white'}`}>
                          {cls.name}
                        </div>
                        <div className="font-vt text-sm text-slate-400 leading-none mt-1">{cls.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Combat Stats Overview */}
              <div className="bg-[#0e141f] p-4 border border-slate-700">
                <h4 className="font-pixel text-xs text-white mb-2">CHỈ SỐ CHIẾN ĐẤU:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-pixel text-[10px]">
                  <div className="p-2 bg-black/40 border border-slate-800 text-rose-400">
                    MÁU: {player.stats.hp}/{player.stats.maxHp}
                  </div>
                  <div className="p-2 bg-black/40 border border-slate-800 text-cyan-400">
                    NĂNG LƯỢNG: {player.stats.mp}/{player.stats.maxMp}
                  </div>
                  <div className="p-2 bg-black/40 border border-slate-800 text-amber-400">
                    CÔNG: {player.stats.attack}
                  </div>
                  <div className="p-2 bg-black/40 border border-slate-800 text-blue-400">
                    THỦ: {player.stats.defense}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="mt-4 pt-3 border-t-2 border-slate-700 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                onGoToMap();
                onClose();
              }}
              className="pixel-btn bg-[#18202c] hover:bg-[#253245] text-amber-300 border border-amber-600 px-3 py-2 font-pixel text-[10px] cursor-pointer"
            >
              🗺 VỀ MAP CHỮ S
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenGallery();
                onClose();
              }}
              className="pixel-btn bg-[#18202c] hover:bg-[#253245] text-pink-300 border border-pink-600 px-3 py-2 font-pixel text-[10px] cursor-pointer"
            >
              👘 CỔ PHỤC
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                onGoToTitle();
                onClose();
              }}
              className="pixel-btn bg-[#3b1219] hover:bg-[#521722] text-rose-300 border border-rose-700 px-3 py-2 font-pixel text-[10px] cursor-pointer"
            >
              🚪 MENU CHÍNH
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="pixel-btn bg-[#d13426] hover:bg-[#e04535] text-white border-2 border-black px-4 py-2 font-pixel text-xs cursor-pointer shadow-[3px_3px_0_#000]"
            >
              TIẾP TỤC ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

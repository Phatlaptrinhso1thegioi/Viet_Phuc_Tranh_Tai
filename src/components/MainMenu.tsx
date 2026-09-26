import React, { useState } from 'react';
import { PlayerProfile } from '../types/game';
import { soundEngine } from '../utils/audio';
import { CharacterSpriteCanvas } from './CharacterSpriteCanvas';

interface MainMenuProps {
  player: PlayerProfile;
  hasSavedGame: boolean;
  onPlay: () => void;
  onResetGame: () => void;
  onCharacterCreate: () => void;
  onOpenGallery: () => void;
  onOpenTrivia: () => void;
  onOpenSettings: () => void;
  onWatchIntro: () => void;
  onWatchOutro: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  player,
  hasSavedGame,
  onPlay,
  onResetGame,
  onCharacterCreate,
  onOpenGallery,
  onOpenTrivia,
  onOpenSettings,
  onWatchIntro,
  onWatchOutro,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  return (
    <div className="relative w-full h-full bg-[#0b0e14] text-[#f0e6d2] overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 scanlines z-10 pointer-events-none" />

      {/* Retro background atmospheric elements */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      {/* Mountain & Pagoda silhouettes in distance */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#121924] to-transparent z-0 opacity-80" />

      {/* Main Title Banner */}
      <div className="relative z-20 text-center max-w-2xl mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1d160c] border border-[#d4af37] text-[#fbe282] font-pixel text-[10px] tracking-widest mb-3 shadow-[2px_2px_0_#000]">
          <span>⭐</span>
          <span>GAME RPG PIXEL VIỆT NAM • XUYÊN KHÔNG 2026</span>
          <span>⭐</span>
        </div>

        <h1 className="font-pixel text-2xl sm:text-4xl text-[#d4af37] leading-tight drop-shadow-[0_4px_12px_rgba(212,175,55,0.5)] tracking-wide">
          HÀNH TRÌNH VIỆT PHỤC
        </h1>
        
        <p className="font-vt text-2xl sm:text-3xl text-slate-300 mt-2 tracking-wide text-shadow">
          Ký Ức Chữ S • Sứ Mệnh Đánh Thức Cội Nguồn Trước Virus Lãng Quên
        </p>

        {/* Current profile badge if existing */}
        {hasSavedGame && (
          <div className="mt-4 flex items-center justify-center gap-4 bg-[#131b26]/95 border-2 border-[#d4af37] p-2.5 px-4 shadow-[4px_4px_0_#000]">
            <div className="w-16 h-20 bg-black/60 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              <CharacterSpriteCanvas
                characterClass={(player.avatarId as any) || 'general_armor'}
                gender={player.gender}
                scale={0.7}
                facing="right"
                action="walk"
                width={64}
                height={80}
              />
            </div>
            <div className="text-left font-pixel text-xs text-slate-300 space-y-1">
              <div className="text-amber-300 font-bold">{player.name}</div>
              <div className="text-slate-400 font-vt text-base">{player.title}</div>
              <div className="text-[10px]">
                <span className="text-[#d4af37]">Lv {player.stats.level}</span> • <span className="text-emerald-400">EXP {player.stats.exp}/{player.stats.expToNext}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Buttons Group */}
      <div className="relative z-20 flex flex-col gap-2.5 w-full max-w-xs sm:max-w-sm">
        {/* Play / Continue Button */}
        <button
          onClick={() => {
            soundEngine.playLevelUp();
            onPlay();
          }}
          className="pixel-btn bg-[#d13426] hover:bg-[#e04535] text-white border-3 border-black py-3 px-6 text-xs sm:text-sm flex items-center justify-center gap-3 cursor-pointer shadow-[5px_5px_0_#000]"
        >
          <span>▶</span>
          <span>{hasSavedGame ? 'TIẾP TỤC HÀNH TRÌNH' : 'BẮT ĐẦU DU HÀNH'}</span>
        </button>

        {/* Reset Game Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            if (hasSavedGame) {
              setShowResetConfirm(true);
            } else {
              onResetGame();
            }
          }}
          className="pixel-btn bg-[#2a1318] hover:bg-[#3d1820] text-rose-300 border-2 border-rose-800/80 py-2.5 px-6 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0_#000]"
        >
          <span>🔄</span>
          <span>CHƠI LẠI TỪ ĐẦU (RESET TIẾN TRÌNH)</span>
        </button>

        {/* Character Profile Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onCharacterCreate();
          }}
          className="pixel-btn bg-[#18202c] hover:bg-[#253245] text-[#d4af37] border-2 border-[#d4af37] py-2.5 px-6 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0_#000]"
        >
          <span>🧑/👩</span>
          <span>HỒ SƠ & GIỚI TÍNH NHÂN VẬT</span>
        </button>

        {/* Costume Gallery */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenGallery();
          }}
          className="pixel-btn bg-[#18202c] hover:bg-[#253245] text-slate-200 border-2 border-slate-600 py-2.5 px-6 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0_#000]"
        >
          <span>👘</span>
          <span>CỔ PHỤC (BỘ SƯU TẬP)</span>
        </button>

        {/* Trivia Arena */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenTrivia();
          }}
          className="pixel-btn bg-[#18202c] hover:bg-[#253245] text-amber-300 border-2 border-amber-600 py-2.5 px-6 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0_#000]"
        >
          <span>🧠</span>
          <span>ĐẤU TRƯỜNG TRI THỨC</span>
        </button>

        {/* Bottom row of small buttons: Settings, Intro, Outro */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenSettings();
            }}
            className="pixel-btn bg-[#141a24] hover:bg-[#1f2838] text-slate-300 border-2 border-slate-700 py-2 px-1 text-[9px] sm:text-[10px] flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>⚙</span>
            <span>CÀI ĐẶT</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onWatchIntro();
            }}
            className="pixel-btn bg-[#141a24] hover:bg-[#1f2838] text-amber-300 border-2 border-amber-700 py-2 px-1 text-[9px] sm:text-[10px] flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>📜</span>
            <span>XEM INTRO</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onWatchOutro();
            }}
            className="pixel-btn bg-[#141a24] hover:bg-[#1f2838] text-cyan-300 border-2 border-cyan-700 py-2 px-1 text-[9px] sm:text-[10px] flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>👑</span>
            <span>XEM OUTRO</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset Game */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#180f12] border-3 border-red-500 p-5 max-w-sm w-full text-center shadow-[6px_6px_0_#000]">
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="font-pixel text-xs text-red-400 mb-2 font-bold">
              XÁC NHẬN CHƠI LẠI TỪ ĐẦU?
            </h3>
            <p className="font-vt text-lg text-slate-300 mb-4 leading-relaxed">
              Toàn bộ cấp độ, nhiệm vụ và trang phục đã thu thập sẽ được thiết lập lại từ đầu. Bạn sẽ bắt đầu chuyến du hành mới từ Làng Cổ Miền Bắc!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="pixel-btn bg-[#1e293b] hover:bg-[#334155] text-slate-300 border border-slate-600 px-4 py-2 font-pixel text-[10px] cursor-pointer"
              >
                HỦY BỎ
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetGame();
                }}
                className="pixel-btn bg-[#dc2626] hover:bg-[#ef4444] text-white border-2 border-black px-4 py-2 font-pixel text-[10px] cursor-pointer shadow-[2px_2px_0_#000]"
              >
                ĐỒNG Ý RESET
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer copyright & retro version */}
      <div className="relative z-20 mt-6 text-center text-xs font-vt text-slate-500">
        HÀNH TRÌNH CHỮ S: VIỆT PHỤC VĨNH CỬU • PHIÊN BẢN RETRO RPG 2026
      </div>
    </div>
  );
};

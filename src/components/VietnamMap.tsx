import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, RegionLocation } from '../types/game';
import { REGIONS_DATA } from '../data/gameData';
import { soundEngine } from '../utils/audio';

interface VietnamMapProps {
  player: PlayerProfile;
  onSelectRegion: (regionId: string) => void;
  onOpenMenu: () => void;
  onOpenTrivia: () => void;
  onOpenGallery: () => void;
}

export const VietnamMap: React.FC<VietnamMapProps> = ({
  player,
  onSelectRegion,
  onOpenMenu,
  onOpenTrivia,
  onOpenGallery,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionLocation>(
    REGIONS_DATA.find((r) => r.id === player.currentRegionId) || REGIONS_DATA[0]
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background audio
  useEffect(() => {
    soundEngine.playBGM('peaceful');
    return () => {
      // Keep BGM running or handle properly
    };
  }, []);

  // Canvas animated decorations (waves, sailing ships, clouds, pulsing markers)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Sea Background Grid
      const w = canvas.width;
      const h = canvas.height;
      const tileSize = 28;

      ctx.fillStyle = '#1e3c72';
      ctx.fillRect(0, 0, w, h);

      // Sea wave highlights
      ctx.fillStyle = '#2a5298';
      for (let x = 0; x < w; x += tileSize) {
        for (let y = 0; y < h; y += tileSize) {
          if ((x + y + Math.floor(tick / 20)) % 6 === 0) {
            ctx.fillRect(x, y, 4, 2);
          }
        }
      }

      // 2. Draw Sailing Boats on Biển Đông
      const boatX1 = (w * 0.72 + Math.sin(tick * 0.02) * 15);
      const boatY1 = (h * 0.38 + Math.cos(tick * 0.02) * 8);
      drawPixelBoat(ctx, boatX1, boatY1, '🇻🇳');

      const boatX2 = (w * 0.65 + Math.cos(tick * 0.015) * 12);
      const boatY2 = (h * 0.78 + Math.sin(tick * 0.015) * 6);
      drawPixelBoat(ctx, boatX2, boatY2, '⛵');

      // 3. Draw Moving Clouds
      const cloudX1 = ((tick * 0.4) % (w + 120)) - 60;
      const cloudX2 = (((tick * 0.3) + 300) % (w + 120)) - 60;
      drawPixelCloud(ctx, cloudX1, h * 0.12);
      drawPixelCloud(ctx, cloudX2, h * 0.55);

      animId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const drawPixelBoat = (ctx: CanvasRenderingContext2D, x: number, y: number, flag: string) => {
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(x - 12, y + 2, 24, 7);
    ctx.fillRect(x - 9, y + 9, 18, 4);

    // Sail
    ctx.fillStyle = '#f0e6d2';
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 2);
    ctx.lineTo(x - 2, y - 16);
    ctx.lineTo(x + 10, y - 2);
    ctx.fill();

    // Flag text or icon
    ctx.font = '10px serif';
    ctx.fillText(flag, x - 5, y - 18);
  };

  const drawPixelCloud = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(x, y, 48, 14);
    ctx.fillRect(x + 10, y - 8, 28, 8);
    ctx.fillRect(x + 6, y + 14, 36, 4);
  };

  const handleRegionClick = (reg: RegionLocation) => {
    soundEngine.playClick();
    setSelectedRegion(reg);
    const isLocked = player.stats.level < reg.recommendedLevel || !player.unlockedRegions.includes(reg.id);
    if (isLocked) {
      soundEngine.playBossRoar();
    }
  };

  const handleEnterRegion = () => {
    const isLocked = player.stats.level < selectedRegion.recommendedLevel || !player.unlockedRegions.includes(selectedRegion.id);
    if (isLocked) {
      soundEngine.playBossRoar();
      return;
    }
    soundEngine.playLevelUp();
    onSelectRegion(selectedRegion.id);
  };

  return (
    <div className="relative w-full h-full bg-[#1e3c72] text-[#f0e6d2] overflow-hidden flex flex-col">
      {/* Background Animated Canvas (Sea & Clouds) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Retro CRT Scanlines */}
      <div className="absolute inset-0 scanlines z-10 pointer-events-none" />

      {/* TOP RETRO HUD (Inspired by user's reference image) */}
      <header className="relative z-30 w-full bg-[#0d131d]/95 border-b-3 border-[#d4af37] px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
        {/* Title & Location */}
        <div className="flex items-center gap-3">
          <div className="text-xl">🇻🇳</div>
          <div>
            <div className="font-pixel text-[10px] sm:text-xs text-[#d4af37] tracking-wider hidden sm:block">
              HÀNH TRÌNH CHỮ S: MAP VIỆT NAM (RETRO RPG)
            </div>
            <div className="font-pixel text-xs text-white flex items-center gap-2">
              <span className="text-emerald-400">VỊ TRÍ:</span>
              <span className="text-[#fbe282]">{selectedRegion.vietnameseName}</span>
            </div>
          </div>
        </div>

        {/* Player Stats (HP / MP / Gold / Level) */}
        <div className="flex items-center gap-3 sm:gap-6 font-pixel text-[10px] sm:text-xs">
          {/* Level & EXP */}
          <div className="flex flex-col items-end">
            <span className="text-amber-300">
              Lv <strong className="text-white text-xs">{player.stats.level}</strong>
            </span>
            <span className="text-slate-400 text-[9px]">
              EXP {player.stats.exp}/{player.stats.expToNext}
            </span>
          </div>

          {/* HP Bar */}
          <div className="hidden md:flex flex-col w-24 sm:w-28">
            <div className="flex justify-between text-[9px] mb-0.5">
              <span className="text-red-400">HP</span>
              <span>{player.stats.hp}/{player.stats.maxHp}</span>
            </div>
            <div className="w-full h-2.5 bg-black border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (player.stats.hp / player.stats.maxHp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-1.5 text-amber-300 bg-black/50 px-2.5 py-1 border border-amber-500/60">
            <span>🪙</span>
            <span>{player.stats.gold}</span>
          </div>

          {/* Menu Button ☰ */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenMenu();
            }}
            className="pixel-btn bg-[#d13426] hover:bg-[#e04535] text-white border-2 border-black p-2 sm:px-3 text-xs sm:text-sm cursor-pointer shadow-[3px_3px_0_#000] flex items-center gap-1"
            title="Mở bảng Cài đặt & Trạng thái"
          >
            <span>☰</span>
            <span className="hidden sm:inline">MENU</span>
          </button>
        </div>
      </header>

      {/* MAIN MAP AREA */}
      <div className="relative flex-1 w-full overflow-hidden flex flex-col md:flex-row">
        {/* Interactive Map Visual Area */}
        <div className="relative flex-1 h-full flex items-center justify-center p-2 sm:p-4">
          {/* S-Shaped Vietnam Graphic Container */}
          <div className="relative w-full max-w-xl h-[420px] sm:h-[500px] md:h-[540px] bg-[#162744]/70 border-3 border-[#28497d] shadow-[8px_8px_0_#000] overflow-hidden">
            {/* Grid Coordinates Overlay */}
            <div className="absolute inset-0 cyber-grid opacity-25" />

            {/* Adjacent Countries Representation */}
            <div className="absolute top-2 left-6 text-slate-400 font-pixel text-[10px] opacity-60">
              CHINA (TRUNG QUỐC)
            </div>
            <div className="absolute top-28 left-4 text-slate-400 font-pixel text-[10px] opacity-60">
              LAOS (LÀO)
            </div>
            <div className="absolute bottom-28 left-6 text-slate-400 font-pixel text-[10px] opacity-60">
              CAMBODIA (CAMPUCHIA)
            </div>

            {/* Sea Label: BIỂN ĐÔNG */}
            <div className="absolute top-36 right-10 text-cyan-200/80 font-pixel text-xs sm:text-sm tracking-widest pointer-events-none drop-shadow">
              🌊 BIỂN ĐÔNG VIỆT NAM
            </div>

            {/* Vietnam S-Shape SVG with authentic curves */}
            <svg
              viewBox="0 0 400 600"
              className="absolute inset-0 w-full h-full filter drop-shadow-[4px_6px_12px_rgba(0,0,0,0.8)]"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Vietnam Main S-Shaped Landmass */}
              <path
                d="M 140 40 
                   Q 190 35, 230 65 
                   Q 215 95, 195 105 
                   Q 210 135, 185 175 
                   Q 215 220, 210 270 
                   Q 240 330, 230 380 
                   Q 210 420, 190 460 
                   Q 160 520, 140 550 
                   Q 105 565, 80 540 
                   Q 125 490, 140 440 
                   Q 155 370, 150 310 
                   Q 130 260, 120 200 
                   Q 95 130, 100 80 
                   Z"
                fill="#4a9c36"
                stroke="#2d681f"
                strokeWidth="4"
              />

              {/* Mountains & Hills Pattern on Land */}
              <path
                d="M 150 90 L 160 75 L 170 90 M 175 140 L 185 120 L 195 140 M 170 240 L 185 215 L 200 240 M 180 340 L 195 315 L 210 340"
                stroke="#27501a"
                strokeWidth="3"
                fill="none"
              />

              {/* Red River & Mekong River Deltas */}
              <path
                d="M 130 65 Q 170 85, 205 95"
                stroke="#3884c4"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M 120 490 Q 150 515, 165 540"
                stroke="#3884c4"
                strokeWidth="4"
                fill="none"
              />

              {/* Quần Đảo Hoàng Sa (Paracel Islands) */}
              <g className="filter drop-shadow">
                <circle cx="280" cy="230" r="7" fill="#4a9c36" stroke="#2d681f" strokeWidth="2" />
                <circle cx="295" cy="220" r="5" fill="#4a9c36" stroke="#2d681f" strokeWidth="2" />
                <circle cx="270" cy="245" r="5" fill="#4a9c36" stroke="#2d681f" strokeWidth="2" />
                <circle cx="310" cy="240" r="6" fill="#4a9c36" stroke="#2d681f" strokeWidth="2" />
                <text x="250" y="212" fill="#fbe282" fontSize="10" fontFamily="'Press Start 2P', monospace">
                  HOÀNG SA
                </text>
              </g>

              {/* Quần Đảo Trường Sa (Spratly Islands) */}
              <g className="filter drop-shadow">
                <circle cx="270" cy="410" r="6" fill="#4a9c36" stroke="#2d681f" strokeWidth="2" />
                <circle cx="290" cy="425" r="7" fill="#4a9c36" stroke="#2d681f" strokeWidth="2" />
                <circle cx="315" cy="445" r="6" fill="#4a9c36" stroke="#2d681f" strokeWidth="2" />
                <circle cx="260" cy="450" r="5" fill="#4a9c36" stroke="#2d681f" strokeWidth="2" />
                <circle cx="285" cy="470" r="6" fill="#4a9c36" stroke="#2d681f" strokeWidth="2" />
                <text x="245" y="395" fill="#fbe282" fontSize="10" fontFamily="'Press Start 2P', monospace">
                  TRƯỜNG SA
                </text>
              </g>

              {/* Đảo Phú Quốc */}
              <circle cx="85" cy="510" r="8" fill="#4a9c36" stroke="#2d681f" strokeWidth="2" />
              <text x="45" y="505" fill="#fbe282" fontSize="8" fontFamily="'Press Start 2P', monospace">
                PHÚ QUỐC
              </text>
            </svg>

            {/* REGION PINS & MARKERS */}
            {REGIONS_DATA.map((reg) => {
              const isSelected = selectedRegion.id === reg.id;
              const isBoss = reg.id === 'tam_linh_virus';
              const isLocked = player.stats.level < reg.recommendedLevel;

              return (
                <div
                  key={reg.id}
                  onClick={() => handleRegionClick(reg)}
                  style={{
                    left: `${reg.mapX}%`,
                    top: `${reg.mapY}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-30 cursor-pointer group flex flex-col items-center transition-transform ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                  }`}
                >
                  {/* Pin Flag/Icon */}
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-pixel text-xs shadow-[3px_3px_0_#000] ${
                      isLocked
                        ? 'bg-[#2b1212] border-red-500/80 text-red-300'
                        : isBoss
                        ? 'bg-red-700 border-red-300 text-yellow-300 animate-pulse'
                        : isSelected
                        ? 'bg-[#d4af37] border-white text-black'
                        : 'bg-[#141a24] border-[#d4af37] text-[#d4af37]'
                    }`}
                  >
                    {isLocked ? '🔒' : isBoss ? '👾' : isSelected ? '★' : '📍'}
                  </div>

                  {/* Label under pin */}
                  <div
                    className={`mt-1 font-pixel text-[9px] px-1.5 py-0.5 whitespace-nowrap shadow-[2px_2px_0_#000] ${
                      isLocked
                        ? 'bg-[#3b1212]/90 text-red-300 border border-red-700'
                        : isSelected
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'bg-black/80 text-[#f0e6d2] border border-slate-700'
                    }`}
                  >
                    {isLocked ? `🔒 Lv ${reg.recommendedLevel}` : reg.vietnameseName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR: SELECTED REGION DETAILS & ACTIONS */}
        <aside className="w-full md:w-80 lg:w-96 bg-[#111823]/95 border-t-3 md:border-t-0 md:border-l-3 border-[#d4af37] p-4 sm:p-5 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header badge */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`font-pixel text-[10px] px-2 py-0.5 border ${
                  player.stats.level < selectedRegion.recommendedLevel || !player.unlockedRegions.includes(selectedRegion.id)
                    ? 'text-red-400 bg-red-950/80 border-red-600'
                    : 'text-amber-400 bg-[#241a0d] border-amber-500'
                }`}
              >
                CẤP ĐỘ YÊU CẦU: LV {selectedRegion.recommendedLevel}
              </span>
              <span
                className={`font-vt text-lg ${
                  player.stats.level < selectedRegion.recommendedLevel || !player.unlockedRegions.includes(selectedRegion.id)
                    ? 'text-red-400'
                    : 'text-emerald-400'
                }`}
              >
                {player.stats.level < selectedRegion.recommendedLevel || !player.unlockedRegions.includes(selectedRegion.id)
                  ? '🔒 Chưa mở khóa'
                  : '✓ Đã mở khóa'}
              </span>
            </div>

            {/* Locked Warning Box */}
            {(player.stats.level < selectedRegion.recommendedLevel || !player.unlockedRegions.includes(selectedRegion.id)) && (
              <div className="bg-[#2c0e0e] border-2 border-red-500 p-2.5 mb-3 text-red-200 font-pixel text-[10px] leading-relaxed shadow-[2px_2px_0_#000]">
                <div className="text-yellow-300 font-bold mb-1 flex items-center gap-1.5">
                  <span>🔒</span>
                  <span>KHU VỰC BỊ PHONG ẤN BỞI VIRUS!</span>
                </div>
                Cấp hiện tại: <strong className="text-white">Cấp {player.stats.level}</strong>. Cần đạt tối thiểu <strong className="text-yellow-300">Cấp {selectedRegion.recommendedLevel}</strong> để phá vỡ phong ấn và tiến vào vùng đất này.
              </div>
            )}

            {/* Region Title */}
            <h2 className="font-pixel text-base sm:text-lg text-[#d4af37] mb-1">
              {selectedRegion.vietnameseName}
            </h2>
            <div className="font-vt text-xl text-cyan-300 mb-3">
              {selectedRegion.subTitle}
            </div>

            {/* Description */}
            <p className="font-vt text-lg text-slate-300 leading-relaxed bg-[#0c121b] p-3 border border-slate-800 mb-4">
              {selectedRegion.description}
            </p>

            {/* Landmark & Heritage Cloth */}
            <div className="space-y-2.5 font-pixel text-[10px] sm:text-xs">
              <div className="bg-[#17202d] p-2.5 border border-slate-700 flex flex-col gap-1">
                <span className="text-[#fbe282]">🏛 DANH THẮNG:</span>
                <span className="text-slate-200">{selectedRegion.landmark}</span>
              </div>

              <div className="bg-[#17202d] p-2.5 border border-slate-700 flex flex-col gap-1">
                <span className="text-pink-300">👘 CỔ PHỤC ĐẶC TRƯNG:</span>
                <span className="text-emerald-300">{selectedRegion.specialtyCloth}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 space-y-2.5 pt-3 border-t border-slate-800">
            {/* Enter Region Explore */}
            <button
              onClick={handleEnterRegion}
              disabled={player.stats.level < selectedRegion.recommendedLevel || !player.unlockedRegions.includes(selectedRegion.id)}
              className={`w-full pixel-btn border-2 py-3 text-xs sm:text-sm font-pixel flex items-center justify-center gap-2 shadow-[4px_4px_0_#000] ${
                player.stats.level < selectedRegion.recommendedLevel || !player.unlockedRegions.includes(selectedRegion.id)
                  ? 'bg-[#3b1212] border-red-800 text-red-300 cursor-not-allowed opacity-85'
                  : 'bg-[#d13426] hover:bg-[#e04535] text-white border-black cursor-pointer'
              }`}
            >
              {player.stats.level < selectedRegion.recommendedLevel || !player.unlockedRegions.includes(selectedRegion.id) ? (
                <>
                  <span>🔒</span>
                  <span>CẦN CẤP ĐỘ {selectedRegion.recommendedLevel} ĐỂ MỞ KHÓA</span>
                </>
              ) : (
                <>
                  <span>⚔</span>
                  <span>TIẾN VÀO KHÁM PHÁ MAP</span>
                </>
              )}
            </button>

            {/* Trivia Arena button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenTrivia();
              }}
              className="w-full pixel-btn bg-[#1a2332] hover:bg-[#253245] text-amber-300 border-2 border-amber-500 py-2.5 text-xs font-pixel flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0_#000]"
            >
              <span>🧠</span>
              <span>ĐẤU TRƯỜNG TRI THỨC</span>
            </button>

            {/* Wardrobe gallery button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenGallery();
              }}
              className="w-full pixel-btn bg-[#111823] hover:bg-[#1a2332] text-slate-300 border border-slate-700 py-2 text-xs font-pixel flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>👘</span>
              <span>XEM BỘ SƯU TẬP VIỆT PHỤC</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

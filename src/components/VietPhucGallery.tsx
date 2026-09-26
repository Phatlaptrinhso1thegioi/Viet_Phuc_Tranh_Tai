import React, { useState } from 'react';
import { PlayerProfile, VietPhucItem } from '../types/game';
import { INITIAL_VIET_PHUC_ITEMS } from '../data/gameData';
import { soundEngine } from '../utils/audio';

interface VietPhucGalleryProps {
  player: PlayerProfile;
  onEquipItem: (item: VietPhucItem) => void;
  onBack: () => void;
  toast: (msg: string) => void;
}

export const VietPhucGallery: React.FC<VietPhucGalleryProps> = ({
  player,
  onEquipItem,
  onBack,
  toast,
}) => {
  const [selectedItem, setSelectedItem] = useState<VietPhucItem>(INITIAL_VIET_PHUC_ITEMS[0]);

  const isUnlocked = (item: VietPhucItem) => {
    return player.inventory.includes(item.id) || item.id === 'non_la' || item.id === 'ao_tu_than';
  };

  const isEquipped = (item: VietPhucItem) => {
    return player.equippedCostumeId === item.id || player.equippedHatId === item.id;
  };

  const handleEquip = (item: VietPhucItem) => {
    if (!isUnlocked(item)) {
      toast('Cổ phục này chưa được mở khóa! Hãy phiêu lưu trên bản đồ chữ S để tìm kiếm.');
      return;
    }
    soundEngine.playLevelUp();
    onEquipItem(item);
    toast(`Đã mặc: ${item.name}!`);
  };

  return (
    <div className="relative w-full h-full bg-[#0b0e14] text-[#f0e6d2] overflow-y-auto flex flex-col p-4 sm:p-6">
      <div className="absolute inset-0 scanlines z-10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between bg-[#141a24] border-2 border-[#d4af37] p-4 shadow-[4px_4px_0_#000] mb-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👘</span>
          <div>
            <h1 className="font-pixel text-xs sm:text-base text-[#d4af37]">
              CỔ PHỤC CÁC • BẢO TÀNG TRANG PHỤC ĐẠI VIỆT
            </h1>
            <span className="font-vt text-lg text-slate-300">
              Khám phá tinh hoa y phục ngàn năm lịch sử dân tộc
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="pixel-btn bg-[#18202c] hover:bg-[#253245] text-slate-200 border-2 border-slate-600 px-4 py-2 font-pixel text-xs cursor-pointer shadow-[3px_3px_0_#000]"
        >
          TRỞ VỀ
        </button>
      </div>

      {/* Main Content Layout: Grid list on left, detailed display on right */}
      <div className="relative z-20 flex-1 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Item Grid */}
        <div className="md:col-span-5 bg-[#121822] border-2 border-slate-700 p-3 overflow-y-auto max-h-[560px]">
          <div className="font-pixel text-[11px] text-[#fbe282] mb-3 px-1 flex justify-between items-center">
            <span>DANH SÁCH VIỆT PHỤC:</span>
            <span className="text-xs text-slate-400">
              {INITIAL_VIET_PHUC_ITEMS.filter((i) => isUnlocked(i)).length} / {INITIAL_VIET_PHUC_ITEMS.length} ĐÃ MỞ
            </span>
          </div>

          <div className="space-y-2.5">
            {INITIAL_VIET_PHUC_ITEMS.map((item) => {
              const unlocked = isUnlocked(item);
              const equipped = isEquipped(item);
              const isSelected = selectedItem.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedItem(item);
                  }}
                  className={`p-3 border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#d4af37] bg-[#1d2638] shadow-[3px_3px_0_#d4af37]'
                      : 'border-slate-800 bg-[#0d131c] hover:border-slate-600'
                  } ${!unlocked ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 border flex items-center justify-center text-xl shrink-0"
                      style={{
                        backgroundColor: unlocked ? item.color : '#222',
                        borderColor: item.secondaryColor,
                      }}
                    >
                      {unlocked ? item.icon : '🔒'}
                    </div>

                    <div>
                      <div className="font-pixel text-xs text-white">
                        {unlocked ? item.name : '??? (Chưa giải mã)'}
                      </div>
                      <div className="font-vt text-sm text-[#d4af37]">
                        {unlocked ? item.dynastyOrRegion : 'Bị Virus Lãng Quên phong ấn'}
                      </div>
                    </div>
                  </div>

                  {equipped && (
                    <span className="font-pixel text-[9px] bg-emerald-950 border border-emerald-500 text-emerald-400 px-2 py-0.5">
                      ĐANG MẶC
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: High Detail Preview, Lore & Stats */}
        <div className="md:col-span-7 bg-[#141b26] border-3 border-[#d4af37] p-5 shadow-[6px_6px_0_#000] flex flex-col justify-between">
          <div>
            {/* Item Showcase Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div>
                <span className="font-pixel text-[10px] text-amber-400 bg-amber-950/60 border border-amber-500 px-2 py-0.5">
                  {selectedItem.dynastyOrRegion}
                </span>
                <h2 className="font-pixel text-sm sm:text-lg text-[#d4af37] mt-1.5">
                  {isUnlocked(selectedItem) ? selectedItem.name : 'CỔ VẬT BỊ PHONG ẤN'}
                </h2>
              </div>

              {isEquipped(selectedItem) && (
                <span className="font-pixel text-xs bg-emerald-500 text-black px-3 py-1 font-bold">
                  ✓ TRANG BỊ
                </span>
              )}
            </div>

            {/* Visual Pixel Mannequin Display */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#0c121b] p-4 border border-slate-800 mb-4">
              {/* Costume Canvas Render Box */}
              <div
                className="w-32 h-36 border-3 border-[#d4af37] flex flex-col items-center justify-center p-3 shadow-[4px_4px_0_#000]"
                style={{ backgroundColor: isUnlocked(selectedItem) ? selectedItem.color : '#1a1a1a' }}
              >
                <span className="text-6xl filter drop-shadow">
                  {isUnlocked(selectedItem) ? selectedItem.icon : '🔒'}
                </span>
                <span className="font-pixel text-[8px] text-white mt-2 bg-black/70 px-2 py-0.5">
                  {selectedItem.category.toUpperCase()}
                </span>
              </div>

              {/* Stats Bonus Box */}
              <div className="flex-1 space-y-2">
                <div className="font-pixel text-[11px] text-amber-300 mb-1">
                  CHỈ SỐ TĂNG CƯỜNG KHI MẶC:
                </div>
                <div className="grid grid-cols-2 gap-2 font-pixel text-[10px]">
                  {selectedItem.statsBonus.hp && (
                    <div className="bg-[#121a24] p-2 border border-slate-700 text-emerald-400">
                      + {selectedItem.statsBonus.hp} MÁU (HP)
                    </div>
                  )}
                  {selectedItem.statsBonus.attack && (
                    <div className="bg-[#121a24] p-2 border border-slate-700 text-rose-400">
                      + {selectedItem.statsBonus.attack} TẤN CÔNG
                    </div>
                  )}
                  {selectedItem.statsBonus.defense && (
                    <div className="bg-[#121a24] p-2 border border-slate-700 text-cyan-400">
                      + {selectedItem.statsBonus.defense} PHÒNG THỦ
                    </div>
                  )}
                  {selectedItem.statsBonus.expBonus && (
                    <div className="bg-[#121a24] p-2 border border-slate-700 text-amber-300">
                      + {selectedItem.statsBonus.expBonus}% EXP THƯỞNG
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description & Cultural Lore */}
            <div className="space-y-3 font-vt text-slate-200">
              <div>
                <h4 className="font-pixel text-[11px] text-[#fbe282] mb-1">CẤU TẠO & ĐẶC ĐIỂM:</h4>
                <p className="text-xl bg-[#0e141e] p-3 border border-slate-800 leading-relaxed">
                  {isUnlocked(selectedItem)
                    ? selectedItem.description
                    : 'Cổ phục đang bị chìm trong dòng xoáy hư không. Cần khám phá map hoặc hoàn thành nhiệm vụ để hồi phục.'}
                </p>
              </div>

              <div>
                <h4 className="font-pixel text-[11px] text-[#fbe282] mb-1">Ý NGHĨA VĂN HÓA & LỊCH SỬ:</h4>
                <p className="text-xl text-amber-100/90 bg-[#0e141e] p-3 border border-slate-800 leading-relaxed">
                  {isUnlocked(selectedItem)
                    ? selectedItem.lore
                    : 'Ký ức dân tộc đang chờ bạn đánh thức.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button: Equip / Unequip */}
          <div className="mt-5 pt-3 border-t border-slate-700 flex justify-end">
            <button
              onClick={() => handleEquip(selectedItem)}
              disabled={!isUnlocked(selectedItem)}
              className={`pixel-btn py-3 px-6 text-xs font-pixel flex items-center gap-2 cursor-pointer shadow-[4px_4px_0_#000] ${
                isUnlocked(selectedItem)
                  ? 'bg-[#d13426] hover:bg-[#e04535] text-white border-2 border-black'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <span>{isEquipped(selectedItem) ? '✓ ĐANG TRANG BỊ' : '👘 MẶC VÀO NHÂN VẬT'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

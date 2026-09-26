import React, { useState } from 'react';
import { PlayerProfile, VietPhucItem } from '../types/game';
import { INITIAL_VIET_PHUC_ITEMS } from '../data/gameData';
import { soundEngine } from '../utils/audio';

interface AncientHeritageShopProps {
  player: PlayerProfile;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  onClose: () => void;
  toast: (msg: string) => void;
}

export const AncientHeritageShop: React.FC<AncientHeritageShopProps> = ({
  player,
  onUpdatePlayer,
  onClose,
  toast,
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'weapon' | 'relic'>('all');
  const [selectedItem, setSelectedItem] = useState<VietPhucItem | null>(null);

  // Danh sách các vật phẩm có thể mua trong Shop (có giá price)
  const shopItems = INITIAL_VIET_PHUC_ITEMS.filter((item) => (item.price || 0) > 0);

  const filteredItems = shopItems.filter((item) => {
    if (selectedTab === 'weapon') return item.category === 'weapon';
    if (selectedTab === 'relic') return item.category === 'relic';
    return true;
  });

  // Xử lý Mua vật phẩm
  const handleBuy = (item: VietPhucItem) => {
    const price = item.price || 0;
    if (player.stats.gold < price) {
      soundEngine.playTone(200, 'sawtooth', 0.2);
      toast(`❌ Không đủ Vàng! Bạn cần thêm ${price - player.stats.gold} vàng nữa.`);
      return;
    }

    soundEngine.playLevelUp();

    let newInventory = [...player.inventory];
    if (!newInventory.includes(item.id)) {
      newInventory.push(item.id);
    }

    let updatedStats = {
      ...player.stats,
      gold: player.stats.gold - price,
    };

    // Nếu là bùa hộ mệnh hoặc linh đan tăng vĩnh viễn:
    if (item.id === 'bua_trong_dong') {
      updatedStats.defense += 16;
      updatedStats.maxHp += 80;
      updatedStats.hp += 80;
      toast(`🛡️ Đã gia trì Bùa Trống Đồng! Tăng vĩnh viễn +16 Thủ, +80 Máu tối đa!`);
    } else if (item.id === 'linh_dan_fansipan') {
      updatedStats.attack += 15;
      updatedStats.maxHp += 50;
      updatedStats.hp += 50;
      toast(`💊 Đã uống Linh Đan Fansipan! Tăng vĩnh viễn +15 Tấn Công, +50 Máu!`);
    } else if (item.id === 'binh_linh_duoc') {
      updatedStats.hp = Math.min(updatedStats.maxHp, updatedStats.hp + 120);
      toast(`✨ Đã dùng Bình Ngọc Linh Dược! Hồi phục +120 HP ngay lập tức.`);
    } else if (item.id === 'tra_sen_cung_dinh') {
      updatedStats.hp = Math.min(updatedStats.maxHp, updatedStats.hp + 180);
      updatedStats.mp = Math.min(updatedStats.maxMp, updatedStats.mp + 60);
      toast(`🫖 Đã thưởng thức Trà Sen Cung Đình! Hồi phục +180 HP và +60 MP.`);
    } else {
      toast(`🪙 Mua thành công [${item.name}]! Đã thêm vào kho binh khí.`);
    }

    onUpdatePlayer({
      ...player,
      stats: updatedStats,
      inventory: newInventory,
    });
  };

  // Xử lý Trang bị Vũ khí
  const handleEquipWeapon = (weaponId: string) => {
    soundEngine.playHeavySlash();

    const currentWep = shopItems.find((i) => i.id === player.equippedWeaponId);
    const newWep = shopItems.find((i) => i.id === weaponId);

    // Tính toán lại chỉ số tấn công
    let baseAtk = player.stats.attack;
    if (currentWep?.statsBonus.attack) {
      baseAtk -= currentWep.statsBonus.attack;
    }
    if (newWep?.statsBonus.attack) {
      baseAtk += newWep.statsBonus.attack;
    }

    onUpdatePlayer({
      ...player,
      equippedWeaponId: weaponId,
      stats: {
        ...player.stats,
        attack: Math.max(10, baseAtk),
      },
    });

    toast(`⚔️ ĐÃ TRANG BỊ: [${newWep?.name || weaponId}]! Lực tấn công hiện tại: ${baseAtk}`);
  };

  // Tháo vũ khí
  const handleUnequipWeapon = () => {
    soundEngine.playClick();
    const currentWep = shopItems.find((i) => i.id === player.equippedWeaponId);
    let baseAtk = player.stats.attack;
    if (currentWep?.statsBonus.attack) {
      baseAtk -= currentWep.statsBonus.attack;
    }

    onUpdatePlayer({
      ...player,
      equippedWeaponId: '',
      stats: {
        ...player.stats,
        attack: Math.max(10, baseAtk),
      },
    });

    toast(`Đã gỡ vũ khí về tay không.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      {/* Khung Shop Phong Cách Lò Rèn Đại Việt */}
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[720px] bg-[#140b05] border-3 border-[#d4af37] flex flex-col shadow-[0_10px_35px_rgba(0,0,0,0.9),6px_6px_0_#000] overflow-hidden">
        {/* Hoa văn góc hoàng gia dát vàng */}
        <div className="absolute top-1 left-2 text-[#d4af37] font-pixel text-xs opacity-75">✦ ╔══</div>
        <div className="absolute top-1 right-2 text-[#d4af37] font-pixel text-xs opacity-75">══╗ ✦</div>
        <div className="absolute bottom-1 left-2 text-[#d4af37] font-pixel text-xs opacity-75">✦ ╚══</div>
        <div className="absolute bottom-1 right-2 text-[#d4af37] font-pixel text-xs opacity-75">══╝ ✦</div>

        {/* HEADER: TIỆM RÈN & SỐ TIỀN */}
        <div className="relative z-10 bg-gradient-to-r from-[#291307] via-[#3a1a09] to-[#291307] border-b-2 border-[#854d0e] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Lò than rèn pixel */}
            <div className="w-12 h-12 bg-[#1a0802] border-2 border-[#d97706] flex items-center justify-center text-3xl shadow-[2px_2px_0_#000]">
              <span>🔥</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-pixel text-xs sm:text-sm text-[#fbe282] tracking-wider">
                  TIỆM RÈN CỔ TRUYỀN & BINH KHÍ CÁC
                </h2>
                <span className="bg-[#991b1b] border border-[#ef4444] text-[#fef08a] font-pixel text-[8px] px-1.5 py-0.5">
                  THẦN CƠ ĐẠI VIỆT
                </span>
              </div>
              <p className="font-vt text-sm sm:text-base text-amber-200/80">
                Thợ rèn Cao Thắng: "Lửa lò nghìn năm đúc gươm thần, chém tan mã độc thời không!"
              </p>
            </div>
          </div>

          {/* SỐ VÀNG CỦA NGƯỜI CHƠI & NÚT ĐÓNG */}
          <div className="flex items-center gap-4">
            <div className="bg-[#1e1005] border-2 border-[#f59e0b] px-3.5 py-1.5 flex items-center gap-2 shadow-[2px_2px_0_#000]">
              <span className="text-xl">🪙</span>
              <div className="flex flex-col">
                <span className="font-pixel text-[8px] text-amber-400">NGÂN LƯỢNG:</span>
                <span className="font-pixel text-xs sm:text-sm text-[#fef08a]">
                  {player.stats.gold.toLocaleString()} VÀNG
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="pixel-btn bg-[#7f1d1d] hover:bg-[#991b1b] text-white border-2 border-black w-9 h-9 flex items-center justify-center font-pixel text-xs cursor-pointer shadow-[2px_2px_0_#000]"
              title="Đóng [ESC / B]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* TABS PHÂN LOẠI & LỰC TẤN CÔNG HIỆN TẠI */}
        <div className="bg-[#1c0f06] border-b border-[#854d0e]/60 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                setSelectedTab('all');
              }}
              className={`pixel-btn px-3 py-1.5 font-pixel text-[10px] cursor-pointer ${
                selectedTab === 'all'
                  ? 'bg-[#d97706] text-black font-bold border-2 border-yellow-200'
                  : 'bg-[#29160a] text-amber-200 border border-[#854d0e]'
              }`}
            >
              TẤT CẢ ({shopItems.length})
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setSelectedTab('weapon');
              }}
              className={`pixel-btn px-3 py-1.5 font-pixel text-[10px] cursor-pointer flex items-center gap-1.5 ${
                selectedTab === 'weapon'
                  ? 'bg-[#d97706] text-black font-bold border-2 border-yellow-200'
                  : 'bg-[#29160a] text-amber-200 border border-[#854d0e]'
              }`}
            >
              <span>⚔️</span>
              <span>VŨ KHÍ NGÀY XƯA</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setSelectedTab('relic');
              }}
              className={`pixel-btn px-3 py-1.5 font-pixel text-[10px] cursor-pointer flex items-center gap-1.5 ${
                selectedTab === 'relic'
                  ? 'bg-[#d97706] text-black font-bold border-2 border-yellow-200'
                  : 'bg-[#29160a] text-amber-200 border border-[#854d0e]'
              }`}
            >
              <span>🧪</span>
              <span>LINH DƯỢC & BẢO VẬT</span>
            </button>
          </div>

          {/* VŨ KHÍ ĐANG TRANG BỊ */}
          <div className="font-pixel text-[9px] text-amber-300 flex items-center gap-2">
            <span>VŨ KHÍ ĐANG CẦM:</span>
            {player.equippedWeaponId ? (
              <span className="bg-[#451a03] border border-[#d97706] text-[#fde047] px-2 py-0.5 font-bold">
                {shopItems.find((i) => i.id === player.equippedWeaponId)?.name || 'Vũ khí'}
              </span>
            ) : (
              <span className="text-slate-400 italic">Chưa trang bị (Tay không)</span>
            )}
            <span className="text-emerald-400 font-bold ml-2">ATK: {player.stats.attack}</span>
          </div>
        </div>

        {/* NỘI DUNG SHOP: GRID SẢN PHẨM & PANEL CHI TIẾT */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3">
          {/* CỘT TRÁI & GIỮA: DANH SÁCH VẬT PHẨM */}
          <div className="md:col-span-2 overflow-y-auto p-3 sm:p-4 space-y-2.5 custom-scrollbar bg-[#160d05]">
            {filteredItems.map((item) => {
              const owned = player.inventory.includes(item.id);
              const isEquipped = player.equippedWeaponId === item.id;
              const isSelected = selectedItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#f59e0b] bg-[#34180a]'
                      : 'border-[#78350f]/80 bg-[#221006] hover:border-[#b45309] hover:bg-[#2c1408]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-[#120803] border border-[#854d0e] flex items-center justify-center text-2xl shadow-[2px_2px_0_#000] shrink-0">
                      <span>{item.icon}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-pixel text-xs text-[#fef08a]">{item.name}</h4>
                        {isEquipped && (
                          <span className="bg-[#15803d] text-[#bbf7d0] font-pixel text-[7px] px-1 py-0.2 border border-[#4ade80]">
                            ĐANG DÙNG
                          </span>
                        )}
                        {owned && !isEquipped && (
                          <span className="bg-[#1e293b] text-slate-300 font-pixel text-[7px] px-1 py-0.2 border border-slate-600">
                            ĐÃ CÓ
                          </span>
                        )}
                      </div>

                      <div className="font-vt text-sm text-amber-200/70 mt-0.5">
                        {item.dynastyOrRegion}
                      </div>

                      {/* Chỉ số cộng */}
                      <div className="flex items-center gap-3 mt-1 font-pixel text-[8px]">
                        {item.statsBonus.attack && (
                          <span className="text-amber-400">+{item.statsBonus.attack} CÔNG (ATK)</span>
                        )}
                        {item.statsBonus.defense && (
                          <span className="text-cyan-400">+{item.statsBonus.defense} THỦ (DEF)</span>
                        )}
                        {item.statsBonus.hp && (
                          <span className="text-emerald-400">+{item.statsBonus.hp} MÁU (HP)</span>
                        )}
                        {item.statsBonus.expBonus && (
                          <span className="text-purple-400">+{item.statsBonus.expBonus}% EXP</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nút hành động trực tiếp */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {!owned ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuy(item);
                        }}
                        className="pixel-btn bg-[#b45309] hover:bg-[#d97706] text-[#fef08a] border-2 border-black px-3 py-1.5 font-pixel text-[9px] cursor-pointer shadow-[2px_2px_0_#000] flex items-center gap-1"
                      >
                        <span>🪙</span>
                        <span>{item.price} VÀNG</span>
                      </button>
                    ) : item.category === 'weapon' ? (
                      isEquipped ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnequipWeapon();
                          }}
                          className="pixel-btn bg-[#334155] hover:bg-[#475569] text-slate-200 border border-slate-600 px-3 py-1.5 font-pixel text-[8px] cursor-pointer"
                        >
                          THÁO GỠ
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquipWeapon(item.id);
                          }}
                          className="pixel-btn bg-[#15803d] hover:bg-[#16a34a] text-white border-2 border-black px-3 py-1.5 font-pixel text-[9px] cursor-pointer shadow-[2px_2px_0_#000] flex items-center gap-1"
                        >
                          <span>⚔️</span>
                          <span>TRANG BỊ</span>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuy(item);
                        }}
                        className="pixel-btn bg-[#0369a1] hover:bg-[#0284c7] text-white border border-cyan-400 px-2.5 py-1 font-pixel text-[8px] cursor-pointer"
                      >
                        MUA THÊM
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CỘT PHẢI: BẢNG CHI TIẾT & ĐIỂN TÍCH LỊCH SỬ (LORE) */}
          <div className="border-t md:border-t-0 md:border-l border-[#854d0e] bg-[#1a0f07] p-4 flex flex-col justify-between overflow-y-auto">
            {selectedItem ? (
              <div className="space-y-3">
                <div className="text-center pb-3 border-b border-[#854d0e]/60">
                  <div className="w-16 h-16 mx-auto bg-[#120803] border-2 border-[#f59e0b] flex items-center justify-center text-4xl shadow-[3px_3px_0_#000] mb-2">
                    <span>{selectedItem.icon}</span>
                  </div>
                  <h3 className="font-pixel text-sm text-[#fef08a]">{selectedItem.name}</h3>
                  <div className="font-pixel text-[9px] text-amber-400 mt-0.5">
                    {selectedItem.dynastyOrRegion}
                  </div>
                </div>

                {/* Mô tả */}
                <div>
                  <h5 className="font-pixel text-[9px] text-[#d4af37] mb-1">MÔ TẢ CHI TIẾT:</h5>
                  <p className="font-vt text-base text-slate-200 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Điển tích lịch sử hào hùng */}
                <div className="bg-[#120803] p-3 border border-[#854d0e]/50">
                  <h5 className="font-pixel text-[9px] text-amber-300 mb-1 flex items-center gap-1.5">
                    <span>📜</span>
                    <span>ĐIỂN TÍCH DÂN TỘC:</span>
                  </h5>
                  <p className="font-vt text-base text-amber-100/90 leading-relaxed italic">
                    "{selectedItem.lore}"
                  </p>
                </div>

                {/* Nút hành động */}
                <div className="pt-2">
                  {!player.inventory.includes(selectedItem.id) ? (
                    <button
                      onClick={() => handleBuy(selectedItem)}
                      className="w-full pixel-btn bg-[#b45309] hover:bg-[#d97706] text-[#fef08a] border-2 border-black py-2.5 font-pixel text-xs cursor-pointer shadow-[3px_3px_0_#000] flex items-center justify-center gap-2"
                    >
                      <span>🪙</span>
                      <span>MUA BẢO VẬT ({selectedItem.price} VÀNG)</span>
                    </button>
                  ) : selectedItem.category === 'weapon' ? (
                    player.equippedWeaponId === selectedItem.id ? (
                      <button
                        onClick={handleUnequipWeapon}
                        className="w-full pixel-btn bg-[#475569] hover:bg-[#64748b] text-white border-2 border-black py-2.5 font-pixel text-xs cursor-pointer"
                      >
                        THÁO VŨ KHÍ
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEquipWeapon(selectedItem.id)}
                        className="w-full pixel-btn bg-[#15803d] hover:bg-[#16a34a] text-white border-2 border-black py-2.5 font-pixel text-xs cursor-pointer shadow-[3px_3px_0_#000] flex items-center justify-center gap-2"
                      >
                        <span>⚔️</span>
                        <span>TRANG BỊ VŨ KHÍ NÀY</span>
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleBuy(selectedItem)}
                      className="w-full pixel-btn bg-[#0369a1] hover:bg-[#0284c7] text-white border-2 border-black py-2.5 font-pixel text-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>🧪</span>
                      <span>MUA THÊM ({selectedItem.price} VÀNG)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <span className="text-4xl mb-2 opacity-50">🗡️</span>
                <p className="font-pixel text-[10px] text-amber-200/70 mb-1">
                  CHỌN MỘT VŨ KHÍ HOẶC BẢO VẬT
                </p>
                <p className="font-vt text-sm text-slate-400">
                  Nhấp vào danh sách bên trái để đọc điển tích lịch sử và xem thông số chiến đấu.
                </p>
              </div>
            )}

            {/* Footer tips */}
            <div className="mt-4 pt-3 border-t border-[#854d0e]/40 text-center font-vt text-xs text-amber-200/50">
              💡 Mẹo: Trang bị Rìu Đồng, Bảo Kiếm hoặc Nỏ Thần sẽ tăng trực tiếp sát thương đòn đánh [J] trong trận chiến!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

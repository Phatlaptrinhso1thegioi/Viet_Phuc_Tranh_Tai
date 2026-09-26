import React, { useState } from 'react';
import { Gender, PlayerProfile } from '../types/game';
import { soundEngine } from '../utils/audio';
import { CharacterSpriteCanvas } from './CharacterSpriteCanvas';

interface CharacterCreateProps {
  onConfirm: (profile: Partial<PlayerProfile>) => void;
  onBack: () => void;
}

export const CharacterCreate: React.FC<CharacterCreateProps> = ({ onConfirm, onBack }) => {
  const [gender, setGender] = useState<Gender>('male');
  const [name, setName] = useState<string>('Trần Minh Quân');
  const [title, setTitle] = useState<string>('Nho Sĩ Áo Tấc Xanh');
  const [avatarId, setAvatarId] = useState<string>('scholar_blue');

  const characterClasses = [
    {
      id: 'scholar_blue',
      name: 'Nho Sĩ Áo Tấc Xanh',
      title: 'Trạng Nguyên Cầm Cuốn Thư',
      desc: 'Áo dài cổ đứng xanh lam, khăn đóng đen, tay cầm cuốn thư ngàn năm văn hiến, dáng vẻ nho nhã khoan thai.',
      role: 'Khai mở tri thức & Tinh thông cổ văn',
    },
    {
      id: 'general_armor',
      name: 'Tướng Quân Thiết Giáp',
      title: 'Đại Tướng Quân Phá Trận',
      desc: 'Mũ trụ chỏm lông đỏ kiêu hãnh, giáp vảy đồng kiên cố, cờ lệnh ngũ sắc & kiếm lệnh Đại Việt.',
      role: 'Đỡ đòn & Cận chiến uy lực',
    },
    {
      id: 'tuong_actor',
      name: 'Đại Thần Áo Giao Lĩnh',
      title: 'Hiền Sĩ Cố Đô Tuồng Cổ',
      desc: 'Mặt nạ tuồng hoa văn rực rỡ, áo choàng mây sóng gấm thêu ngũ sắc, đai ngọc & kiếm cong sắc bén.',
      role: 'Ma pháp & Trí tuệ cổ phong',
    },
    {
      id: 'archer_crossbow',
      name: 'Xạ Thủ Nỏ Liên Châu',
      title: 'Cung Thủ Chi Lăng Thần Tốc',
      desc: 'Nỏ thần An Dương Vương sau lưng, dải lụa đỏ phiêu dật tung bay trong gió, áo chẽn lính chiến xám xanh.',
      role: 'Xạ thủ tầm xa & Né tránh thần tốc',
    },
    {
      id: 'claw_warrior',
      name: 'Chiến Binh Móng Vuốt',
      title: 'Thích Khách Phi Đao Hoa Sen',
      desc: 'Tóc vuốt nhọn phong trần, giáp nẹp đinh đồng, bộ ba móng vuốt sắc lẹm & phi đao hoa sen lơ lửng.',
      role: 'Bạo kích cực đại & Tốc độ',
    },
    {
      id: 'rustic_villager',
      name: 'Dân Làng Áo Nâu Cổ',
      title: 'Hiền Sĩ Nông Làng Đại Việt',
      desc: 'Áo nâu sồng mộc mạc, khăn vấn xanh thẫm, đai lưng vải mộc, chân bước khoan thai trên sân gạch nhà cổ.',
      role: 'Hồi phục sinh lực & Am hiểu di sản',
    },
  ];

  const handleGenderChange = (newGender: Gender) => {
    soundEngine.playClick();
    setGender(newGender);
    if (newGender === 'male') {
      setName('Trần Minh Quân');
    } else {
      setName('Lê Ngọc Anh');
    }
  };

  const handleStart = () => {
    soundEngine.playLevelUp();
    onConfirm({
      gender,
      name: name.trim() || (gender === 'male' ? 'Trần Minh Quân' : 'Lê Ngọc Anh'),
      title,
      avatarId,
    });
  };

  const selectedClassData = characterClasses.find((c) => c.id === avatarId) || characterClasses[0];

  return (
    <div className="relative w-full h-full bg-[#0b0e14] text-[#f0e6d2] overflow-y-auto flex flex-col items-center justify-center p-3 sm:p-6 py-8">
      <div className="absolute inset-0 scanlines z-10 pointer-events-none" />

      <div className="relative z-20 w-full max-w-4xl bg-[#141a24] border-3 border-[#d4af37] p-5 sm:p-7 shadow-[8px_8px_0_#000]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 bg-[#221710] border border-[#d4af37] font-pixel text-[10px] sm:text-xs text-[#d4af37] mb-2">
            HỒ SƠ ANH HÙNG ĐẠI VIỆT • NGHỆ THUẬT PIXEL RETRO
          </div>
          <h1 className="font-pixel text-lg sm:text-2xl text-[#d4af37] drop-shadow-[0_2px_4px_#000]">
            THIẾT LẬP HÌNH TƯỢNG NHÂN VẬT
          </h1>
          <p className="font-vt text-lg sm:text-xl text-slate-300 mt-1">
            Chọn giới tính và 1 trong 4 hình mẫu tướng sĩ xuất chúng (chuẩn phong cách @george_ttowers)
          </p>
        </div>

        {/* 1. Gender Selection */}
        <div className="mb-5">
          <label className="block font-pixel text-xs text-[#d4af37] mb-2.5">
            1. CHỌN GIỚI TÍNH:
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleGenderChange('male')}
              className={`p-3 border-3 text-center cursor-pointer transition-all flex items-center justify-center gap-3 ${
                gender === 'male'
                  ? 'border-[#d4af37] bg-[#1d2638] shadow-[4px_4px_0_#d4af37]'
                  : 'border-slate-700 bg-[#0e131b] hover:border-slate-500 shadow-[3px_3px_0_#000]'
              }`}
            >
              <div className="text-3xl filter drop-shadow">🧑</div>
              <div className="text-left">
                <div className="font-pixel text-xs sm:text-sm text-cyan-300">NAM (TRÁNG SĨ)</div>
                <div className="text-xs text-slate-400 font-vt text-base">Hào khí ngút trời</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleGenderChange('female')}
              className={`p-3 border-3 text-center cursor-pointer transition-all flex items-center justify-center gap-3 ${
                gender === 'female'
                  ? 'border-[#d4af37] bg-[#331d27] shadow-[4px_4px_0_#d4af37]'
                  : 'border-slate-700 bg-[#0e131b] hover:border-slate-500 shadow-[3px_3px_0_#000]'
              }`}
            >
              <div className="text-3xl filter drop-shadow">👩</div>
              <div className="text-left">
                <div className="font-pixel text-xs sm:text-sm text-pink-300">NỮ (NỮ HIỆP)</div>
                <div className="text-xs text-slate-400 font-vt text-base">Anh thư dũng liệt</div>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Name input */}
        <div className="mb-6">
          <label className="block font-pixel text-xs text-[#d4af37] mb-2">
            2. TÊN DANH XƯNG NHÂN VẬT:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={26}
            className="w-full bg-[#0a0d13] border-2 border-slate-600 focus:border-[#d4af37] px-4 py-2 font-pixel text-xs sm:text-sm text-[#f0e6d2] outline-none"
            placeholder="Nhập tên nhân vật..."
          />
        </div>

        {/* 3. 4 Character Classes (Visual Pixel Art Selection) */}
        <div className="mb-6">
          <label className="block font-pixel text-xs text-[#d4af37] mb-2.5">
            3. CHỌN 1 TRONG 4 HÌNH MẪU NHÂN VẬT PIXEL (@GEORGE_TTOWERS):
          </label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {characterClasses.map((cls) => {
              const isSelected = avatarId === cls.id;
              return (
                <div
                  key={cls.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setAvatarId(cls.id);
                    setTitle(cls.name);
                  }}
                  className={`p-2.5 border-3 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? 'border-[#d4af37] bg-[#1d2638] shadow-[4px_4px_0_#d4af37] scale-102'
                      : 'border-slate-700 bg-[#0e131b] hover:border-slate-500'
                  }`}
                >
                  {/* Sprite Preview Canvas */}
                  <div className="relative w-full h-32 flex items-center justify-center bg-black/40 border border-slate-800 mb-2 overflow-hidden">
                    <CharacterSpriteCanvas
                      characterClass={cls.id as any}
                      gender={gender}
                      scale={1.05}
                      facing="right"
                      action="idle"
                      width={110}
                      height={130}
                    />
                  </div>

                  <div className="w-full">
                    <div className="font-pixel text-[10px] sm:text-[11px] text-[#fbe282] mb-1 leading-tight line-clamp-1">
                      {cls.name}
                    </div>
                    <div className="font-vt text-emerald-400 text-sm leading-none">
                      {cls.role}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Class Highlight Details */}
          <div className="mt-4 p-3 bg-[#0a1017] border border-[#d4af37]/60 flex items-start gap-4">
            <div className="hidden sm:block shrink-0 border border-slate-700 bg-black/50 p-1">
              <CharacterSpriteCanvas
                characterClass={selectedClassData.id as any}
                gender={gender}
                scale={1.2}
                facing="right"
                action="walk"
                width={80}
                height={100}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 font-pixel text-xs text-[#d4af37] mb-1">
                <span>⭐</span>
                <span>{selectedClassData.title}</span>
              </div>
              <p className="font-vt text-lg text-slate-200 leading-relaxed">
                {selectedClassData.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto pixel-btn bg-[#18202c] hover:bg-[#232f40] border-2 border-slate-500 text-slate-300 px-5 py-3 text-xs cursor-pointer"
          >
            QUAY LẠI MENU
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="w-full sm:w-auto pixel-btn bg-[#d13426] hover:bg-[#e04535] text-white border-2 border-black px-7 py-3 text-xs cursor-pointer font-pixel shadow-[4px_4px_0_#000] flex items-center justify-center gap-2"
          >
            <span>BẮT ĐẦU DU HÀNH CHỮ S</span>
            <span>▶</span>
          </button>
        </div>
      </div>
    </div>
  );
};

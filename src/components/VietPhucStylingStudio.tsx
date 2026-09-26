import React, { useState, useRef } from 'react';
import { PlayerProfile, VietPhucItem, Gender } from '../types/game';
import { INITIAL_VIET_PHUC_ITEMS } from '../data/gameData';
import { soundEngine } from '../utils/audio';
import { CharacterRenderer } from '../engine/CharacterRenderer';

interface VietPhucStylingStudioProps {
  player: PlayerProfile;
  onEquipItem: (item: VietPhucItem) => void;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  onClose: () => void;
  toast: (msg: string) => void;
}

// Bối cảnh sự kiện văn hóa chi tiết theo yêu cầu đề bài
export interface CulturalOccasion {
  id: string;
  name: string;
  badge: string;
  season: string;
  weather: string;
  userNeed: string; // Nhu cầu người dùng (học sinh, sinh viên, lễ cưới, du xuân...)
  description: string;
  idealCostumes: string[];
  idealHats: string[];
  idealAccessories: string[];
  recommendedFiveElements: 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';
  inappropriateCombos: { costumeId: string; hatId?: string; accessoryId?: string; reason: string }[];
}

export const CULTURAL_OCCASIONS: CulturalOccasion[] = [
  {
    id: 'hoc_sinh_ky_yeu',
    name: 'Chụp Ảnh Kỷ Yếu & Lễ Tốt Nghiệp Văn Miếu',
    badge: '🎓 KỶ YẾU TRI THỨC TRẺ',
    season: 'Tháng 4 - 5 & Tháng 10 - 11',
    weather: 'Trời thu mát mẻ, nắng nhẹ văn miếu',
    userNeed: 'Học sinh, sinh viên chụp ảnh lưu niệm thời đi học tôn nghiêm, thanh xuân và lịch thiệp.',
    description: 'Không gian Văn Miếu - Quốc Tử Giám và sân trường rợp bóng phượng vĩ. Y phục tôn vinh tinh thần hiếu học, thanh lịch của thế hệ trẻ.',
    idealCostumes: ['ao_ngu_than', 'ao_tu_than', 'ao_giao_linh'],
    idealHats: ['non_la', 'non_bai_tho'],
    idealAccessories: ['acc_quat_lua', 'acc_tui_gam', 'acc_kieng_bac'],
    recommendedFiveElements: 'moc',
    inappropriateCombos: [
      {
        costumeId: 'giap_tru_dai_viet',
        reason: 'Chiến giáp sa trường không phù hợp với chốn Văn Miếu Quốc Tử Giám tôn nghiêm thờ hiền tài và các bậc tiên nho.',
      },
      {
        costumeId: 'hoang_bao_long_van',
        reason: 'Hoàng Bào Long Vân chỉ dành cho bậc chí tôn đế vương ngày xưa, học sinh sinh viên mặc sẽ tạo cảm giác xa rời bối cảnh giáo dục.',
      },
    ],
  },
  {
    id: 'tet_nguyen_dan',
    name: 'Tết Nguyên Đán & Du Xuân Chúc Thọ',
    badge: '🧧 ĐẦU NĂM MỚI HOAN HỶ',
    season: 'Mùa Xuân (Tháng Giêng âm lịch)',
    weather: 'Gió xuân se lạnh, lất phất mưa phùn ấm áp',
    userNeed: 'Người trẻ dạo chợ hoa xuân, lễ chùa cầu may, mừng tuổi ông bà cha mẹ.',
    description: 'Không khí đoàn viên tết cổ truyền, đào mai khoe sắc. Cổ phục mang sắc màu tươi sáng cầu chúc thịnh vượng, an khang.',
    idealCostumes: ['ao_nhat_binh', 'ao_ngu_than', 'ao_tu_than', 'ao_vien_linh'],
    idealHats: ['non_la', 'non_bai_tho', 'non_quai_thao'],
    idealAccessories: ['acc_kieng_bac', 'acc_quat_lua', 'acc_tram_cai', 'acc_tui_gam'],
    recommendedFiveElements: 'hoa',
    inappropriateCombos: [
      {
        costumeId: 'giap_tru_dai_viet',
        reason: 'Áo giáp sắt mang sát khí binh đao đối lập với tinh thần an lành, hỷ lạc ngày Tết đầu năm.',
      },
    ],
  },
  {
    id: 'dam_cuoi_truyen_thong',
    name: 'Lễ Cưới Cổ Truyền / Lễ Ăn Hỏi',
    badge: '💒 HỶ SỰ TRĂM NĂM',
    season: 'Quanh năm (Mùa cưới thu đông)',
    weather: 'Trang trọng ấm cúng hai họ',
    userNeed: 'Cô dâu chú rể và quan khách cử hành nghi thức kết duyên truyền thống đoan trang.',
    description: 'Nghi thức dâng trầu cau kết tóc se duyên, dâng hương gia tiên. Cổ phục Nhật Bình thêu hoa văn ngũ hành và áo ngũ thân tay chẽn.',
    idealCostumes: ['ao_nhat_binh', 'ao_ngu_than', 'ao_giao_linh'],
    idealHats: ['non_bai_tho', 'non_quai_thao'],
    idealAccessories: ['acc_kieng_bac', 'acc_tram_cai', 'acc_chuoi_ngoc'],
    recommendedFiveElements: 'hoa',
    inappropriateCombos: [
      {
        costumeId: 'ao_ba_ba',
        reason: 'Áo bà ba là y phục mộc mạc đời thường lao động, lễ cưới cổ truyền đòi hỏi sự trang trọng của Áo Nhật Bình hoặc Áo Ngũ Thân.',
      },
      {
        costumeId: 'giap_tru_dai_viet',
        reason: 'Chiến bào giáp sắt không thể dùng làm y phục đại hỷ của hôn lễ người Việt.',
      },
    ],
  },
  {
    id: 'hoi_lim_kinh_bac',
    name: 'Hội Lim & Lễ Hội Dân Ca Quan Họ',
    badge: '🌸 GIAO DUYÊN KINH BẮC',
    season: 'Tháng Giêng âm lịch (Xuân Bắc Bộ)',
    weather: 'Nắng xuân ấm, gió sông mát mẻ',
    userNeed: 'Khám phá văn hóa ca trù, hát đối đáp quan họ trên thuyền rồng hồ làng.',
    description: 'Không gian văn hóa Kinh Bắc trứ danh. Liền anh áo ngũ thân khăn đóng, liền chị áo tứ thân yếm đào nón quai thao trao cơi trầu têm cánh phượng.',
    idealCostumes: ['ao_tu_than', 'ao_ngu_than', 'ao_giao_linh'],
    idealHats: ['non_quai_thao', 'non_la'],
    idealAccessories: ['acc_quat_lua', 'acc_tui_gam', 'acc_guoc_moc'],
    recommendedFiveElements: 'moc',
    inappropriateCombos: [
      {
        costumeId: 'tho_cam_tay_nguyen',
        reason: 'Thổ cẩm đại ngàn gắn với không gian sử thi Tây Nguyên, không hòa nhập với không gian Dân ca Quan họ trữ tình Kinh Bắc.',
      },
      {
        costumeId: 'ao_ba_ba',
        hatId: 'non_quai_thao',
        reason: 'Áo bà ba Nam Bộ phối cùng nón quai thao Kinh Bắc gây sai lệch đặc trưng văn hóa hai vùng miền.',
      },
    ],
  },
  {
    id: 'cung_dinh_festival',
    name: 'Dạ Tiệc Cung Đình Festival Huế',
    badge: '👑 HOÀNG CUNG CỐ ĐÔ',
    season: 'Mùa hè Festival di sản',
    weather: 'Đêm hoàng cung gió sông Hương mát rượi',
    userNeed: 'Thưởng thức Nhã Nhạc Cung Đình, dự tiệc yến di sản hoàng triều.',
    description: 'Lầu son gác tía Ngọ Môn Đại Nội, tái hiện cảnh triều nghi uy nghi của triều Nguyễn thế kỷ 19.',
    idealCostumes: ['ao_nhat_binh', 'hoang_bao_long_van', 'ao_vien_linh', 'ao_ngu_than'],
    idealHats: ['non_bai_tho'],
    idealAccessories: ['acc_kieng_bac', 'acc_chuoi_ngoc', 'acc_tram_cai'],
    recommendedFiveElements: 'kim',
    inappropriateCombos: [
      {
        costumeId: 'ao_ba_ba',
        reason: 'Áo bà ba mộc mạc Nam Bộ không phù hợp với các điển lễ nghi thức cung đình chốn cung khuyết.',
      },
      {
        costumeId: 'tho_cam_tay_nguyen',
        reason: 'Y phục thổ cẩm không thuộc hệ thống quy chế phẩm phục triều đình nhà Nguyễn.',
      },
    ],
  },
  {
    id: 'dao_pho_mua_thu',
    name: 'Dạo Phố Thu Hà Nội & Thưởng Trà Sen',
    badge: '🍂 THƠ MỘNG HOÀNG THÀNH',
    season: 'Mùa thu Hà Nội (Tháng 9 - 11)',
    weather: 'Gió heo may se lạnh, hương hoa sữa nồng nàn',
    userNeed: 'Tản bộ hồ Gươm, chụp ảnh check-in cổ phong phố cổ, thưởng trà sen thanh tao.',
    description: 'Phong cách dạo phố thanh lịch, kết hợp nét đẹp truyền thống của Áo dài / Ngũ thân cách tân nhẹ nhàng, vừa tôn trọng văn hóa vừa trẻ trung.',
    idealCostumes: ['ao_ngu_than', 'ao_tu_than', 'ao_giao_linh'],
    idealHats: ['non_la', 'non_bai_tho'],
    idealAccessories: ['acc_quat_lua', 'acc_guoc_moc', 'acc_tui_gam'],
    recommendedFiveElements: 'thuy',
    inappropriateCombos: [
      {
        costumeId: 'hoang_bao_long_van',
        reason: 'Hoàng Bào Long Vân là phẩm phục chí tôn ngày xưa, mặc đi dạo phố đời thường sẽ lạc lõng và làm giảm tính trang trọng.',
      },
    ],
  },
  {
    id: 'cho_noi_song_nuoc',
    name: 'Chợ Nổi Miệt Vườn Đồng Bằng Sông Cửu Long',
    badge: '🛶 PHÙ SA HÀO SẢNG',
    season: 'Quanh năm nắng ấm phương Nam',
    weather: 'Nắng ấm chan hòa, gió sông lồng lộng',
    userNeed: 'Trải nghiệm du lịch sông nước, chèo ghe ngắm chợ nổi Cái Răng, hái trái cây miệt vườn.',
    description: 'Vùng sông nước mênh mông bến phà rợp bóng dừa nước. Y phục áo bà ba đen hoặc màu đất mộc mạc, nhẹ mát, dễ vận động bơi xuồng.',
    idealCostumes: ['ao_ba_ba'],
    idealHats: ['non_la'],
    idealAccessories: ['acc_guoc_moc', 'acc_tui_gam'],
    recommendedFiveElements: 'tho',
    inappropriateCombos: [
      {
        costumeId: 'ao_nhat_binh',
        reason: 'Áo Nhật Bình gấm vóc tay thụng nhiều tầng lộng lẫy sẽ bị vướng víu, ướt nước và hư hại khi đi ghe xuồng chợ nổi.',
      },
      {
        costumeId: 'hoang_bao_long_van',
        reason: 'Hoàng Bào Long Vân không hề tương thích với không gian sinh hoạt mộc mạc của sông nước miền Tây.',
      },
      {
        costumeId: 'ao_tu_than',
        hatId: 'non_quai_thao',
        reason: 'Nón quai thao cồng kềnh khó giữ thăng bằng khi gặp gió lớn trên sông nước Nam Bộ.',
      },
    ],
  },
];

// Phụ kiện truyền thống phong phú
export interface TraditionalAccessory {
  id: string;
  name: string;
  icon: string;
  categoryName: string;
  lore: string;
  element: 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';
  elementName: string;
}

export const TRADITIONAL_ACCESSORIES: TraditionalAccessory[] = [
  {
    id: 'acc_kieng_bac',
    name: 'Kiềng Bạc Chạm Hoa Sen Cổ',
    icon: '⭕',
    categoryName: 'Trang sức cổ',
    lore: 'Chiếc kiềng bạc sáng bóng chạm nổi hoa sen hoặc dây lá cách điệu, tôn nét thanh tú quý phái của phụ nữ Việt Nam.',
    element: 'kim',
    elementName: 'Hành Kim (Thanh khiết)',
  },
  {
    id: 'acc_quat_lua',
    name: 'Quạt Lụa Thêu Sen Bách Diệp',
    icon: '🪭',
    categoryName: 'Phụ kiện cầm tay',
    lore: 'Nan tre vót chuốt mảnh dẻ, mặt quạt lụa tơ tằm Hà Đông thêu hoa sen Tây Hồ, mang phong thái tao nhã e ấp.',
    element: 'moc',
    elementName: 'Hành Mộc (Thư thái)',
  },
  {
    id: 'acc_tram_cai',
    name: 'Trâm Cài Tóc Ngọc Bích',
    icon: '🗡️',
    categoryName: 'Trang sức cài tóc',
    lore: 'Trâm bạc cẩn ngọc xanh biếc cài sau búi tóc trần đoan trang, vật đính ước son sắt trong thi ca cổ điển.',
    element: 'thuy',
    elementName: 'Hành Thủy (Nhu hòa)',
  },
  {
    id: 'acc_tui_gam',
    name: 'Túi Gấm Thêu Cánh Phượng',
    icon: '👛',
    categoryName: 'Túi đeo thắt lưng',
    lore: 'Túi thơm gấm điều đựng xạ hương hoặc đồng tiền may mắn, thắt ngang dải lụa thắt lưng cổ phục.',
    element: 'hoa',
    elementName: 'Hành Hỏa (Hỷ khí)',
  },
  {
    id: 'acc_guoc_moc',
    name: 'Guốc Mộc Quai Gấm Thêu',
    icon: '👡',
    categoryName: 'Hài guốc truyền thống',
    lore: 'Đẽo từ gỗ mít hoặc gỗ dừa già, đế sơn son, quai bằng gấm thêu ngũ sắc, gõ nhịp lách cách mộc mạc trên ngõ gạch.',
    element: 'tho',
    elementName: 'Hành Thổ (Vững bền)',
  },
  {
    id: 'acc_chuoi_ngoc',
    name: 'Chuỗi Ngọc Bội Hoàng Cung',
    icon: '📿',
    categoryName: 'Phẩm vật quý tộc',
    lore: 'Chuỗi ngọc bội đeo bên vạt áo ngũ thân hay Nhật Bình, bước đi phát ra tiếng ngọc reo thanh tao phong thái vương giả.',
    element: 'kim',
    elementName: 'Hành Kim (Quyền quý)',
  },
];

export const VietPhucStylingStudio: React.FC<VietPhucStylingStudioProps> = ({
  player,
  onEquipItem,
  onUpdatePlayer,
  onClose,
  toast,
}) => {
  // Bối cảnh sự kiện được chọn
  const [selectedOccasion, setSelectedOccasion] = useState<CulturalOccasion>(CULTURAL_OCCASIONS[0]);

  // Bộ phối Look A (Chính)
  const [selectedCostumeId, setSelectedCostumeId] = useState<string>(
    player.equippedCostumeId || 'ao_tu_than'
  );
  const [selectedHatId, setSelectedHatId] = useState<string>(
    player.equippedHatId || 'non_la'
  );
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string>('acc_kieng_bac');
  const [avatarClass, setAvatarClass] = useState<string>(player.avatarId || 'general_armor');
  const [gender, setGender] = useState<Gender>(player.gender);

  // Chế độ so sánh A / B
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [lookBCostumeId, setLookBCostumeId] = useState<string>('ao_ngu_than');
  const [lookBHatId, setLookBHatId] = useState<string>('non_bai_tho');
  const [lookBAccessoryId, setLookBAccessoryId] = useState<string>('acc_quat_lua');

  // Thẻ Lookbook đã lưu
  const [savedLookbooks, setSavedLookbooks] = useState<
    {
      id: string;
      title: string;
      costumeName: string;
      hatName: string;
      accessoryName: string;
      occasionName: string;
      score: number;
      elementName: string;
      dateStr: string;
    }[]
  >([]);

  // Xem chi tiết thẻ lookbook phóng to để chia sẻ
  const [previewLookbook, setPreviewLookbook] = useState<any | null>(null);

  // Lấy dữ liệu item
  const allCostumes = INITIAL_VIET_PHUC_ITEMS.filter((i) => i.category === 'costume');
  const allHats = INITIAL_VIET_PHUC_ITEMS.filter((i) => i.category === 'hat');

  const currentCostume = allCostumes.find((c) => c.id === selectedCostumeId) || allCostumes[0];
  const currentHat = allHats.find((h) => h.id === selectedHatId) || allHats[0];
  const currentAccessory = TRADITIONAL_ACCESSORIES.find((a) => a.id === selectedAccessoryId) || TRADITIONAL_ACCESSORIES[0];

  const lookBCostume = allCostumes.find((c) => c.id === lookBCostumeId) || allCostumes[1];
  const lookBHat = allHats.find((h) => h.id === lookBHatId) || allHats[1];
  const lookBAccessory = TRADITIONAL_ACCESSORIES.find((a) => a.id === lookBAccessoryId) || TRADITIONAL_ACCESSORIES[1];

  // =========================================================================
  // BỘ ĐÁNH GIÁ CHUẨN MỰC VĂN HÓA & NGŨ HÀNH HÀI HÒA (CULTURAL GUARDIAN ENGINE)
  // =========================================================================
  const evaluateHarmony = (costumeId: string, hatId: string, accessoryId: string) => {
    const costume = allCostumes.find((c) => c.id === costumeId) || allCostumes[0];
    const hat = allHats.find((h) => h.id === hatId) || allHats[0];
    const acc = TRADITIONAL_ACCESSORIES.find((a) => a.id === accessoryId) || TRADITIONAL_ACCESSORIES[0];

    // 1. Kiểm tra cảnh báo phối đồ sai lệch văn hóa
    for (const badCombo of selectedOccasion.inappropriateCombos) {
      if (badCombo.costumeId === costumeId) {
        if (!badCombo.hatId || badCombo.hatId === hatId) {
          return {
            status: 'warning' as const,
            score: 40,
            title: '⚠️ CẢNH BÁO: SAI LỆCH ĐẶC TRƯNG VĂN HÓA',
            message: badCombo.reason,
            advice: 'Lời khuyên văn hóa: Hãy đổi sang bộ trang phục phù hợp với lễ nghi và bối cảnh để tôn vinh giá trị cội nguồn.',
            color: '#ef4444',
            bg: '#450a0a',
          };
        }
      }
    }

    // 2. Kiểm tra tính lý tưởng
    const isIdealCostume = selectedOccasion.idealCostumes.includes(costumeId);
    const isIdealHat = selectedOccasion.idealHats.includes(hatId);
    const isIdealAcc = selectedOccasion.idealAccessories.includes(accessoryId);

    let score = 65;
    if (isIdealCostume) score += 20;
    if (isIdealHat) score += 10;
    if (isIdealAcc) score += 5;

    // Ngũ hành tương sinh
    const isElementMatch = acc.element === selectedOccasion.recommendedFiveElements;
    if (isElementMatch) score = Math.min(100, score + 5);

    if (score >= 95) {
      return {
        status: 'perfect' as const,
        score,
        title: '⭐ TUYỆT PHẨM: ĐÚNG CHUẨN QUY CHẾ & TÔN TRỌNG NGUYÊN BẢN',
        message: `Bộ phối ${costume.name} cùng ${hat.name} và ${acc.name} đạt điểm tối đa! Tinh tế, vừa giữ trọn đạo lý thuần phong mỹ tục vừa toát lên phong thái tao nhã của người Việt.`,
        advice: 'Bộ đồ này hoàn hảo để chụp kỷ yếu, du xuân hoặc tham dự các sự kiện văn hóa lớn của thanh niên.',
        color: '#10b981',
        bg: '#064e3b',
      };
    } else if (score >= 80) {
      return {
        status: 'good' as const,
        score,
        title: '✨ PHỐI ĐỒ HÀI HÒA & ĐẸP MẮT',
        message: `${costume.name} rất hòa hợp với ${selectedOccasion.name}. Bạn có thể thay đổi thêm nón hoặc phụ kiện chuẩn miền để nâng điểm lên mức tuyệt hảo.`,
        advice: 'Cách phối thanh lịch, dễ tiếp cận và được giới trẻ hoan nghênh.',
        color: '#f59e0b',
        bg: '#451a03',
      };
    }

    return {
      status: 'neutral' as const,
      score,
      title: '🌿 BIẾN TẤU PHÁ CÁCH CÁ NHÂN',
      message: `Một sự kết hợp mới mẻ, tuy nhiên cần chú ý đến hoàn cảnh sử dụng và quy tắc lễ giáo của từng triều đại xưa.`,
      advice: 'Hãy thử phối theo các gợi ý bên dưới để đạt độ hòa sắc cao hơn.',
      color: '#38bdf8',
      bg: '#0c2a47',
    };
  };

  const harmonyResultA = evaluateHarmony(selectedCostumeId, selectedHatId, selectedAccessoryId);
  const harmonyResultB = evaluateHarmony(lookBCostumeId, lookBHatId, lookBAccessoryId);

  // Áp dụng trang phục đang phối vào nhân vật chính
  const handleApplyToCharacter = () => {
    soundEngine.playLevelUp();
    if (currentCostume) onEquipItem(currentCostume);
    if (currentHat) onEquipItem(currentHat);

    onUpdatePlayer({
      ...player,
      equippedCostumeId: selectedCostumeId,
      equippedHatId: selectedHatId,
      avatarId: avatarClass,
      gender: gender,
    });

    toast(`👘 Đã diện bộ phối [${currentCostume.name} + ${currentHat.name}] vào nhân vật game!`);
  };

  // Tạo và lưu thẻ Lookbook Việt Phục
  const handleSaveLookbook = () => {
    soundEngine.playLevelUp();
    const newLookbook = {
      id: `lb_${Date.now()}`,
      title: `Lookbook ${selectedOccasion.name}`,
      costumeName: currentCostume.name,
      hatName: currentHat.name,
      accessoryName: currentAccessory.name,
      occasionName: selectedOccasion.name,
      score: harmonyResultA.score,
      elementName: currentAccessory.elementName,
      dateStr: new Date().toLocaleDateString('vi-VN'),
    };
    setSavedLookbooks((prev) => [newLookbook, ...prev]);
    toast(`📸 Đã tạo & lưu thẻ "Lookbook Việt Phục"! Điểm chuẩn mực: ${harmonyResultA.score}/100.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Khung giao diện Studio */}
      <div className="relative w-full max-w-6xl h-[94vh] max-h-[820px] bg-[#0c121d] border-3 border-[#d4af37] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.95),8px_8px_0_#000] overflow-hidden">
        {/* Hoa văn hoàng gia 4 góc */}
        <div className="absolute top-1 left-2 text-[#d4af37] font-pixel text-xs opacity-75">✦ ╔════</div>
        <div className="absolute top-1 right-2 text-[#d4af37] font-pixel text-xs opacity-75">════╗ ✦</div>
        <div className="absolute bottom-1 left-2 text-[#d4af37] font-pixel text-xs opacity-75">✦ ╚════</div>
        <div className="absolute bottom-1 right-2 text-[#d4af37] font-pixel text-xs opacity-75">════╝ ✦</div>

        {/* HEADER: TIÊU ĐỀ & CHỨC NĂNG NHANH */}
        <div className="relative z-10 bg-gradient-to-r from-[#172132] via-[#202e45] to-[#172132] border-b-2 border-[#d4af37] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0c131f] border-2 border-[#f59e0b] flex items-center justify-center text-3xl shadow-[3px_3px_0_#000]">
              <span>👘</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-pixel text-xs sm:text-sm text-[#fbe282] tracking-wider">
                  PHÒNG PHỐI ĐỒ CỔ PHỤC & LOOKBOOK VIỆT TRUYỀN THỐNG
                </h2>
                <span className="bg-[#15803d] text-[#bbf7d0] font-pixel text-[8px] px-1.5 py-0.5 border border-[#4ade80]">
                  DI SẢN TRẺ 2026
                </span>
              </div>
              <p className="font-vt text-sm sm:text-base text-amber-200/80">
                Khám phá, thử nghiệm & phối trang phục truyền thống Việt Nam theo sự kiện, địa phương và phong cách cá nhân
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Nút bật/tắt So Sánh A/B */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setCompareMode(!compareMode);
              }}
              className={`pixel-btn px-3 py-1.5 font-pixel text-[9px] border-2 border-black cursor-pointer shadow-[2px_2px_0_#000] flex items-center gap-1.5 ${
                compareMode ? 'bg-[#3b82f6] text-white' : 'bg-[#1e293b] text-slate-300'
              }`}
            >
              <span>⚖️</span>
              <span>{compareMode ? 'ĐANG SO SÁNH A/B' : 'BẬT SO SÁNH A/B'}</span>
            </button>

            {/* Mặc vào Game */}
            <button
              onClick={handleApplyToCharacter}
              className="pixel-btn bg-[#15803d] hover:bg-[#16a34a] text-white border-2 border-black px-3.5 py-1.5 font-pixel text-[10px] cursor-pointer shadow-[2px_2px_0_#000] flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>MẶC VÀO GAME</span>
            </button>

            {/* Đóng */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="pixel-btn bg-[#7f1d1d] hover:bg-[#991b1b] text-white border-2 border-black w-9 h-9 flex items-center justify-center font-pixel text-xs cursor-pointer shadow-[2px_2px_0_#000]"
              title="Đóng phòng thử đồ"
            >
              ✕
            </button>
          </div>
        </div>

        {/* NỘI DUNG CHÍNH: 3 CỘT (TÙY CHỌN BỐI CẢNH & PHỤ KIỆN) - (MOCKUP CANVAS AVATAR) - (CỐ VẤN VĂN HÓA & LOOKBOOK) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* CỘT 1 (4 CỘT): CHỌN BỐI CẢNH VĂN HÓA, TRANG PHỤC & PHỤ KIỆN */}
          <div className="lg:col-span-4 p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-slate-700 bg-[#0f1624] overflow-y-auto space-y-4 custom-scrollbar">
            {/* 1. CHỌN SỰ KIỆN / HOÀN CẢNH SỬ DỤNG */}
            <div>
              <label className="font-pixel text-[10px] text-[#fbe282] block mb-1.5 flex items-center gap-1.5">
                <span>🏮</span>
                <span>1. HOÀN CẢNH & NHU CẦU SỬ DỤNG:</span>
              </label>
              <div className="space-y-1.5">
                {CULTURAL_OCCASIONS.map((occ) => {
                  const isSelected = occ.id === selectedOccasion.id;
                  return (
                    <div
                      key={occ.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedOccasion(occ);
                      }}
                      className={`p-2 border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#f59e0b] bg-[#1e2c44] shadow-[2px_2px_0_#d4af37]'
                          : 'border-slate-800 bg-[#0d131f] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-pixel text-[9px] text-[#fef08a]">{occ.name}</span>
                        <span className="font-pixel text-[7px] bg-[#291307] text-amber-300 px-1 border border-amber-800">
                          {occ.badge}
                        </span>
                      </div>
                      <div className="font-vt text-xs text-cyan-300 mt-0.5">
                        {occ.weather} • {occ.season}
                      </div>
                      <div className="font-vt text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        🎯 {occ.userNeed}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. CHỌN CỔ PHỤC CHÍNH (ÁO DÀI, NGŨ THÂN, TỨ THÂN, NHẬT BÌNH...) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-pixel text-[10px] text-amber-300 flex items-center gap-1.5">
                  <span>👘</span>
                  <span>2. CHỌN CỔ PHỤC CHÍNH:</span>
                </label>
                <span className="font-pixel text-[8px] text-slate-400">
                  {allCostumes.length} Mẫu
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {allCostumes.map((costume) => {
                  const isSelectedA = costume.id === selectedCostumeId;
                  const isSelectedB = costume.id === lookBCostumeId;
                  return (
                    <button
                      key={costume.id}
                      onClick={() => {
                        soundEngine.playClick();
                        if (compareMode) {
                          setLookBCostumeId(costume.id);
                        } else {
                          setSelectedCostumeId(costume.id);
                        }
                      }}
                      className={`p-2 border text-left cursor-pointer transition-all relative ${
                        isSelectedA
                          ? 'border-[#f59e0b] bg-[#263752]'
                          : isSelectedB && compareMode
                          ? 'border-blue-400 bg-[#162744]'
                          : 'border-slate-800 bg-[#0c121d] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl mb-1">{costume.icon}</span>
                        {isSelectedA && (
                          <span className="bg-amber-500 text-black font-pixel text-[7px] px-1">
                            LOOK A
                          </span>
                        )}
                        {isSelectedB && compareMode && (
                          <span className="bg-blue-500 text-white font-pixel text-[7px] px-1">
                            LOOK B
                          </span>
                        )}
                      </div>
                      <div className="font-pixel text-[8px] text-white truncate">{costume.name}</div>
                      <div className="font-vt text-[11px] text-slate-400 truncate">{costume.dynastyOrRegion}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. CHỌN MŨ / NÓN / KHĂN ĐÓNG */}
            <div>
              <label className="font-pixel text-[10px] text-cyan-300 block mb-1.5 flex items-center gap-1.5">
                <span>👒</span>
                <span>3. CHỌN NÓN / KHĂN ĐÓNG / MŨ CỔ:</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {allHats.map((hat) => {
                  const isSelectedA = hat.id === selectedHatId;
                  const isSelectedB = hat.id === lookBHatId;
                  return (
                    <button
                      key={hat.id}
                      onClick={() => {
                        soundEngine.playClick();
                        if (compareMode) {
                          setLookBHatId(hat.id);
                        } else {
                          setSelectedHatId(hat.id);
                        }
                      }}
                      className={`p-1.5 border text-center cursor-pointer transition-all relative ${
                        isSelectedA
                          ? 'border-cyan-400 bg-[#162e4a]'
                          : isSelectedB && compareMode
                          ? 'border-blue-400 bg-[#14233c]'
                          : 'border-slate-800 bg-[#0c121d] hover:border-slate-600'
                      }`}
                    >
                      <div className="text-lg">{hat.icon}</div>
                      <div className="font-pixel text-[7px] text-slate-200 truncate mt-0.5">{hat.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. CHỌN PHỤ KIỆN TRUYỀN THỐNG (KIỀNG BẠC, QUẠT LỤA, GUỐC MỘC...) */}
            <div>
              <label className="font-pixel text-[10px] text-emerald-300 block mb-1.5 flex items-center gap-1.5">
                <span>⭕</span>
                <span>4. PHỤ KIỆN VĂN HÓA & NGŨ HÀNH:</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {TRADITIONAL_ACCESSORIES.map((acc) => {
                  const isSelectedA = acc.id === selectedAccessoryId;
                  const isSelectedB = acc.id === lookBAccessoryId;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => {
                        soundEngine.playClick();
                        if (compareMode) {
                          setLookBAccessoryId(acc.id);
                        } else {
                          setSelectedAccessoryId(acc.id);
                        }
                      }}
                      className={`p-1.5 border text-left cursor-pointer transition-all ${
                        isSelectedA
                          ? 'border-emerald-400 bg-[#0e3024]'
                          : isSelectedB && compareMode
                          ? 'border-blue-400 bg-[#14233c]'
                          : 'border-slate-800 bg-[#0c121d] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{acc.icon}</span>
                        <div className="truncate">
                          <div className="font-pixel text-[8px] text-slate-200 truncate">{acc.name}</div>
                          <div className="font-vt text-[10px] text-emerald-300">{acc.elementName}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CỘT 2 (4 CỘT): MOCKUP SPRITE AVATAR & TÙY BIẾN NHÂN VẬT THỰC TẾ */}
          <div className="lg:col-span-4 p-4 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-slate-700 bg-[#080d15] overflow-y-auto">
            {/* Header Mockup */}
            <div className="w-full text-center">
              <span className="font-pixel text-[9px] text-[#d4af37] tracking-wider uppercase">
                {compareMode ? 'SO SÁNH HAI PHƯƠNG ÁN PHỐI ĐỒ (A vs B)' : 'MOCKUP PHỐI ĐỒ TRỰC QUAN'}
              </span>
              <h3 className="font-pixel text-xs text-white mt-1">
                {currentCostume.name}
              </h3>
              <div className="font-pixel text-[8px] text-cyan-400">
                kết hợp {currentHat.name} & {currentAccessory.name}
              </div>
            </div>

            {/* KHUNG HIỂN THỊ MOCKUP SPRITE AVATAR */}
            {!compareMode ? (
              // Chế độ 1 Khung Mockup Đơn
              <div className="relative w-64 h-64 sm:h-72 bg-gradient-to-b from-[#141d2d] to-[#0a0f18] border-2 border-[#d4af37] flex flex-col items-center justify-center shadow-[inset_0_0_24px_rgba(0,0,0,0.85),4px_4px_0_#000] my-2">
                <div className="absolute top-2 left-2 bg-black/70 border border-amber-500/60 px-1.5 py-0.5 text-[8px] font-pixel text-amber-300">
                  {selectedOccasion.badge}
                </div>

                <div className="absolute top-2 right-2 bg-black/70 border border-slate-700 px-1.5 py-0.5 text-[8px] font-pixel text-emerald-300">
                  {currentAccessory.icon} {currentAccessory.elementName.split(' ')[0]}
                </div>

                {/* Canvas vẽ Sprite động */}
                <div className="relative z-10 scale-125">
                  <canvas
                    width={140}
                    height={150}
                    ref={(canvas) => {
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.clearRect(0, 0, 140, 150);
                          CharacterRenderer.drawCharacter(ctx, 70, 75, {
                            characterClass: avatarClass as any,
                            gender: gender,
                            scale: 1.25,
                            facing: 'right',
                            action: 'idle',
                            tick: Date.now() / 40,
                          });
                        }
                      }
                    }}
                  />
                </div>

                {/* Chân đế phong cảnh */}
                <div className="absolute bottom-2 font-vt text-slate-400 text-xs text-center px-2">
                  Bối cảnh: {selectedOccasion.name}
                </div>
              </div>
            ) : (
              // Chế độ So Sánh Song Song A / B
              <div className="w-full grid grid-cols-2 gap-2 my-2">
                {/* Look A */}
                <div className="bg-[#101726] border-2 border-amber-500 p-2 flex flex-col items-center shadow-[2px_2px_0_#000]">
                  <span className="font-pixel text-[8px] bg-amber-500 text-black px-1.5 py-0.5 font-bold mb-1">
                    PHƯƠNG ÁN A
                  </span>
                  <div className="font-pixel text-[8px] text-white text-center truncate w-full">{currentCostume.name}</div>
                  <div className="font-vt text-xs text-cyan-300">{currentHat.name}</div>
                  <div className="my-1 scale-90">
                    <canvas
                      width={110}
                      height={120}
                      ref={(canvas) => {
                        if (canvas) {
                          const ctx = canvas.getContext('2d');
                          if (ctx) {
                            ctx.clearRect(0, 0, 110, 120);
                            CharacterRenderer.drawCharacter(ctx, 55, 60, {
                              characterClass: avatarClass as any,
                              gender: gender,
                              scale: 1.0,
                              facing: 'right',
                              action: 'idle',
                              tick: Date.now() / 40,
                            });
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="w-full text-center font-pixel text-[8px]" style={{ color: harmonyResultA.color }}>
                    {harmonyResultA.score} Điểm Chuẩn
                  </div>
                </div>

                {/* Look B */}
                <div className="bg-[#101726] border-2 border-blue-400 p-2 flex flex-col items-center shadow-[2px_2px_0_#000]">
                  <span className="font-pixel text-[8px] bg-blue-500 text-white px-1.5 py-0.5 font-bold mb-1">
                    PHƯƠNG ÁN B
                  </span>
                  <div className="font-pixel text-[8px] text-white text-center truncate w-full">{lookBCostume.name}</div>
                  <div className="font-vt text-xs text-cyan-300">{lookBHat.name}</div>
                  <div className="my-1 scale-90">
                    <canvas
                      width={110}
                      height={120}
                      ref={(canvas) => {
                        if (canvas) {
                          const ctx = canvas.getContext('2d');
                          if (ctx) {
                            ctx.clearRect(0, 0, 110, 120);
                            CharacterRenderer.drawCharacter(ctx, 55, 60, {
                              characterClass: 'tuong_actor' as any,
                              gender: gender,
                              scale: 1.0,
                              facing: 'left',
                              action: 'idle',
                              tick: Date.now() / 40,
                            });
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="w-full text-center font-pixel text-[8px]" style={{ color: harmonyResultB.color }}>
                    {harmonyResultB.score} Điểm Chuẩn
                  </div>
                </div>
              </div>
            )}

            {/* TÙY BIẾN NHÂN VẬT ĐẠI DIỆN (GIỚI TÍNH & PHONG THÁI) */}
            <div className="w-full bg-[#111723] p-2.5 border border-slate-700 space-y-2 mt-1">
              <div className="flex items-center justify-between text-[9px] font-pixel text-slate-300">
                <span>GIỚI TÍNH:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGender('male')}
                    className={`px-2.5 py-1 font-pixel text-[8px] border cursor-pointer ${
                      gender === 'male'
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    NAM 🧑
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`px-2.5 py-1 font-pixel text-[8px] border cursor-pointer ${
                      gender === 'female'
                        ? 'bg-rose-600 text-white border-rose-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    NỮ 👩
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] font-pixel text-slate-300">
                <span>HÌNH TƯỢNG:</span>
                <select
                  value={avatarClass}
                  onChange={(e) => setAvatarClass(e.target.value)}
                  className="bg-[#1b263b] text-amber-300 border border-slate-700 px-2 py-1 text-[8px] font-pixel cursor-pointer"
                >
                  <option value="scholar_blue">Văn Nhân / Sinh Viên Tri Thức</option>
                  <option value="tuong_actor">Đại Thần / Hoàng Tộc Cung Đình</option>
                  <option value="general_armor">Thiết Giáp Tướng Quân</option>
                  <option value="rustic_villager">Thường Dân Kinh Bắc / Miệt Vườn</option>
                  <option value="archer_crossbow">Xạ Thủ Áo Chàm Biển Đảo</option>
                </select>
              </div>
            </div>

            {/* NÚT TẠO LOOKBOOK VIỆT PHỤC */}
            <button
              onClick={handleSaveLookbook}
              className="w-full mt-2 pixel-btn bg-[#d97706] hover:bg-[#f59e0b] text-black border-2 border-black py-2.5 font-pixel text-[9px] sm:text-[10px] font-bold cursor-pointer shadow-[3px_3px_0_#000] flex items-center justify-center gap-1.5"
            >
              <span>📸</span>
              <span>LƯU & XUẤT THẺ "LOOKBOOK VIỆT PHỤC"</span>
            </button>
          </div>

          {/* CỘT 3 (4 CỘT): CỐ VẤN VĂN HÓA, Ý NGHĨA TRANG PHỤC & BỘ SƯU TẬP LOOKBOOK */}
          <div className="lg:col-span-4 p-4 bg-[#0d131f] overflow-y-auto space-y-3.5 custom-scrollbar">
            {/* ĐÁNH GIÁ CHUẨN MỰC VĂN HÓA & CẢNH BÁO SAI LỆCH */}
            <div
              className="p-3 border-2 shadow-[2px_2px_0_#000]"
              style={{ borderColor: harmonyResultA.color, backgroundColor: harmonyResultA.bg }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[9px] font-bold" style={{ color: harmonyResultA.color }}>
                  {harmonyResultA.title}
                </span>
                <span className="font-pixel text-xs font-bold text-white bg-black/70 px-1.5 py-0.5 rounded border border-slate-700">
                  {harmonyResultA.score}/100 ĐIỂM
                </span>
              </div>
              <p className="font-vt text-sm sm:text-base text-slate-200 leading-relaxed">
                {harmonyResultA.message}
              </p>
              <div className="mt-2 text-xs font-vt text-amber-200 border-t border-white/20 pt-1.5">
                💡 {harmonyResultA.advice}
              </div>
            </div>

            {/* NGUỒN GỐC & QUY THỨC LỊCH SỬ CỦA TRANG PHỤC */}
            <div className="bg-[#121926] p-3 border border-slate-700 space-y-2">
              <h4 className="font-pixel text-[9px] text-[#fbe282] flex items-center gap-1">
                <span>📜</span>
                <span>NGUỒN GỐC & Ý NGHĨA LỊCH SỬ:</span>
              </h4>
              <p className="font-vt text-sm sm:text-base text-slate-300 leading-relaxed">
                {currentCostume.description}
              </p>
              <div className="bg-[#0b0f17] p-2.5 border-l-2 border-[#d4af37] text-amber-200/90 font-vt text-sm sm:text-base italic">
                "{currentCostume.lore}"
              </div>
            </div>

            {/* Ý NGHĨA PHỤ KIỆN VĂN HÓA */}
            <div className="bg-[#121926] p-3 border border-slate-700 space-y-1.5">
              <h4 className="font-pixel text-[9px] text-cyan-300 flex items-center gap-1">
                <span>👒</span>
                <span>PHỤ KIỆN ĐỘI ĐẦU: {currentHat.name}</span>
              </h4>
              <p className="font-vt text-sm text-slate-300">
                {currentHat.description}
              </p>
            </div>

            {/* NGŨ HÀNH & HÒA SẮC PHONG THỦY */}
            <div className="bg-[#121926] p-3 border border-slate-700 space-y-2">
              <h4 className="font-pixel text-[9px] text-emerald-300 flex items-center gap-1">
                <span>☯</span>
                <span>HÒA SẮC NGŨ HÀNH TRUYỀN THỐNG:</span>
              </h4>
              <div className="flex items-center justify-between text-xs font-vt text-slate-300">
                <span>Hành bối cảnh: <strong className="text-amber-300">{selectedOccasion.recommendedFiveElements.toUpperCase()}</strong></span>
                <span>Phụ kiện: <strong className="text-emerald-400">{currentAccessory.elementName}</strong></span>
              </div>
              <div className="w-full bg-black/60 h-2 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-300"
                  style={{ width: `${harmonyResultA.score}%` }}
                />
              </div>
            </div>

            {/* BỘ SƯU TẬP LOOKBOOK ĐÃ TẠO TRONG PHIÊN */}
            {savedLookbooks.length > 0 && (
              <div className="border-t border-slate-700 pt-3">
                <h5 className="font-pixel text-[8px] text-amber-300 mb-2 flex items-center justify-between">
                  <span>BỘ SƯU TẬP LOOKBOOK ĐÃ TẠO ({savedLookbooks.length}):</span>
                  <span className="text-slate-400">Bấm để xem thẻ</span>
                </h5>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {savedLookbooks.map((lb) => (
                    <div
                      key={lb.id}
                      onClick={() => setPreviewLookbook(lb)}
                      className="bg-[#162032] hover:bg-[#1f2d45] p-2 border border-slate-700 flex items-center justify-between text-[9px] font-pixel cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="text-[#fef08a]">{lb.costumeName}</div>
                        <div className="text-slate-400 font-vt text-xs">{lb.occasionName} • {lb.dateStr}</div>
                      </div>
                      <span className="text-emerald-400 font-bold bg-black/60 px-1.5 py-0.5 border border-slate-700">
                        {lb.score} đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL XEM CHI TIẾT THẺ LOOKBOOK VIỆT PHỤC PHÓNG TO */}
      {previewLookbook && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-3">
          <div className="relative w-full max-w-md bg-[#131b29] border-3 border-[#d4af37] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.9),6px_6px_0_#000]">
            <div className="flex items-center justify-between border-b border-[#d4af37]/60 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📸</span>
                <h3 className="font-pixel text-xs text-[#fbe282]">THẺ LOOKBOOK VIỆT PHỤC</h3>
              </div>
              <button
                onClick={() => setPreviewLookbook(null)}
                className="pixel-btn bg-red-800 text-white px-2 py-0.5 font-pixel text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 font-vt text-base text-slate-200">
              <div className="bg-[#0b1019] p-3 border border-slate-700">
                <div className="font-pixel text-[10px] text-amber-300">{previewLookbook.occasionName}</div>
                <div className="text-lg text-white font-bold mt-1">👘 {previewLookbook.costumeName}</div>
                <div className="text-cyan-300">👒 Kết hợp: {previewLookbook.hatName}</div>
                <div className="text-emerald-300">⭕ Phụ kiện: {previewLookbook.accessoryName}</div>
              </div>

              <div className="flex items-center justify-between bg-black/50 p-2.5 border border-slate-700">
                <span className="font-pixel text-[9px] text-slate-300">ĐIỂM CHUẨN MỰC VĂN HÓA:</span>
                <span className="font-pixel text-xs text-emerald-400 font-bold">{previewLookbook.score}/100 ĐIỂM</span>
              </div>

              <div className="text-xs text-slate-400 italic">
                "Bảo tồn vẻ đẹp cội nguồn, tự hào lan tỏa giá trị trang phục truyền thống Việt Nam đến thế hệ trẻ 2026."
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  soundEngine.playLevelUp();
                  toast(`📤 Đã sao chép liên kết thẻ Lookbook [${previewLookbook.costumeName}] để chia sẻ!`);
                  setPreviewLookbook(null);
                }}
                className="flex-1 pixel-btn bg-[#d97706] hover:bg-[#f59e0b] text-black border-2 border-black py-2 font-pixel text-[9px] font-bold cursor-pointer"
              >
                CHIA SẺ LOOKBOOK 🌟
              </button>
              <button
                onClick={() => setPreviewLookbook(null)}
                className="pixel-btn bg-slate-700 text-white border border-black px-4 py-2 font-pixel text-[9px] cursor-pointer"
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

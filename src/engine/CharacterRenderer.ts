/**
 * CharacterRenderer.ts
 * Trình vẽ Sprite Pixel Art chuyên sâu độ phân giải cao chuẩn retro RPG
 * Tái hiện chính xác phong cách 4 nhân vật theo artwork của tác giả @george_ttowers:
 * 1. Tướng Quân Thiết Giáp Đại Việt (Mũ chiến chỏm lông đỏ, cờ lệnh ngũ sắc, kiếm lệnh, giáp vảy đồng/sắt)
 * 2. Quan Văn Tuồng Cổ / Đại Thần Áo Giao Lĩnh (Mặt nạ hoa văn tuồng, áo choàng mây sóng hoa văn dệt, đai đỏ)
 * 3. Cung Thủ Nỏ Liên Châu / Xạ Thủ Áo Chàm (Nỏ sau lưng, dải lụa đỏ phiêu dật, áo chẽn xám xanh)
 * 4. Thích Khách Phi Đao / Chiến Binh Giáp Hổ Phù (Tóc vuốt dựng spiky, 3 móng vuốt / phi đao hoa sen, giáp nẹp đồng)
 */

export interface CharacterDrawOptions {
  characterClass?: 'general_armor' | 'tuong_actor' | 'archer_crossbow' | 'claw_warrior' | 'rustic_villager' | 'scholar_blue';
  gender?: 'male' | 'female';
  scale?: number;
  facing?: 'left' | 'right' | 'up' | 'down';
  action?: 'idle' | 'walk' | 'attack' | 'dash';
  tick?: number;
  glow?: boolean;
}

export class CharacterRenderer {
  /**
   * Vẽ nhân vật pixel cao cấp lên 2D Canvas Context
   */
  public static drawCharacter(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    options: CharacterDrawOptions = {}
  ) {
    const {
      characterClass = 'general_armor',
      gender = 'male',
      scale = 1.0,
      facing = 'right',
      action = 'idle',
      tick = 0,
      glow = false,
    } = options;

    ctx.save();
    ctx.translate(x, y);

    // Lật hướng nhìn nếu quay sang trái
    if (facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Hiệu ứng nhấp nhô nhẹ lúc thở / bước đi (Breathing / Walk bobbing)
    const bob = action === 'walk' ? Math.sin(tick * 0.25) * 3 : Math.sin(tick * 0.08) * 1.5;
    ctx.translate(0, bob);

    // Tỉ lệ scale
    ctx.scale(scale, scale);

    // 1. Bóng đổ dưới chân (Soft Pixel Oval Shadow)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 48, 28, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Vẽ chi tiết từng trường phái nhân vật theo artwork @george_ttowers
    switch (characterClass) {
      case 'general_armor':
        this.drawGeneralArmor(ctx, gender, action, tick);
        break;
      case 'tuong_actor':
        this.drawTuongActor(ctx, gender, action, tick);
        break;
      case 'archer_crossbow':
        this.drawCrossbowArcher(ctx, gender, action, tick);
        break;
      case 'claw_warrior':
        this.drawClawWarrior(ctx, gender, action, tick);
        break;
      case 'rustic_villager':
        this.drawRusticVillager(ctx, gender, action, tick);
        break;
      case 'scholar_blue':
        this.drawScholarBlue(ctx, gender, action, tick);
        break;
      default:
        this.drawGeneralArmor(ctx, gender, action, tick);
        break;
    }

    ctx.restore();
  }

  // =========================================================================
  // 1. TƯỚNG QUÂN THIẾT GIÁP ĐẠI VIỆT (Top-left trong ảnh)
  // Mũ trụ chỏm lông đỏ, giáp vảy cá hoàng gia viền vàng chu sa, kiếm lệnh & cờ hiệu
  // =========================================================================
  private static drawGeneralArmor(
    ctx: CanvasRenderingContext2D,
    gender: 'male' | 'female',
    action: string,
    tick: number
  ) {
    const isAtk = action === 'attack';

    // A. Cán cờ lệnh ngũ sắc cắm sau lưng
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(26, -55, 4, 102); // Cán cờ gỗ lim
    // Ngọn giáo trên đầu cờ
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(28, -68);
    ctx.lineTo(24, -54);
    ctx.lineTo(32, -54);
    ctx.closePath();
    ctx.fill();
    // Lá cờ ngũ sắc (Cờ lệnh Đại Việt)
    const flagWave = Math.sin(tick * 0.15) * 2;
    ctx.fillStyle = '#b91c1c'; // Nền đỏ cờ lệnh
    ctx.fillRect(30, -52 + flagWave, 26, 32);
    ctx.strokeStyle = '#f59e0b'; // Viền răng cưa vàng
    ctx.lineWidth = 2.5;
    ctx.strokeRect(30, -52 + flagWave, 26, 32);
    // Họa tiết trám tâm cờ
    ctx.fillStyle = '#15803d'; // Tâm xanh ngọc
    ctx.beginPath();
    ctx.moveTo(43, -48 + flagWave);
    ctx.lineTo(51, -36 + flagWave);
    ctx.lineTo(43, -24 + flagWave);
    ctx.lineTo(35, -36 + flagWave);
    ctx.closePath();
    ctx.fill();

    // B. Chân & Ủng chiến tướng quân (Boots)
    ctx.fillStyle = '#78350f'; // Da thuộc nâu đậm
    ctx.fillRect(-18, 22, 14, 25);
    ctx.fillRect(4, 22, 14, 25);
    // Viền kim loại đầu ủng
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-20, 42, 18, 7);
    ctx.fillRect(2, 42, 18, 7);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-18, 44, 12, 3);
    ctx.fillRect(4, 44, 12, 3);

    // C. Quần lót màu chu sa / xanh chàm
    ctx.fillStyle = '#1e3a5f';
    ctx.fillRect(-16, 12, 32, 14);

    // D. Vạt giáp hông & Tấm hộ tâm hạ bàn (Tassets)
    ctx.fillStyle = '#991b1b'; // Vạt vải đỏ thắm lót giáp
    ctx.fillRect(-22, 6, 44, 18);
    // Tấm giáp vảy sắt xếp tầng (Scale armor)
    for (let r = 0; r < 3; r++) {
      ctx.fillStyle = r % 2 === 0 ? '#5a3825' : '#78472a';
      ctx.fillRect(-18, 6 + r * 5, 36, 4);
      // Viền đinh tán đồng
      ctx.fillStyle = '#f59e0b';
      for (let c = -14; c <= 14; c += 7) {
        ctx.fillRect(c, 7 + r * 5, 2, 2);
      }
    }

    // E. Đai lưng ngọc & Thắt lưng hoàng gia
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-18, 0, 36, 7);
    ctx.fillStyle = '#fef08a'; // Khóa thắt lưng vàng chạm mặt Hổ Phù
    ctx.fillRect(-7, -1, 14, 9);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-3, 2, 6, 4);

    // F. Giáp ngực Thiết Giáp (Chestplate)
    ctx.fillStyle = '#653818';
    ctx.fillRect(-16, -20, 32, 21);
    // Tấm giáp hộ tâm giữa ngực mạ đồng
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(0, -10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-3, -13, 6, 6);

    // G. Giáp vai Hổ Phù (Pauldrons)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-25, -23, 10, 16);
    ctx.fillRect(15, -23, 10, 16);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-26, -24, 12, 4);
    ctx.fillRect(14, -24, 12, 4);

    // H. Tay cầm kiếm lệnh (Hands & Sword)
    const armShift = isAtk ? 12 : 0;
    // Kiếm lệnh Đại Việt chuôi đỏ tơ vàng
    ctx.fillStyle = '#e2e8f0'; // Lưỡi kiếm sáng loáng
    ctx.fillRect(-26, 4 - armShift, 48, 5);
    ctx.fillStyle = '#d97706'; // Chắn kiếm mạ vàng
    ctx.fillRect(-10, 1 - armShift, 6, 11);
    ctx.fillStyle = '#991b1b'; // Chuôi quấn chỉ đỏ
    ctx.fillRect(-18, 4 - armShift, 8, 5);
    // Dải tua rua đỏ đung đưa
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-24, 7 - armShift, 4, 12);

    // I. Đầu & Khuôn mặt
    ctx.fillStyle = '#fed7aa'; // Màu da
    ctx.fillRect(-9, -36, 18, 16);
    // Đôi mắt kiên nghị
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-4, -30, 3, 3);
    ctx.fillRect(3, -30, 3, 3);

    // J. Mũ Trụ Chiến Tướng Quân (Helm with Red Plume)
    ctx.fillStyle = '#78350f'; // Khung mũ kim loại đồng/sắt
    ctx.fillRect(-12, -43, 24, 10);
    ctx.fillRect(-11, -38, 4, 14); // Giáp bảo vệ má
    ctx.fillRect(7, -38, 4, 14);
    // Vành chóp mũ vàng
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-8, -48, 16, 6);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-3, -52, 6, 5);
    // Chỏm lông vũ đỏ thắm kiêu hãnh (Red Plume Feather)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.quadraticCurveTo(-14, -64, -18, -48);
    ctx.quadraticCurveTo(-8, -50, 0, -48);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-12, -56, 6, 6);
  }

  // =========================================================================
  // 2. ĐẠI THẦN / NGHỆ NHÂN ÁO GIAO LĨNH TUỒNG CỔ (Top-right trong ảnh)
  // Mặt nạ tuồng văn võ, áo choàng mây sóng hoa văn dệt ngũ sắc, đai ngọc
  // =========================================================================
  private static drawTuongActor(
    ctx: CanvasRenderingContext2D,
    gender: 'male' | 'female',
    action: string,
    tick: number
  ) {
    // A. Hài gấm đen đế trắng (Traditional Shoes)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-16, 42, 14, 6);
    ctx.fillRect(3, 42, 14, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-16, 38, 14, 5);
    ctx.fillRect(3, 38, 14, 5);

    // B. Tà Áo Dài Thụng Giao Lĩnh (Xanh mây nước & họa tiết gấm hoa)
    ctx.fillStyle = '#1e3a47'; // Xanh ngọc sẫm nền gấm
    ctx.fillRect(-22, -6, 44, 46);

    // Viền áo dệt hoa văn sóng biển & kim tuyến
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-24, 30, 48, 10);
    // Họa tiết thổ cẩm / vảy sóng trên áo
    ctx.fillStyle = '#2dd4bf';
    for (let i = -18; i <= 14; i += 8) {
      ctx.fillRect(i, 32, 4, 4);
    }

    // C. Đai lưng thêu hoa & Dải ngọc buông rủ
    ctx.fillStyle = '#dc2626'; // Đai đỏ
    ctx.fillRect(-16, 10, 32, 7);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-2, 8, 5, 11);
    // Tua rua đỏ buông xuống bên hông
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-4, 18, 8, 16);

    // D. Áo khoác ngoài vạt chéo (Giao Lĩnh xanh họa tiết mây bay)
    ctx.fillStyle = '#285e61';
    ctx.fillRect(-18, -20, 36, 32);
    // Vạt cổ đan chéo đặc trưng của Áo Giao Lĩnh
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, -20);
    ctx.lineTo(8, 10);
    ctx.stroke();

    // Họa tiết đám mây cổ điển thêu trên vạt áo
    ctx.fillStyle = '#99f6e4';
    ctx.fillRect(-12, -8, 6, 3);
    ctx.fillRect(6, -6, 6, 3);

    // E. Tay áo thụng rộng & Kiếm lưỡi liềm cổ
    ctx.fillStyle = '#1e3a47';
    ctx.fillRect(-26, -16, 10, 28); // Ống tay trái
    ctx.fillRect(16, -16, 10, 28); // Ống tay phải
    // Kiếm cong nghệ sĩ tuồng
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-8, 16, 36, 4);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-14, 14, 6, 8);
    // Dải lụa đỏ buộc chuôi kiếm
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-18, 18, 5, 14);

    // F. Mặt Nạ Tuồng Cổ Điển Điển Tích
    // Nền mặt trắng phấn
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, -36, 20, 16);
    // Hoa văn vẽ mặt tuồng (Đỏ chu sa & Xanh đen oai nghiêm)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-8, -35, 4, 5); // Vẽ mắt đỏ
    ctx.fillRect(4, -35, 4, 5);
    ctx.fillRect(-3, -27, 6, 4); // Môi chu sa
    // Đôi mắt sắc sảo
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -33, 2, 2);
    ctx.fillRect(4, -33, 2, 2);
    // Râu tướng dài đen tuyền
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -22, 8, 8);

    // G. Mũ Phốc Đầu / Mũ Cánh Chuồn Quan lại
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(-12, -43, 24, 9);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-14, -40, 28, 3);
    // Đính ngọc đỏ trên chóp mũ
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -44, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // =========================================================================
  // 3. CUNG THỦ NỎ LIÊN CHÂU / XẠ THỦ ÁO CHÀM (Bottom-left trong ảnh)
  // Nỏ liên châu thần cơ An Dương Vương sau lưng, dải dải lụa đỏ mềm mại, áo chẽn gọn gàng
  // =========================================================================
  private static drawCrossbowArcher(
    ctx: CanvasRenderingContext2D,
    gender: 'male' | 'female',
    action: string,
    tick: number
  ) {
    // A. Nỏ Thần Thần Cơ (Liên Châu Crossbow sau lưng)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3.5;
    // Cánh nỏ cong kim loại
    ctx.beginPath();
    ctx.arc(-8, -16, 22, 0.8, 2.8);
    ctx.stroke();
    // Báng nỏ gỗ mun
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(-24, -35, 6, 45);
    // Dây nỏ thép
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-24, -30);
    ctx.lineTo(-4, -4);
    ctx.stroke();

    // B. Đôi giày vải hành quân màu chàm cổ
    ctx.fillStyle = '#334155';
    ctx.fillRect(-16, 40, 13, 8);
    ctx.fillRect(3, 40, 13, 8);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-14, 44, 10, 4);
    ctx.fillRect(5, 44, 10, 4);

    // C. Quần thụng bó gấu gọn gàng
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-15, 20, 12, 22);
    ctx.fillRect(3, 20, 12, 22);
    // Dây xà cạp bó chân bảo vệ
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-16, 30, 14, 3);
    ctx.fillRect(2, 30, 14, 3);

    // D. Áo Chẽn Xám Xanh (Áo Ngắn Tiện Chiến Đấu)
    ctx.fillStyle = '#475569'; // Xanh xám lính chiến
    ctx.fillRect(-16, -10, 32, 32);
    // Dây đai da bắt chéo trước ngực giữ nỏ
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-16, -10);
    ctx.lineTo(16, 14);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, -10);
    ctx.lineTo(-16, 14);
    ctx.stroke();

    // E. DẢI LỤA ĐỎ PHIÊU DẬT HUYỀN THOẠI (Red ribbon flowing)
    const wave = Math.sin(tick * 0.2) * 5;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-16, 6);
    ctx.bezierCurveTo(-38 + wave, 14, -28 - wave, 36, -36 + wave, 44);
    ctx.stroke();
    // Vạt dải lụa bên phải
    ctx.beginPath();
    ctx.moveTo(14, 6);
    ctx.bezierCurveTo(34 + wave, 12, 36 - wave, 28, 44 + wave, 36);
    ctx.stroke();

    // F. Tay & Cổ tay có đai bảo hộ
    ctx.fillStyle = '#fed7aa'; // Tay
    ctx.fillRect(-20, -6, 6, 22);
    ctx.fillRect(14, -6, 6, 22);
    // Bọc cổ tay bảo vệ khi bắn cung
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-21, 6, 7, 7);
    ctx.fillRect(14, 6, 7, 7);

    // G. Khuôn mặt thanh tú, thiếu niên anh hùng
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-8, -32, 16, 15);
    // Đôi mắt tập trung tinh anh
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-3, -26, 3, 2.5);
    ctx.fillRect(3, -26, 3, 2.5);

    // H. Mái tóc chải lệch phong cách cổ phong hiện đại
    ctx.fillStyle = '#33271e';
    ctx.fillRect(-9, -38, 19, 9);
    // Lọn tóc mái phủ nhẹ trán
    ctx.beginPath();
    ctx.moveTo(-9, -30);
    ctx.lineTo(2, -26);
    ctx.lineTo(-4, -35);
    ctx.fill();
  }

  // =========================================================================
  // 4. THÍCH KHÁCH PHI ĐAO / CHIẾN BINH GIÁP HỔ PHÙ (Bottom-right trong ảnh)
  // Tóc vuốt nhọn (spiky hair), nẹp đinh đồng, 3 phi đao hoa sen, đao ngắn
  // =========================================================================
  private static drawClawWarrior(
    ctx: CanvasRenderingContext2D,
    gender: 'male' | 'female',
    action: string,
    tick: number
  ) {
    // A. Ống tên & Dao găm dắt sau lưng
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-22, -32, 10, 30);
    // Đầu mũi phi tiêu cắm trong ống
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-21, -38, 3, 7);
    ctx.fillRect(-17, -40, 3, 9);
    ctx.fillRect(-13, -37, 3, 6);

    // B. Ủng chiến dã chiến
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-16, 40, 14, 8);
    ctx.fillRect(3, 40, 14, 8);
    // Quần lính màu xanh rêu sẫm (Forest green)
    ctx.fillStyle = '#1c3d33';
    ctx.fillRect(-15, 20, 13, 22);
    ctx.fillRect(3, 20, 13, 22);
    // Xà cạp da bọc chân
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-16, 26, 14, 12);
    ctx.fillRect(2, 26, 14, 12);

    // C. Giáp Nẹp Đinh Đồng (Studded brigandine armor)
    ctx.fillStyle = '#854d0e'; // Áo giáp nẹp da bò
    ctx.fillRect(-16, -14, 32, 34);
    // Hàng đinh tán đồng gia cố giáp
    ctx.fillStyle = '#fef08a';
    for (let row = -10; row <= 14; row += 6) {
      for (let col = -12; col <= 12; col += 6) {
        ctx.fillRect(col, row, 2.5, 2.5);
      }
    }

    // D. Đai thắt lưng vải gai trắng
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-17, 6, 34, 5);

    // E. Tay áo xắn cao & Bọc tay sắt
    ctx.fillStyle = '#fed7aa'; // Bắp tay lộ ra
    ctx.fillRect(-22, -8, 7, 24);
    ctx.fillRect(15, -8, 7, 24);

    // F. Tay trái: Dao găm cổ truyền dắt ngược
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-24, 16, 4, 14);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-25, 12, 6, 5);

    // G. Tay phải: BỘ BA MÓNG VUỐT PHI ĐAO (Triple Claw Blades)
    ctx.fillStyle = '#cbd5e1'; // Lưỡi phi đao sáng bạc
    ctx.fillRect(20, 14, 18, 3);
    ctx.fillRect(21, 18, 22, 3.5);
    ctx.fillRect(20, 23, 18, 3);
    // Điểm nhấn viền sắc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(28, 19, 14, 1.5);

    // H. CÁC ĐÓA HOA SEN PHI ĐAO PHÁT SÁNG BAY LƠ LỬNG (Lotus throwing blades)
    const floatY = Math.sin(tick * 0.15) * 4;
    for (let i = 0; i < 3; i++) {
      const lx = 34 + (i % 2) * 12;
      const ly = -26 + i * 14 + floatY;
      ctx.fillStyle = '#ef4444'; // Cánh hoa sen đỏ chu sa
      ctx.beginPath();
      ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a'; // Nhụy hoa sen mạ vàng
      ctx.fillRect(lx - 1.5, ly - 1.5, 3, 3);
    }

    // I. Khuôn mặt chiến binh cương nghị & Tóc vuốt nhọn (Spiky Anime/Pixel hair)
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-8, -32, 16, 16);
    // Mắt sắc lạnh
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3, -26, 3, 2.5);
    ctx.fillRect(3, -26, 3, 2.5);
    // Vết sẹo phong trần nhẹ ngang má
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(2, -22, 4, 1.5);

    // Mái tóc vuốt dựng nhọn (Spiky dark brown hair)
    ctx.fillStyle = '#422006';
    ctx.fillRect(-9, -37, 18, 8);
    // Các chỏm tóc nhọn hướng lên
    ctx.beginPath();
    ctx.moveTo(-8, -36);
    ctx.lineTo(-4, -46);
    ctx.lineTo(0, -36);
    ctx.lineTo(4, -48);
    ctx.lineTo(8, -36);
    ctx.lineTo(12, -44);
    ctx.lineTo(11, -36);
    ctx.closePath();
    ctx.fill();
  }

  // =========================================================================
  // 5. DÂN LÀNG VIỆT CỔ / TRANG PHỤC NÂU SỒNG (Theo đúng nhân vật trong ảnh)
  // Khăn vấn/khăn đóng xanh lam, áo cánh nâu sồng cài cúc, quần thâm, chân trần
  // =========================================================================
  private static drawRusticVillager(
    ctx: CanvasRenderingContext2D,
    gender: 'male' | 'female',
    action: string,
    tick: number
  ) {
    const isMoving = action === 'walk';
    const legOffset = isMoving ? Math.sin(tick * 0.3) * 5 : 0;

    // A. Bàn chân mộc mạc (Bare feet / straw sandals)
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-12 + legOffset, 42, 10, 6);
    ctx.fillRect(2 - legOffset, 42, 10, 6);
    ctx.fillStyle = '#654321'; // Quai dép cói / xỏ ngón
    ctx.fillRect(-10 + legOffset, 44, 6, 2);
    ctx.fillRect(4 - legOffset, 44, 6, 2);

    // B. Quần thâm vải thô ống rộng xắn gấu (Loose dark trousers)
    ctx.fillStyle = '#27292d';
    ctx.fillRect(-14 + legOffset, 18, 12, 24);
    ctx.fillRect(2 - legOffset, 18, 12, 24);
    // Gấu quần
    ctx.fillStyle = '#1c1e21';
    ctx.fillRect(-14 + legOffset, 38, 12, 4);
    ctx.fillRect(2 - legOffset, 38, 12, 4);

    // C. Áo Cánh Nâu Sồng (Brown rustic Vietnamese buttoned tunic)
    ctx.fillStyle = '#9c5838'; // Màu nâu sồng đặc trưng
    ctx.fillRect(-15, -12, 30, 32);
    // Vạt áo xẻ tà bên hông
    ctx.fillStyle = '#844528';
    ctx.fillRect(-15, 14, 4, 6);
    ctx.fillRect(11, 14, 4, 6);
    // Hàng cúc áo vải cài giữa ngực
    ctx.fillStyle = '#422114';
    ctx.fillRect(-1, -10, 2, 24);
    for (let c = -8; c <= 10; c += 6) {
      ctx.fillRect(-2.5, c, 5, 2.5);
    }

    // D. Tay áo cánh vải nâu
    ctx.fillStyle = '#9c5838';
    ctx.fillRect(-20 - legOffset * 0.4, -10, 6, 22);
    ctx.fillRect(14 + legOffset * 0.4, -10, 6, 22);
    // Cổ tay & bàn tay
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-19 - legOffset * 0.4, 11, 5, 6);
    ctx.fillRect(14 + legOffset * 0.4, 11, 5, 6);

    // E. Cổ áo và khuôn mặt
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-2, -14, 4, 4);
    // Khuôn mặt
    ctx.fillRect(-8, -30, 16, 16);
    // Mắt và nụ cười hiền hậu
    ctx.fillStyle = '#111827';
    ctx.fillRect(-4, -24, 2.5, 2.5);
    ctx.fillRect(2, -24, 2.5, 2.5);
    // Miệng cười nhẹ
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-2, -18, 4, 1.5);

    // F. KHĂN VẤN / KHĂN ĐÓNG ĐẦU MÀU XANH LAM CỔ TRUYỀN (Blue cloth headband)
    ctx.fillStyle = '#263d54';
    ctx.fillRect(-10, -36, 20, 8);
    ctx.fillStyle = '#41658a';
    ctx.fillRect(-10, -33, 20, 3);
    // Mối thắt khăn bên tai trái
    ctx.fillStyle = '#5c8ab8';
    ctx.fillRect(-12, -34, 4, 6);
    // Tóc đen lấp ló trên đỉnh
    ctx.fillStyle = '#171717';
    ctx.fillRect(-6, -39, 12, 4);
  }

  // =========================================================================
  // 6. NHO SĨ / TRẠNG NGUYÊN ÁO TẤC XANH CẦM CUỐN THƯ (Theo đúng artwork của user)
  // Áo dài/áo tấc cổ đứng xanh lam, khăn đóng đen, tay cầm cuốn thư trắng
  // =========================================================================
  private static drawScholarBlue(
    ctx: CanvasRenderingContext2D,
    gender: 'male' | 'female',
    action: 'idle' | 'walk' | 'attack' | 'dash',
    tick: number
  ) {
    const isWalking = action === 'walk';
    const legOffset = isWalking ? Math.sin(tick * 0.35) * 6 : 0;

    // A. Quần trắng & Hài đen (White trousers & black traditional shoes)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-8 - legOffset, 24, 7, 18);
    ctx.fillRect(2 + legOffset, 24, 7, 18);
    // Hài vải đen
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-9 - legOffset, 40, 9, 6);
    ctx.fillRect(1 + legOffset, 40, 9, 6);

    // B. Thân áo dài / Áo Tấc màu xanh lam sẫm (Deep Royal Blue Robe)
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(-14, -10);
    ctx.lineTo(14, -10);
    ctx.lineTo(18, 30);
    ctx.lineTo(-18, 30);
    ctx.closePath();
    ctx.fill();

    // Vạt áo xanh lam sáng hơn tạo khối pixel
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-10, -6, 20, 34);

    // Nẹp áo & viền khuy áo chéo truyền thống
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(6, -2);
    ctx.lineTo(6, 26);
    ctx.stroke();

    // C. Tay áo thụng màu xanh lam
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-18 - legOffset * 0.3, -8, 6, 20);
    ctx.fillRect(12 + legOffset * 0.3, -8, 6, 20);

    // D. Cuốn thư / Thư tịch cổ màu trắng cầm trước ngực (White scroll/book)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, 2, 14, 16);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(-7, 2, 14, 16);
    // Dải dây buộc cuốn thư màu xanh/đỏ
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-7, 9, 14, 2);

    // Bàn tay ôm cuốn thư
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-9, 5, 4, 6);
    ctx.fillRect(5, 5, 4, 6);

    // E. Cổ áo trắng tinh khôi & Khuôn mặt
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, -14, 8, 4);
    // Khuôn mặt tươi sáng
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-8, -30, 16, 16);
    // Mắt đen sáng ngời & nụ cười nho nhã
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -24, 2.5, 2.5);
    ctx.fillRect(2, -24, 2.5, 2.5);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-2, -18, 4, 1.5);

    // F. KHĂN ĐÓNG / KHĂN VẤN ĐEN CỔ TRUYỀN (Black folded turban)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-10, -36, 20, 8);
    ctx.fillStyle = '#334155';
    ctx.fillRect(-10, -33, 20, 2.5);
    // Vành khăn đóng nhô cao
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-7, -40, 14, 5);
  }
}


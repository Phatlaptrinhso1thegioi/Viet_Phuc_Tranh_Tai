/**
 * VirusCharacterRenderer.ts
 * Hệ thống vẽ Sprite Pixel Art chuyên sâu cho Quái Vật Mã Độc & Mini Boss từng Map:
 * - Tiểu Quái Mã Độc (Data Glitch Spore): Bào tử virus lập thể phân rã, sóng quét nhiễu pixel.
 * - U Hồn Hoàng Triều (Shadow Spirit): Hồn ma bóng đêm áo thụng rách rưới tím neon.
 * - Thú Hoang Xâm Thực (Corrupted Beast): Thú hoang nanh vuốt gai nhọn virus.
 * - Thủy Quái Phù Sa (River Fiend): Quái vật đầm lầy xúc tu và vây độc.
 * 
 * MINI BOSS ĐỘC ĐÁO TỪNG VÙNG ĐẤT:
 * 1. Miền Bắc: Hắc Xà Thời Không - Cuồng Nộ Trùng Trục (Chrono Serpent Glitch)
 * 2. Miền Trung: Hỏa Diệm Trùng Cung Đình (Imperial Flame Phantom)
 * 3. Tây Nguyên: Thạch Thú Hư Không Dray Nur (Void Mountain Golem)
 * 4. Miền Nam: Hắc Thủy Ngạc Ngư 2099 (Cyber Abyssal Croc)
 * 5. Hải Đảo: Hải Vương Lôi Đài Sóng Gió (Storm Titan Glitch)
 * 6. Trùm Cuối: Chúa Tể Virus Lãng Quên (Oblivion Core Master 2099)
 */

export class VirusCharacterRenderer {
  /**
   * Vẽ Quái vật hoặc Mini Boss trên Canvas trận chiến
   */
  public static drawEnemy(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    spriteType: string,
    tick: number,
    isWarning: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);

    // 1. Bóng đổ dưới chân
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 24, 38, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nhịp thở nhấp nhô & rung giật Glitch
    const glitchShake = Math.random() < 0.12 ? (Math.random() - 0.5) * 6 : 0;
    const floatY = Math.sin(tick * 0.1) * 4;
    ctx.translate(glitchShake, floatY);

    // Cảnh báo đòn đánh sắp tới
    if (isWarning) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -30, 48 + Math.sin(tick * 0.3) * 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    switch (spriteType) {
      case 'miniboss_north':
      case 'chrono_serpent':
        this.drawChronoSerpent(ctx, tick);
        break;

      case 'miniboss_central':
      case 'flame_phantom':
        this.drawFlamePhantom(ctx, tick);
        break;

      case 'miniboss_highland':
      case 'void_golem':
        this.drawVoidGolem(ctx, tick);
        break;

      case 'miniboss_south':
      case 'cyber_croc':
        this.drawCyberCroc(ctx, tick);
        break;

      case 'miniboss_islands':
      case 'storm_titan':
        this.drawStormTitan(ctx, tick);
        break;

      case 'boss_virus':
        this.drawOblivionCoreMaster(ctx, tick);
        break;

      case 'shadow_spirit':
        this.drawShadowSpirit(ctx, tick);
        break;

      case 'forest_beast':
        this.drawForestBeast(ctx, tick);
        break;

      case 'river_fiend':
        this.drawRiverFiend(ctx, tick);
        break;

      case 'glitch_minion':
      default:
        this.drawGlitchSpore(ctx, tick);
        break;
    }

    ctx.restore();
  }

  // =========================================================================
  // 1. TIỂU QUÁI: BÀO TỬ MÃ ĐỘC (GLITCH SPORE)
  // =========================================================================
  private static drawGlitchSpore(ctx: CanvasRenderingContext2D, tick: number) {
    // Khối lập phương mã độc tím than
    ctx.fillStyle = '#6b21a8';
    ctx.fillRect(-22, -44, 44, 44);

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.strokeRect(-22, -44, 44, 44);

    // Hạt pixel glitch bay lơ lửng xung quanh
    ctx.fillStyle = '#e879f9';
    for (let i = 0; i < 6; i++) {
      const px = Math.cos(tick * 0.1 + i) * 32;
      const py = -22 + Math.sin(tick * 0.12 + i * 1.5) * 25;
      ctx.fillRect(px - 2, py - 2, 5, 5);
    }

    // Đôi mắt đỏ rực mã độc
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-12, -28, 8, 8);
    ctx.fillRect(4, -28, 8, 8);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-10, -26, 4, 4);
    ctx.fillRect(6, -26, 4, 4);

    // Sừng gai thời gian trên đầu
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-16, -44);
    ctx.lineTo(-22, -58);
    ctx.lineTo(-8, -44);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(16, -44);
    ctx.lineTo(22, -58);
    ctx.lineTo(8, -44);
    ctx.fill();
  }

  // =========================================================================
  // 2. MINI BOSS MIỀN BẮC: HẮC XÀ THỜI KHÔNG (CHRONO SERPENT GLITCH)
  // =========================================================================
  private static drawChronoSerpent(ctx: CanvasRenderingContext2D, tick: number) {
    // Thân rắn cuộn vảy đồng Lý - Trần bị hắc hóa
    ctx.fillStyle = '#1c1917';
    // Khúc đuôi cuộn dưới
    ctx.beginPath();
    ctx.ellipse(-10, 10, 36, 14, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Thân rắn vươn cao
    ctx.fillStyle = '#292524';
    ctx.beginPath();
    ctx.ellipse(5, -20, 24, 38, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Vảy rồng mạ đồng cổ đan xen vệt số hóa
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#d97706' : '#7c3aed';
      ctx.fillRect(-8 + i * 4, -34 + i * 12, 10, 6);
    }

    // Đầu xà thần sừng sững
    ctx.fillStyle = '#44403c';
    ctx.fillRect(-22, -72, 44, 30);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.strokeRect(-22, -72, 44, 30);

    // Sừng xà vút cong như sừng rồng thời Lý
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-16, -72);
    ctx.lineTo(-32, -92);
    ctx.lineTo(-8, -72);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(16, -72);
    ctx.lineTo(32, -92);
    ctx.lineTo(8, -72);
    ctx.fill();

    // Mắt đỏ ngầu rực sáng
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-15, -60, 10, 7);
    ctx.fillRect(5, -60, 10, 7);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-12, -58, 4, 3);
    ctx.fillRect(8, -58, 4, 3);

    // Lưỡi rắn phóng lửa tím
    const tongueOut = Math.sin(tick * 0.4) > 0;
    if (tongueOut) {
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(-3, -42, 6, 16);
      ctx.fillRect(-6, -26, 4, 6);
      ctx.fillRect(2, -26, 4, 6);
    }
  }

  // =========================================================================
  // 3. MINI BOSS MIỀN TRUNG: HỎA DIỆM TRÙNG CUNG ĐÌNH (IMPERIAL FLAME PHANTOM)
  // =========================================================================
  private static drawFlamePhantom(ctx: CanvasRenderingContext2D, tick: number) {
    // Áo gấm cung đình Huế rách tả tơi bốc cháy lửa tím
    ctx.fillStyle = '#4c1d95';
    ctx.beginPath();
    ctx.moveTo(-28, -20);
    ctx.lineTo(28, -20);
    ctx.lineTo(36, 20);
    ctx.lineTo(-36, 20);
    ctx.closePath();
    ctx.fill();

    // Vạt áo rách lửa nhấp nhô
    for (let i = -30; i < 30; i += 12) {
      ctx.fillStyle = '#a855f7';
      const flameH = Math.sin(tick * 0.2 + i) * 8;
      ctx.fillRect(i, 16 + flameH, 8, 12);
    }

    // Lồng đèn hoa đăng ma quái giữa ngực
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -25, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ngọn lửa tím cháy bùng trên đầu
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.moveTo(-16, -45);
    ctx.lineTo(0, -78 + Math.sin(tick * 0.25) * 6);
    ctx.lineTo(16, -45);
    ctx.closePath();
    ctx.fill();

    // Mắt hoa đăng rực vàng
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-10, -30, 7, 7);
    ctx.fillRect(3, -30, 7, 7);

    // Cầu lửa ma bay xoay quanh
    const fx = Math.cos(tick * 0.15) * 44;
    const fy = -25 + Math.sin(tick * 0.15) * 20;
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(fx, fy, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // =========================================================================
  // 4. MINI BOSS TÂY NGUYÊN: THẠCH THÚ HƯ KHÔNG (VOID MOUNTAIN GOLEM)
  // =========================================================================
  private static drawVoidGolem(ctx: CanvasRenderingContext2D, tick: number) {
    // Khối thân đá bazan tạc từ vách thác Dray Nur
    ctx.fillStyle = '#334155';
    ctx.fillRect(-35, -55, 70, 65);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.strokeRect(-35, -55, 70, 65);

    // Khe nứt dung nham mã độc rực đỏ
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-20, -40, 40, 6);
    ctx.fillRect(-5, -34, 10, 25);
    ctx.fillRect(-18, -15, 36, 5);

    // Hai cánh tay đá khổng lồ nện đất
    ctx.fillStyle = '#475569';
    // Tay trái
    ctx.fillRect(-52, -45, 18, 50);
    // Tay phải
    ctx.fillRect(34, -45, 18, 50);

    // Nắm đấm bọc gai đá
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-54, 0, 22, 18);
    ctx.fillRect(32, 0, 22, 18);

    // Đầu đá vuông vức
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-22, -80, 44, 26);

    // Mắt dung nham cam rực
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-14, -70, 9, 6);
    ctx.fillRect(5, -70, 9, 6);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-12, -69, 4, 3);
    ctx.fillRect(7, -69, 4, 3);
  }

  // =========================================================================
  // 5. MINI BOSS MIỀN NAM: HẮC THỦY NGẠC NGƯ 2099 (CYBER CROC)
  // =========================================================================
  private static drawCyberCroc(ctx: CanvasRenderingContext2D, tick: number) {
    // Thân cá sấu biến dị đầm lầy cơ giới hóa
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.ellipse(0, -10, 48, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vảy gai lưng kim loại sắc nhọn
    ctx.fillStyle = '#059669';
    for (let i = -30; i < 30; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, -25);
      ctx.lineTo(i + 6, -42);
      ctx.lineTo(i + 12, -25);
      ctx.fill();
    }

    // Mõm cá sấu răng nanh kim loại
    ctx.fillStyle = '#022c22';
    ctx.fillRect(-55, -20, 45, 20);
    // Răng nanh trắng nhọn
    ctx.fillStyle = '#f8fafc';
    for (let r = -52; r < -15; r += 8) {
      ctx.fillRect(r, -22, 4, 5);
      ctx.fillRect(r + 3, -4, 4, 5);
    }

    // Kính ngắm laser đỏ công nghệ tương lai 2099
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-35, -26, 16, 7);
    ctx.strokeStyle = '#fca5a5';
    ctx.strokeRect(-35, -26, 16, 7);

    // Đuôi quẫy sóng nước
    const tailWiggle = Math.sin(tick * 0.2) * 8;
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.moveTo(35, -18);
    ctx.lineTo(60, -10 + tailWiggle);
    ctx.lineTo(35, -2);
    ctx.fill();
  }

  // =========================================================================
  // 6. MINI BOSS HẢI ĐẢO: HẢI VƯƠNG LÔI ĐÀI (STORM TITAN GLITCH)
  // =========================================================================
  private static drawStormTitan(ctx: CanvasRenderingContext2D, tick: number) {
    // Thân rồng biển khổng lồ quấn sấm chớp
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.ellipse(0, -20, 36, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vây cá mập nhọn bên hông
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-36, -30);
    ctx.lineTo(-58, -45);
    ctx.lineTo(-32, -10);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(36, -30);
    ctx.lineTo(58, -45);
    ctx.lineTo(32, -10);
    ctx.fill();

    // Vòng sấm sét lôi đình bọc quanh
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const ang = tick * 0.15 + i * (Math.PI / 2);
      const lx = Math.cos(ang) * 44;
      const ly = -20 + Math.sin(ang) * 25;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 8, ly - 10);
      ctx.lineTo(lx - 4, ly - 6);
      ctx.stroke();
    }

    // Mắt bão xanh biếc
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(-14, -32, 9, 8);
    ctx.fillRect(5, -32, 9, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-11, -30, 4, 4);
    ctx.fillRect(8, -30, 4, 4);
  }

  // =========================================================================
  // 7. TRÙM CUỐI: CHÚA TỂ VIRUS LÃNG QUÊN (OBLIVION CORE MASTER 2099)
  // =========================================================================
  private static drawOblivionCoreMaster(ctx: CanvasRenderingContext2D, tick: number) {
    // 4 Cánh mã độc glitch xòe rộng
    const wingWave = Math.sin(tick * 0.12) * 10;

    // Cánh trên trái
    ctx.fillStyle = '#701a75';
    ctx.beginPath();
    ctx.moveTo(-20, -35);
    ctx.lineTo(-75, -75 + wingWave);
    ctx.lineTo(-40, -25);
    ctx.fill();

    // Cánh trên phải
    ctx.beginPath();
    ctx.moveTo(20, -35);
    ctx.lineTo(75, -75 + wingWave);
    ctx.lineTo(40, -25);
    ctx.fill();

    // Cánh dưới trái & phải
    ctx.fillStyle = '#4a044e';
    ctx.beginPath();
    ctx.moveTo(-20, -10);
    ctx.lineTo(-65, 15 - wingWave);
    ctx.lineTo(-30, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(20, -10);
    ctx.lineTo(65, 15 - wingWave);
    ctx.lineTo(30, 0);
    ctx.fill();

    // Thân giáp hạch tâm màu tím thẫm
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(-28, -50, 56, 62);
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-28, -50, 56, 62);

    // Lõi phản vật chất nhấp nháy ở tâm ngực
    const coreGlow = Math.sin(tick * 0.25) * 4;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -20, 14 + coreGlow, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-5, -25, 10, 10);

    // Vương miện mã độc sừng sững
    ctx.fillStyle = '#a21caf';
    ctx.beginPath();
    ctx.moveTo(-25, -50);
    ctx.lineTo(-32, -75);
    ctx.lineTo(-12, -58);
    ctx.lineTo(0, -85);
    ctx.lineTo(12, -58);
    ctx.lineTo(32, -75);
    ctx.lineTo(25, -50);
    ctx.closePath();
    ctx.fill();

    // Đôi mắt hủy diệt rực sáng
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-15, -42, 9, 6);
    ctx.fillRect(6, -42, 9, 6);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-12, -40, 4, 3);
    ctx.fillRect(9, -40, 4, 3);
  }

  // =========================================================================
  // CÁC QUÁI VẬT KHÁC
  // =========================================================================
  private static drawShadowSpirit(ctx: CanvasRenderingContext2D, tick: number) {
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.moveTo(-20, -35);
    ctx.lineTo(20, -35);
    ctx.lineTo(24, 15);
    ctx.lineTo(-24, 15);
    ctx.fill();
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(-10, -22, 6, 6);
    ctx.fillRect(4, -22, 6, 6);
  }

  private static drawForestBeast(ctx: CanvasRenderingContext2D, tick: number) {
    ctx.fillStyle = '#14532d';
    ctx.fillRect(-25, -30, 50, 40);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(-15, -45, 10, 15);
    ctx.fillRect(5, -45, 10, 15);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-12, -22, 6, 6);
    ctx.fillRect(6, -22, 6, 6);
  }

  private static drawRiverFiend(ctx: CanvasRenderingContext2D, tick: number) {
    ctx.fillStyle = '#164e63';
    ctx.beginPath();
    ctx.arc(0, -15, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-12, -18, 7, 7);
    ctx.fillRect(5, -18, 7, 7);
  }
}

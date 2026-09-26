/**
 * VietnameseFeudalNPCRenderer.ts
 * Hệ thống dựng hình Pixel Art nhân vật NPC thời Phong Kiến Việt Nam:
 * - Cụ Đồ Nguyễn Khoa: Khăn đóng, áo the dài truyền thống, râu chòm bạc phơ, quạt giấy & cuốn thư.
 * - Thống Soái Lê Đại: Mũ trụ đồng chỏm đỏ thời Lý-Trần, giáp vảy đan dây đỏ, áo bào đỏ tung bay, kiếm báu lệnh triều.
 * - Thượng Thư Lễ Bộ: Mũ cánh chuồn chuốt cong, áo tấc thụng xanh thêu hoa văn mây sóng, thẻ bài ngọc.
 * - Mệ Tôn Nữ Diệu Tâm: Áo Nhật Bình cung đình Huế ngũ sắc, khăn vành vàng kim sa, nón bài thơ che duyên.
 * - Nghệ Nhân Thu Cúc: Khăn mỏ quạ Kinh Bắc, áo tứ thân vạt nâu, yếm đào, đai lưng lụa đào.
 * - Nghệ Nhân Hội An: Áo cánh gụ, tay nâng đèn lồng hoa đăng rực rỡ sắc màu.
 * - Già Làng Tây Nguyên: Khăn thổ cẩm quấn trán, áo chui đầu thổ cẩm hoa văn chim lạc, chuỗi hạt đá.
 */

export class VietnameseFeudalNPCRenderer {
  /**
   * Vẽ Sprite NPC thời phong kiến trên bản đồ khám phá
   */
  public static drawNPC(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    npc: { id: string; name: string; avatar?: string; role?: string },
    tick: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    // 1. Bóng đổ dưới chân
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nhịp thở nhấp nhô cổ điển
    const bob = Math.sin(tick * 0.08) * 1.5;
    ctx.translate(0, bob);

    const id = npc.id;

    if (id.includes('cu_do')) {
      this.drawCuDo(ctx);
    } else if (id.includes('tuong_quan')) {
      this.drawTuongQuan(ctx, tick);
    } else if (id.includes('quan_ngu_y')) {
      this.drawQuanTrieuDinh(ctx);
    } else if (id.includes('hue_nghe_nhan') || id.includes('ton_nu')) {
      this.drawTonNu(ctx);
    } else if (id.includes('ba_ba') || id.includes('van_phuc')) {
      this.drawNgheNhanTuThan(ctx);
    } else if (id.includes('hoian')) {
      this.drawNgheNhanHoiAn(ctx, tick);
    } else {
      this.drawGenericFeudalNPC(ctx);
    }

    // 2. Tên và tước vị triều đình phong kiến phía trên đầu
    ctx.restore();

    ctx.save();
    ctx.translate(x, y - 48);

    // Khung nhãn tên gỗ son thiếp vàng
    const nameText = npc.name;
    const roleText = npc.role || 'Nhân sĩ thời phong kiến';

    ctx.font = '8px "Press Start 2P", monospace';
    const textW = Math.max(ctx.measureText(nameText).width, 80);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(-textW / 2 - 8, -14, textW + 16, 26);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-textW / 2 - 8, -14, textW + 16, 26);

    // Chấm vàng trang trí hai bên
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-textW / 2 - 10, -3, 3, 4);
    ctx.fillRect(textW / 2 + 7, -3, 3, 4);

    ctx.fillStyle = '#fbe282';
    ctx.textAlign = 'center';
    ctx.fillText(nameText, 0, -2);

    ctx.font = '10px "VT323", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(roleText, 0, 9);
    ctx.restore();
  }

  // =========================================================================
  // 1. CỤ ĐỒ NGUYỄN KHOA (TRƯỞNG LÃO VĂN MIẾU)
  // =========================================================================
  private static drawCuDo(ctx: CanvasRenderingContext2D) {
    // Thân áo dài the đen / nâu sồng phong nhã
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(-12, -10, 24, 28);
    // Vạt áo xẻ tà Đại Việt
    ctx.fillStyle = '#2c221a';
    ctx.fillRect(-11, 4, 10, 14);
    ctx.fillRect(1, 4, 10, 14);

    // Đai lưng vải mộc
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(-12, 0, 24, 3);

    // Quần lụa trắng bên trong
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-9, 18, 7, 6);
    ctx.fillRect(2, 18, 7, 6);

    // Giày vải đế mềm
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-10, 22, 9, 4);
    ctx.fillRect(1, 22, 9, 4);

    // Đầu & Gương mặt
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-8, -26, 16, 16);

    // Khăn đóng (Khăn xếp) đen truyền thống
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(-10, -32, 20, 8);
    ctx.fillStyle = '#262626';
    ctx.fillRect(-9, -29, 18, 3);

    // Râu chòm bạc phơ uốn dài xuống ngực
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-5, -14);
    ctx.lineTo(5, -14);
    ctx.lineTo(2, 4);
    ctx.lineTo(-2, 4);
    ctx.closePath();
    ctx.fill();

    // Mắt hiền từ
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-5, -21, 3, 2);
    ctx.fillRect(2, -21, 3, 2);

    // Tay cầm quạt giấy trúc
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(10, -6);
    ctx.lineTo(18, -14);
    ctx.lineTo(22, -6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // =========================================================================
  // 2. THỐNG SOÁI LÊ ĐẠI (TƯỚNG THỦ THÀNH THĂNG LONG)
  // =========================================================================
  private static drawTuongQuan(ctx: CanvasRenderingContext2D, tick: number) {
    // Áo choàng đỏ bay phía sau
    const capeWave = Math.sin(tick * 0.15) * 4;
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(-12, -15);
    ctx.lineTo(-20 + capeWave, 22);
    ctx.lineTo(20 + capeWave, 22);
    ctx.lineTo(12, -15);
    ctx.closePath();
    ctx.fill();

    // Giáp phiến đồng / sắt thời Lý-Trần
    ctx.fillStyle = '#475569';
    ctx.fillRect(-14, -14, 28, 26);

    // Họa tiết giáp vảy cá & Hổ phù ngực
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-8, -10, 16, 12);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-4, -6, 8, 5);

    // Giáp vai hộ tâm sư tử
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-18, -14, 6, 10);
    ctx.fillRect(12, -14, 6, 10);

    // Giáp chân & ủng chiến tướng
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-11, 12, 9, 12);
    ctx.fillRect(2, 12, 9, 12);

    // Đầu & Mặt tướng uy nghi
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-8, -27, 16, 15);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, -22, 3, 2);
    ctx.fillRect(2, -22, 3, 2);

    // Mũ trụ đồng thời Lý - Trần có chỏm lông đỏ
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-11, -34, 22, 9);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-12, -30, 24, 4);

    // Chỏm lông đỏ kiêu hãnh trên đỉnh mũ
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(-4, -44);
    ctx.lineTo(4, -44);
    ctx.closePath();
    ctx.fill();

    // Thanh gươm báu cầm tay tì đất
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(14, -8, 3, 28);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(11, -10, 9, 3); // Chuôi kiếm
  }

  // =========================================================================
  // 3. THƯỢNG THƯ LỄ BỘ (QUAN TRIỀU ĐÌNH - MŨ CÁNH CHUỒN)
  // =========================================================================
  private static drawQuanTrieuDinh(ctx: CanvasRenderingContext2D) {
    // Áo tấc thụng màu lam ngọc gấm hoa
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-15, -12, 30, 28);

    // Cổ áo giao lĩnh viền ngọc
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(-4, -12, 8, 12);

    // Thẻ bài ngà cài trước ngực
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-3, -3, 6, 10);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1;
    ctx.strokeRect(-3, -3, 6, 10);

    // Hài dạ đen
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-10, 16, 9, 6);
    ctx.fillRect(1, 16, 9, 6);

    // Đầu & Gương mặt quan
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-8, -26, 16, 15);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-5, -21, 3, 2);
    ctx.fillRect(2, -21, 3, 2);

    // Râu ria mép quan văn
    ctx.fillStyle = '#334155';
    ctx.fillRect(-6, -15, 12, 2);

    // MŨ CÁNH CHUỒN QUAN TRIỀU ĐÌNH ĐẶC TRƯNG:
    // Chóp mũ đen
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-9, -36, 18, 12);
    ctx.fillStyle = '#27272a';
    ctx.fillRect(-7, -34, 14, 8);

    // Đôi cánh chuồn chuốt cong sang hai bên
    ctx.fillStyle = '#18181b';
    // Cánh trái
    ctx.fillRect(-26, -33, 17, 3);
    ctx.fillRect(-28, -35, 5, 5);
    // Cánh phải
    ctx.fillRect(9, -33, 17, 3);
    ctx.fillRect(23, -35, 5, 5);
  }

  // =========================================================================
  // 4. MỆ TÔN NỮ DIỆU TÂM (ÁO NHẬT BÌNH CUNG ĐÌNH HUẾ)
  // =========================================================================
  private static drawTonNu(ctx: CanvasRenderingContext2D) {
    // Áo Nhật Bình ngũ sắc cung đình
    ctx.fillStyle = '#0284c7'; // Nền áo chính xanh ngọc
    ctx.fillRect(-12, -10, 24, 27);

    // Cổ áo Nhật Bình hình chữ nhật ngũ sắc trước ngực
    const colors = ['#dc2626', '#f59e0b', '#16a34a', '#2563eb', '#9333ea'];
    for (let i = 0; i < colors.length; i++) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(-6 + i, -10, 12 - i * 2, 16);
    }

    // Quần lụa trắng cung nữ
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-9, 17, 7, 7);
    ctx.fillRect(2, 17, 7, 7);

    // Đầu & Gương mặt
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-7, -25, 14, 15);
    ctx.fillStyle = '#be185d';
    ctx.fillRect(-2, -14, 4, 2); // Môi son

    // Khăn Vành Dây màu vàng hoàng gia vấn nhiều vòng
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-10, -32, 20, 8);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-8, -30, 16, 3);

    // Nón Bài Thơ nghiêng cầm bên tay
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(11, -2);
    ctx.lineTo(24, -14);
    ctx.lineTo(26, -2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // =========================================================================
  // 5. NGHỆ NHÂN DỆT LỤA (ÁO TỨ THÂN & KHĂN MỎ QUẠ)
  // =========================================================================
  private static drawNgheNhanTuThan(ctx: CanvasRenderingContext2D) {
    // Áo tứ thân vạt nâu phối yếm hoa đào
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-11, -9, 22, 26);

    // Yếm đào hồng trước ngực
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(-5, -9);
    ctx.lineTo(5, -9);
    ctx.lineTo(0, -1);
    ctx.closePath();
    ctx.fill();

    // Dải thắt lưng lụa xanh đào buộc lệch
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-11, 0, 22, 3);
    ctx.fillRect(-7, 3, 4, 12);

    // Váy đen lụa dài
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-10, 10, 20, 12);

    // Đầu & Gương mặt
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-7, -24, 14, 15);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-5, -19, 2, 2);
    ctx.fillRect(3, -19, 2, 2);

    // Khăn mỏ quạ đen Kinh Bắc (Gập hình chóp nhọn trước trán)
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.moveTo(-9, -24);
    ctx.lineTo(0, -32);
    ctx.lineTo(9, -24);
    ctx.lineTo(8, -17);
    ctx.lineTo(-8, -17);
    ctx.closePath();
    ctx.fill();
  }

  // =========================================================================
  // 6. NGHỆ NHÂN PHỐ CỔ HỘI AN (CẦM ĐÈN LỒNG)
  // =========================================================================
  private static drawNgheNhanHoiAn(ctx: CanvasRenderingContext2D, tick: number) {
    // Áo cánh nâu gụ
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-10, -9, 20, 24);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-8, 15, 6, 8);
    ctx.fillRect(2, 15, 6, 8);

    // Đầu & Khăn vấn
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-7, -24, 14, 15);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-8, -29, 16, 6);

    // Tay cầm Đèn Lồng Hội An phát sáng
    const glow = Math.sin(tick * 0.1) * 3;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(15, -4, 9 + glow * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(13, -7, 4, 6);
    // Tua rua đèn lồng vàng
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(14, 5, 2, 8);
  }

  // =========================================================================
  // 7. DÂN LÀNG PHONG KIẾN CHUNG
  // =========================================================================
  private static drawGenericFeudalNPC(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#57534e';
    ctx.fillRect(-10, -10, 20, 25);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-7, -24, 14, 14);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-8, -29, 16, 6);
  }
}

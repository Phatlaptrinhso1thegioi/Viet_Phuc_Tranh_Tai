/**
 * VietnameseHouseRenderer.ts
 * Trình vẽ phối cảnh Pixel Art 2D "Ngôi Nhà Cổ Việt Nam" chuẩn xác theo phong cách Retro RPG:
 * - Ngôi nhà 5 gian truyền thống lợp mái ngói mũi hài đỏ nung, bờ dải và cột trụ đá vững chãi.
 * - Hệ thống cửa bức bàn gỗ lim với hàng song con tiện (wooden lattice).
 * - Hiên nhà lát gạch đỏ đất nung với bóng đổ mái hiên chân thực.
 * - Chum sành / lu nước mưa gốm nung, cây sào tre, đống củi gỗ tròn xếp gọn gàng.
 * - Cây chuối làng quê trĩu quả với buồng chuối xanh và hoa chuối tím rủ xuống.
 * - Sân gạch Bát Tràng cổ đa sắc, lối đi đất cát vàng uốn lượn ven thảm cỏ xanh ngát.
 * - Mini-map thời gian thực & Thanh HUD trái tim pixel theo đúng ảnh tham chiếu.
 */

export interface HouseRenderState {
  playerX: number;
  playerY: number;
  canvasWidth: number;
  canvasHeight: number;
  tick: number;
  locationName?: string;
  playerHpPercent?: number;
}

export class VietnameseHouseRenderer {
  /**
   * Vẽ toàn bộ phối cảnh Ngôi Nhà Cổ và sân vườn làng quê Việt Nam
   */
  public static renderScene(
    ctx: CanvasRenderingContext2D,
    state: HouseRenderState
  ) {
    const { canvasWidth: W, canvasHeight: H, tick } = state;

    // Tọa độ tâm của ngôi nhà cổ trên canvas
    // Cho phép nhà nằm ở phần trên của màn hình, sân gạch rộng phía dưới để người chơi đi lại
    const houseX = W * 0.5;
    const houseY = Math.max(160, H * 0.32);
    const houseW = Math.min(W * 0.88, 760);
    const houseH = 190;

    // 1. NỀN THẢM CỎ & LỐI ĐI ĐẤT CÁT VÀNG
    this.renderGroundAndPaths(ctx, W, H, houseX, houseY, houseW, houseH);

    // 2. RỪNG CÂY CỔ THỤ XANH PHÍA SAU NHÀ (Backdrop trees)
    this.renderForestBackground(ctx, W, houseY, houseW);

    // 3. SÂN GẠCH BÁT TRÀNG CỔ ĐA SẮC (Courtyard)
    this.renderCourtyard(ctx, houseX, houseY, houseW, H);

    // 4. KIẾN TRÚC NGÔI NHÀ CỔ 5 GIAN (Traditional Vietnamese House)
    this.renderAncientHouse(ctx, houseX, houseY, houseW, houseH, tick);

    // 5. CÁC VẬT PHẨM LÀNG QUÊ DÂN DÃ:
    // - Gian chái tường vôi & Chum sành lu nước mưa, sào tre bên trái
    this.renderLeftOuthouseAndJar(ctx, houseX - houseW * 0.5 - 40, houseY);

    // - Đống củi gỗ tròn & Cây chuối trĩu quả buồng chuối bắp chuối bên phải
    this.renderBananaTreeAndWoodpile(ctx, houseX + houseW * 0.5, houseY, tick);

    // 6. MINI-MAP (Góc dưới bên phải theo đúng ảnh tham chiếu)
    const mmW = 104;
    const mmH = 78;
    const mmX = W - mmW - 16;
    const mmY = H - mmH - 42;
    this.renderMiniMap(ctx, mmX, mmY, mmW, mmH, state.playerX / W, state.playerY / H);

    // 7. THANH HUD DƯỚI ĐÁY MÀN HÌNH (Trái tim pixel + Thanh HP + Tên vị trí)
    this.renderBottomHUD(
      ctx,
      W,
      H,
      state.locationName || 'NGÔI NHÀ CỔ',
      state.playerHpPercent !== undefined ? state.playerHpPercent : 1.0
    );
  }

  /**
   * Vẽ môi trường Ngôi Nhà Cổ 5 Gian chân thực phục vụ camera World Explorer
   */
  public static renderWorldEnvironment(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    tick: number
  ) {
    const houseX = W * 0.5;
    const houseY = Math.max(160, H * 0.32);
    const houseW = Math.min(W * 0.88, 760);
    const houseH = 190;

    // 1. Nền cỏ xanh mướt & đường mòn đất cát vàng
    this.renderGroundAndPaths(ctx, W, H, houseX, houseY, houseW, houseH);

    // 2. Rừng cây xanh cổ thụ phía sau nhà
    this.renderForestBackground(ctx, W, houseY, houseW);

    // 3. Sân gạch Bát Tràng đa sắc với cỏ mọc kẽ gạch
    this.renderCourtyard(ctx, houseX, houseY, houseW, H);

    // 4. Ngôi nhà cổ 5 gian ngói mũi hài đỏ nung, bờ dải vôi trắng, 6 cột lim và cửa bức bàn
    this.renderAncientHouse(ctx, houseX, houseY, houseW, houseH, tick);

    // 5. Vật phẩm làng quê: Chum sành nước mưa, sào tre bên trái; đống củi khô & bụi chuối trĩu buồng bên phải
    this.renderLeftOuthouseAndJar(ctx, houseX - houseW * 0.5 - 40, houseY);
    this.renderBananaTreeAndWoodpile(ctx, houseX + houseW * 0.5, houseY, tick);

    // 6. Ao sen làng cổ (Hồ nước phong thủy trước sân nhà)
    this.renderVillageLotusPond(ctx, 160, H - 150, tick);
  }

  /**
   * Vẽ Ao Sen Làng Cổ truyền thống Việt Nam (Vật thể nước không thể đi qua)
   */
  private static renderVillageLotusPond(
    ctx: CanvasRenderingContext2D,
    pondX: number,
    pondY: number,
    tick: number
  ) {
    const rX = 85;
    const rY = 65;

    // 1. Bờ kè đá ong / gạch vỉa ao
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(pondX, pondY, rX + 8, rY + 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 2. Lòng hồ nước trong xanh
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(pondX, pondY, rX, rY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sóng nước lăn tăn
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) {
      const waveOffset = Math.sin(tick * 0.08 + i) * 6;
      ctx.beginPath();
      ctx.arc(pondX - 30 + i * 20, pondY - 20 + i * 12 + waveOffset, 12, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    // 3. Những tán lá sen nổi bập bềnh
    const lotusPads = [
      { dx: -45, dy: -15, r: 12 },
      { dx: -20, dy: 20, r: 15 },
      { dx: 25, dy: -25, r: 14 },
      { dx: 40, dy: 15, r: 13 },
      { dx: 5, dy: -5, r: 11 },
    ];

    lotusPads.forEach((pad) => {
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(pondX + pad.dx, pondY + pad.dy, pad.r, 0, Math.PI * 1.8);
      ctx.lineTo(pondX + pad.dx, pondY + pad.dy);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(pondX + pad.dx - 2, pondY + pad.dy - 2, 4, 4);
    });

    // 4. Búp sen hồng thắm
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(pondX + 25, pondY - 32, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(pondX + 24, pondY - 34, 2, 3);

    // Biển gỗ: "AO SEN LÀNG CỔ"
    ctx.fillStyle = '#78350f';
    ctx.fillRect(pondX - 35, pondY + rY + 4, 70, 14);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(pondX - 35, pondY + rY + 4, 70, 14);
    ctx.fillStyle = '#fef08a';
    ctx.font = '7px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('AO SEN', pondX, pondY + rY + 14);
    ctx.textAlign = 'start';
  }

  // =========================================================================
  // 1. NỀN CỎ & ĐƯỜNG MÒN ĐẤT CÁT VÀNG
  // =========================================================================
  private static renderGroundAndPaths(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    hx: number,
    hy: number,
    hw: number,
    hh: number
  ) {
    // Nền cỏ xanh mướt (với các sắc thái pixel dịu mắt)
    ctx.fillStyle = '#659c47';
    ctx.fillRect(0, 0, W, H);

    // Điểm xuyết thảm cỏ xanh đậm / xanh nhạt đan xen
    ctx.fillStyle = '#578a3c';
    for (let x = 0; x < W; x += 32) {
      for (let y = 0; y < H; y += 32) {
        if ((x * 13 + y * 7) % 29 < 12) {
          ctx.fillRect(x + 4, y + 4, 12, 10);
        }
      }
    }

    // Lối đi đất cát vàng uốn lượn ở góc dưới bên trái
    const pathStartY = hy + hh + 20;
    ctx.fillStyle = '#e8bc78'; // Màu đất vàng phù sa pha cát
    ctx.beginPath();
    ctx.moveTo(0, pathStartY + 40);
    ctx.bezierCurveTo(W * 0.1, pathStartY + 30, W * 0.12, pathStartY + 110, 0, pathStartY + 160);
    ctx.lineTo(0, pathStartY + 200);
    ctx.bezierCurveTo(W * 0.18, pathStartY + 150, W * 0.16, pathStartY + 20, 0, pathStartY + 20);
    ctx.closePath();
    ctx.fill();

    // Viền sỏi đá đất cát
    ctx.fillStyle = '#cf9f59';
    for (let i = 0; i < 15; i++) {
      const px = (i * 27) % (W * 0.14);
      const py = pathStartY + 35 + (i * 19) % 110;
      ctx.fillRect(px, py, 4, 3);
    }
  }

  // =========================================================================
  // 2. RỪNG CÂY CỔ THỤ XANH PHÍA SAU NHÀ (Pixel Art Tree Canopy)
  // =========================================================================
  private static renderForestBackground(
    ctx: CanvasRenderingContext2D,
    W: number,
    hy: number,
    hw: number
  ) {
    const baseY = hy - 40;
    // Tầng cây xanh sẫm xa
    ctx.fillStyle = '#1c4228';
    for (let x = -40; x < W + 80; x += 65) {
      ctx.beginPath();
      ctx.arc(x, baseY - 30, 48, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tầng cây xanh vừa
    ctx.fillStyle = '#2b6338';
    for (let x = -20; x < W + 60; x += 55) {
      ctx.beginPath();
      ctx.arc(x, baseY - 18, 42, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tầng lá cây sáng màu gần nhà
    ctx.fillStyle = '#428549';
    for (let x = 0; x < W + 40; x += 50) {
      ctx.beginPath();
      ctx.arc(x, baseY - 6, 36, 0, Math.PI * 2);
      ctx.fill();
      // Khối highlight trên tán cây
      ctx.fillStyle = '#5ca862';
      ctx.fillRect(x - 12, baseY - 24, 22, 10);
      ctx.fillStyle = '#428549';
    }
  }

  // =========================================================================
  // 3. SÂN GẠCH BÁT TRÀNG CỔ ĐA SẮC (Courtyard)
  // =========================================================================
  private static renderCourtyard(
    ctx: CanvasRenderingContext2D,
    hx: number,
    hy: number,
    hw: number,
    H: number
  ) {
    const courtLeft = hx - hw * 0.5 - 20;
    const courtRight = hx + hw * 0.5 + 30;
    const courtTop = hy + 86;
    const courtBottom = Math.min(H - 45, courtTop + 340);

    const tileSize = 28;

    // Bảng màu gạch Bát Tràng đất nung cổ điển:
    const tileColors = [
      '#ad5c52', // Đỏ gạch nung chính
      '#be695e', // Hồng gạch sáng
      '#994e45', // Đỏ nâu trầm
      '#a2554c', // Đỏ gạch vừa
      '#8f4b43', // Gạch cũ nứt
      '#6d554a', // Gạch rêu phong xám
      '#7a6358', // Mảng gạch xám tro
    ];

    // Vẽ từng viên gạch lát sân
    for (let y = courtTop; y < courtBottom; y += tileSize) {
      for (let x = courtLeft; x < courtRight; x += tileSize) {
        // Thuật toán giả ngẫu nhiên xác định màu từng viên gạch cố định
        const seed = Math.floor(x * 17 + y * 31);
        const colIdx = Math.abs(seed) % tileColors.length;
        ctx.fillStyle = tileColors[colIdx];
        ctx.fillRect(x, y, tileSize, tileSize);

        // Đường mạch vữa xám đen giữa các viên gạch
        ctx.strokeStyle = '#442d27';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x, y, tileSize, tileSize);

        // Vết nứt gạch cổ phong ngẫu nhiên
        if (seed % 11 === 0) {
          ctx.strokeStyle = '#321f1c';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + 4, y + 6);
          ctx.lineTo(x + tileSize - 8, y + tileSize - 6);
          ctx.stroke();
        }
      }
    }

    // Bờ rêu xanh viền quanh mép sân gạch
    ctx.fillStyle = '#517a3a';
    ctx.fillRect(courtLeft, courtTop, 4, courtBottom - courtTop);
    ctx.fillRect(courtLeft, courtBottom - 3, courtRight - courtLeft, 4);
  }

  // =========================================================================
  // 4. KIẾN TRÚC NGÔI NHÀ CỔ 5 GIAN (Traditional House)
  // =========================================================================
  private static renderAncientHouse(
    ctx: CanvasRenderingContext2D,
    hx: number,
    hy: number,
    hw: number,
    hh: number,
    tick: number
  ) {
    const roofLeft = hx - hw * 0.5;
    const roofRight = hx + hw * 0.5;
    const roofTop = hy - 90;
    const roofH = 110;

    // A. MÁI NGÓI MŨI HÀI ĐỎ TERRACOTTA (Red clay tile roof)
    // Nền ngói đỏ nung
    ctx.fillStyle = '#b34d3b';
    ctx.fillRect(roofLeft, roofTop, hw, roofH);

    // Các hàng ngói vảy cá / ngói mũi hài nằm ngang
    const tileRowH = 7;
    for (let r = 0; r < roofH; r += tileRowH) {
      const y = roofTop + r;
      // Đường viền bóng đổ hàng ngói
      ctx.fillStyle = r % 2 === 0 ? '#983f2e' : '#c45a46';
      ctx.fillRect(roofLeft, y, hw, tileRowH);

      // Đường rãnh dọc giữa từng viên ngói
      ctx.strokeStyle = '#7c2f21';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = roofLeft + 4; x < roofRight; x += 12) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + tileRowH);
      }
      ctx.stroke();
    }

    // B. BỜ NÓC & BỜ DẢI MÁI NHÀ (Roof ridges & cement borders)
    // Bờ nóc đỉnh mái màu xám vôi vữa
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(roofLeft - 8, roofTop - 12, hw + 16, 14);
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(roofLeft - 8, roofTop + 2, hw + 16, 4);

    // Kìm nóc / Bờ dải hai bên đầu hồi uốn lượn
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(roofLeft - 10, roofTop - 14, 14, roofH + 20);
    ctx.fillRect(roofRight - 4, roofTop - 14, 14, roofH + 20);

    // Chóp trang trí đầu hồi hình búp sen / trụ vuông
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(roofLeft - 14, roofTop - 26, 22, 16);
    ctx.fillRect(roofRight - 8, roofTop - 26, 22, 16);
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(roofLeft - 11, roofTop - 24, 16, 4);
    ctx.fillRect(roofRight - 5, roofTop - 24, 16, 4);

    // C. HAI CỘT TRỤ ĐÁ TRẮNG XÁM MẶT TIỀN (Two main stone pillars)
    const pillarW = 20;
    const verandaTop = roofTop + roofH;
    const verandaH = 70;

    // Cột trụ trái
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(roofLeft - 6, verandaTop - 2, pillarW, verandaH + 10);
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(roofLeft - 6, verandaTop - 2, 4, verandaH + 10);
    ctx.strokeRect(roofLeft - 6, verandaTop - 2, pillarW, verandaH + 10);

    // Cột trụ phải
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(roofRight - pillarW + 6, verandaTop - 2, pillarW, verandaH + 10);
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(roofRight - pillarW + 6, verandaTop - 2, 4, verandaH + 10);
    ctx.strokeRect(roofRight - pillarW + 6, verandaTop - 2, pillarW, verandaH + 10);

    // D. HIÊN NHÀ & NỀN GẠCH HIÊN (Veranda porch)
    ctx.fillStyle = '#c5533e'; // Nền gạch đỏ thềm hiên
    ctx.fillRect(roofLeft + 10, verandaTop + 36, hw - 20, 36);

    // Bậc tam cấp đá xanh mát trước hiên
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(roofLeft + 8, verandaTop + 68, hw - 16, 6);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(roofLeft + 8, verandaTop + 72, hw - 16, 2);

    // E. BÓNG RÂM ĐỔ TỪ MÁI HIÊN (Realistic Deep Porch Shadow)
    ctx.fillStyle = 'rgba(28, 16, 12, 0.55)';
    ctx.beginPath();
    ctx.moveTo(roofLeft + 14, verandaTop);
    ctx.lineTo(roofRight - 14, verandaTop);
    ctx.lineTo(roofRight - 14, verandaTop + 40);
    ctx.lineTo(roofLeft + 14, verandaTop + 40);
    ctx.closePath();
    ctx.fill();

    // F. HỆ THỐNG CỬA BỨC BÀN GỖ LIM 5 GIAN (5-Bay Wooden Lattice Doors)
    const bayCount = 5;
    const bayWidth = (hw - 40) / bayCount;

    for (let i = 0; i < bayCount; i++) {
      const bayX = roofLeft + 18 + i * bayWidth;
      const bayY = verandaTop - 4;
      const bayW = bayWidth - 6;
      const bayH = 68;

      // Khung bao gỗ lim màu nâu trầm
      ctx.fillStyle = '#5c351b';
      ctx.fillRect(bayX, bayY, bayW, bayH);

      // Cánh cửa bức bàn bên trong
      ctx.fillStyle = '#7a4624';
      ctx.fillRect(bayX + 2, bayY + 3, bayW - 4, bayH - 5);

      // Hàng song con tiện gỗ phía trên cửa (Wooden Balusters / Lattice)
      ctx.fillStyle = '#452613';
      ctx.fillRect(bayX + 5, bayY + 6, bayW - 10, 26);

      // Các thanh song cửa gỗ thẳng đứng
      ctx.fillStyle = '#a16538';
      for (let s = bayX + 8; s < bayX + bayW - 8; s += 5) {
        ctx.fillRect(s, bayY + 7, 2, 24);
      }

      // Tấm gỗ pa-nô bịt dưới (Wooden lower panels)
      ctx.fillStyle = '#5c351b';
      ctx.fillRect(bayX + 5, bayY + 35, bayW - 10, 26);
      ctx.strokeStyle = '#8f522a';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(bayX + 7, bayY + 37, bayW - 14, 22);

      // Then cài cửa gỗ lim ở giữa
      ctx.fillStyle = '#2d180c';
      ctx.fillRect(bayX + bayW * 0.5 - 2, bayY + 28, 4, 10);
    }
  }

  // =========================================================================
  // 5. GIAN CHÁI BÊN TRÁI & CHUM SÀNH / LU NƯỚC MƯA, SÀO TRE
  // =========================================================================
  private static renderLeftOuthouseAndJar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) {
    // A. Mái ngói gian chái phụ nối liền
    ctx.fillStyle = '#ad4c3a';
    ctx.fillRect(x - 55, y - 65, 80, 52);
    // Viền ngói
    ctx.fillStyle = '#8f3c2d';
    for (let r = 0; r < 50; r += 6) {
      ctx.fillRect(x - 55, y - 65 + r, 80, 2);
    }

    // B. Tường gạch trát vôi vàng rêu phong loang lổ
    ctx.fillStyle = '#e5d8b8';
    ctx.fillRect(x - 50, y - 13, 70, 75);
    // Vết loang rêu phong thời gian
    ctx.fillStyle = '#a39878';
    ctx.fillRect(x - 30, y + 8, 22, 18);
    ctx.fillStyle = '#7a7056';
    ctx.fillRect(x - 26, y + 14, 12, 10);

    // C. Cây sào tre / gậy chống dựng dựa vào tường
    ctx.strokeStyle = '#b8944d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 35, y + 54);
    ctx.lineTo(x - 22, y - 6);
    ctx.stroke();

    // D. Chum sành / Lu nước mưa đất nung cổ truyền
    const jarX = x - 12;
    const jarY = y + 42;
    // Bóng đổ của chum
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(jarX, jarY + 16, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thân chum phình tròn màu gốm sành nâu bóng
    ctx.fillStyle = '#8a482b';
    ctx.beginPath();
    ctx.arc(jarX, jarY, 14, 0, Math.PI * 2);
    ctx.fill();

    // Miệng chum có vành gờ
    ctx.fillStyle = '#653119';
    ctx.fillRect(jarX - 8, jarY - 14, 16, 4);
    // Vệt sáng bóng gốm tráng men
    ctx.fillStyle = '#ba7250';
    ctx.fillRect(jarX - 7, jarY - 8, 4, 10);
  }

  // =========================================================================
  // 6. ĐỐNG CỦI GỖ & CÂY CHUỐI TRĨU QUẢ (Buồng chuối & Bắp chuối tím)
  // =========================================================================
  private static renderBananaTreeAndWoodpile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    tick: number
  ) {
    // A. ĐỐNG CỦI GỖ TRÒN XẾP SÁT TƯỜNG (Woodpile)
    const woodX = x - 14;
    const woodY = y + 48;
    // Các thanh củi gỗ tròn xếp chồng hình kim tự tháp
    const woodLogs = [
      [-12, 8], [-4, 8], [4, 8], [12, 8],
      [-8, 0], [0, 0], [8, 0],
      [-4, -8], [4, -8]
    ];
    woodLogs.forEach(([ox, oy]) => {
      // Vỏ củi nâu sẫm
      ctx.fillStyle = '#5c3a21';
      ctx.beginPath();
      ctx.arc(woodX + ox, woodY + oy, 5.5, 0, Math.PI * 2);
      ctx.fill();
      // Tâm củi màu gỗ vàng sáng
      ctx.fillStyle = '#d4a373';
      ctx.beginPath();
      ctx.arc(woodX + ox, woodY + oy, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Vòng tròn vân gỗ
      ctx.strokeStyle = '#8a5a36';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // B. CÂY CHUỐI LÀNG QUÊ VIỆT NAM (Banana Tree)
    const treeX = x + 38;
    const treeY = y + 26;

    // Bóng đổ dưới gốc chuối
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(treeX + 4, treeY + 45, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thân cây chuối (Thân giả màu xanh ngà có bẹ nâu)
    ctx.fillStyle = '#659c47';
    ctx.fillRect(treeX, treeY - 20, 14, 64);
    ctx.fillStyle = '#4c7833';
    ctx.fillRect(treeX, treeY - 20, 4, 64);
    // Bẹ chuối khô màu nâu vàng sát gốc
    ctx.fillStyle = '#9c733c';
    ctx.fillRect(treeX - 1, treeY + 24, 16, 18);

    // Tán lá chuối tỏa rộng xum xuê (Banana Fronds with natural slits)
    const wind = Math.sin(tick * 0.08) * 3;

    // Lá vươn sang trái
    this.drawBananaLeaf(ctx, treeX + 4, treeY - 18, -48 + wind, -28, '#589e3a');
    this.drawBananaLeaf(ctx, treeX + 6, treeY - 26, -58 + wind, -10, '#6cb546');
    this.drawBananaLeaf(ctx, treeX + 4, treeY - 10, -42 + wind, 18, '#4c8a32');

    // Lá vươn sang phải
    this.drawBananaLeaf(ctx, treeX + 10, treeY - 20, 52 + wind, -26, '#589e3a');
    this.drawBananaLeaf(ctx, treeX + 8, treeY - 28, 64 + wind, -8, '#6cb546');
    this.drawBananaLeaf(ctx, treeX + 10, treeY - 10, 48 + wind, 20, '#4c8a32');

    // Đọt lá non chuối đứng thẳng ở giữa (Young upright leaf)
    ctx.fillStyle = '#8bd957';
    ctx.beginPath();
    ctx.moveTo(treeX + 6, treeY - 28);
    ctx.lineTo(treeX + 7, treeY - 65);
    ctx.lineTo(treeX + 11, treeY - 28);
    ctx.closePath();
    ctx.fill();

    // C. BUỒNG CHUỐI XANH TRĨU QUẢ (Banana bunch)
    const bunchX = treeX - 12;
    const bunchY = treeY + 2;

    // Cuống buồng chuối cong cong
    ctx.strokeStyle = '#43732c';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(treeX + 4, treeY - 14);
    ctx.quadraticCurveTo(bunchX - 4, treeY - 8, bunchX, bunchY + 16);
    ctx.stroke();

    // Từng nải chuối nhỏ xếp tầng màu xanh non
    ctx.fillStyle = '#7ac943';
    for (let b = 0; b < 4; b++) {
      for (let f = 0; f < 3; f++) {
        ctx.fillRect(bunchX - 6 + f * 5, bunchY + b * 6, 4, 7);
      }
    }

    // D. BẮP CHUỐI / HOA CHUỐI TÍM THẮM RỦ XUỐNG (Purple Banana Blossom)
    const flowerY = bunchY + 26;
    ctx.fillStyle = '#7a224d'; // Màu tím hoa chuối
    ctx.beginPath();
    ctx.moveTo(bunchX + 1, flowerY);
    ctx.lineTo(bunchX - 5, flowerY + 12);
    ctx.lineTo(bunchX + 1, flowerY + 20);
    ctx.lineTo(bunchX + 7, flowerY + 12);
    ctx.closePath();
    ctx.fill();
    // Đầu nhọn hoa chuối
    ctx.fillStyle = '#4f1431';
    ctx.fillRect(bunchX, flowerY + 18, 2, 4);
  }

  private static drawBananaLeaf(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    dx: number,
    dy: number,
    color: string
  ) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + dx * 0.5, startY + dy * 0.7 - 8, startX + dx, startY + dy);
    ctx.stroke();

    // Gân cuống lá chuối màu xanh nhạt
    ctx.strokeStyle = '#a3e66a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + dx * 0.5, startY + dy * 0.7 - 8, startX + dx, startY + dy);
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // 7. MINI-MAP CHÍNH XÁC THEO GÓC PHẢI BÊN DƯỚI ẢNH THAM CHIẾU
  // =========================================================================
  public static renderMiniMap(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    playerNormalizedX: number,
    playerNormalizedY: number
  ) {
    // Khung viền pixel của Mini-map
    ctx.fillStyle = '#1c2616';
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    ctx.strokeStyle = '#4a6b32';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);

    // Nền sân vườn xanh
    ctx.fillStyle = '#568a3c';
    ctx.fillRect(x, y, w, h);

    // Ngôi nhà cổ ngói đỏ thu nhỏ
    const houseMW = w * 0.65;
    const houseMH = h * 0.28;
    const houseMX = x + (w - houseMW) * 0.5;
    const houseMY = y + h * 0.14;

    ctx.fillStyle = '#b34d3b'; // Mái ngói đỏ
    ctx.fillRect(houseMX, houseMY, houseMW, houseMH);
    ctx.fillStyle = '#e5e7eb'; // Bờ dải viền trắng
    ctx.strokeRect(houseMX, houseMY, houseMW, houseMH);

    // Cây chuối thu nhỏ màu xanh sáng
    ctx.fillStyle = '#7ac943';
    ctx.beginPath();
    ctx.arc(houseMX + houseMW + 7, houseMY + houseMH * 0.5, 6, 0, Math.PI * 2);
    ctx.fill();

    // Sân gạch thu nhỏ màu đỏ gạch
    ctx.fillStyle = '#a65649';
    ctx.fillRect(houseMX - 6, houseMY + houseMH + 2, houseMW + 14, h * 0.44);

    // Lối đi đất thu nhỏ màu vàng cát
    ctx.fillStyle = '#e8bc78';
    ctx.fillRect(x + 2, houseMY + houseMH + 6, 12, 10);

    // Chấm vàng nhấp nháy định vị người chơi trên Mini-map
    const pDotX = x + Math.max(6, Math.min(w - 6, playerNormalizedX * w));
    const pDotY = y + Math.max(6, Math.min(h - 6, playerNormalizedY * h));

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(pDotX - 2.5, pDotY - 2.5, 5, 5);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(pDotX - 1.5, pDotY - 1.5, 3, 3);
  }

  // =========================================================================
  // 8. THANH STATUS BAR DƯỚI CÙNG (Trái tim pixel + HP Bar + VỊ TRÍ: NGÔI NHÀ CỔ)
  // =========================================================================
  public static renderBottomHUD(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    locationName: string = 'NGÔI NHÀ CỔ',
    hpPercent: number = 0.85
  ) {
    const barH = 34;
    const barY = H - barH;

    // Thanh nền đen xanh viền pixel đáy màn hình
    ctx.fillStyle = '#0f1712';
    ctx.fillRect(0, barY, W, barH);
    ctx.strokeStyle = '#2d4233';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, barY, W, barH);

    // A. Trái tim pixel đỏ góc trái
    const heartX = 22;
    const heartY = barY + 10;
    this.drawPixelHeart(ctx, heartX, heartY);

    // B. Khung thanh máu HP màu đỏ gạch
    const hpBarW = 100;
    const hpBarH = 12;
    const hpBarX = 38;
    const hpBarY = barY + 11;

    ctx.fillStyle = '#1e241f';
    ctx.fillRect(hpBarX, hpBarY, hpBarW, hpBarH);
    ctx.strokeStyle = '#8fa394';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(hpBarX, hpBarY, hpBarW, hpBarH);

    // Phần máu đỏ đầy
    ctx.fillStyle = '#d94b43';
    ctx.fillRect(hpBarX + 1.5, hpBarY + 1.5, (hpBarW - 3) * Math.max(0, Math.min(1, hpPercent)), hpBarH - 3);

    // C. Nhãn vị trí góc phải: "VỊ TRÍ: NGÔI NHÀ CỔ"
    ctx.fillStyle = '#f3f4f6';
    ctx.font = '11px "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`VỊ TRÍ: ${locationName.toUpperCase()}`, W - 145, barY + 22);
    ctx.textAlign = 'start';
  }

  private static drawPixelHeart(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#ef4444';
    // Pixel heart shape
    ctx.fillRect(x - 4, y - 4, 3, 3);
    ctx.fillRect(x + 1, y - 4, 3, 3);
    ctx.fillRect(x - 5, y - 1, 10, 4);
    ctx.fillRect(x - 3, y + 3, 6, 3);
    ctx.fillRect(x - 1, y + 6, 2, 2);
    // Viền trắng
    ctx.fillStyle = '#fee2e2';
    ctx.fillRect(x - 3, y - 3, 1, 1);
  }
}

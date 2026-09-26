/**
 * VillageSanctuaryRenderer.ts
 * Trình dựng Pixel Art 2D chính xác 100% theo tác phẩm nghệ thuật Làng Nghề Cổ Đại Việt:
 * - Bầu trời hoàng hôn chiều tà rực rỡ nắng vàng, trăng tròn sáng mờ góc trên bên trái, rặng núi đồi xa xa.
 * - Gò đất tròn và cây xanh cổ thụ trên đồi góc trên bên phải.
 * - Hai tòa đình bát giác / lò gốm mái ngói tròn độc đáo (một trên, một dưới) với lò nung đỏ lửa, bếp củi trại, chậu bonsai và chum vại.
 * - Giàn phơi vải nhuộm lụa tơ tằm với các nong vải hoa văn vàng và xanh chàm.
 * - Chú mèo đen và chú cún con màu nâu chạy nhảy trên nền cát.
 * - Trục đường cát uốn lượn trung tâm với bụi tre ngà, cây chuối, giếng đá cổ tròn và kiệu rước bằng gỗ lim.
 * - Dãy nhà gỗ truyền thống mái ngói đỏ với hàng song cửa sổ gỗ tiện và đèn lồng góc hiên.
 * - Hồ hoa súng / hoa sen hồng thanh khiết với lá sen xanh biếc góc dưới bên phải.
 */

export interface VillageRenderOptions {
  canvasW: number;
  canvasH: number;
  tick: number;
  playerPos: { x: number; y: number };
}

export class VillageSanctuaryRenderer {
  public static render(ctx: CanvasRenderingContext2D, opt: VillageRenderOptions) {
    const { canvasW: W, canvasH: H, tick, playerPos } = opt;

    // 1. BẦU TRỜ HOÀNG HÔN & MẶT TRĂNG VÀNG MỜ
    this.drawSunsetSkyAndMountains(ctx, W, H);

    // 2. MẶT ĐẤT CÁT VÀNG & ĐƯỜNG MÒN UỐN LƯỢN
    this.drawTerrainAndRoad(ctx, W, H);

    // 3. GÒ ĐẤT & CÂY XANH TRÊN ĐỒI (Góc trên bên phải)
    this.drawMoundAndTree(ctx, W * 0.62, H * 0.12);

    // 4. HAI TÒA ĐÌNH TRÒN / LÒ GỐM MÁI NGÓI (Bên trái)
    // Tòa trên:
    this.drawCircularKilnPavilion(ctx, W * 0.24, H * 0.24, tick, true);
    // Tòa dưới:
    this.drawCircularKilnPavilion(ctx, W * 0.22, H * 0.72, tick, false);

    // 5. GIÀN PHƠI VẢI HOA VĂN VÀNG & XANH (Giữa 2 tòa đình tròn)
    this.drawTextileDryingRacks(ctx, W * 0.08, H * 0.44);

    // 6. ĐỘNG VẬT LÀNG QUÊ: MÈO ĐEN & CÚN CON
    this.drawAnimals(ctx, W, H, tick);

    // 7. TRỤC ĐƯỜNG GIỮA: BỤI TRE, CÂY CHUỐI, GIẾNG ĐÁ CỔ, KIỆU RƯỚC
    this.drawCentralProps(ctx, W, H, tick);

    // 8. DÃY NHÀ GỖ MÁI NGÓI ĐỎ & ĐÈN LỒNG (Bên phải)
    this.drawTraditionalHouses(ctx, W, H);

    // 9. HỒ SEN / HOA SÚNG HỒNG (Góc dưới bên phải)
    this.drawLotusPond(ctx, W * 0.84, H * 0.84, tick);

    // 10. ĐÁ CUỘI TỰ NHIÊN RẢI RÁC
    this.drawPebbles(ctx, W, H);
  }

  // =========================================================================
  // 1. BẦU TRỜ HOÀNG HÔN & MẶT TRĂNG VÀNG
  // =========================================================================
  private static drawSunsetSkyAndMountains(ctx: CanvasRenderingContext2D, W: number, H: number) {
    // Bầu trời dải màu hoàng hôn ấm áp
    const skyH = H * 0.24;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, skyH);
    skyGrad.addColorStop(0, '#f59e0b'); // Vàng cam ấm
    skyGrad.addColorStop(0.6, '#fed7aa'); // Vàng mơ
    skyGrad.addColorStop(1, '#fde68a'); // Vàng hoàng hôn
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, skyH);

    // Mặt trăng tròn trắng mờ góc trên bên trái
    const moonX = W * 0.18;
    const moonY = skyH * 0.32;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 26, 0, Math.PI * 2);
    ctx.fill();
    // Vết xám trên mặt trăng
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(moonX - 5, moonY - 4, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 8, moonY + 7, 7, 0, Math.PI * 2);
    ctx.fill();

    // Dãy núi tím phớt hoàng hôn xa xa
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.moveTo(0, skyH * 0.85);
    ctx.quadraticCurveTo(W * 0.15, skyH * 0.45, W * 0.35, skyH * 0.8);
    ctx.quadraticCurveTo(W * 0.6, skyH * 0.38, W * 0.85, skyH * 0.75);
    ctx.lineTo(W, skyH * 0.65);
    ctx.lineTo(W, skyH);
    ctx.lineTo(0, skyH);
    ctx.closePath();
    ctx.fill();

    // Rặng đồi gần màu cát hồng tím
    ctx.fillStyle = '#d8b4e2';
    ctx.beginPath();
    ctx.moveTo(0, skyH * 0.95);
    ctx.quadraticCurveTo(W * 0.25, skyH * 0.7, W * 0.5, skyH * 0.95);
    ctx.quadraticCurveTo(W * 0.75, skyH * 0.65, W, skyH * 0.9);
    ctx.lineTo(W, skyH);
    ctx.lineTo(0, skyH);
    ctx.closePath();
    ctx.fill();
  }

  // =========================================================================
  // 2. MẶT ĐẤT CÁT VÀNG & CON ĐƯỜNG UỐN LƯỢN
  // =========================================================================
  private static drawTerrainAndRoad(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const groundY = H * 0.22;
    // Nền đất cát màu hoàng thổ ấm áp (Warm sand earth)
    ctx.fillStyle = '#d4a373';
    ctx.fillRect(0, groundY, W, H - groundY);

    // Các mảng cát màu vàng đậm nhạt tự nhiên
    ctx.fillStyle = '#cca06f';
    for (let x = 0; x < W; x += 60) {
      for (let y = groundY; y < H; y += 50) {
        if ((x * 7 + y * 13) % 31 < 14) {
          ctx.fillRect(x, y, 35, 20);
        }
      }
    }

    // Con đường mòn cát màu vàng sáng ở trung tâm
    ctx.fillStyle = '#e9c46a';
    ctx.beginPath();
    ctx.moveTo(W * 0.46, groundY);
    ctx.lineTo(W * 0.53, groundY);
    ctx.quadraticCurveTo(W * 0.5, H * 0.45, W * 0.48, H * 0.65);
    ctx.quadraticCurveTo(W * 0.47, H * 0.85, W * 0.49, H);
    ctx.lineTo(W * 0.42, H);
    ctx.quadraticCurveTo(W * 0.41, H * 0.85, W * 0.42, H * 0.65);
    ctx.quadraticCurveTo(W * 0.43, H * 0.45, W * 0.46, groundY);
    ctx.closePath();
    ctx.fill();

    // Nhánh rẽ sang nhà bên phải
    ctx.beginPath();
    ctx.moveTo(W * 0.48, H * 0.62);
    ctx.quadraticCurveTo(W * 0.62, H * 0.64, W * 0.74, H * 0.67);
    ctx.lineTo(W * 0.74, H * 0.72);
    ctx.quadraticCurveTo(W * 0.62, H * 0.7, W * 0.48, H * 0.68);
    ctx.closePath();
    ctx.fill();

    // Nhánh rẽ sang sân tròn bên trái
    ctx.beginPath();
    ctx.moveTo(W * 0.43, H * 0.38);
    ctx.quadraticCurveTo(W * 0.34, H * 0.38, W * 0.28, H * 0.36);
    ctx.lineTo(W * 0.28, H * 0.42);
    ctx.quadraticCurveTo(W * 0.34, H * 0.44, W * 0.43, H * 0.44);
    ctx.closePath();
    ctx.fill();

    // Viền bờ đường đất
    ctx.strokeStyle = '#bc6c25';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // =========================================================================
  // 3. GÒ ĐẤT & CÂY XANH TRÊN ĐỒI (Góc trên bên phải)
  // =========================================================================
  private static drawMoundAndTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Miệng gò đất tròn như núi lửa nhỏ cổ xưa
    ctx.fillStyle = '#b48a5c';
    ctx.beginPath();
    ctx.ellipse(x + 100, y + 40, 50, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.ellipse(x + 100, y + 42, 32, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cây xanh cổ thụ vươn lên
    const tx = x + 15;
    const ty = y + 25;
    // Thân cây gỗ nâu
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(tx - 6, ty, 12, 45);
    // Tán lá xanh tròn xum xuê
    ctx.fillStyle = '#2d6a4f';
    ctx.beginPath();
    ctx.arc(tx, ty - 15, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#40916c';
    ctx.beginPath();
    ctx.arc(tx - 10, ty - 22, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#52b788';
    ctx.beginPath();
    ctx.arc(tx + 8, ty - 25, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // =========================================================================
  // 4. HAI TÒA ĐÌNH TRÒN / LÒ NUNG MÁI NGÓI ĐẶC TRƯNG
  // =========================================================================
  private static drawCircularKilnPavilion(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    tick: number,
    hasRoofVent: boolean
  ) {
    const R = 85;

    // Nền đá hình tròn
    ctx.fillStyle = '#a89078';
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6e543c';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Sàn gỗ màu đất ấm bên trong
    ctx.fillStyle = '#c59b6d';
    ctx.beginPath();
    ctx.arc(cx, cy, R - 6, 0, Math.PI * 2);
    ctx.fill();

    // Cổng vòm lối vào phía trước
    ctx.fillStyle = '#8b6f4e';
    ctx.fillRect(cx - 16, cy + R - 24, 32, 24);
    ctx.fillStyle = '#3e2c1c';
    ctx.fillRect(cx - 12, cy + R - 20, 24, 20);

    // LÒ NUNG GỐM / BẾP LỬA Ở TRUNG TÂM PHÍA SAU
    const ovenY = cy - 25;
    ctx.fillStyle = '#8c5035';
    ctx.beginPath();
    ctx.arc(cx, ovenY, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b1810';
    ctx.beginPath();
    ctx.arc(cx, ovenY + 5, 14, 0, Math.PI * 2);
    ctx.fill();

    // Ngọn lửa lò nung bập bùng
    const flameFlicker = Math.sin(tick * 0.2) * 3;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(cx, ovenY + 5, 8 + flameFlicker, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(cx, ovenY + 5, 4 + flameFlicker * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // ĐỐNG LỬA TRẠI TRUNG TÂM
    const fireX = cx;
    const fireY = cy + 15;
    ctx.fillStyle = '#451a03';
    ctx.fillRect(fireX - 10, fireY + 4, 20, 5);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(fireX - 6, fireY + 4);
    ctx.lineTo(fireX, fireY - 10 + flameFlicker);
    ctx.lineTo(fireX + 6, fireY + 4);
    ctx.closePath();
    ctx.fill();

    // CÁC CHẬU BONSAI CÂY CẢNH VÀ CHUM VẠI XUNG QUANH
    this.drawBonsaiPot(ctx, cx - 45, cy - 10);
    this.drawBonsaiPot(ctx, cx + 45, cy - 10);
    this.drawBonsaiPot(ctx, cx - 40, cy + 30);
    this.drawBonsaiPot(ctx, cx + 40, cy + 30);

    // CỘT GỖ CHỊU LỰC XUNG QUANH VÀ VÁCH
    ctx.fillStyle = '#5c3a21';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      if (a > Math.PI * 0.35 && a < Math.PI * 0.65) continue; // Chừa cổng trước
      const px = cx + Math.cos(a) * (R - 10);
      const py = cy + Math.sin(a) * (R - 10);
      ctx.fillRect(px - 4, py - 4, 8, 8);
    }

    // MÁI NGÓI MŨI HÀI HÌNH VÒM TRÒN ĐẶC TRƯNG TRONG ẢNH
    // Mái ngói che nửa chu vi
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, R - 2, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();

    // Rãnh ngói đất nung xếp lớp
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.5;
    for (let a = Math.PI * 0.75; a <= Math.PI * 2.25; a += 0.12) {
      const rx1 = cx + Math.cos(a) * (R - 10);
      const ry1 = cy + Math.sin(a) * (R - 10);
      const rx2 = cx + Math.cos(a) * (R + 6);
      const ry2 = cy + Math.sin(a) * (R + 6);
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();
    }
  }

  private static drawBonsaiPot(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Chậu sứ men lam
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(x - 8, y, 16, 7);
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 8, y, 16, 7);

    // Thân cây bonsai uốn lượn
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 2, y - 8, 4, 8);

    // Tán lá xanh tròn tỉa nghệ thuật
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x - 3, y - 11, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(x + 3, y - 13, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // =========================================================================
  // 5. GIÀN PHƠI VẢI HOA VĂN VÀNG & XANH (Nong phơi lụa)
  // =========================================================================
  private static drawTextileDryingRacks(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // 3 Tấm vải vàng (Hàng trên)
    for (let i = 0; i < 3; i++) {
      const fx = x + i * 26;
      const fy = y;
      // Khung gỗ
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(fx + 9, fy + 32, 4, 18);
      // Nong phơi vải vàng óng
      ctx.fillStyle = '#facc15';
      ctx.fillRect(fx, fy, 22, 32);
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(fx, fy, 22, 32);
      // Họa tiết hoa văn caro
      ctx.fillStyle = '#b45309';
      for (let p = 4; p < 28; p += 6) {
        ctx.fillRect(fx + 3, fy + p, 16, 2);
      }
    }

    // 3 Tấm vải chàm xanh (Hàng dưới)
    for (let i = 0; i < 3; i++) {
      const fx = x + 10 + i * 26;
      const fy = y + 46;
      // Khung gỗ
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(fx + 9, fy + 32, 4, 18);
      // Tấm vải xanh lam chàm
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(fx, fy, 22, 32);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(fx, fy, 22, 32);
      // Họa tiết hoa văn truyền thống
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(fx + 4, fy + 6, 14, 20);
    }
  }

  // =========================================================================
  // 6. ĐỘNG VẬT LÀNG QUÊ: MÈO ĐEN & CÚN CON
  // =========================================================================
  private static drawAnimals(ctx: CanvasRenderingContext2D, W: number, H: number, tick: number) {
    // MÈO ĐEN (Ngồi bên vệ đường cạnh giàn phơi vải)
    const catX = W * 0.28;
    const catY = H * 0.47;
    ctx.fillStyle = '#0f172a';
    // Thân mèo đen
    ctx.fillRect(catX - 6, catY - 8, 12, 14);
    // Đầu mèo
    ctx.beginPath();
    ctx.arc(catX, catY - 12, 7, 0, Math.PI * 2);
    ctx.fill();
    // Tai nhọn
    ctx.beginPath();
    ctx.moveTo(catX - 5, catY - 18);
    ctx.lineTo(catX - 1, catY - 13);
    ctx.lineTo(catX - 6, catY - 13);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(catX + 5, catY - 18);
    ctx.lineTo(catX + 1, catY - 13);
    ctx.lineTo(catX + 6, catY - 13);
    ctx.fill();
    // Đuôi cong
    const tailWag = Math.sin(tick * 0.1) * 3;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(catX - 6, catY + 4);
    ctx.quadraticCurveTo(catX - 14 + tailWag, catY - 4, catX - 10 + tailWag, catY - 12);
    ctx.stroke();

    // CÚN CON MÀU NÂU (Chó con cạnh cổng đình trên)
    const dogX = W * 0.47;
    const dogY = H * 0.36;
    ctx.fillStyle = '#b45309';
    // Thân cún
    ctx.fillRect(dogX - 6, dogY - 5, 14, 10);
    // Đầu cún
    ctx.fillRect(dogX + 4, dogY - 10, 8, 8);
    // Tai cụp
    ctx.fillStyle = '#78350f';
    ctx.fillRect(dogX + 3, dogY - 9, 3, 5);
    // Chân & đuôi vẫy
    ctx.fillRect(dogX - 5, dogY + 5, 3, 5);
    ctx.fillRect(dogX + 3, dogY + 5, 3, 5);
    const dogTail = Math.sin(tick * 0.25) * 4;
    ctx.fillRect(dogX - 9, dogY - 4 + dogTail, 4, 3);
  }

  // =========================================================================
  // 7. TRỤC ĐƯỜNG GIỮA: BỤI TRE, CÂY CHUỐI, GIẾNG ĐÁ CỔ, KIỆU RƯỚC
  // =========================================================================
  private static drawCentralProps(ctx: CanvasRenderingContext2D, W: number, H: number, tick: number) {
    const roadMidX = W * 0.58;

    // A. CÂY CHUỐI / CAU XANH TƯƠI
    const bananaX = roadMidX + 15;
    const bananaY = H * 0.51;
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(bananaX - 4, bananaY, 8, 30); // Thân
    // Tán lá chuối tỏa đều
    ctx.fillStyle = '#22c55e';
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(
        bananaX + Math.cos(angle) * 16,
        bananaY - 4 + Math.sin(angle) * 10,
        14,
        6,
        angle,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // B. BỤI TRE XANH LÀNG QUÊ (Gốc tre với các đốt tre)
    const bambooX = roadMidX + 10;
    const bambooY = H * 0.64;
    for (let b = 0; b < 4; b++) {
      const bx = bambooX + b * 9;
      const by = bambooY;
      // Thân tre xanh
      ctx.fillStyle = '#15803d';
      ctx.fillRect(bx, by - 40, 5, 45);
      // Đốt tre
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(bx - 1, by - 30, 7, 2);
      ctx.fillRect(bx - 1, by - 18, 7, 2);
      ctx.fillRect(bx - 1, by - 6, 7, 2);
      // Lá tre nhọn
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.moveTo(bx + 4, by - 32);
      ctx.lineTo(bx + 18, by - 38);
      ctx.lineTo(bx + 6, by - 30);
      ctx.fill();
    }

    // C. KIỆU RƯỚC CỔ ĐẠI VIỆT (Kiệu gỗ lim sơn thếp vàng)
    const palX = roadMidX + 120;
    const palY = H * 0.72;
    // Đòn khiêng dài 2 bên
    ctx.fillStyle = '#78350f';
    ctx.fillRect(palX - 65, palY + 4, 130, 5);
    // Thùng kiệu gỗ lim
    ctx.fillStyle = '#451a03';
    ctx.fillRect(palX - 22, palY - 26, 44, 34);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(palX - 22, palY - 26, 44, 34);
    // Mái kiệu cong cổ kính
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(palX - 30, palY - 26);
    ctx.quadraticCurveTo(palX, palY - 45, palX + 30, palY - 26);
    ctx.closePath();
    ctx.fill();
    // Chóp kiệu hoa sen vàng
    ctx.fillStyle = '#facc15';
    ctx.fillRect(palX - 4, palY - 48, 8, 6);

    // D. GIẾNG ĐÁ CỔ TRÒN (Thành đá xám, nước xanh)
    const wellX = W * 0.63;
    const wellY = H * 0.86;
    // Thành giếng đá tròn
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(wellX, wellY, 32, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Miệng giếng sâu nước xanh ngọc
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(wellX, wellY, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(wellX, wellY + 2, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Họa tiết đá xếp quanh miệng giếng
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.moveTo(wellX + Math.cos(a) * 22, wellY + Math.sin(a) * 14);
      ctx.lineTo(wellX + Math.cos(a) * 32, wellY + Math.sin(a) * 22);
      ctx.stroke();
    }
  }

  // =========================================================================
  // 8. DÃY NHÀ GỖ MÁI NGÓI ĐỎ & ĐÈN LỒNG (Bên phải)
  // =========================================================================
  private static drawTraditionalHouses(ctx: CanvasRenderingContext2D, W: number, H: number) {
    // 1. NGÔI NHÀ GỖ TRÊN (Nhà dài 4 gian)
    const house1X = W * 0.54;
    const house1Y = H * 0.23;
    const house1W = Math.min(W * 0.44, 420);
    const house1H = 95;
    this.drawWoodenHouseBlock(ctx, house1X, house1Y, house1W, house1H, true);

    // 2. NGÔI NHÀ GỖ DƯỚI (Nhà 3 gian)
    const house2X = W * 0.66;
    const house2Y = H * 0.47;
    const house2W = Math.min(W * 0.32, 320);
    const house2H = 110;
    this.drawWoodenHouseBlock(ctx, house2X, house2Y, house2W, house2H, false);
  }

  private static drawWoodenHouseBlock(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    hasLantern: boolean
  ) {
    // Thềm hiên bằng gỗ / đá
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(x, y + 35, w, h - 35);
    ctx.strokeStyle = '#3e2211';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y + 35, w, h - 35);

    // Các cột hiên gỗ lim tròn
    const numPillars = Math.floor(w / 50);
    const step = w / numPillars;
    ctx.fillStyle = '#3e2211';
    for (let i = 0; i <= numPillars; i++) {
      ctx.fillRect(x + i * step - 4, y + 35, 8, h - 35);
    }

    // Các ô cửa sổ song gỗ tiện (Lattice Windows)
    for (let i = 0; i < numPillars; i++) {
      const wx = x + i * step + 10;
      const wy = y + 45;
      const ww = step - 20;
      const wh = h - 60;
      if (ww > 12) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(wx, wy, ww, wh);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(wx, wy, ww, wh);
        // Song gỗ dọc
        for (let sx = wx + 4; sx < wx + ww - 2; sx += 5) {
          ctx.beginPath();
          ctx.moveTo(sx, wy);
          ctx.lineTo(sx, wy + wh);
          ctx.stroke();
        }
      }
    }

    // MÁI NGÓI MŨI HÀI ĐỎ RỰC (Terracotta Tile Roof)
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 36);
    ctx.lineTo(x + w + 14, y + 36);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();

    // Bờ nóc mái ngói
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(x - 6, y - 4, w + 12, 6);

    // Kẻ chỉ ngói đỏ
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1;
    for (let tx = x; tx < x + w; tx += 6) {
      ctx.beginPath();
      ctx.moveTo(tx, y);
      ctx.lineTo(tx - 4, y + 36);
      ctx.stroke();
    }

    // Đèn lồng treo góc hiên nhà
    if (hasLantern) {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(x - 8, y + 42, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Ánh sáng tỏa ra
      ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
      ctx.beginPath();
      ctx.arc(x - 8, y + 42, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // =========================================================================
  // 9. HỒ SEN / HOA SÚNG HỒNG (Góc dưới bên phải)
  // =========================================================================
  private static drawLotusPond(ctx: CanvasRenderingContext2D, cx: number, cy: number, tick: number) {
    const rx = 120;
    const ry = 65;

    // Mặt nước hồ xanh biếc trong vắt
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Viền sỏi đá quanh hồ
    ctx.fillStyle = '#64748b';
    for (let a = 0; a < Math.PI * 2; a += 0.25) {
      const sx = cx + Math.cos(a) * (rx + 4);
      const sy = cy + Math.sin(a) * (ry + 3);
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lá sen tròn xanh nổi trên mặt nước (Water lily pads)
    for (let i = 0; i < 11; i++) {
      const lx = cx - 70 + (i * 27) % (rx * 1.5);
      const ly = cy - 35 + (i * 19) % (ry * 1.3);
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(lx, ly, 11, 0, Math.PI * 1.85);
      ctx.fill();
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Hoa súng hồng nở rộ
      if (i % 2 === 0) {
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.moveTo(lx, ly - 6);
        ctx.lineTo(lx - 5, ly + 2);
        ctx.lineTo(lx + 5, ly + 2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fdf2f8';
        ctx.fillRect(lx - 1, ly - 8, 3, 3);
      }
    }
  }

  // =========================================================================
  // 10. ĐÁ CUỘI TỰ NHIÊN RẢI RÁC
  // =========================================================================
  private static drawPebbles(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const rocks = [
      [W * 0.05, H * 0.28, 12],
      [W * 0.03, H * 0.35, 16],
      [W * 0.34, H * 0.58, 20],
      [W * 0.38, H * 0.62, 14],
      [W * 0.94, H * 0.26, 18],
      [W * 0.96, H * 0.38, 14],
      [W * 0.95, H * 0.78, 18],
      [W * 0.72, H * 0.83, 10],
      [W * 0.08, H * 0.94, 22],
    ];

    ctx.fillStyle = '#78716c';
    rocks.forEach(([rx, ry, s]) => {
      ctx.beginPath();
      ctx.arc(rx, ry, s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a8a29e';
      ctx.beginPath();
      ctx.arc(rx - s * 0.25, ry - s * 0.25, s * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78716c';
    });
  }
}

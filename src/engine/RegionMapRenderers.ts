/**
 * RegionMapRenderers.ts
 * Hệ thống dựng phối cảnh Pixel Art độc quyền cho từng vùng miền và từng địa danh tại Việt Nam:
 * - Miền Bắc: Làng Cổ 5 Gian, Hoàng Thành Thăng Long & Chùa Một Cột, Làng Lụa Vạn Phúc.
 * - Miền Trung: Đại Nội Huế (Ngọ Môn & Cầu Thái Dịch), Bến Ngự Sông Hương & Thuyền Rồng, Phố Cổ Hội An.
 * - Tây Nguyên: Buôn Làng & Nhà Rông Hùng Vĩ, Thác Nước Dray Nur & Đại Ngàn Kơ-Nia.
 * - Miền Nam: Chợ Nổi Cái Răng & Rặng Dừa Nước, Vườn Cây Trái & Cầu Khỉ Nam Bộ.
 * - Hải Đảo: Bia Chủ Quyền Hoàng Sa - Trường Sa & Hải Đăng Biển Đông.
 * - Hư Không Tâm Linh: Vùng Đất Virus Lãng Quên (Final Boss Realm).
 */

import { VietnameseHouseRenderer } from './VietnameseHouseRenderer';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  canvasW: number;
  canvasH: number;
  cameraX: number;
  cameraY: number;
  worldW: number;
  worldH: number;
  tick: number;
  playerPos: { x: number; y: number };
}

export class RegionMapRenderers {
  /**
   * Điều phối vẽ bản đồ tương ứng với khu vực đang khám phá
   */
  public static renderSubArea(subAreaType: string, rc: RenderContext) {
    const { ctx } = rc;

    switch (subAreaType) {
      // 1. MIỀN BẮC
      case 'ancient_house':
        this.renderNorthAncientHouse(rc);
        break;
      case 'citadel_north':
        this.renderNorthCitadel(rc);
        break;
      case 'silk_village':
        this.renderNorthSilkVillage(rc);
        break;

      // 2. MIỀN TRUNG
      case 'imperial_hue':
        this.renderCentralImperialHue(rc);
        break;
      case 'river_hue':
        this.renderCentralHuongRiver(rc);
        break;
      case 'hoian_lantern':
        this.renderCentralHoiAn(rc);
        break;

      // 3. TÂY NGUYÊN
      case 'highland_rong':
        this.renderHighlandRongHouse(rc);
        break;
      case 'highland_waterfall':
        this.renderHighlandWaterfall(rc);
        break;

      // 4. MIỀN NAM
      case 'south_floating_market':
        this.renderSouthFloatingMarket(rc);
        break;
      case 'south_orchard':
        this.renderSouthOrchard(rc);
        break;

      // 5. HẢI ĐẢO
      case 'islands_milestone':
        this.renderIslandsMilestone(rc);
        break;
      case 'islands_lighthouse':
        this.renderIslandsLighthouse(rc);
        break;

      // 6. HƯ KHÔNG / BOSS
      case 'void_realm':
      default:
        this.renderVoidRealm(rc);
        break;
    }
  }

  // =========================================================================
  // 1. MIỀN BẮC - A. HOÀNG THÀNH THĂNG LONG & CHÙA MỘT CỘT
  // =========================================================================
  public static renderNorthCitadel(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Nền gạch đá hoàng thành màu xám lam cổ kính
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, worldW, worldH);

    // Kẻ gạch lát sân rồng Đại Việt
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let x = 0; x < worldW; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, worldH);
      ctx.stroke();
    }
    for (let y = 0; y < worldH; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(worldW, y);
      ctx.stroke();
    }

    // Hồ sen Thăng Long ở góc trái
    const lakeW = 320;
    const lakeH = 260;
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(60, 100, lakeW, lakeH);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 100, lakeW, lakeH);

    // Lá sen & hoa sen hồng bập bềnh
    for (let i = 0; i < 18; i++) {
      const lx = 80 + (i * 37) % (lakeW - 40);
      const ly = 120 + (i * 29) % (lakeH - 40);
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(lx, ly, 10, 0, Math.PI * 1.8);
      ctx.fill();

      // Nụ hoa sen hồng
      if (i % 3 === 0) {
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(lx + 2, ly - 6, 6, 8);
        ctx.fillStyle = '#fdf2f8';
        ctx.fillRect(lx + 3, ly - 8, 4, 3);
      }
    }

    // Chùa Một Cột ở giữa hồ sen
    const pagodaX = 60 + lakeW / 2;
    const pagodaY = 100 + lakeH / 2;
    // Cột đá hình trụ
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(pagodaX - 10, pagodaY - 10, 20, 50);
    // Mái chùa Một Cột mái cong ngói đỏ
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(pagodaX - 40, pagodaY - 10);
    ctx.quadraticCurveTo(pagodaX, pagodaY - 45, pagodaX + 40, pagodaY - 10);
    ctx.lineTo(pagodaX + 30, pagodaY - 20);
    ctx.lineTo(pagodaX - 30, pagodaY - 20);
    ctx.closePath();
    ctx.fill();

    // Cổng Đoan Môn sừng sững ở giữa phía trên
    const gateX = worldW * 0.55;
    const gateY = 120;
    const gateW = 420;
    const gateH = 140;

    // Tường thành gạch đá ong đỏ nâu
    ctx.fillStyle = '#78350f';
    ctx.fillRect(gateX - gateW / 2, gateY, gateW, gateH);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 3;
    ctx.strokeRect(gateX - gateW / 2, gateY, gateW, gateH);

    // 3 Cửa vòm cuốn (Vòm giữa lớn, 2 bên nhỏ)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(gateX, gateY + gateH, 45, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(gateX - 130, gateY + gateH, 30, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(gateX + 130, gateY + gateH, 30, Math.PI, 0);
    ctx.fill();

    // Vọng Lâu trên cổng thành lợp ngói đỏ
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(gateX - 140, gateY - 50, 280, 50);
    // Mái vọng lâu uốn cong Đại Việt
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(gateX - 170, gateY - 50);
    ctx.quadraticCurveTo(gateX, gateY - 95, gateX + 170, gateY - 50);
    ctx.lineTo(gateX + 130, gateY - 65);
    ctx.lineTo(gateX - 130, gateY - 65);
    ctx.closePath();
    ctx.fill();

    // Biển đồng dát vàng: "ĐOAN MÔN THĂNG LONG"
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(gateX - 70, gateY - 40, 140, 22);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(gateX - 70, gateY - 40, 140, 22);
    ctx.fillStyle = '#fef08a';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ĐOAN MÔN', gateX, gateY - 26);
    ctx.textAlign = 'start';

    // Cặp Rồng Đá thời Lý uốn lượn thềm điện
    this.drawDragonBalustrade(ctx, gateX - 60, gateY + gateH + 20);
    this.drawDragonBalustrade(ctx, gateX + 60, gateY + gateH + 20);
  }

  // =========================================================================
  // 1. MIỀN BẮC - B. LÀNG LỤA VẠN PHÚC
  // =========================================================================
  public static renderNorthSilkVillage(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Nền sân gạch làng nghề cổ truyền
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(0, 0, worldW, worldH);

    // Lối đi lát đá xanh
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, worldH * 0.45, worldW, 80);

    // Các giàn phơi lụa tơ tằm ngũ sắc tung bay
    const silkColors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 6; i++) {
      const sx = 100 + i * 160;
      const sy = 120;
      // Cột tre giàn phơi
      ctx.fillStyle = '#78350f';
      ctx.fillRect(sx, sy, 8, 140);
      ctx.fillRect(sx + 100, sy, 8, 140);
      ctx.fillRect(sx - 4, sy + 6, 116, 6);

      // Dải lụa mềm phấp phới trong gió
      const wave = Math.sin(tick * 0.08 + i) * 6;
      ctx.fillStyle = silkColors[i % silkColors.length];
      ctx.beginPath();
      ctx.moveTo(sx + 4, sy + 12);
      ctx.quadraticCurveTo(sx + 50 + wave, sy + 60, sx + 4 + wave * 0.5, sy + 130);
      ctx.lineTo(sx + 96 + wave * 0.5, sy + 130);
      ctx.quadraticCurveTo(sx + 50 + wave, sy + 60, sx + 96, sy + 12);
      ctx.closePath();
      ctx.fill();
    }

    // Xưởng dệt cửi mái lá phía dưới
    const shopW = 340;
    const shopH = 150;
    const shopX = worldW * 0.5 - shopW / 2;
    const shopY = worldH - 180;
    ctx.fillStyle = '#451a03';
    ctx.fillRect(shopX, shopY, shopW, shopH);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(shopX - 20, shopY - 30, shopW + 40, 35);

    // Bảng hiệu: "XƯỞNG LỤA VẠN PHÚC"
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(shopX + 50, shopY - 18, shopW - 100, 20);
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(shopX + 50, shopY - 18, shopW - 100, 20);
    ctx.fillStyle = '#fef08a';
    ctx.font = '8px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('LỤA VẠN PHÚC', shopX + shopW / 2, shopY - 4);
    ctx.textAlign = 'start';
  }

  // =========================================================================
  // 1. MIỀN BẮC - C. NHÀ CỔ 5 GIAN (Tích hợp nguyên mẫu chuẩn Pixel Art 100%)
  // =========================================================================
  public static renderNorthAncientHouse(rc: RenderContext) {
    VietnameseHouseRenderer.renderWorldEnvironment(rc.ctx, rc.worldW, rc.worldH, rc.tick);
  }

  // =========================================================================
  // 2. MIỀN TRUNG - A. ĐẠI NỘI HUẾ (NGỌ MÔN & CẦU THÁI DỊCH)
  // =========================================================================
  public static renderCentralImperialHue(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Nền sân Đại Nội lát đá Thanh
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, worldW, worldH);

    // Hồ sen Thái Dịch ôm trước Ngọ Môn
    const lakeY = worldH * 0.48;
    const lakeH = 140;
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, lakeY, worldW, lakeH);

    // Hoa sen & súng tím xứ Huế
    for (let i = 0; i < 24; i++) {
      const lx = (i * 53) % worldW;
      const ly = lakeY + 15 + (i * 27) % (lakeH - 30);
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(lx, ly, 12, 0, Math.PI * 1.8);
      ctx.fill();
      if (i % 2 === 0) {
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(lx + 2, ly - 7, 7, 9);
      }
    }

    // Cầu Trung Đạo lát đá bắc qua hồ Thái Dịch
    const bridgeW = 120;
    const bridgeX = (worldW - bridgeW) / 2;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(bridgeX, lakeY - 10, bridgeW, lakeH + 20);
    // Lan can đá trạm trổ sen
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bridgeX - 4, lakeY - 10, 8, lakeH + 20);
    ctx.fillRect(bridgeX + bridgeW - 4, lakeY - 10, 8, lakeH + 20);

    // NGỌ MÔN HOÀNG THÀNH (Lầu Ngũ Phụng trên đài đá)
    const nmonW = Math.min(worldW * 0.85, 780);
    const nmonH = 150;
    const nmonX = (worldW - nmonW) / 2;
    const nmonY = lakeY - nmonH - 20;

    // Đài đá chân Ngọ Môn (Đá ong & đá thanh)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(nmonX, nmonY + 50, nmonW, nmonH - 50);

    // 5 Cửa Ngọ Môn (Ngũ Môn Triều Nguyễn):
    // Cửa chính giữa: Ngọ Môn (Chỉ dành cho Vua đi)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(worldW * 0.5, nmonY + nmonH, 32, Math.PI, 0);
    ctx.fill();
    // 2 cửa Tả/Hữu Giáp (Quan văn quan võ)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(worldW * 0.5 - 90, nmonY + nmonH, 22, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(worldW * 0.5 + 90, nmonY + nmonH, 22, Math.PI, 0);
    ctx.fill();
    // 2 cửa Tả/Hữu Dịch (Binh lính voi ngựa)
    ctx.beginPath();
    ctx.arc(worldW * 0.5 - 180, nmonY + nmonH, 18, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(worldW * 0.5 + 180, nmonY + nmonH, 18, Math.PI, 0);
    ctx.fill();

    // LẦU NGŨ PHỤNG (Sơn son thếp vàng trên nóc Ngọ Môn)
    const lauW = nmonW * 0.75;
    const lauX = (worldW - lauW) / 2;
    ctx.fillStyle = '#b91c1c'; // Sơn son đỏ
    ctx.fillRect(lauX, nmonY, lauW, 55);

    // Mái ngói Hoàng Lưu Ly (màu vàng kim triều đình)
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(lauX - 30, nmonY);
    ctx.quadraticCurveTo(worldW * 0.5, nmonY - 45, lauX + lauW + 30, nmonY);
    ctx.lineTo(lauX + lauW, nmonY - 15);
    ctx.lineTo(lauX, nmonY - 15);
    ctx.closePath();
    ctx.fill();

    // Biển vàng chữ đỏ: "NGỌ MÔN"
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(worldW * 0.5 - 60, nmonY + 12, 120, 24);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(worldW * 0.5 - 60, nmonY + 12, 120, 24);
    ctx.fillStyle = '#fef08a';
    ctx.font = '9px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('NGỌ MÔN', worldW * 0.5, nmonY + 28);
    ctx.textAlign = 'start';
  }

  // =========================================================================
  // 2. MIỀN TRUNG - B. BẾN NGỰ SÔNG HƯƠNG & THUYỀN RỒNG
  // =========================================================================
  public static renderCentralHuongRiver(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Bờ sông lát cỏ xanh pha sỏi
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 0, worldW, worldH * 0.35);

    // Dòng sông Hương xanh biếc êm đềm
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, worldH * 0.35, worldW, worldH * 0.65);

    // Gợn sóng lấp lánh nước sông Hương
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    for (let y = worldH * 0.38; y < worldH; y += 30) {
      const waveOffset = Math.sin(tick * 0.05 + y) * 20;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(worldW * 0.25 + waveOffset, y - 6, worldW * 0.5, y);
      ctx.quadraticCurveTo(worldW * 0.75 - waveOffset, y + 6, worldW, y);
      ctx.stroke();
    }

    // Cầu Tràng Tiền sáu vài mười hai nhịp ở xa xa
    const bridgeY = worldH * 0.33;
    ctx.fillStyle = '#e2e8f0';
    for (let s = 40; s < worldW - 40; s += 140) {
      ctx.beginPath();
      ctx.arc(s + 60, bridgeY, 50, Math.PI, 0);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // Thuyền rồng Hoàng Gia đậu bến ngự
    const boatX = worldW * 0.48;
    const boatY = worldH * 0.58;
    this.drawDragonBoat(ctx, boatX, boatY, tick);

    // Bến Ngự tam cấp đá bước xuống sông
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(boatX - 160, worldH * 0.3, 80, 50);
  }

  // =========================================================================
  // 2. MIỀN TRUNG - C. PHỐ CỔ HỘI AN ĐÈN LỒNG
  // =========================================================================
  public static renderCentralHoiAn(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Nền phố đêm Hội An màu vàng hoa cau / vàng hoài niệm
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, worldW, worldH);

    // Dãy nhà cổ tường vàng mái ngói âm dương
    const houseW = 160;
    for (let i = 0; i < Math.ceil(worldW / houseW); i++) {
      const hx = i * houseW;
      // Tường vàng đặc trưng Hội An
      ctx.fillStyle = '#d97706';
      ctx.fillRect(hx, 60, houseW - 4, 180);
      // Mái ngói âm dương xám rêu
      ctx.fillStyle = '#44403c';
      ctx.beginPath();
      ctx.moveTo(hx - 8, 60);
      ctx.lineTo(hx + houseW * 0.5, 20);
      ctx.lineTo(hx + houseW + 4, 60);
      ctx.closePath();
      ctx.fill();

      // Cửa gỗ đen nâu
      ctx.fillStyle = '#292524';
      ctx.fillRect(hx + 30, 130, 45, 90);
      ctx.fillRect(hx + 90, 130, 45, 90);

      // Hàng lồng đèn lung linh treo hiên nhà
      const lanternCols = ['#ef4444', '#f59e0b', '#ec4899', '#3b82f6', '#10b981'];
      for (let l = 0; l < 3; l++) {
        const lx = hx + 25 + l * 45;
        const ly = 75 + Math.sin(tick * 0.1 + l + i) * 3;
        ctx.fillStyle = lanternCols[(i + l) % lanternCols.length];
        ctx.beginPath();
        ctx.arc(lx, ly, 10, 0, Math.PI * 2);
        ctx.fill();
        // Ánh sáng lồng đèn tỏa ra
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.beginPath();
        ctx.arc(lx, ly, 22, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sông Hoài ở nửa dưới
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, worldH * 0.65, worldW, worldH * 0.35);

    // Hoa đăng thả trôi trên sông Hoài
    for (let h = 0; h < 14; h++) {
      const hdx = (h * 73 + tick * 0.5) % worldW;
      const hdy = worldH * 0.72 + (h * 19) % (worldH * 0.22);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(hdx - 6, hdy - 3, 12, 6);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(hdx - 2, hdy - 8, 4, 6);
    }
  }

  // =========================================================================
  // 3. TÂY NGUYÊN - A. NHÀ RÔNG BUÔN ĐÔN & LỬA THIÊNG
  // =========================================================================
  public static renderHighlandRongHouse(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Đất đỏ bazan trứ danh Tây Nguyên
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(0, 0, worldW, worldH);

    // Đồng cỏ dã quỳ hoa vàng nở rộ hai bên
    for (let i = 0; i < 40; i++) {
      const qx = (i * 47) % worldW;
      const qy = (i * 39) % worldH;
      if (Math.abs(qx - worldW * 0.5) > 160) {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(qx, qy, 8, 12);
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(qx + 4, qy - 2, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // NHÀ RÔNG CAO VÚT BUÔN ĐÔN
    const rongW = 280;
    const rongH = 290;
    const rongX = (worldW - rongW) / 2;
    const rongY = worldH * 0.12;

    // Cột gỗ sàn nhà rông nâng cao
    ctx.fillStyle = '#451a03';
    for (let c = 0; c < 6; c++) {
      ctx.fillRect(rongX + 25 + c * 45, rongY + 160, 14, 80);
    }
    // Sàn gỗ tre
    ctx.fillStyle = '#78350f';
    ctx.fillRect(rongX + 10, rongY + 150, rongW - 20, 20);

    // Thân nhà sàn có vách nứa hoa văn thổ cẩm
    ctx.fillStyle = '#92400e';
    ctx.fillRect(rongX + 20, rongY + 90, rongW - 40, 60);

    // MÁI NHÀ RÔNG CAO VÚT NHƯ LƯỠI RÌU
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(rongX, rongY + 95);
    ctx.lineTo(rongX + rongW * 0.5, rongY);
    ctx.lineTo(rongX + rongW, rongY + 95);
    ctx.closePath();
    ctx.fill();

    // Họa tiết đỉnh mái nhà rông
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(rongX + rongW * 0.5 - 12, rongY - 14, 24, 18);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.strokeRect(rongX + rongW * 0.5 - 12, rongY - 14, 24, 18);

    // ĐỐNG LỬA THIÊNG BẬP BÙNG GIỮA SÂN
    const fireX = worldW * 0.5;
    const fireY = worldH * 0.62;
    // Củi gỗ tròn bắt chéo
    ctx.fillStyle = '#3f1d0b';
    ctx.fillRect(fireX - 25, fireY + 10, 50, 10);
    ctx.fillRect(fireX - 10, fireY - 5, 20, 30);

    // Ngọn lửa thiêng linh hồn buôn làng
    const flameH = 30 + Math.sin(tick * 0.2) * 8;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(fireX - 18, fireY + 10);
    ctx.quadraticCurveTo(fireX, fireY - flameH, fireX + 18, fireY + 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(fireX - 10, fireY + 10);
    ctx.quadraticCurveTo(fireX, fireY - flameH * 0.7, fireX + 10, fireY + 10);
    ctx.closePath();
    ctx.fill();

    // Dàn cồng chiêng đồng treo trên giá gỗ bên phải
    this.drawCongChiengStand(ctx, rongX + rongW + 40, worldH * 0.45);
  }

  // =========================================================================
  // 3. TÂY NGUYÊN - B. THÁC NƯỚC DRAY NUR & RỪNG KƠ-NIA
  // =========================================================================
  public static renderHighlandWaterfall(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Rừng già rậm rạp màu xanh sẫm
    ctx.fillStyle = '#14532d';
    ctx.fillRect(0, 0, worldW, worldH);

    // Vách đá Basalt hùng vĩ
    ctx.fillStyle = '#334155';
    ctx.fillRect(worldW * 0.25, 0, worldW * 0.5, worldH * 0.6);

    // Dòng thác Dray Nur đổ bọt trắng xóa
    const fallW = 160;
    const fallX = (worldW - fallW) / 2;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(fallX, 0, fallW, worldH * 0.6);

    // Bọt nước tung trắng xóa
    ctx.fillStyle = '#f8fafc';
    for (let i = 0; i < 30; i++) {
      const fy = (tick * 8 + i * 20) % (worldH * 0.6);
      const fx = fallX + (i * 23) % fallW;
      ctx.fillRect(fx, fy, 12, 18);
    }

    // Hồ nước dưới chân thác
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, worldH * 0.6, worldW, worldH * 0.4);

    // Cây Kơ-nia cổ thụ tỏa bóng hai bên
    this.drawKoNiaTree(ctx, 120, worldH * 0.4);
    this.drawKoNiaTree(ctx, worldW - 140, worldH * 0.4);
  }

  // =========================================================================
  // 4. MIỀN NAM - A. CHỢ NỔI CÁI RĂNG & RẶNG DỪA NƯỚC
  // =========================================================================
  public static renderSouthFloatingMarket(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Nước sông Tiền phù sa đục đỏ mỡ màng
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, worldW, worldH);

    // Rặng dừa nước soi bóng hai bên bờ
    for (let x = 0; x < worldW; x += 60) {
      this.drawWaterCoconut(ctx, x, 40);
      this.drawWaterCoconut(ctx, x, worldH - 60);
    }

    // Các ghe xuồng chợ nổi đầy hoa trái
    for (let g = 0; g < 5; g++) {
      const gx = 140 + g * 180;
      const gy = worldH * 0.4 + Math.sin(tick * 0.06 + g) * 8;
      this.drawMarketBoat(ctx, gx, gy, g);
    }
  }

  // =========================================================================
  // 4. MIỀN NAM - B. VƯỜN CÂY TRÁI & CẦU KHỈ
  // =========================================================================
  public static renderSouthOrchard(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Vườn cỏ cây trái Nam Bộ
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, worldW, worldH);

    // Mương rạch dẫn nước phù sa cắt ngang
    const canalY = worldH * 0.46;
    const canalH = 90;
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(0, canalY, worldW, canalH);

    // CẦU KHỈ TRE LẮC LẺO BẮC QUA KÊNH
    const bridgeX = worldW * 0.5;
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 5;
    // Cây tre thân cầu
    ctx.beginPath();
    ctx.moveTo(bridgeX - 40, canalY - 10);
    ctx.lineTo(bridgeX + 40, canalY + canalH + 10);
    ctx.stroke();
    // Tay vịn tre
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bridgeX - 25, canalY - 25);
    ctx.lineTo(bridgeX + 55, canalY + canalH);
    ctx.stroke();

    // Nhà lá ba gian Nam Bộ ở góc trên
    const houseW = 260;
    const houseH = 110;
    const houseX = worldW * 0.2;
    const houseY = 60;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(houseX, houseY + 30, houseW, houseH - 30);
    // Mái lá dừa nước
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.moveTo(houseX - 20, houseY + 30);
    ctx.lineTo(houseX + houseW * 0.5, houseY);
    ctx.lineTo(houseX + houseW + 20, houseY + 30);
    ctx.closePath();
    ctx.fill();
  }

  // =========================================================================
  // 5. HẢI ĐẢO - A. BIA CHỦ QUYỀN HOÀNG SA - TRƯỜNG SA
  // =========================================================================
  public static renderIslandsMilestone(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Biển xanh ngắt ngút ngàn Biển Đông
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, worldW, worldH);

    // Đảo cát trắng san hô ở trung tâm
    const islandW = Math.min(worldW * 0.8, 800);
    const islandH = 340;
    const islandX = (worldW - islandW) / 2;
    const islandY = (worldH - islandH) / 2;

    ctx.fillStyle = '#fef3c7'; // Bãi cát san hô vàng óng
    ctx.beginPath();
    ctx.ellipse(worldW * 0.5, worldH * 0.52, islandW * 0.5, islandH * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // BIA CHỦ QUYỀN ĐÁ HOA CƯƠNG ĐẠI VIỆT
    const msX = worldW * 0.5;
    const msY = worldH * 0.42;

    // Bệ đá tam cấp
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(msX - 50, msY + 40, 100, 20);
    ctx.fillRect(msX - 40, msY + 25, 80, 15);

    // Cột bia đá hoa cương màu đỏ thắm
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(msX - 24, msY - 50, 48, 75);
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(msX - 24, msY - 50);
    ctx.lineTo(msX, msY - 70);
    ctx.lineTo(msX + 24, msY - 50);
    ctx.closePath();
    ctx.fill();

    // Quốc huy / Ngôi sao vàng & Tên quần đảo
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(msX, msY - 40, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '6px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('HOÀNG SA', msX, msY - 18);
    ctx.fillText('TRƯỜNG SA', msX, msY - 6);
    ctx.fillText('VIỆT NAM', msX, msY + 6);
    ctx.textAlign = 'start';

    // Cột cờ Tổ quốc với lá cờ đỏ sao vàng tung bay phần phật
    const flagX = msX + 80;
    const flagY = msY - 20;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(flagX, flagY - 80, 4, 120); // Cột cờ inox

    // Lá cờ đỏ sao vàng tung bay
    const wave = Math.sin(tick * 0.15) * 5;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(flagX + 4, flagY - 80);
    ctx.quadraticCurveTo(flagX + 25, flagY - 80 + wave, flagX + 50, flagY - 80);
    ctx.lineTo(flagX + 50, flagY - 50);
    ctx.quadraticCurveTo(flagX + 25, flagY - 50 + wave, flagX + 4, flagY - 50);
    ctx.closePath();
    ctx.fill();

    // Ngôi sao vàng trên cờ
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(flagX + 26, flagY - 65 + wave * 0.5, 6, 0, Math.PI * 2);
    ctx.fill();

    // Cây bàng vuông kiên cường trước sóng gió
    this.drawBangVuongTree(ctx, msX - 140, msY + 20);
    this.drawBangVuongTree(ctx, msX + 160, msY + 50);
  }

  // =========================================================================
  // 5. HẢI ĐẢO - B. NGỌN HẢI ĐĂNG CỔ KÍNH
  // =========================================================================
  public static renderIslandsLighthouse(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, worldW, worldH);

    // Mỏm đá san hô cao
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(worldW * 0.5, worldH * 0.7, 240, Math.PI, 0);
    ctx.fill();

    // Ngọn hải đăng cao vút
    const lhX = worldW * 0.5;
    const lhY = worldH * 0.25;
    // Tháp hải đăng sọc đỏ trắng
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(lhX - 25, lhY, 50, 160);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(lhX - 25, lhY + 35, 50, 30);
    ctx.fillRect(lhX - 25, lhY + 95, 50, 30);

    // Đèn pha phát sáng xoay tròn
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lhX - 30, lhY - 25, 60, 25);
    // Luồng sáng quét ngang biển
    const lightAngle = tick * 0.04;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.beginPath();
    ctx.moveTo(lhX, lhY - 12);
    ctx.arc(lhX, lhY - 12, 340, lightAngle - 0.25, lightAngle + 0.25);
    ctx.closePath();
    ctx.fill();
  }

  // =========================================================================
  // 6. HƯ KHÔNG TÂM LINH (OBLIVION REALM / BOSS)
  // =========================================================================
  public static renderVoidRealm(rc: RenderContext) {
    const { ctx, worldW, worldH, tick } = rc;

    // Ma trận không gian glitch tím đen
    ctx.fillStyle = '#0a0210';
    ctx.fillRect(0, 0, worldW, worldH);

    // Lưới Cyber không gian bị xé rách
    ctx.strokeStyle = '#581c87';
    ctx.lineWidth = 1;
    for (let x = 0; x < worldW; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, worldH);
      ctx.stroke();
    }
    for (let y = 0; y < worldH; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(worldW, y);
      ctx.stroke();
    }

    // Các mảnh vỡ ký ức cổ phục bay lơ lửng và tan biến
    for (let i = 0; i < 20; i++) {
      const px = (i * 89 + tick * 1.5) % worldW;
      const py = (i * 73 + Math.sin(tick * 0.05 + i) * 30) % worldH;
      ctx.fillStyle = i % 2 === 0 ? '#ec4899' : '#06b6d4';
      ctx.fillRect(px, py, 14, 14);
      // Glitch shadow
      ctx.fillStyle = 'rgba(255, 0, 80, 0.4)';
      ctx.fillRect(px + 4, py + 4, 14, 14);
    }
  }

  // =========================================================================
  // CÁC HÀM TIỆN ÍCH VẼ CHI TIẾT
  // =========================================================================
  private static drawDragonBalustrade(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 12, y, 24, 60);
    // Đầu rồng đá
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x - 16, y - 14, 32, 16);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 4, y - 10, 8, 8);
  }

  private static drawDragonBoat(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number) {
    const floatY = y + Math.sin(tick * 0.08) * 4;
    // Thân thuyền rồng gỗ thếp vàng
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(x - 120, floatY);
    ctx.quadraticCurveTo(x, floatY + 35, x + 120, floatY);
    ctx.lineTo(x + 90, floatY - 20);
    ctx.lineTo(x - 90, floatY - 20);
    ctx.closePath();
    ctx.fill();

    // Mũi rồng vươn cao
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 100, floatY - 45, 30, 35);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + 115, floatY - 40, 15, 10);

    // Mui thuyền cung đình thếp vàng
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x - 60, floatY - 40, 120, 25);
  }

  private static drawBananaPlant(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number) {
    // Thân cây chuối
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(x - 6, y, 12, 60);

    // Tàu lá chuối xòe rộng
    ctx.fillStyle = '#22c55e';
    for (let a = -1; a <= 1; a += 0.7) {
      ctx.beginPath();
      ctx.ellipse(x + a * 25, y - 10, 32, 10, a * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Buồng chuối trĩu quả
    ctx.fillStyle = '#eab308';
    ctx.fillRect(x - 8, y + 25, 16, 20);

    // Bắp chuối tím
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 45);
    ctx.lineTo(x + 6, y + 45);
    ctx.lineTo(x, y + 62);
    ctx.closePath();
    ctx.fill();
  }

  private static drawWaterJar(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 14, y - 22, 28, 6);
  }

  private static drawCongChiengStand(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Giá gỗ
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x, y, 120, 8);
    ctx.fillRect(x + 10, y, 8, 90);
    ctx.fillRect(x + 100, y, 8, 90);

    // 3 Cồng chiêng bằng đồng
    for (let i = 0; i < 3; i++) {
      const cx = x + 30 + i * 30;
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(cx, y + 35, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#713f12';
      ctx.beginPath();
      ctx.arc(cx, y + 35, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private static drawKoNiaTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 16, y, 32, 120);
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(x, y - 30, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x - 20, y - 50, 60, 0, Math.PI * 2);
    ctx.fill();
  }

  private static drawWaterCoconut(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  private static drawMarketBoat(ctx: CanvasRenderingContext2D, x: number, y: number, fruitType: number) {
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(x, y, 55, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cây bẹo treo trái cây
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x + 35, y - 45, 4, 45);

    // Trái cây trưng bày trên ghe
    const fruitColors = ['#eab308', '#dc2626', '#16a34a', '#ea580c', '#8b5cf6'];
    ctx.fillStyle = fruitColors[fruitType % fruitColors.length];
    ctx.beginPath();
    ctx.arc(x + 37, y - 45, 8, 0, Math.PI * 2);
    ctx.fill();

    // Khóm dưa trên khoang thuyền
    for (let f = -25; f <= 25; f += 12) {
      ctx.fillRect(x + f, y - 6, 10, 8);
    }
  }

  private static drawBangVuongTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 8, y, 16, 50);
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x, y - 15, 35, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * CollisionSystem.ts
 * Hệ thống phát hiện và xử lý va chạm vật lý cho RPG Pixel Art 2D:
 * - Vật thể cứng: Tường nhà, cột lim, mái hiên, đống củi, bụi chuối, gian chái, tường thành, bia đá.
 * - Vùng nước sâu: Hồ sen Chùa Một Cột, Hồ sen Thái Dịch, Sông Hương, Hồ chân thác Dray Nur, Kênh rạch chợ nổi.
 * - Va chạm NPC: Người chơi không thể đi xuyên qua người NPC.
 * - Hỗ trợ trượt mượt mà (smooth wall-sliding) theo trục X và Y.
 */

export interface RectCollider {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  type?: 'solid' | 'water';
}

export class CollisionSystem {
  /**
   * Lấy danh sách các hộp va chạm của khu vực bản đồ hiện tại
   */
  public static getCollidersForScenery(
    sceneryType: string,
    worldW: number,
    worldH: number
  ): RectCollider[] {
    const colliders: RectCollider[] = [];

    // 1. Viền biên bản đồ
    colliders.push(
      { x: -50, y: -50, w: worldW + 100, h: 80, label: 'Biên trên', type: 'solid' },
      { x: -50, y: worldH - 35, w: worldW + 100, h: 80, label: 'Biên dưới', type: 'solid' },
      { x: -50, y: -50, w: 85, h: worldH + 100, label: 'Biên trái', type: 'solid' },
      { x: worldW - 35, y: -50, w: 85, h: worldH + 100, label: 'Biên phải', type: 'solid' }
    );

    switch (sceneryType) {
      // =====================================================================
      // 1. MIỀN BẮC - LÀNG CỔ ĐẠI VIỆT (NHÀ 5 GIAN NGUYÊN MẪU)
      // =====================================================================
      case 'ancient_house': {
        const houseX = worldW * 0.5; // 600
        const houseY = Math.max(160, worldH * 0.32); // 256
        const houseW = Math.min(worldW * 0.88, 760); // 760
        const houseLeft = houseX - houseW * 0.5; // 220
        const houseRight = houseX + houseW * 0.5; // 980

        // A. Rừng cây rậm phía sau nhà (không thể đi vào rừng)
        colliders.push({
          x: 0,
          y: 0,
          w: worldW,
          h: houseY - 30,
          label: 'Rừng cây sau nhà',
          type: 'solid',
        });

        // B. Khối nhà 5 gian chính: Mái ngói, tường lim, hàng cột hiên và cửa bức bàn
        // Sân gạch bắt đầu từ houseY + 86 (khoảng y: 342). Vùng nhà từ y: 0 đến 340 là vật cứng
        colliders.push({
          x: houseLeft - 10,
          y: houseY - 40,
          w: houseW + 20,
          h: 125,
          label: 'Nhà 5 gian cổ truyền',
          type: 'solid',
        });

        // C. Gian chái tường vôi & chum sành nước mưa bên trái
        colliders.push({
          x: houseLeft - 105,
          y: houseY - 20,
          w: 100,
          h: 140,
          label: 'Gian chái tường vôi',
          type: 'solid',
        });

        // Chum sành gốm nung múc nước mưa
        colliders.push({
          x: 215,
          y: 300,
          w: 48,
          h: 48,
          label: 'Chum sành nước mưa',
          type: 'solid',
        });

        // D. Đống củi gỗ tròn & rặng chuối tiêu bên phải
        colliders.push({
          x: houseRight + 5,
          y: houseY - 10,
          w: 140,
          h: 155,
          label: 'Bụi chuối tiêu & đống củi khô',
          type: 'solid',
        });

        colliders.push({
          x: 810,
          y: 395,
          w: 60,
          h: 50,
          label: 'Đống củi sân trước',
          type: 'solid',
        });

        // E. Ao sen làng cổ (Hồ nước phong thủy - Người chơi KHÔNG THỂ BĂNG QUA NƯỚC)
        colliders.push({
          x: 75,
          y: worldH - 225,
          w: 175,
          h: 145,
          label: 'Ao Sen Làng Cổ',
          type: 'water',
        });
        break;
      }

      // =====================================================================
      // 2. MIỀN BẮC - HOÀNG THÀNH THĂNG LONG & CHÙA MỘT CỘT
      // =====================================================================
      case 'citadel_north': {
        // A. Hồ sen Chùa Một Cột (HỒ NƯỚC CỨNG - KHÔNG THỂ ĐI VÀO NƯỚC)
        colliders.push({
          x: 90,
          y: 190,
          w: 260,
          h: 180,
          label: 'Hồ sen Chùa Một Cột',
          type: 'water',
        });

        // B. Chùa Một Cột chính giữa hồ
        colliders.push({
          x: 180,
          y: 240,
          w: 80,
          h: 80,
          label: 'Trụ đá Chùa Một Cột',
          type: 'solid',
        });

        // C. Tường thành Đoan Môn sừng sững bên phải
        const gateX = worldW * 0.55;
        const gateY = 120;
        const gateW = 420;
        const gateH = 140;

        // Cánh tường thành trái
        colliders.push({
          x: gateX - gateW / 2,
          y: gateY,
          w: 160,
          h: gateH,
          label: 'Tường thành Đoan Môn trái',
          type: 'solid',
        });

        // Cánh tường thành phải
        colliders.push({
          x: gateX + 50,
          y: gateY,
          w: 160,
          h: gateH,
          label: 'Tường thành Đoan Môn phải',
          type: 'solid',
        });

        // Lan can Rồng đá thời Lý hai bên thềm điện
        colliders.push(
          { x: gateX - 90, y: gateY + gateH - 10, w: 35, h: 45, label: 'Rồng đá thời Lý T', type: 'solid' },
          { x: gateX + 55, y: gateY + gateH - 10, w: 35, h: 45, label: 'Rồng đá thời Lý P', type: 'solid' }
        );
        break;
      }

      // =====================================================================
      // 3. MIỀN BẮC - LÀNG LỤA CỔ TRUYỀN VẠN PHÚC
      // =====================================================================
      case 'silk_village': {
        // Các giàn phơi lụa tơ tằm
        for (let i = 0; i < 6; i++) {
          const sx = 100 + i * 160;
          const sy = 120;
          colliders.push({
            x: sx - 4,
            y: sy,
            w: 118,
            h: 90,
            label: `Giàn phơi lụa ngũ sắc ${i + 1}`,
            type: 'solid',
          });
        }

        // Xưởng dệt cửi phía dưới
        const shopW = 340;
        const shopH = 140;
        const shopX = worldW * 0.5 - shopW / 2;
        const shopY = worldH - 170;
        colliders.push({
          x: shopX,
          y: shopY,
          w: shopW,
          h: shopH,
          label: 'Xưởng dệt lụa Vạn Phúc',
          type: 'solid',
        });
        break;
      }

      // =====================================================================
      // 4. MIỀN TRUNG - ĐẠI NỘI HUẾ & NGỌ MÔN
      // =====================================================================
      case 'imperial_hue': {
        const lakeY = worldH * 0.48; // 384
        const lakeH = 135;

        // Hồ sen Thái Dịch ôm trước Ngọ Môn (Hồ nước - chỉ Cầu Trung Đạo đi được)
        // Hồ bên trái
        colliders.push({
          x: 0,
          y: lakeY,
          w: worldW * 0.42,
          h: lakeH,
          label: 'Hồ sen Thái Dịch (Bên trái)',
          type: 'water',
        });

        // Hồ bên phải
        colliders.push({
          x: worldW * 0.58,
          y: lakeY,
          w: worldW * 0.42,
          h: lakeH,
          label: 'Hồ sen Thái Dịch (Bên phải)',
          type: 'water',
        });

        // Thành Cổ Ngọ Môn & Lầu Ngũ Phụng
        const ngoX = worldW * 0.5;
        const ngoY = 140;
        const ngoW = 600;
        const ngoH = 130;

        // Cánh thành cung đình bên trái
        colliders.push({
          x: ngoX - ngoW / 2,
          y: ngoY,
          w: 240,
          h: ngoH,
          label: 'Ngọ Môn thành cánh trái',
          type: 'solid',
        });

        // Cánh thành cung đình bên phải
        colliders.push({
          x: ngoX + 60,
          y: ngoY,
          w: 240,
          h: ngoH,
          label: 'Ngọ Môn thành cánh phải',
          type: 'solid',
        });
        break;
      }

      // =====================================================================
      // 5. MIỀN TRUNG - BẾN NGỰ SÔNG HƯƠNG & THUYỀN RỒNG
      // =====================================================================
      case 'river_hue': {
        const riverY = worldH * 0.45; // 360
        // Dòng sông Hương sâu thẳm (Ngoại trừ bến ngự và boong thuyền rồng)
        colliders.push({
          x: 0,
          y: riverY,
          w: worldW * 0.38,
          h: worldH - riverY,
          label: 'Dòng sông Hương (Phía Tây)',
          type: 'water',
        });

        colliders.push({
          x: worldW * 0.72,
          y: riverY,
          w: worldW * 0.28,
          h: worldH - riverY,
          label: 'Dòng sông Hương (Phía Đông)',
          type: 'water',
        });

        // Nước sâu phía dưới thuyền rồng
        colliders.push({
          x: 0,
          y: worldH - 120,
          w: worldW,
          h: 120,
          label: 'Lòng sông sâu',
          type: 'water',
        });
        break;
      }

      // =====================================================================
      // 6. MIỀN TRUNG - PHỐ CỔ HỘI AN
      // =====================================================================
      case 'hoian_lantern': {
        // Dãy nhà cổ tường vàng hoa cau phía trên
        colliders.push({
          x: 0,
          y: 0,
          w: worldW,
          h: 220,
          label: 'Dãy nhà cổ tường vàng Hội An',
          type: 'solid',
        });

        // Dãy cửa hiệu phố cổ phía dưới
        colliders.push({
          x: 0,
          y: worldH - 140,
          w: worldW * 0.42,
          h: 140,
          label: 'Hiệu buôn phố cổ T',
          type: 'solid',
        });
        colliders.push({
          x: worldW * 0.58,
          y: worldH - 140,
          w: worldW * 0.42,
          h: 140,
          label: 'Hiệu buôn phố cổ P',
          type: 'solid',
        });
        break;
      }

      // =====================================================================
      // 7. TÂY NGUYÊN - NHÀ RÔNG & THÁC DRAY NUR
      // =====================================================================
      case 'highland_rong': {
        const rongX = worldW * 0.5;
        const rongY = 160;
        const rongW = 280;
        const rongH = 260;

        // Thân Nhà Rông sàn cao vút
        colliders.push({
          x: rongX - rongW / 2,
          y: rongY,
          w: rongW,
          h: rongH - 40,
          label: 'Nhà Rông đại ngàn',
          type: 'solid',
        });

        // Cây Kơ-nia cổ thụ bên trái
        colliders.push({
          x: 100,
          y: 120,
          w: 120,
          h: 180,
          label: 'Gốc cây Kơ-nia cổ thụ',
          type: 'solid',
        });
        break;
      }

      case 'highland_waterfall': {
        // Vách đá dựng đứng thác Dray Nur
        colliders.push({
          x: 0,
          y: 0,
          w: worldW,
          h: 240,
          label: 'Vách đá thác Dray Nur',
          type: 'solid',
        });

        // Hồ nước sâu cuộn xoáy chân thác (HỒ NƯỚC - KHÔNG THỂ BĂNG QUA)
        colliders.push({
          x: 200,
          y: 220,
          w: 800,
          h: 220,
          label: 'Hồ nước sâu chân thác',
          type: 'water',
        });
        break;
      }

      // =====================================================================
      // 8. MIỀN NAM - CHỢ NỔI CÁI RĂNG & VƯỜN CÂY TRÁI
      // =====================================================================
      case 'south_floating_market': {
        // Vùng kênh rạch sông Tiền sông Hậu (Chỉ đi trên các ghe thuyền & cầu ván)
        colliders.push(
          { x: 0, y: 0, w: worldW * 0.35, h: 260, label: 'Lạch nước sâu Tây Bắc', type: 'water' },
          { x: worldW * 0.65, y: 0, w: worldW * 0.35, h: 260, label: 'Lạch nước sâu Đông Bắc', type: 'water' },
          { x: 0, y: worldH - 240, w: worldW * 0.32, h: 240, label: 'Lạch nước sâu Tây Nam', type: 'water' },
          { x: worldW * 0.68, y: worldH - 240, w: worldW * 0.32, h: 240, label: 'Lạch nước sâu Đông Nam', type: 'water' }
        );
        break;
      }

      // =====================================================================
      // 9. HẢI ĐẢO - BIA CHỦ QUYỀN & HẢI ĐĂNG
      // =====================================================================
      case 'islands_milestone':
      case 'islands_lighthouse': {
        // Biển Đông nước sâu bao bọc xung quanh đảo cát
        colliders.push(
          { x: 0, y: 0, w: worldW, h: 120, label: 'Biển Đông Bắc', type: 'water' },
          { x: 0, y: worldH - 120, w: worldW, h: 120, label: 'Biển Đông Nam', type: 'water' },
          { x: 0, y: 0, w: 140, h: worldH, label: 'Biển Đông Tây', type: 'water' },
          { x: worldW - 140, y: 0, w: 140, h: worldH, label: 'Biển Đông', type: 'water' }
        );

        // Bia chủ quyền / Tháp Hải Đăng
        colliders.push({
          x: worldW * 0.5 - 45,
          y: 200,
          w: 90,
          h: 90,
          label: 'Cột mốc chủ quyền thiêng liêng',
          type: 'solid',
        });
        break;
      }

      default:
        break;
    }

    return colliders;
  }

  /**
   * Kiểm tra tọa độ mục tiêu có bị chặn bởi vật cứng hoặc mặt nước hay không
   * Có tính đến bán kính người chơi (radius ~14px)
   */
  public static isBlocked(
    px: number,
    py: number,
    sceneryType: string,
    worldW: number,
    worldH: number,
    npcs: Array<{ x: number; y: number }> = [],
    playerRadius: number = 14
  ): boolean {
    // 1. Kiểm tra va chạm với NPC (Người chơi không thể đi xuyên qua NPC)
    for (const npc of npcs) {
      const dist = Math.hypot(px - npc.x, py - npc.y);
      if (dist < playerRadius + 16) {
        return true;
      }
    }

    // 2. Kiểm tra va chạm với các vật thể cứng và hồ nước
    const colliders = this.getCollidersForScenery(sceneryType, worldW, worldH);

    for (const box of colliders) {
      // Hộp va chạm mở rộng thêm bán kính người chơi
      const left = box.x - playerRadius;
      const right = box.x + box.w + playerRadius;
      const top = box.y - playerRadius;
      const bottom = box.y + box.h + playerRadius;

      if (px >= left && px <= right && py >= top && py <= bottom) {
        return true;
      }
    }

    return false;
  }
}

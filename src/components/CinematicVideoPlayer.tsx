import React, { useRef, useEffect, useState } from 'react';
import { soundEngine } from '../utils/audio';

interface CinematicVideoPlayerProps {
  type: 'intro' | 'outro';
  onComplete: () => void;
  videoUrl?: string; // Optional direct mp4 file/url
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({
  type,
  onComplete,
  videoUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoElemRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const totalDuration = type === 'intro' ? 24 : 36; // Intro 24s, Outro 36s for deep story reveal
  const timeRef = useRef<number>(0);

  // Controls video playback loop
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();
    timeRef.current = 0;

    // Start background theme sound
    if (type === 'intro') {
      soundEngine.playTone(350, 'sawtooth', 0.15);
      soundEngine.playBGM('boss');
    } else {
      soundEngine.playBGM('peaceful');
      soundEngine.playLevelUp();
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth || 800;
        canvasRef.current.height = window.innerHeight || 600;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      timeRef.current += dt;
      const currentT = timeRef.current;
      setCurrentTime(currentT);

      if (currentT >= totalDuration) {
        onComplete();
        return;
      }

      // Draw canvas animation sequence
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          const W = canvas.width;
          const H = canvas.height;
          ctx.clearRect(0, 0, W, H);

          if (type === 'intro') {
            drawIntroScene(ctx, W, H, currentT, now);
          } else {
            drawOutroScene(ctx, W, H, currentT, now);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete, totalDuration, type]);

  // =========================================================================
  // INTRO CANVAS VIDEO SCENES (9 SHOTS THEO ĐÚNG VIDEO NGƯỜI DÙNG CUNG CẤP)
  // =========================================================================
  const drawIntroScene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    t: number,
    now: number
  ) => {
    // 0:00 - 0:04 (Scene 1): Phòng Lab 2026 & Capsule chứa Áo Dài bị Virus Lãng Quên bao trùm
    if (t < 4.0) {
      drawLabScene(ctx, W, H, t, now);
    }
    // 0:04 - 0:07 (Scene 2): Báo động đỏ "DANGER: DATA CORRUPTION" & Lời kêu gọi của nhà khoa học
    else if (t < 7.5) {
      drawGlitchCorruptionScene(ctx, W, H, t, now);
    }
    // 0:07 - 0:11 (Scene 3): Bệ Chrono-Dive khởi động, vòng xoáy plasma xanh neon
    else if (t < 11.5) {
      drawChronoDiveStartScene(ctx, W, H, t, now);
    }
    // 0:11 - 0:17 (Scene 4): Đường hầm xuyên không! Trống Đồng Đông Sơn, Rồng Lửa Thăng Long
    else if (t < 17.5) {
      drawWarpTunnelScene(ctx, W, H, t, now);
    }
    // 0:17 - 0:24 (Scene 5): Hiện ra thế giới cổ phong hùng vĩ & Logo Title Drop
    else {
      drawTitleDropScene(ctx, W, H, t, now);
    }

    // Hiệu ứng điện tử Scanlines & Glitch nhẹ
    drawScanlines(ctx, W, H, now);
  };

  // PHÂN CẢNH 1: PHÒNG LAB VIỆN DI SẢN KỸ THUẬT SỐ 2026
  const drawLabScene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    t: number,
    now: number
  ) => {
    // Nền phòng điều khiển màu xám xanh hiện đại
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Bàn máy chủ và màn hình cảnh báo
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, H * 0.65, W, H * 0.35);

    // Lồng ấp bảo tồn di sản (Chrono Capsule)
    const capX = W * 0.5;
    const capY = H * 0.42;
    const capW = 180;
    const capH = 260;

    // Đèn đế lồng ấp
    ctx.fillStyle = '#334155';
    ctx.fillRect(capX - capW / 2, capY + capH / 2 - 20, capW, 40);

    // Kính lồng ấp màu xanh cyan phát sáng
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.fillRect(capX - capW / 2 + 10, capY - capH / 2, capW - 20, capH - 20);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(capX - capW / 2 + 10, capY - capH / 2, capW - 20, capH - 20);

    // Bộ Áo Dài / Áo Tứ Thân truyền thống trưng bày bên trong lồng
    ctx.fillStyle = '#dc2626'; // Thân áo đỏ
    ctx.fillRect(capX - 25, capY - 60, 50, 90);
    ctx.fillStyle = '#eab308'; // Vạt vàng hoa văn
    ctx.fillRect(capX - 6, capY - 60, 12, 90);

    // Đám mây dữ liệu hắc ám Virus Lãng Quên bắt đầu xâm chiếm
    const glitchSize = Math.min(1.0, t / 3.5);
    ctx.fillStyle = '#050208';
    for (let i = 0; i < 45 * glitchSize; i++) {
      const gx = capX - 120 + Math.sin(now * 0.01 + i) * 60;
      const gy = capY - 100 + Math.cos(now * 0.01 + i * 2) * 80;
      ctx.fillRect(gx, gy, 14, 14);
      ctx.fillStyle = i % 2 === 0 ? '#ec4899' : '#8b5cf6';
      ctx.fillRect(gx + 2, gy + 2, 4, 4);
      ctx.fillStyle = '#050208';
    }

    // Các kỹ sư công nghệ đứng quan sát
    drawScientist(ctx, capX + 160, capY + 60, false);
    drawScientist(ctx, capX - 160, capY + 60, true);

    // Bảng tên: "VIỆN DI SẢN KỸ THUẬT SỐ QUỐC GIA - NĂM 2026"
    ctx.fillStyle = '#f8fafc';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NĂM 2026: VIỆN DI SẢN KỸ THUẬT SỐ QUỐC GIA', W * 0.5, 45);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "VT323", monospace';
    ctx.fillText('Dữ liệu cổ phục nghìn năm đang bị mã độc thời không xâm thực...', W * 0.5, 75);
    ctx.textAlign = 'start';
  };

  // PHÂN CẢNH 2: BÁO ĐỘNG ĐỎ "DANGER: DATA CORRUPTION"
  const drawGlitchCorruptionScene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    t: number,
    now: number
  ) => {
    // Chớp tắt báo động đỏ khẩn cấp
    const isAlarm = Math.floor(now / 200) % 2 === 0;
    ctx.fillStyle = isAlarm ? '#450a0a' : '#1e1b4b';
    ctx.fillRect(0, 0, W, H);

    // Khung cảnh báo DANGER
    const boxW = Math.min(W * 0.85, 600);
    const boxH = 140;
    const boxX = (W - boxW) / 2;
    const boxY = H * 0.22;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#ef4444';
    ctx.font = '16px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ DANGER: DATA CORRUPTION ⚠', W * 0.5, boxY + 45);

    ctx.fillStyle = '#fef08a';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText('"VIRUS LÃNG QUÊN ĐANG XÓA SỔ VIỆT PHỤC!"', W * 0.5, boxY + 85);

    // Nhà khoa học kêu gọi hoảng hốt
    ctx.fillStyle = '#38bdf8';
    ctx.font = '18px "VT323", monospace';
    ctx.fillText('Tiến sĩ Hoàng: "Chỉ có bạn mới có thể kích hoạt Chrono-Dive để về quá khứ thu thập mảnh vỡ ký ức!"', W * 0.5, boxY + 120);

    // Lời nhắc nhở DIVE
    ctx.fillStyle = '#22c55e';
    ctx.font = '14px "Press Start 2P"';
    ctx.fillText('▶ BƯỚC VÀO BUỒNG DIVE NGAY LẬP TỨC ◀', W * 0.5, H * 0.75);
    ctx.textAlign = 'start';
  };

  // PHÂN CẢNH 3: BỆ CHRONO-DIVE NẠP NĂNG LƯỢNG
  const drawChronoDiveStartScene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    t: number,
    now: number
  ) => {
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, W, H);

    const centerX = W * 0.5;
    const centerY = H * 0.52;

    // Vòng tròn năng lượng bệ phóng
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 80, 160, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Các vòng plasma xoay quanh nhân vật
    for (let r = 0; r < 4; r++) {
      const angle = now * 0.003 * (r % 2 === 0 ? 1 : -1) + r * 1.5;
      ctx.strokeStyle = r % 2 === 0 ? '#38bdf8' : '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 30 - r * 30, 120 - r * 15, 30, angle, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Nhân vật đứng hiên ngang chuẩn bị lặn thời gian
    drawChronoHero(ctx, centerX, centerY);

    // Biển "DIVE START" rực sáng dưới chân
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(centerX - 80, centerY + 105, 160, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = '9px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('DIVE START', centerX, centerY + 124);

    // Đếm ngược khởi động
    ctx.fillStyle = '#fde047';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText('NẠP NĂNG LƯỢNG XUYÊN KHÔNG: 99.8%...', centerX, H * 0.18);
    ctx.textAlign = 'start';
  };

  // PHÂN CẢNH 4: ĐƯỜNG HẦM XUYÊN KHÔNG (WARP SPEED - TRỐNG ĐỒNG & RỒNG THẦN)
  const drawWarpTunnelScene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    t: number,
    now: number
  ) => {
    // Không gian sâu thẳm
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, W, H);

    const cx = W * 0.5;
    const cy = H * 0.5;

    // Các luồng ánh sáng Warp Speed bắn ra từ tâm
    const numLines = 60;
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2 + now * 0.002;
      const speed = ((now * 0.4 + i * 20) % Math.max(W, H)) / Math.max(W, H);
      const dist = speed * (Math.max(W, H) * 0.8);
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;

      ctx.strokeStyle = i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#f59e0b' : '#ec4899';
      ctx.lineWidth = 1.5 + speed * 3;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * (dist * 0.6), cy + Math.sin(angle) * (dist * 0.6));
      ctx.lineTo(px, py);
      ctx.stroke();
    }

    // Biểu tượng TRỐNG ĐỒNG ĐÔNG SƠN phát sáng vàng kim trong đường hầm
    const drumScale = (Math.sin(now * 0.005) + 1.5) * 0.7;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx - 180, cy - 80, 70 * drumScale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - 180, cy - 80, 45 * drumScale, 0, Math.PI * 2);
    ctx.stroke();

    // RỒNG LỬA THĂNG LONG bay lượn bên cạnh
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx + 120, cy - 120);
    ctx.quadraticCurveTo(cx + 220, cy - 60 + Math.sin(now * 0.01) * 30, cx + 160, cy + 40);
    ctx.stroke();

    // Nhân vật bay xuyên không tiến về phía trước
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cx - 15, cy - 15, 30, 40);
    ctx.fillStyle = '#dc2626'; // Khăn lụa đỏ tung bay phía sau
    ctx.fillRect(cx - 35, cy - 5, 20, 8);

    ctx.fillStyle = '#fef08a';
    ctx.font = '11px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('ĐANG BAY VỀ QUÁ KHỨ... THẾ KỶ X - XIX', cx, H * 0.88);
    ctx.textAlign = 'start';
  };

  // PHÂN CẢNH 5: THÀNH QUÁCH ĐẠI VIỆT & TITLE DROP
  const drawTitleDropScene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    t: number,
    now: number
  ) => {
    // Trời mây bình minh vàng son cổ phong
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#fef3c7');
    grad.addColorStop(0.5, '#fed7aa');
    grad.addColorStop(1, '#64748b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Núi non mây ngàn Đại Việt
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(0, H * 0.7);
    ctx.lineTo(W * 0.3, H * 0.5);
    ctx.lineTo(W * 0.7, H * 0.65);
    ctx.lineTo(W, H * 0.52);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Thành quách Thăng Long hiện ra trong sương sớm
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(W * 0.5 - 120, H * 0.48, 240, 80);
    // Mái ngói cong cổ kính
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(W * 0.5 - 150, H * 0.48);
    ctx.quadraticCurveTo(W * 0.5, H * 0.4, W * 0.5 + 150, H * 0.48);
    ctx.lineTo(W * 0.5 + 120, H * 0.44);
    ctx.lineTo(W * 0.5 - 120, H * 0.44);
    ctx.closePath();
    ctx.fill();

    // Nhân vật tráng sĩ đứng quay lưng nhìn ra giang sơn
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(W * 0.5 - 14, H * 0.65, 28, 65);
    // Dải khăn đỏ bay phất phơ
    const scarfWave = Math.sin(now * 0.01) * 10;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(W * 0.5 - 10, H * 0.68);
    ctx.quadraticCurveTo(W * 0.5 - 40, H * 0.65 + scarfWave, W * 0.5 - 60, H * 0.7);
    ctx.lineTo(W * 0.5 - 40, H * 0.75 + scarfWave);
    ctx.closePath();
    ctx.fill();

    // BANNER TIÊU ĐỀ BÙNG NỔ THƯƠNG MẠI HOÁ
    const boxW = Math.min(W * 0.9, 740);
    const boxH = 120;
    const boxX = (W - boxW) / 2;
    const boxY = H * 0.16;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('HÀNH TRÌNH VIỆT PHỤC', W * 0.5, boxY + 45);

    ctx.fillStyle = '#fef08a';
    ctx.font = '11px "Press Start 2P"';
    ctx.fillText('KỶ NGUYÊN TRANH TÀI • SỨ MỆNH HỒI SINH KÝ ỨC', W * 0.5, boxY + 80);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '16px "VT323"';
    ctx.fillText('Nhấn TIẾP TỤC để bước vào hành trình cứu lấy di sản ngàn đời...', W * 0.5, boxY + 105);
    ctx.textAlign = 'start';
  };

  // =========================================================================
  // OUTRO CANVAS VIDEO SCENES
  // =========================================================================
  const drawOutroScene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    t: number,
    now: number
  ) => {
    // 0:00 - 0:05: Tiêu diệt Boss & Hào quang Phượng Hoàng tái sinh
    if (t < 5.0) {
      ctx.fillStyle = '#0a0512';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '16px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('VIRUS LÃNG QUÊN ĐÃ BỊ ĐÁNH BẠI!', W * 0.5, H * 0.22);

      // Phượng Hoàng hào quang
      const phY = H * 0.52 + Math.sin(now * 0.005) * 15;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(W * 0.5, phY, 65, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.font = '12px "Press Start 2P"';
      ctx.fillText('🕊 Tinh thần di sản ngàn năm đã hồi sinh!', W * 0.5, H * 0.76);
      ctx.textAlign = 'start';
    }
    // 0:05 - 0:11: Trở về năm 2026 - Lễ hội cổ phục bừng sáng
    else if (t < 11.0) {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '14px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('NĂM 2026: VIỆT NAM RỰC RỠ SẮC MÀU', W * 0.5, H * 0.18);

      ctx.fillStyle = '#22c55e';
      ctx.font = '20px "VT323", monospace';
      ctx.fillText('Viện Di Sản Kỹ Thuật Số đã phục hồi trọn vẹn dữ liệu cổ phục ngàn năm!', W * 0.5, H * 0.32);
      ctx.fillText('Khắp phố phường, giới trẻ tự hào khoác lên mình Áo Tấc, Nhật Bình, Tứ Thân và Nón Bài Thơ.', W * 0.5, H * 0.42);

      ctx.fillStyle = '#facc15';
      ctx.font = '11px "Press Start 2P"';
      ctx.fillText('BẠN ĐÃ THU THẬP TRỌN BỘ CỔ PHỤC QUÝ GIÁ CỦA DÂN TỘC!', W * 0.5, H * 0.65);
      ctx.textAlign = 'start';
    }
    // 0:10 - 0:24: GIẢI MÃ NGUỒN GỐC TẠI SAO VIRUS LÃNG QUÊN LẠI XUẤT HIỆN Ở THỜI CỔ ĐẠI
    else if (t < 24.0) {
      ctx.fillStyle = '#05020c';
      ctx.fillRect(0, 0, W, H);

      // Hiệu ứng Cyber Matrix màu tím cảnh báo dữ liệu mật
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Vòng xoáy Cổng Thời Không 2099 phóng ngược mã độc
      const portalX = W * 0.5;
      const portalY = H * 0.22;
      const pulse = Math.sin(now * 0.008) * 8;
      ctx.fillStyle = '#7e22ce';
      ctx.beginPath();
      ctx.arc(portalX, portalY, 40 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(portalX, portalY, 20 + pulse * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Cảnh báo truyền tin từ tương lai 2099
      ctx.fillStyle = '#ef4444';
      ctx.font = '12px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ GIẢI MÃ: VÌ SAO VIRUS LÃNG QUÊN XUẤT HIỆN TRONG QUÁ KHỨ? ⚠', W * 0.5, portalY + 65);

      // Nội dung cốt truyện trả lời trực tiếp thắc mắc của người chơi
      const boxW = Math.min(W * 0.9, 780);
      const boxX = (W - boxW) / 2;
      const boxY = portalY + 80;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(boxX, boxY, boxW, H - boxY - 30);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, H - boxY - 30);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '18px "VT323", monospace';
      ctx.fillText('Năm 2099, Tập đoàn Công nghệ Siêu Trí Tuệ phát động chiến dịch "TABULA RASA" (Xóa Trắng Tâm Thức).', W * 0.5, boxY + 30);
      ctx.fillText('Chúng muốn toàn nhân loại trở thành lực lượng lao động số vô cảm, không còn ký ức cội nguồn.', W * 0.5, boxY + 58);

      ctx.fillStyle = '#fef08a';
      ctx.fillText('Tuy nhiên, bản sắc văn hóa Việt Nam kiên cường như sóng ngầm ngàn năm, không thể bị xóa ở năm 2099.', W * 0.5, boxY + 88);
      ctx.fillText('Do đó, chúng đã tạo ra MÁY GIA TỐC THỜI KHÔNG, bắn "Virus Lãng Quên" ngược về hàng trăm năm trước,', W * 0.5, boxY + 116);
      ctx.fillText('nhằm nhiễm độc cổ vật và xóa sổ trang phục Việt Phục ngay từ lúc cội nguồn mới sinh ra!', W * 0.5, boxY + 144);

      ctx.fillStyle = '#4ade80';
      ctx.font = '11px "Press Start 2P"';
      ctx.fillText('NHƯNG SỰ CAN TRƯỜNG CỦA BẠN ĐÃ ĐẬP TAN KẾ HOẠCH NÀY TRONG QUÁ KHỨ!', W * 0.5, boxY + 190);
      ctx.textAlign = 'start';
    }
    // 0:24 - 0:36: TO BE CONTINUED (HÉ LỘ PHẦN TIẾP THEO CHIẾN DỊCH TƯƠNG LAI 2099)
    else {
      ctx.fillStyle = '#020005';
      ctx.fillRect(0, 0, W, H);

      // Khung cảnh tương lai 2099 cyberpunk âm u với mưa số
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      for (let i = 0; i < 25; i++) {
        const rx = (i * 47 + Math.floor(now * 0.2)) % W;
        const ry = (i * 31 + Math.floor(now * 0.4)) % H;
        ctx.fillRect(rx, ry, 2, 14);
      }

      // Bóng đen của kẻ chủ mưu ở năm 2099 đứng trước màn hình khổng lồ
      const bossX = W * 0.5;
      const bossY = H * 0.32;
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(bossX - 25, bossY - 20, 50, 70);
      // Đôi mắt đỏ phát sáng trong bóng tối
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(bossX - 10, bossY - 6, 6, 4);
      ctx.fillRect(bossX + 4, bossY - 6, 6, 4);

      ctx.fillStyle = '#ec4899';
      ctx.font = '10px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('CẢNH BÁO TỐI MẬT: HẠCH TÂM CHỈ HUY 2099 VẪN TIẾP TỤC VẬN HÀNH...', W * 0.5, H * 0.46);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '19px "VT323", monospace';
      ctx.fillText('"Các người đã cứu được quá khứ... nhưng tương lai 2099 thuộc về chúng ta!"', W * 0.5, H * 0.54);
      ctx.fillText('Hành trình bảo vệ cội nguồn dân tộc vẫn chưa dừng lại ở đây.', W * 0.5, H * 0.62);

      // Logo Game phát sáng
      ctx.fillStyle = '#f59e0b';
      ctx.font = '18px "Press Start 2P"';
      ctx.fillText('HÀNH TRÌNH VIỆT PHỤC', W * 0.5, H * 0.74);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px "Press Start 2P"';
      ctx.fillText('PHẦN 2: ĐỘT KÍCH TRỤ SỞ THỜI KHÔNG 2099', W * 0.5, H * 0.82);

      // Dòng chữ TO BE CONTINUED rực rỡ
      const glow = Math.sin(now * 0.006) > 0 ? '#fef08a' : '#fbbf24';
      ctx.fillStyle = glow;
      ctx.font = '15px "Press Start 2P"';
      ctx.fillText('TO BE CONTINUED...', W * 0.5, H * 0.91);
      ctx.textAlign = 'start';
    }

    drawScanlines(ctx, W, H, now);
  };

  const drawScanlines = (ctx: CanvasRenderingContext2D, W: number, H: number, now: number) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let y = 0; y < H; y += 4) {
      ctx.fillRect(0, y, W, 2);
    }
  };

  const drawScientist = (ctx: CanvasRenderingContext2D, x: number, y: number, lookRight: boolean) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - 12, y, 24, 45);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 10, y + 45, 8, 25);
    ctx.fillRect(x + 2, y + 45, 8, 25);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 8, y - 18, 16, 18);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(lookRight ? x + 2 : x - 6, y - 10, 6, 4);
  };

  const drawChronoHero = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 14, y, 28, 55);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x - 16, y + 8, 4, 35);
    ctx.fillRect(x + 12, y + 8, 4, 35);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 9, y - 20, 18, 20);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(x - 10, y - 14, 20, 6);
  };

  const handleSkip = () => {
    soundEngine.playClick();
    onComplete();
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-center select-none">
      {/* 60FPS Video Canvas Render Screen */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Chapter Title Badge */}
      <div className="absolute top-4 left-4 z-40 bg-[#141a24]/90 border border-[#d4af37] px-3 py-1.5 flex items-center gap-2 shadow-[2px_2px_0_#000]">
        <span className="text-amber-400 text-xs">🎬</span>
        <span className="font-pixel text-[9px] sm:text-[10px] text-[#fbe282]">
          {type === 'intro' ? 'MỞ ĐẦU: SỨ MỆNH XUYÊN KHÔNG' : 'KẾT CỤC: GIẢI MÃ NGUỒN GỐC & TO BE CONTINUED'}
        </span>
      </div>

      {/* ONLY A CLEAN SKIP BUTTON AS REQUESTED */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-40 pixel-btn bg-[#d13426] hover:bg-[#e04535] text-white border-2 border-black px-4 py-2 font-pixel text-xs cursor-pointer shadow-[3px_3px_0_#000] active:translate-y-0.5"
      >
        BỎ QUA ⏭
      </button>

      {/* Subtle Progress Bar at the Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/60 z-40">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-[#d4af37] to-yellow-300 transition-all duration-100"
          style={{ width: `${Math.min(100, (currentTime / totalDuration) * 100)}%` }}
        />
      </div>

      {/* Subtle Time Indicator */}
      <div className="absolute bottom-3 right-4 z-40 font-pixel text-[8px] text-slate-400 bg-black/70 px-2 py-0.5 rounded border border-slate-800">
        {Math.floor(currentTime)}s / {totalDuration}s
      </div>
    </div>
  );
};

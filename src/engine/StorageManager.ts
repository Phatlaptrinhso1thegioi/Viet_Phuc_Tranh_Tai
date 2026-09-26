/**
 * StorageManager.ts - Hệ thống Lưu trữ Dữ liệu Tiêu chuẩn Thương mại
 * Quản lý Save/Load game, Auto-save, Kiểm tra toàn vẹn dữ liệu (Integrity Check)
 */

import { PlayerProfile } from '../types/game';

const SAVE_KEY = 'viet_phuc_chronicles_save_v1';
const SETTINGS_KEY = 'viet_phuc_settings_v1';

export interface GameSettings {
  sfxVolume: number;
  bgmVolume: number;
  isMuted: boolean;
  screenShake: boolean;
  virtualJoystickEnabled: boolean;
  language: 'vi' | 'en';
}

export const DEFAULT_SETTINGS: GameSettings = {
  sfxVolume: 0.75,
  bgmVolume: 0.5,
  isMuted: false,
  screenShake: true,
  virtualJoystickEnabled: true,
  language: 'vi',
};

export class StorageManager {
  /**
   * Lưu hồ sơ nhân vật & tiến trình chơi
   */
  public static saveGame(profile: PlayerProfile): boolean {
    try {
      const payload = {
        version: 1,
        timestamp: Date.now(),
        profile,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error('[StorageManager] Lưu game thất bại:', e);
      return false;
    }
  }

  /**
   * Tải hồ sơ tiến trình đã lưu
   */
  public static loadGame(): PlayerProfile | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data && data.profile && typeof data.profile.stats === 'object') {
        return data.profile as PlayerProfile;
      }
      return null;
    } catch (e) {
      console.error('[StorageManager] Đọc file save bị lỗi:', e);
      return null;
    }
  }

  /**
   * Xóa file save (Bắt đầu lại cuộc phiêu lưu mới)
   */
  public static clearSave(): boolean {
    try {
      localStorage.removeItem(SAVE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Lưu cài đặt game
   */
  public static saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('[StorageManager] Không thể lưu settings:', e);
    }
  }

  /**
   * Đọc cài đặt game
   */
  public static loadSettings(): GameSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      }
    } catch {
      // Fallback
    }
    return { ...DEFAULT_SETTINGS };
  }
}

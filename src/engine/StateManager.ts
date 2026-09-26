/**
 * StateManager.ts - Kiến trúc State Machine quản lý luồng Game
 * Tiêu chuẩn thương mại (Commercial Game State Machine)
 * Hỗ trợ: Transition effects, Scene stack (push/pop), Event bus, Trạng thái phân tầng
 */

export type GameStateId =
  | 'INTRO'
  | 'MENU'
  | 'CHAR_SELECT'
  | 'WORLD_MAP'
  | 'TOPDOWN_EXPLORE'
  | 'COMBAT'
  | 'TRIVIA_ARENA'
  | 'GALLERY'
  | 'OUTRO'
  | 'PAUSE_OVERLAY';

export interface StateTransitionEvent {
  from: GameStateId;
  to: GameStateId;
  params?: Record<string, unknown>;
}

export type StateListener = (event: StateTransitionEvent) => void;

export class StateManager {
  private currentState: GameStateId = 'INTRO';
  private stateStack: GameStateId[] = [];
  private listeners: Set<StateListener> = new Set();
  private isTransitioning: boolean = false;

  constructor(initialState: GameStateId = 'INTRO') {
    this.currentState = initialState;
  }

  /**
   * Lấy trạng thái hiện tại của Game
   */
  public getCurrentState(): GameStateId {
    return this.currentState;
  }

  /**
   * Đăng ký lắng nghe sự kiện chuyển State
   */
  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Chuyển đổi sang một State mới với hiệu ứng transition
   */
  public switchState(newState: GameStateId, params?: Record<string, unknown>) {
    if (this.currentState === newState || this.isTransitioning) return;

    const fromState = this.currentState;
    this.isTransitioning = true;

    // Kích hoạt transition event
    const event: StateTransitionEvent = {
      from: fromState,
      to: newState,
      params,
    };

    this.currentState = newState;
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('[StateManager] Listener error:', err);
      }
    });

    this.isTransitioning = false;
  }

  /**
   * Push state vào stack (ví dụ mở Overlay Pause Menu hoặc Wardrobe tạm thời)
   */
  public pushState(newState: GameStateId, params?: Record<string, unknown>) {
    this.stateStack.push(this.currentState);
    this.switchState(newState, params);
  }

  /**
   * Quay trở lại state trước đó trong stack
   */
  public popState(): boolean {
    const prevState = this.stateStack.pop();
    if (prevState) {
      this.switchState(prevState);
      return true;
    }
    return false;
  }

  /**
   * Kiểm tra xem game có đang ở trạng thái chơi (Gameplay) hay không
   */
  public isGameplayActive(): boolean {
    return (
      this.currentState === 'WORLD_MAP' ||
      this.currentState === 'TOPDOWN_EXPLORE' ||
      this.currentState === 'COMBAT' ||
      this.currentState === 'TRIVIA_ARENA'
    );
  }
}

export const globalStateManager = new StateManager('INTRO');

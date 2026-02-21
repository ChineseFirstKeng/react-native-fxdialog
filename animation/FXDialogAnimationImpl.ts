import { ViewStyle } from "react-native";

/**
 * 动画控制器接口
 * 所有需要队列管理的 UI 组件都必须实现此接口
 */
export interface FXDialogAnimationImpl {
  /**
   * 执行显示动画
   * @returns Promise，在动画完成时 resolve
   */
  show(): Promise<void>;

  /**
   * 执行关闭动画
   * @returns Promise，在动画完成时 resolve
   */
  close(): Promise<void>;

  /**
   * 立即停止所有动画并重置状态
   */
  stop?(): void;

  /**
   * 获取动画配置
   */
  getConfig(): {
    showDuration: number;
    closeDuration: number;
  };
  /** 获取背景蒙层的动画样式 */
  backgroundStyle: () => ViewStyle;
  /** 获取弹窗容器的动画样式 */
  containerStyle: () => ViewStyle;
}

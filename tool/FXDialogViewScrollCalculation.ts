import { logger } from "react-native-fxview";

/**
 * Dialog业务逻辑服务层
 * 负责处理所有与UI无关的业务逻辑：测量计算、状态管理
 */
export class FXDialogViewScrollCalculation {
  private maxHeight: number;
  private minActionsHeight: number;
  private maxActionsHeight: number;

  constructor(
    maxHeight: number,
    minActionsHeight: number,
    maxActionsHeight: number,
  ) {
    this.maxHeight = maxHeight;
    this.minActionsHeight = minActionsHeight;
    this.maxActionsHeight = maxActionsHeight;
  }

  /**
   * 计算滚动状态
   */
  calculateScrollState(
    contentHeight: number,
    actionsHeight: number,
  ): FXScrollCalculationResult {
    const totalHeight = contentHeight + actionsHeight;

    logger.log("[DialogViewScrollCalculation] 📊 calculate:", {
      contentHeight,
      actionsHeight,
      totalHeight,
      maxHeight: this.maxHeight,
    });

    // 规则 1: 总高度 <= 最大高度，都不滚动
    if (totalHeight <= this.maxHeight) {
      const result = {
        contentScrollable: false,
        actionsScrollable: false,
        adjustedContentHeight: contentHeight,
        adjustedActionsHeight: actionsHeight,
      };
      logger.log("[DialogViewScrollCalculation] 📊 规则 1: 都不滚动", result);
      return result;
    }

    // 规则 2: 总高度 > 最大高度
    return this.calculateOverflowState(contentHeight, actionsHeight);
  }

  /**
   * 计算溢出状态
   */
  private calculateOverflowState(
    contentHeight: number,
    actionsHeight: number,
  ): FXScrollCalculationResult {
    // 规则 2.1: 内容高度 + 最小按钮高度 <= 最大高度，只有按钮滚动
    if (contentHeight + this.minActionsHeight <= this.maxHeight) {
      const adjustedContentHeight = contentHeight;
      const adjustedActionsHeight = this.maxHeight - adjustedContentHeight;
      const result = {
        contentScrollable: false,
        actionsScrollable: true,
        adjustedContentHeight,
        adjustedActionsHeight,
      };
      logger.log(
        "[DialogViewScrollCalculation] 📊 规则 2.1: 只有按钮滚动",
        result,
      );
      return result;
    }

    // 规则 2.2: 按钮高度 <= 最大按钮高度，只有内容滚动
    if (actionsHeight <= this.maxActionsHeight) {
      const adjustedActionsHeight = actionsHeight;
      const adjustedContentHeight = this.maxHeight - actionsHeight;

      const result = {
        contentScrollable: true,
        actionsScrollable: false,
        adjustedContentHeight,
        adjustedActionsHeight,
      };
      logger.log(
        "[DialogViewScrollCalculation] 📊 规则 2.2: 只有内容滚动",
        result,
      );

      return result;
    }

    // 规则 2.3: 都滚动
    const adjustedActionsHeight = this.maxActionsHeight;
    const adjustedContentHeight = this.maxHeight - this.maxActionsHeight;
    const result = {
      contentScrollable: true,
      actionsScrollable: true,
      adjustedContentHeight,
      adjustedActionsHeight,
    };
    logger.log("[DialogViewScrollCalculation] 📊 规则 2.3: 都滚动", result);
    return result;
  }
}

/**
 * 防抖工具函数
 */
export function Debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 滚动计算结果
 */
interface FXScrollCalculationResult {
  contentScrollable: boolean;
  actionsScrollable: boolean;
  adjustedContentHeight: number;
  adjustedActionsHeight: number;
}

/**
 * Dialog业务逻辑服务层
 * 负责处理所有与UI无关的业务逻辑：测量计算、状态管理
 */
export declare class FXDialogViewScrollCalculation {
    private maxHeight;
    private minActionsHeight;
    private maxActionsHeight;
    constructor(maxHeight: number, minActionsHeight: number, maxActionsHeight: number);
    /**
     * 计算滚动状态
     */
    calculateScrollState(contentHeight: number, actionsHeight: number): FXScrollCalculationResult;
    /**
     * 计算溢出状态
     */
    private calculateOverflowState;
}
/**
 * 防抖工具函数
 */
export declare function Debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * 滚动计算结果
 */
interface FXScrollCalculationResult {
    contentScrollable: boolean;
    actionsScrollable: boolean;
    adjustedContentHeight: number;
    adjustedActionsHeight: number;
}
export {};
//# sourceMappingURL=FXDialogViewScrollCalculation.d.ts.map
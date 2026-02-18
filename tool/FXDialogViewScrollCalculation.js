"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FXDialogViewScrollCalculation = void 0;
exports.Debounce = Debounce;
const react_native_fxview_1 = require("react-native-fxview");
/**
 * Dialog业务逻辑服务层
 * 负责处理所有与UI无关的业务逻辑：测量计算、状态管理
 */
class FXDialogViewScrollCalculation {
    constructor(maxHeight, minActionsHeight, maxActionsHeight) {
        this.maxHeight = maxHeight;
        this.minActionsHeight = minActionsHeight;
        this.maxActionsHeight = maxActionsHeight;
    }
    /**
     * 计算滚动状态
     */
    calculateScrollState(contentHeight, actionsHeight) {
        const totalHeight = contentHeight + actionsHeight;
        react_native_fxview_1.logger.log("[DialogViewScrollCalculation] 📊 calculate:", {
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
            react_native_fxview_1.logger.log("[DialogViewScrollCalculation] 📊 规则 1: 都不滚动", result);
            return result;
        }
        // 规则 2: 总高度 > 最大高度
        return this.calculateOverflowState(contentHeight, actionsHeight);
    }
    /**
     * 计算溢出状态
     */
    calculateOverflowState(contentHeight, actionsHeight) {
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
            react_native_fxview_1.logger.log("[DialogViewScrollCalculation] 📊 规则 2.1: 只有按钮滚动", result);
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
            react_native_fxview_1.logger.log("[DialogViewScrollCalculation] 📊 规则 2.2: 只有内容滚动", result);
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
        react_native_fxview_1.logger.log("[DialogViewScrollCalculation] 📊 规则 2.3: 都滚动", result);
        return result;
    }
}
exports.FXDialogViewScrollCalculation = FXDialogViewScrollCalculation;
/**
 * 防抖工具函数
 */
function Debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

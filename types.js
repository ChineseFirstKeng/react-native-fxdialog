"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDialogActionKind = exports.checkIsCustomAction = exports.checkIsDefaultAction = exports.FXDialogActionKind = exports.checkIsCustomContent = exports.FXDialogContentKind = exports.FXDialogAnimationType = exports.FXDialogActionType = exports.FXDialogCloseSystemType = exports.FXDialogType = exports.FXDialogFXViewCategory = exports.FXDialogMaxNumberOfLines = void 0;
exports.resolveDialogContentKind = resolveDialogContentKind;
/**
 * Dialog 的最大行数，用于实现"无限行"的文本显示
 * 设置为一个足够大的数值以避免文本被截断
 */
exports.FXDialogMaxNumberOfLines = 999999;
/**
 * Dialog 在 FXView 系统中的分类标识
 */
exports.FXDialogFXViewCategory = "Dialog";
/**
 * 弹窗类型枚举
 * 定义了三种不同的弹窗展示形式
 */
var FXDialogType;
(function (FXDialogType) {
    /** 居中弹窗 - 在屏幕中央显示的警告框 */
    FXDialogType["Alert"] = "alert";
    /** 底部操作表 - 从底部滑出的操作选择列表 */
    FXDialogType["ActionSheet"] = "actionSheet";
    /** 底部弹窗 - 从底部弹出的自定义内容容器 */
    FXDialogType["Popup"] = "popup";
})(FXDialogType || (exports.FXDialogType = FXDialogType = {}));
/**
 * 弹窗关闭系统类型枚举
 * 定义了弹窗被关闭的各种系统触发方式
 */
var FXDialogCloseSystemType;
(function (FXDialogCloseSystemType) {
    /** 点击背景蒙层关闭 */
    FXDialogCloseSystemType["Background"] = "background";
    /** 点击取消按钮关闭 */
    FXDialogCloseSystemType["ActionCancel"] = "cancel";
    /** 点击默认类型操作按钮关闭 */
    FXDialogCloseSystemType["ActionDefault"] = "default";
    /** 点击高亮类型操作按钮关闭 */
    FXDialogCloseSystemType["ActionHighlight"] = "highlight";
    /** 自定义关闭 - 用户主动调用 close 方法且未传递关闭类型时使用 */
    FXDialogCloseSystemType["Custom"] = "custom";
})(FXDialogCloseSystemType || (exports.FXDialogCloseSystemType = FXDialogCloseSystemType = {}));
/**
 * 弹窗操作按钮类型枚举
 * 定义了按钮的样式和行为类别
 */
var FXDialogActionType;
(function (FXDialogActionType) {
    /** 默认按钮样式 */
    FXDialogActionType["Default"] = "default";
    /** 取消按钮样式 - 通常用于取消操作 */
    FXDialogActionType["Cancel"] = "cancel";
    /** 高亮按钮样式 - 用于强调主要操作 */
    FXDialogActionType["Highlight"] = "highlight";
})(FXDialogActionType || (exports.FXDialogActionType = FXDialogActionType = {}));
/**
 * 弹窗动画类型枚举
 * 定义了弹窗显示和隐藏时的动画效果
 */
var FXDialogAnimationType;
(function (FXDialogAnimationType) {
    /** 无动画 - 立即显示/隐藏 */
    FXDialogAnimationType["None"] = "none";
    /** 淡入淡出动画 */
    FXDialogAnimationType["Fade"] = "fade";
    /** 缩放动画 - 从中心放大/缩小 */
    FXDialogAnimationType["Scale"] = "scale";
    /** 从下向上滑动 */
    FXDialogAnimationType["SlideUp"] = "slideUp";
    /** 从上向下滑动 */
    FXDialogAnimationType["SlideDown"] = "slideDown";
})(FXDialogAnimationType || (exports.FXDialogAnimationType = FXDialogAnimationType = {}));
var FXDialogContentKind;
(function (FXDialogContentKind) {
    FXDialogContentKind["Title"] = "title";
    FXDialogContentKind["Message"] = "message";
    FXDialogContentKind["Custom"] = "customContent";
})(FXDialogContentKind || (exports.FXDialogContentKind = FXDialogContentKind = {}));
/**
 * 类型保护函数：判断是否为自定义内容
 */
const checkIsCustomContent = (content) => {
    return "content" in content;
};
exports.checkIsCustomContent = checkIsCustomContent;
function resolveDialogContentKind(content) {
    /**
     * 类型保护函数：判断是否为标题
     */
    const isTitle = (content) => {
        return "title" in content;
    };
    /**
     * 类型保护函数：判断是否为消息
     */
    const isMessage = (content) => {
        return "message" in content;
    };
    if (isTitle(content)) {
        return FXDialogContentKind.Title;
    }
    else if (isMessage(content)) {
        return FXDialogContentKind.Message;
    }
    else if ((0, exports.checkIsCustomContent)(content)) {
        return FXDialogContentKind.Custom;
    }
    return undefined;
}
var FXDialogActionKind;
(function (FXDialogActionKind) {
    /**
     * 默认类型按钮
     */
    FXDialogActionKind["Default"] = "default";
    /**
     * 自定义类型按钮
     */
    FXDialogActionKind["Custom"] = "custom";
})(FXDialogActionKind || (exports.FXDialogActionKind = FXDialogActionKind = {}));
const checkIsDefaultAction = (action) => {
    return action && typeof action.action === "string";
};
exports.checkIsDefaultAction = checkIsDefaultAction;
const checkIsCustomAction = (action) => {
    return action && typeof action.action !== "string";
};
exports.checkIsCustomAction = checkIsCustomAction;
const resolveDialogActionKind = (action) => {
    if ((0, exports.checkIsDefaultAction)(action)) {
        return FXDialogActionKind.Default;
    }
    else if ((0, exports.checkIsCustomAction)(action)) {
        return FXDialogActionKind.Custom;
    }
    return undefined;
};
exports.resolveDialogActionKind = resolveDialogActionKind;

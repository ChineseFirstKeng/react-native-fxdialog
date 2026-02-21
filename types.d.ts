import type React from "react";
import { ViewStyle, TextStyle } from "react-native";
import { FXDialogAnimationImpl } from "./animation/FXDialogAnimationImpl";
import FXDialogView, { FXDialogViewProps } from "./FXDialogView";
import { FXComponentController } from "react-native-fxview";
export interface FXDialogShowEntry {
    fxViewId?: string;
    priority?: number;
    enqueue?: boolean;
    dialogProps?: FXDialogViewProps;
    didShow?: () => void;
    didClose?: (closeType?: string) => void;
}
export interface FXDialogShowItem {
    fxViewId: string;
    priority: number;
    enqueue: boolean;
    dialogProps?: FXDialogViewProps;
    didShow?: () => void;
    didClose?: (closeType?: string) => void;
    componentId: string;
    timestamp: number;
    controller?: FXComponentController;
    animationController?: FXDialogAnimationImpl;
    dialogView?: React.ReactNode;
    dialogViewRef?: React.RefObject<FXDialogView | null>;
}
/**
 * Dialog 的最大行数，用于实现"无限行"的文本显示
 * 设置为一个足够大的数值以避免文本被截断
 */
export declare const FXDialogMaxNumberOfLines = 999999;
/**
 * Dialog 在 FXView 系统中的分类标识
 */
export declare const FXDialogFXViewCategory = "Dialog";
/**
 * 弹窗类型枚举
 * 定义了三种不同的弹窗展示形式
 */
export declare enum FXDialogType {
    /** 居中弹窗 - 在屏幕中央显示的警告框 */
    Alert = "alert",
    /** 底部操作表 - 从底部滑出的操作选择列表 */
    ActionSheet = "actionSheet",
    /** 底部弹窗 - 从底部弹出的自定义内容容器 */
    Popup = "popup"
}
/**
 * 弹窗关闭系统类型枚举
 * 定义了弹窗被关闭的各种系统触发方式
 */
export declare enum FXDialogCloseSystemType {
    /** 点击背景蒙层关闭 */
    Background = "background",
    /** 点击取消按钮关闭 */
    ActionCancel = "cancel",
    /** 点击默认类型操作按钮关闭 */
    ActionDefault = "default",
    /** 点击高亮类型操作按钮关闭 */
    ActionHighlight = "highlight",
    /** 自定义关闭 - 用户主动调用 close 方法且未传递关闭类型时使用 */
    Custom = "custom"
}
/**
 * 弹窗关闭类型
 * 可以是系统预定义的类型，也可以是自定义字符串
 * @example
 * // 使用系统类型
 * dialog.close(id, DialogCloseSystemType.Cancel);
 *
 * // 使用自定义类型
 * dialog.close(id, "timeout");
 */
export type FXDialogCloseType = FXDialogCloseSystemType | string;
/**
 * 弹窗操作按钮类型枚举
 * 定义了按钮的样式和行为类别
 */
export declare enum FXDialogActionType {
    /** 默认按钮样式 */
    Default = "default",
    /** 取消按钮样式 - 通常用于取消操作 */
    Cancel = "cancel",
    /** 高亮按钮样式 - 用于强调主要操作 */
    Highlight = "highlight"
}
/**
 * 弹窗动画类型枚举
 * 定义了弹窗显示和隐藏时的动画效果
 */
export declare enum FXDialogAnimationType {
    /** 无动画 - 立即显示/隐藏 */
    None = "none",
    /** 淡入淡出动画 */
    Fade = "fade",
    /** 缩放动画 - 从中心放大/缩小 */
    Scale = "scale",
    /** 从下向上滑动 */
    SlideUp = "slideUp",
    /** 从上向下滑动 */
    SlideDown = "slideDown"
}
export type FXDialogContent = FXDialogTitle | FXDialogMessage | FXDialogCustomContent;
export declare enum FXDialogContentKind {
    Title = "title",
    Message = "message",
    Custom = "customContent"
}
/**
 * 类型保护函数：判断是否为自定义内容
 */
export declare const checkIsCustomContent: (content: FXDialogContent) => content is FXDialogContent;
export declare function resolveDialogContentKind(content: FXDialogContent): FXDialogContentKind | undefined;
/**
 * 默认文本标题配置
 */
export interface FXDialogTitle {
    id?: string;
    /** 标题文本内容 */
    title: string;
    /** 标题文本样式 */
    style?: TextStyle;
    /** 最大显示行数���默认为 1 */
    numberOfLines?: number;
    /** 文本溢出时的省略模式 */
    ellipsizeMode?: "head" | "middle" | "tail" | "clip";
    /** 标题容器样式 */
    containerStyle?: ViewStyle;
    onPress?: () => void;
}
/**
 * 默认文本消息配置
 */
export interface FXDialogMessage {
    id?: string;
    /** 消息文本内容 */
    message: string;
    /** 消息文本样式 */
    style?: TextStyle;
    /** 最大显示行数 */
    numberOfLines?: number;
    /** 文本溢出时的省略模式 */
    ellipsizeMode?: "head" | "middle" | "tail" | "clip";
    /** 消息容器样式 */
    containerStyle?: ViewStyle;
    onPress?: () => void;
}
export declare enum FXDialogActionKind {
    /**
     * 默认类型按钮
     */
    Default = "default",
    /**
     * 自定义类型按钮
     */
    Custom = "custom"
}
export declare const checkIsDefaultAction: (action: FXDialogAction) => action is FXDialogDefaultAction;
export declare const checkIsCustomAction: (action: FXDialogAction) => action is FXDialogCustomAction;
export declare const resolveDialogActionKind: (action: FXDialogAction) => FXDialogActionKind | undefined;
/**
 * 弹窗操作按钮配置
 * 可以是默认文本按钮或自定义 React 组件
 */
export type FXDialogAction = FXDialogDefaultAction | FXDialogCustomAction;
/**
 * 默认文本按钮配置
 */
export interface FXDialogDefaultAction {
    id?: string;
    /** 按钮文本内容 */
    action: string;
    /** 按钮类型，决定按钮的样式和优先级，默认为 Default */
    type?: FXDialogActionType;
    /** 按钮文本样式 */
    style?: TextStyle;
    /** 按钮背景样式 也是position:absolute */
    background?: React.ReactNode;
    /** 按钮文本最大显示行数，默认为 1 */
    numberOfLines?: number;
    /** 文本溢出时的省略模式 */
    ellipsizeMode?: "head" | "middle" | "tail" | "clip";
    /** 按钮容器样式 */
    containerStyle?: ViewStyle;
    /**
     * 点击按钮后是否自动关闭弹窗，默认为 true
     */
    closeOnClick?: boolean;
    /**
     * 关闭类型，手动设置按钮关闭时的类型标识
     * 如果不设置，则默认为 Action
     */
    closeType?: FXDialogCloseType;
    /**
     * 按钮点击回调函数
     */
    onPress?: () => void;
}
/**
 * 自定义按钮配置
 * 允许使用任意 React 组件作为按钮
 */
export interface FXDialogCustomAction {
    id?: string;
    /** 自定义按钮组件 */
    action: React.ReactNode;
    /** 按钮类型，决定按钮在关闭时的行为，默认为 Default */
    type?: FXDialogActionType;
    /** 按钮容器样式 */
    containerStyle?: ViewStyle;
    /**
     * 点击按钮后是否自动关闭弹窗，默认为 true
     */
    closeOnClick?: boolean;
    /**
     * 关闭类型，手动设置按钮关闭时的类型标识
     * 如果不设置，则默认为 Action
     */
    closeType?: FXDialogCloseType;
    /**
     * 按钮点击回调函数
     * 可以返回 Promise 以支持异步操作
     */
    onPress?: () => void;
}
/**
 * 自定义视图配置
 * 允许在弹窗中插入任意自定义 React 组件
 * @example
 * const customView: FXDialogCustomContent = {
 *   content: <MyCustomComponent />,
 *   containerStyle: { padding: 16 }
 * };
 */
export interface FXDialogCustomContent {
    id?: string;
    /** 自定义视图内容 */
    content: React.ReactNode;
    /** 自定义视图容器样式 */
    containerStyle?: ViewStyle;
}
export interface FXDialogUpdateConfig {
    /** 更新背景样式 */
    backgroundStyle?: ViewStyle;
    /** 更新容器样式 */
    containerStyle?: ViewStyle;
    /** 更新内容容器样式 */
    contentsContainerStyle?: ViewStyle;
    /** 更新操作按钮容器样式 */
    actionsContainerStyle?: ViewStyle;
    /** 更新内容元素（必须有ID） */
    contents?: FXDialogContent[];
    /** 更新按钮元素 */
    actions?: FXDialogAction[];
}
/**
 * 弹窗控制器接口
 * 提供弹窗的控制方法
 */
export interface FXDialogController {
    /**
     * 关闭弹窗
     * @param closeType - 可选，关闭类型，用于区分不同的关闭触发方式
     * @example
     * // 关闭当前弹窗
     * controller.close();
     *
     * // 关闭并标记关闭类型
     * controller.close(DialogCloseSystemType.Cancel);
     */
    close: (closeType?: FXDialogCloseType) => void;
    update: (updates: FXDialogUpdateConfig) => void;
    updateContent: (update: FXDialogContent) => void;
    updateAction: (update: FXDialogAction) => void;
    updateBackgroundStyle: (update: ViewStyle) => void;
    updateContainerStyle: (update: ViewStyle) => void;
    updateContentContainerStyle: (update: ViewStyle) => void;
    updateActionsContainerStyle: (update: ViewStyle) => void;
    fxViewId: () => string | undefined;
}
export type { FXDialogAnimationImpl } from "./animation/FXDialogAnimationImpl";
//# sourceMappingURL=types.d.ts.map
import { FXDialogViewProps } from "./FXDialogView";
import { FXDialogAnimationType, FXDialogAction, FXDialogTitle, FXDialogMessage, FXDialogCustomContent, FXDialogCloseType, FXDialogController, FXDialogAnimationImpl, FXDialogUpdateConfig, FXDialogQueueItem, FXDialogContent } from "./types";
import { FXDialogStyleInterceptor } from "./style/FXDialogStyleInterceptor";
import { FXDialogAnimation } from "./animation/FXDialogAnimation";
import { ViewStyle } from "react-native";
import React from "react";
/**
 * Dialog 构建器
 */
declare class FXDialog {
    protected _fxViewId?: string;
    protected _priority: number;
    protected _didShow?: () => void;
    protected _didClose?: (closeType?: FXDialogCloseType) => void;
    protected _queueItem: FXDialogQueueItem | null;
    protected _enqueue: boolean;
    protected _viewDefaultAnimation: FXDialogAnimation;
    protected _viewConfiguration: FXDialogViewProps;
    protected _styleInterceptor: FXDialogStyleInterceptor;
    /**
     * 设置弹窗类型
     */
    static alert(): FXDialog;
    static actionSheet(): FXDialog;
    static popup(): FXDialog;
    private static createDialog;
    /**
     * 添加标题
     */
    addTitle(title: FXDialogTitle): this;
    /**
     * 添加消息内容
     */
    addMessage(message: FXDialogMessage): this;
    /**
     * 添加按钮
     */
    addAction(action: FXDialogAction): this;
    /**
     * 添加自定义视图
     */
    addCustom(view: FXDialogCustomContent): this;
    /**
     * 添加自定义挂起视图，内部布局是绝对定位，默认样式 position: "absolute"，哪怕外部样式设置了类似 position: "relative"，也会被忽略
     * @param suspension 自定义挂起视图
     */
    addSuspension(suspension: React.ReactNode): this;
    /**
     * 添加背景，有默认样式，默认铺满overlay，position: "absolute"，传进来的组件带style，会合并默认样式
     * 注意：这里设置style属性最好不要设置布局相关的样式，比如宽高、margin、padding, top/left/right/bottom 等，这些设置不管用，会被默认样式覆盖
     * @param view 自定义背景组件
     */
    appendBackground(view: React.ReactNode): this;
    /**
     * 设置点击背景是否关闭
     */
    clickBackgroundClose(enable: boolean): this;
    /**
     * 设置背景样式
     */
    backgroundStyle(style: ViewStyle): this;
    /**
     * 添加容器背景，有默认样式，默认铺满container，position: "absolute"，传进来的组件带style，会合并默认样式
     * 注意：这里设置style属性最好不要设置布局相关的样式，比如宽高、margin、padding, top/left/right/bottom 等，这些设置不管用，会被默认样式覆盖
     * @param view 自定义容器背景组件
     */
    appendContainer(view: React.ReactNode): this;
    /**
     * 设置容器样式
     */
    containerStyle(style: ViewStyle): this;
    /**
     * 设置内容区域容器样式 除按钮外的内容区域样式
     */
    contentsContainerStyle(style: ViewStyle): this;
    /**
     * 设置按钮区样式
     */
    actionsContainerStyle(style: ViewStyle): this;
    /**
     * 设置弹窗显示动画时长
     * @param duration 动画时长 ms
     */
    showAnimationDuration(duration: number): this;
    /**
     * 设置弹窗关闭动画时长
     * @param duration 动画时长 ms
     */
    closeAnimationDuration(duration: number): this;
    /**
     * 设置动画：支持传入内置类型
     */
    animationType(animation: FXDialogAnimationType): this;
    /**
     * 添加自定义动画控制器，当设置自定义动画器后， animationType、showAnimationDuration、 closeAnimationDuration 设置将无效
     * @param animator 自定义动画控制器
     */
    animator(animator: FXDialogAnimationImpl): this;
    /**
     * 设置弹窗容器最大高度
     */
    containerScrollMaxHeight(maxHeight: number): this;
    /**
     * 设置弹窗需要滚动时按钮区最小高度
     * @param minHeight 最小高度
     */
    actionsScrollMinHeight(minHeight: number): this;
    /**
     * 添加按钮区最大高度
     * @param maxHeight 最大高度
     */
    actionsScrollMaxHeight(maxHeight: number): this;
    /**
     * 是否入队，入队的话会根据优先级排队显示，一定会展示。不入队的满足条件会立马展示，不满足则跳过不会展示
     * @param enqueue 是否入队
     * @returns
     */
    enqueue(enqueue: boolean): this;
    /**
     * 设置优先级，优先级会影响对话框的显示顺序
     * - 对于入队的对话框：优先级高的会先显示
     * - 对于不入队的对话框：优先级高的会替换优先级低的
     * @param priority 优先级数值，越大优先级越高
     * @returns
     */
    priority(priority: number): this;
    /**
     * 设置显示回调
     */
    didShow(callback: () => void): this;
    /**
     * 设置关闭回调
     */
    didClose(callback: (closeType?: FXDialogCloseType) => void): this;
    /**
     * 更新弹窗内容
     * @param updates 要更新的内容
     */
    protected update(updates: FXDialogUpdateConfig): void;
    /**
     * 更新弹窗内容
     * @param update 要更新的内容，通过id匹配
     */
    protected updateContent(update: FXDialogContent): void;
    /**
     * 更新操作按钮
     * @param actions 要更新的操作按钮，通过id匹配
     */
    protected updateAction(update: FXDialogAction): void;
    /**
     * 更新背景样式
     * @param style 要更新的背景样式
     */
    protected updateBackgroundStyle(style: ViewStyle): void;
    /**
     * 更新弹窗容器样式
     * @param style 要更新的弹窗容器样式
     */
    protected updateContainerStyle(style: ViewStyle): void;
    /**
     * 更新弹窗内容容器样式
     * @param style 要更新的弹窗内容容器样式
     */
    protected updateContentsContainerStyle(style: ViewStyle): void;
    /**
     * 更新弹窗操作按钮容器样式
     * @param style 要更新的弹窗操作按钮容器样式
     */
    protected updateActionsContainerStyle(style: ViewStyle): void;
    /**
     * 显示弹窗
     */
    show(fxViewId?: string): FXDialogController | null;
    /**
     * 触发关闭，关闭弹窗， 转发给 DialogManager
     */
    protected close(closeType?: FXDialogCloseType): void;
    /**
     * 静态函数关闭弹窗，关闭的是最近展示出来的那个。触发关闭弹窗，并不是关闭完成。转发给 FXDialogManager
     * @param fxViewId 可选，指定要关闭的弹窗的 fxViewId
     */
    static close(fxViewId?: string, closeType?: FXDialogCloseType): void;
    /**
     * 静态函数某个视图上的关闭所有弹窗
     * @param fxViewId 弹窗视图的 fxViewId
     */
    static clearAll(fxViewId: string): void;
}
export default FXDialog;
//# sourceMappingURL=FXDialog.d.ts.map
import { FXDialogViewProps } from "./FXDialogView";
import {
  FXDialogType,
  FXDialogAnimationType,
  FXDialogAction,
  FXDialogTitle,
  FXDialogMessage,
  FXDialogCustomContent,
  FXDialogCloseType,
  FXDialogController,
  FXDialogCloseSystemType,
  FXDialogAnimationImpl,
  FXDialogUpdateConfig,
  FXDialogQueueItem,
  FXDialogContent,
} from "./types";
import {
  FXDialogStyleInterceptor,
  FXDialogStyleInterceptorSystem,
} from "./style/FXDialogStyleInterceptor";
import DialogManager from "./FXDialogManager";
import { FXDialogAnimation } from "./animation/FXDialogAnimation";
import { ViewStyle } from "react-native";
import { logger } from "react-native-fxview";
import React from "react";
/**
 * Dialog 构建器
 */
class FXDialog {
  // region========== 私有属性 ==========
  protected _fxViewId?: string;
  protected _priority: number = 0;
  protected _didShow?: () => void;
  protected _didClose?: (closeType?: FXDialogCloseType) => void;
  // 队列项 调用 show() 时生成，show 之前是 null
  protected _queueItem: FXDialogQueueItem | null = null;
  protected _enqueue: boolean = false;
  protected _viewDefaultAnimation: FXDialogAnimation = new FXDialogAnimation(
    FXDialogAnimationType.Scale,
    300,
    200,
  );
  protected _viewConfiguration: FXDialogViewProps = {
    type: FXDialogType.Alert,
    closeOnClickBackground: true,
    contents: [],
    actions: [],
    suspensions: [],
  };

  protected _styleInterceptor: FXDialogStyleInterceptor =
    FXDialogStyleInterceptorSystem;
  /**
   * 设置弹窗类型
   */
  static alert(): FXDialog {
    return this.createDialog(FXDialogType.Alert);
  }

  static actionSheet(): FXDialog {
    return this.createDialog(
      FXDialogType.ActionSheet,
      FXDialogAnimationType.SlideUp,
    );
  }

  static popup(): FXDialog {
    return this.createDialog(FXDialogType.Popup, FXDialogAnimationType.SlideUp);
  }

  private static createDialog(
    dialogType: FXDialogType,
    animationType?: FXDialogAnimationType,
  ): FXDialog {
    const dialog = new this();
    dialog._viewConfiguration.type = dialogType;
    dialog._viewDefaultAnimation.animationType =
      animationType || FXDialogAnimationType.Scale;
    return dialog;
  }

  // region========== 配置方法（链式调用） ==========
  /**
   * 添加标题
   */
  addTitle(title: FXDialogTitle): this {
    this._viewConfiguration.contents?.push(title);
    return this;
  }

  /**
   * 添加消息内容
   */
  addMessage(message: FXDialogMessage): this {
    this._viewConfiguration.contents?.push(message);
    return this;
  }

  /**
   * 添加按钮
   */
  addAction(action: FXDialogAction): this {
    this._viewConfiguration.actions?.push(action);
    return this;
  }

  /**
   * 添加自定义视图
   */
  addCustom(view: FXDialogCustomContent): this {
    this._viewConfiguration.contents?.push(view);
    return this;
  }

  /**
   * 添加自定义挂起视图，内部布局是绝对定位，默认样式 position: "absolute"，哪怕外部样式设置了类似 position: "relative"，也会被忽略
   * @param suspension 自定义挂起视图
   */
  addSuspension(suspension: React.ReactNode): this {
    this._viewConfiguration.suspensions?.push(suspension);
    return this;
  }

  /**
   * 添加背景，有默认样式，默认铺满overlay，position: "absolute"，传进来的组件带style，会合并默认样式
   * 注意：这里设置style属性最好不要设置布局相关的样式，比如宽高、margin、padding, top/left/right/bottom 等，这些设置不管用，会被默认样式覆盖
   * @param view 自定义背景组件
   */
  appendBackground(view: React.ReactNode): this {
    this._viewConfiguration.appendBackground = view;
    return this;
  }

  /**
   * 设置点击背景是否关闭
   */
  clickBackgroundClose(enable: boolean): this {
    this._viewConfiguration.closeOnClickBackground = enable;
    return this;
  }

  /**
   * 设置背景样式
   */
  backgroundStyle(style: ViewStyle): this {
    this._viewConfiguration.backgroundStyle = {
      ...this._viewConfiguration.backgroundStyle,
      ...style,
    };
    return this;
  }

  /**
   * 添加容器背景，有默认样式，默认铺满container，position: "absolute"，传进来的组件带style，会合并默认样式
   * 注意：这里设置style属性最好不要设置布局相关的样式，比如宽高、margin、padding, top/left/right/bottom 等，这些设置不管用，会被默认样式覆盖
   * @param view 自定义容器背景组件
   */
  appendContainer(view: React.ReactNode): this {
    this._viewConfiguration.appendContainer = view;
    return this;
  }

  /**
   * 设置容器样式
   */
  containerStyle(style: ViewStyle): this {
    this._viewConfiguration.containerStyle = style;
    return this;
  }

  /**
   * 设置内容区域容器样式 除按钮外的内容区域样式
   */
  contentsContainerStyle(style: ViewStyle): this {
    this._viewConfiguration.contentsContainerStyle = style;
    return this;
  }

  /**
   * 设置按钮区样式
   */
  actionsContainerStyle(style: ViewStyle): this {
    this._viewConfiguration.actionsContainerStyle = style;
    return this;
  }

  /**
   * 设置弹窗显示动画时长
   * @param duration 动画时长 ms
   */
  showAnimationDuration(duration: number): this {
    this._viewDefaultAnimation.showDuration = duration;
    return this;
  }

  /**
   * 设置弹窗关闭动画时长
   * @param duration 动画时长 ms
   */
  closeAnimationDuration(duration: number): this {
    this._viewDefaultAnimation.closeDuration = duration;
    return this;
  }

  /**
   * 设置动画：支持传入内置类型
   */
  animationType(animation: FXDialogAnimationType): this {
    this._viewDefaultAnimation.animationType = animation;
    return this;
  }

  /**
   * 添加自定义动画控制器，当设置自定义动画器后， animationType、showAnimationDuration、 closeAnimationDuration 设置将无效
   * @param animator 自定义动画控制器
   */
  animator(animator: FXDialogAnimationImpl): this {
    this._viewConfiguration.animator = animator;
    return this;
  }
  /**
   * 设置弹窗容器最大高度
   */
  containerScrollMaxHeight(maxHeight: number): this {
    this._viewConfiguration.containerScrollMaxHeight = maxHeight;
    return this;
  }

  /**
   * 设置弹窗需要滚动时按钮区最小高度
   * @param minHeight 最小高度
   */
  actionsScrollMinHeight(minHeight: number): this {
    this._viewConfiguration.actionsScrollMinHeight = minHeight;
    return this;
  }

  /**
   * 添加按钮区最大高度
   * @param maxHeight 最大高度
   */
  actionsScrollMaxHeight(maxHeight: number): this {
    this._viewConfiguration.actionsScrollMaxHeight = maxHeight;
    return this;
  }

  /**
   * 是否入队，入队的话会根据优先级排队显示，一定会展示。不入队的满足条件会立马展示，不满足则跳过不会展示
   * @param enqueue 是否入队
   * @returns
   */
  enqueue(enqueue: boolean): this {
    this._enqueue = enqueue;
    return this;
  }

  /**
   * 设置优先级，优先级会影响对话框的显示顺序
   * - 对于入队的对话框：优先级高的会先显示
   * - 对于不入队的对话框：优先级高的会替换优先级低的
   * @param priority 优先级数值，越大优先级越高
   * @returns
   */
  priority(priority: number): this {
    this._priority = priority;
    return this;
  }

  /**
   * 设置显示回调
   */
  didShow(callback: () => void): this {
    this._didShow = callback;
    return this;
  }

  /**
   * 设置关闭回调
   */
  didClose(callback: (closeType?: FXDialogCloseType) => void): this {
    this._didClose = callback;
    return this;
  }

  /**
   * 更新弹窗内容
   * @param updates 要更新的内容
   */
  protected update(updates: FXDialogUpdateConfig) {
    try {
      logger.log("Dialog update", this._fxViewId);
      if (this._queueItem) {
        // 通过引用调用DialogView的update方法（只作用于弹窗层）
        const dialogViewRef = this._queueItem.dialogViewRef;
        logger.log("[Dialog] update", this._queueItem.dialogViewRef);
        if (dialogViewRef && dialogViewRef.current) {
          dialogViewRef.current.update(updates);
        } else {
          logger.warn("[Dialog] Cannot update: DialogView ref not available");
        }
      } else {
        logger.warn("[Dialog] Cannot update: dialog not shown yet");
      }
    } catch (error) {
      logger.error("[Dialog] Failed to update dialog", error);
    }
  }

  /**
   * 更新弹窗内容
   * @param update 要更新的内容，通过id匹配
   */
  protected updateContent(update: FXDialogContent) {
    this.update({
      contents: [update],
    });
  }

  /**
   * 更新操作按钮
   * @param actions 要更新的操作按钮，通过id匹配
   */
  protected updateAction(update: FXDialogAction) {
    this.update({
      actions: [update],
    });
  }

  /**
   * 更新背景样式
   * @param style 要更新的背景样式
   */
  protected updateBackgroundStyle(style: ViewStyle) {
    this.update({
      backgroundStyle: style,
    });
  }

  /**
   * 更新弹窗容器样式
   * @param style 要更新的弹窗容器样式
   */
  protected updateContainerStyle(style: ViewStyle) {
    this.update({
      containerStyle: style,
    });
  }

  /**
   * 更新弹窗内容容器样式
   * @param style 要更新的弹窗内容容器样式
   */
  protected updateContentsContainerStyle(style: ViewStyle) {
    this.update({
      contentsContainerStyle: style,
    });
  }

  /**
   * 更新弹窗操作按钮容器样式
   * @param style 要更新的弹窗操作按钮容器样式
   */
  protected updateActionsContainerStyle(style: ViewStyle) {
    this.update({
      actionsContainerStyle: style,
    });
  }

  // region========== 显示方法 ==========

  /**
   * 显示弹窗
   */
  show(fxViewId?: string): FXDialogController | null {
    try {
      if (!this._viewConfiguration.animator) {
        this._viewConfiguration.animator = this._viewDefaultAnimation;
      }
      if (this._styleInterceptor) {
        this._viewConfiguration = this._styleInterceptor.intercept(
          this._viewConfiguration,
        );
      }
      logger.warn(
        "Dialog show",
        this._styleInterceptor,
        this._viewConfiguration,
      );
      this._queueItem = DialogManager.getInstance().show({
        fxViewId: fxViewId,
        priority: this._priority,
        enqueue: this._enqueue,
        dialogProps: this._viewConfiguration,
        didShow: this._didShow,
        didClose: this._didClose,
      });
      // 关键修复：检查show操作是否成功
      if (!this._queueItem) {
        logger.error(
          "[Dialog] Failed to show dialog: DialogManager.show() returned null",
        );
        return null;
      }
      this._fxViewId = this._queueItem.fxViewId;
      return {
        close: this.close.bind(this),
        update: this.update.bind(this),
        updateContent: this.updateContent.bind(this),
        updateAction: this.updateAction.bind(this),
        updateBackgroundStyle: this.updateBackgroundStyle.bind(this),
        updateContainerStyle: this.updateContainerStyle.bind(this),
        updateContentContainerStyle:
          this.updateContentsContainerStyle.bind(this),
        updateActionsContainerStyle:
          this.updateActionsContainerStyle.bind(this),
        fxViewId: () => this._fxViewId,
      };
    } catch (error) {
      logger.error("[Dialog] Failed to show dialog", error);
      return null;
    }
  }
  /**
   * 触发关闭，关闭弹窗， 转发给 DialogManager
   */
  protected close(closeType?: FXDialogCloseType) {
    logger.log("Dialog close", this._fxViewId);
    if (this._queueItem) {
      DialogManager.getInstance().close(
        this._queueItem,
        closeType || FXDialogCloseSystemType.Custom,
      );
    }
  }

  /**
   * 静态函数关闭弹窗，关闭的是最近展示出来的那个。触发关闭弹窗，并不是关闭完成。转发给 DialogManager
   * @param fxViewId 可选，指定要关闭的弹窗的 fxViewId
   */
  static close(fxViewId?: string, closeType?: FXDialogCloseType) {
    try {
      logger.log("Dialog static close", fxViewId);
      DialogManager.getInstance().close(
        fxViewId,
        closeType || FXDialogCloseSystemType.Custom,
      );
    } catch (error) {
      logger.error("[Dialog] Failed to close dialog", error);
    }
  }
  /**
   * 静态函数某个视图上的关闭所有弹窗
   * @param fxViewId 弹窗视图的 fxViewId
   */
  static clearAll(fxViewId: string) {
    logger.log("Dialog clearAll");
    DialogManager.getInstance().clearViewController(fxViewId);
  }
}

export default FXDialog;

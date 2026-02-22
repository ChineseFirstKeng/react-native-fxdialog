import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle,
  ScrollView,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import {
  DialogStyleFactory,
  FXDialogStyleProtocol,
  styles,
} from "./style/style";
import {
  FXDialogType,
  FXDialogAction,
  FXDialogActionType,
  FXDialogTitle,
  FXDialogMessage,
  FXDialogCustomContent,
  FXDialogMaxNumberOfLines,
  FXDialogCloseSystemType,
  FXDialogAnimationImpl,
  checkIsDefaultAction,
  FXDialogUpdateConfig,
  FXDialogContent,
  resolveDialogContentKind,
  FXDialogContentKind,
  FXDialogDefaultAction,
} from "./types";
import {
  Debounce,
  FXDialogViewScrollCalculation,
} from "./tool/FXDialogViewScrollCalculation";
import { logger } from "react-native-fxview";
import { FXDialogViewUpdateBuilder } from "./tool/FXDialogViewUpdateBuilder";

export interface FXDialogViewProps {
  type?: FXDialogType;
  contents?: FXDialogContent[];
  actions?: FXDialogAction[];
  suspensions?: React.ReactNode[];
  backgroundStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  contentsContainerStyle?: ViewStyle;
  actionsContainerStyle?: ViewStyle;
  appendBackground?: React.ReactNode;
  appendContainer?: React.ReactNode;
  animator?: FXDialogAnimationImpl;
  closeOnClickBackground?: boolean;
  actionsScrollMinHeight?: number;
  actionsScrollMaxHeight?: number;
  containerScrollMaxHeight?: number;
  close?: (closeType?: string) => void;
}

interface FXDialogViewState {
  // 前5个属性不影响渲染，只是用来控制测量流程
  hasMeasuredContent: boolean;
  hasMeasuredActions: boolean;

  measureContentHeight: number;
  measureActionHeight: number;

  suspensions?: React.ReactNode[];

  contentScrollable: boolean;
  actionsScrollable: boolean;
  adjustedContentHeight: number;
  adjustedActionsHeight: number;

  displayContents?: FXDialogContent[];
  displayActions?: FXDialogAction[];
  measureContents?: FXDialogContent[]; // ✅ 双层渲染：等待替换的新内容
  measureActions?: FXDialogAction[]; // ✅ 双层渲染：等待替换的新内容
  containerStyle?: ViewStyle;
  backgroundStyle?: ViewStyle;
  contentsContainerStyle?: ViewStyle;
  actionsContainerStyle?: ViewStyle;
  appendBackground?: React.ReactNode;
  appendContainer?: React.ReactNode;
}

export const FXDialogViewDefaultScrollConfig = {
  layout: {
    maxHeightRatio: 0.8,
    maxActionsHeightRatio: 0.4,
    minActionsHeight: 90,
  },

  getRuntimeDimensions() {
    const { height: screenHeight } = Dimensions.get("window");
    const maxHeight = screenHeight * this.layout.maxHeightRatio;
    return {
      maxHeight,
      maxActionsHeight: maxHeight * this.layout.maxActionsHeightRatio,
      minActionsHeight: this.layout.minActionsHeight,
    };
  },
};

export default class FXDialogView extends Component<
  FXDialogViewProps,
  FXDialogViewState
> {
  private animator?: FXDialogAnimationImpl;
  private scrollCalculation: FXDialogViewScrollCalculation;
  private style: FXDialogStyleProtocol;

  constructor(props: FXDialogViewProps) {
    super(props);
    logger.log("DialogView:", props);
    this.animator = this.props.animator;
    const { maxHeight, minActionsHeight, maxActionsHeight } =
      FXDialogViewDefaultScrollConfig.getRuntimeDimensions();
    this.scrollCalculation = new FXDialogViewScrollCalculation(
      this.props.containerScrollMaxHeight || maxHeight,
      this.props.actionsScrollMinHeight || minActionsHeight,
      this.props.actionsScrollMaxHeight || maxActionsHeight,
    );
    this.style = DialogStyleFactory.getStyle(
      this.props.type || FXDialogType.Alert,
    );
    this.state = {
      hasMeasuredContent: false,
      hasMeasuredActions: false,
      measureContentHeight: 0,
      measureActionHeight: 0,
      suspensions: this.props.suspensions || [],
      contentScrollable: false,
      actionsScrollable: false,
      adjustedContentHeight: 0,
      adjustedActionsHeight: 0,
      displayContents: undefined,
      displayActions: undefined,
      measureContents: this.props.contents || [],
      measureActions: this.props.actions || [],
      containerStyle: this.props.containerStyle,
      backgroundStyle: this.props.backgroundStyle,
      contentsContainerStyle: this.props.contentsContainerStyle,
      actionsContainerStyle: this.props.actionsContainerStyle,
      appendBackground: this.props.appendBackground,
      appendContainer: this.props.appendContainer,
    };
    logger.log("DialogView: constructor", this.state.appendBackground);
  }

  componentDidMount(): void {
    logger.log("DialogView: componentDidMount");
  }

  componentWillUnmount(): void {
    logger.log("DialogView: componentWillUnmount");
  }

  shouldComponentUpdate(
    nextProps: FXDialogViewProps,
    nextState: FXDialogViewState,
  ): boolean {
    if (
      this.state.displayContents !== nextState.displayContents ||
      this.state.displayActions !== nextState.displayActions ||
      this.state.measureContents !== nextState.measureContents ||
      this.state.measureActions !== nextState.measureActions
    ) {
      return true;
    }
    if (
      this.state.containerStyle !== nextState.containerStyle ||
      this.state.backgroundStyle !== nextState.backgroundStyle
    ) {
      return true;
    }
    if (
      this.state.contentScrollable !== nextState.contentScrollable ||
      this.state.actionsScrollable !== nextState.actionsScrollable
    ) {
      return true;
    }
    if (
      this.state.adjustedContentHeight !== nextState.adjustedContentHeight ||
      this.state.adjustedActionsHeight !== nextState.adjustedActionsHeight
    ) {
      return true;
    }
    return this.props !== nextProps;
  }

  update(updates: FXDialogUpdateConfig): void {
    if (
      (!updates.contents || updates.contents.length === 0) &&
      (!updates.actions || updates.actions.length === 0) &&
      !updates.backgroundStyle &&
      !updates.containerStyle &&
      !updates.contentsContainerStyle &&
      !updates.actionsContainerStyle
    ) {
      return;
    }

    const updatedContents = FXDialogViewUpdateBuilder.buildUpdatedContents(
      updates.contents || [],
      this.state.displayContents || [],
    );

    const updatedActions = FXDialogViewUpdateBuilder.buildUpdatedActions(
      updates.actions || [],
      this.state.displayActions || [],
    );

    const stateUpdates: FXDialogViewState = {
      ...this.state,
      hasMeasuredContent: !updatedContents.changed,
      hasMeasuredActions: !updatedActions.changed,
    };

    if (updatedContents.changed) {
      // ✅ 不直接替换可见
      stateUpdates.measureContents = updatedContents.contents;
    }

    if (updatedActions.changed) {
      // ✅ 不直接替换可见层，先放到 pendingElements
      stateUpdates.measureActions = updatedActions.actions;
    }

    if (updates.backgroundStyle) {
      stateUpdates.backgroundStyle = updates.backgroundStyle;
    }

    if (updates.containerStyle) {
      stateUpdates.containerStyle = updates.containerStyle;
    }

    if (updates.contentsContainerStyle) {
      stateUpdates.contentsContainerStyle = updates.contentsContainerStyle;
    }

    if (updates.actionsContainerStyle) {
      stateUpdates.actionsContainerStyle = updates.actionsContainerStyle;
    }

    this.setState(stateUpdates);
  }

  private handleContentLayout = (event: LayoutChangeEvent) => {
    if (!this.state.measureContents || this.state.hasMeasuredContent) return;
    const { height } = event.nativeEvent.layout;

    this.setState(
      { measureContentHeight: height, hasMeasuredContent: true },
      this.checkIfBothMeasured,
    );
  };

  private handleActionsLayout = (event: LayoutChangeEvent) => {
    if (!this.state.measureActions || this.state.hasMeasuredActions) return;
    const { height } = event.nativeEvent.layout;

    this.setState(
      { measureActionHeight: height, hasMeasuredActions: true },
      this.checkIfBothMeasured,
    );
  };

  private checkIfBothMeasured = () => {
    if (this.state.hasMeasuredContent && this.state.hasMeasuredActions) {
      this.debouncedCalculateScrollState();
    }
  };

  private debouncedCalculateScrollState = Debounce(() => {
    this.calculateScrollState();
  }, 16);

  private calculateScrollState = () => {
    if (!this.state.hasMeasuredContent || !this.state.hasMeasuredActions)
      return;

    const { measureContentHeight, measureActionHeight } = this.state;
    const scrollState = this.scrollCalculation.calculateScrollState(
      measureContentHeight,
      measureActionHeight,
    );

    this.setState((prev) => ({
      ...scrollState,
      // ✅ 测量完成后一次性替换可见内容
      displayContents: prev.measureContents ?? prev.displayContents,
      measureContents: undefined,
      displayActions: prev.measureActions ?? prev.displayActions,
      measureActions: undefined,
    }));
  };

  handleBackdropPress = () => {
    const { closeOnClickBackground = true, close } = this.props;
    if (closeOnClickBackground && close) {
      close(FXDialogCloseSystemType.Background);
    }
  };

  handleActionPress = (action: FXDialogAction) => {
    const { closeOnClick = true } = action;

    if (action.onPress) {
      action.onPress();
    }

    const closeTypeMap: Record<FXDialogActionType, FXDialogCloseSystemType> = {
      [FXDialogActionType.Cancel]: FXDialogCloseSystemType.ActionCancel,
      [FXDialogActionType.Default]: FXDialogCloseSystemType.ActionDefault,
      [FXDialogActionType.Highlight]: FXDialogCloseSystemType.ActionHighlight,
    };
    if (closeOnClick && this.props.close) {
      const actionCloseType =
        closeTypeMap[action.type || FXDialogActionType.Default];
      this.props.close(action.closeType ? action.closeType : actionCloseType);
    }
  };
  private categorizeContents = (contents: FXDialogContent[]) => {
    const contentComponents: React.ReactNode[] = [];
    contents.forEach((child, index) => {
      const component = this.renderSingleContent(child, index);
      if (component) {
        contentComponents.push(component);
      }
    });
    return contentComponents;
  };

  private allActions = (actions: FXDialogAction[]) => {
    const actionComponents: React.ReactNode[] = [];
    actions.forEach((action, index) => {
      const component = this.renderSingleAction(action, index);
      if (component) {
        actionComponents.push(component);
      }
    });
    return actionComponents;
  };

  private renderTitle = (title: FXDialogTitle) => {
    const style = this.style.title;
    const containerStyle = this.style.titleContainer;
    // 根据是否有 onPress 决定使用 TouchableOpacity 还是 View
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const WrapperComponent: React.ComponentType<any> = title.onPress
      ? TouchableOpacity
      : View;
    return (
      <WrapperComponent
        style={[containerStyle, title.containerStyle]}
        onPress={title.onPress}
      >
        <Text
          style={[style, title.style]}
          numberOfLines={title.numberOfLines || FXDialogMaxNumberOfLines}
          ellipsizeMode={title.ellipsizeMode || "tail"}
        >
          {title.title}
        </Text>
      </WrapperComponent>
    );
  };

  private renderMessage = (message: FXDialogMessage) => {
    const style = this.style.message;
    const containerStyle = this.style.messageContainer;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const WrapperComponent: React.ComponentType<any> = message.onPress
      ? TouchableOpacity
      : View;
    return (
      <WrapperComponent
        style={[containerStyle, message.containerStyle]}
        onPress={message.onPress}
      >
        <Text
          style={[style, message.style]}
          numberOfLines={message.numberOfLines || FXDialogMaxNumberOfLines}
          ellipsizeMode={message.ellipsizeMode || "tail"}
        >
          {message.message}
        </Text>
      </WrapperComponent>
    );
  };

  private renderCustomContent = (content: FXDialogCustomContent) => {
    return <View style={content.containerStyle}>{content.content}</View>;
  };

  private renderSingleContent = (
    content: FXDialogContent,
    index: number,
  ): React.ReactNode | null => {
    const dialogType = resolveDialogContentKind(content);
    switch (dialogType) {
      case FXDialogContentKind.Title:
        return React.cloneElement(this.renderTitle(content as FXDialogTitle), {
          key: index,
        });
      case FXDialogContentKind.Message:
        return React.cloneElement(
          this.renderMessage(content as FXDialogMessage),
          { key: index },
        );
      case FXDialogContentKind.Custom: {
        return React.cloneElement(
          this.renderCustomContent(content as FXDialogCustomContent),
          { key: index },
        );
      }
      default:
        return null;
    }
  };

  private renderSingleAction(
    action: FXDialogAction,
    index: number,
  ): React.ReactNode {
    const buttonStyle = this.style.actionButton;
    const buttonStyles: ViewStyle[] = [buttonStyle || {}];
    const textStyle: TextStyle[] = [this.style.actionText];

    if (action.type === FXDialogActionType.Cancel) {
      textStyle.push(this.style.actionCancelText);
    } else if (action.type === FXDialogActionType.Highlight) {
      textStyle.push(this.style.actionHighlightText);
    }
    const isDefaultAction = checkIsDefaultAction(action);
    return (
      <TouchableOpacity
        key={index}
        style={[...buttonStyles, action.containerStyle]}
        onPress={() => this.handleActionPress(action)}
      >
        {isDefaultAction && this.renderActionBackground(action)}
        {isDefaultAction ? (
          <Text
            style={[textStyle, action.style]}
            numberOfLines={action.numberOfLines || 1}
            ellipsizeMode={action.ellipsizeMode || "tail"}
          >
            {action.action}
          </Text>
        ) : (
          action.action
        )}
      </TouchableOpacity>
    );
  }

  // 创建智能背景渲染方法
  renderAppendBackground() {
    const { appendBackground } = this.state;
    // 如果是 React 元素，克隆并添加样式
    if (React.isValidElement(appendBackground)) {
      logger.info("appendBackground - style", {
        ...this.style.appendBackground,
        ...appendBackground.props.style,
      });
      return React.cloneElement(appendBackground, {
        // 这里注意，是默认样式覆盖自定义样式，必须保证position: "absolute" …… 几个属性
        style: [appendBackground.props.style, this.style.appendBackground],
      });
    }
    return null;
  }

  renderAppendContainer() {
    const { appendContainer } = this.props;
    // 如果是 React 元素，克隆并添加样式
    if (React.isValidElement(appendContainer)) {
      return React.cloneElement(appendContainer, {
        // 这里注意，是默认样式覆盖自定义样式，必须保证position: "absolute" …… 几个属性
        style: [appendContainer.props.style, this.style.appendContainer],
      });
    }
    return null;
  }

  renderActionBackground(action: FXDialogDefaultAction) {
    const { background } = action;
    if (React.isValidElement(background)) {
      return React.cloneElement(background, {
        style: [background.props.style, this.style.actionBackground],
      });
    }
    return null;
  }

  renderSuspensions = () => {
    const { suspensions } = this.state;
    return suspensions?.map((suspension, index) => {
      if (React.isValidElement(suspension)) {
        return React.cloneElement(suspension, {
          key: index,
          // 这里注意，是默认样式覆盖自定义样式，必须保证position: "absolute"
          style: [suspension.props.style, this.style.suspension],
        });
      }
      return null;
    });
  };

  renderActions = (actions: FXDialogAction[]) => {
    const {
      actionsScrollable,
      adjustedActionsHeight,
      measureActions,
      actionsContainerStyle,
    } = this.state;

    if (actions.length === 0) {
      return (
        <View
          onLayout={measureActions ? this.handleActionsLayout : undefined}
        />
      );
    }
    const containerStyle: ViewStyle = this.style.actionsContainer;
    const actionsButtons = this.allActions(actions);
    return (
      <ScrollView
        style={
          actionsScrollable ? { height: adjustedActionsHeight } : undefined
        }
        scrollEnabled={actionsScrollable}
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled={true}
      >
        <View onLayout={measureActions ? this.handleActionsLayout : undefined}>
          <View style={[containerStyle, actionsContainerStyle]}>
            {actionsButtons}
          </View>
        </View>
      </ScrollView>
    );
  };

  renderContents = (contents: FXDialogContent[]) => {
    const {
      contentScrollable,
      adjustedContentHeight,
      measureContents,
      contentsContainerStyle,
    } = this.state;
    const contentComponents = this.categorizeContents(contents);
    if (!contents || contents.length === 0) {
      return (
        <View
          onLayout={measureContents ? this.handleContentLayout : undefined}
        />
      );
    }
    return (
      <ScrollView
        style={[contentScrollable && { height: adjustedContentHeight }]}
        scrollEnabled={contentScrollable}
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled={true}
      >
        <View onLayout={measureContents ? this.handleContentLayout : undefined}>
          <View style={[this.style.contentsContainer, contentsContainerStyle]}>
            {contentComponents}
          </View>
        </View>
      </ScrollView>
    );
  };

  renderAllArea = (contents: FXDialogContent[], actions: FXDialogAction[]) => {
    return (
      <>
        {this.renderContents(contents)}
        {this.renderActions(actions)}
      </>
    );
  };

  render() {
    const {
      containerStyle,
      backgroundStyle,
      displayContents,
      displayActions,
      measureContents,
      measureActions,
    } = this.state;

    const overlayStyles: ViewStyle[] = [
      styles.overlay,
      backgroundStyle || {},
      this.animator?.backgroundStyle() || {},
    ];

    const containerStyles: ViewStyle[] = [
      this.style.container,
      containerStyle || {},
      this.animator?.containerStyle() || {},
    ];

    // ✅ 可见层：始终展示旧内容
    const displayLayer = this.renderAllArea(
      displayContents || [],
      displayActions || [],
    );

    // ✅ 隐藏测量层：只在 measureElements 存在时渲染
    const measureLayer =
      measureContents || measureActions ? (
        <View style={{ position: "absolute", opacity: 0 }}>
          {this.renderAllArea(measureContents || [], measureActions || [])}
        </View>
      ) : null;

    return (
      <Animated.View style={overlayStyles}>
        {this.renderAppendBackground()}
        <TouchableWithoutFeedback onPress={this.handleBackdropPress}>
          <View style={styles.responder} />
        </TouchableWithoutFeedback>

        <Animated.View style={containerStyles}>
          {this.renderAppendContainer()}
          {displayLayer}
          {measureLayer}
          {this.renderSuspensions()}
        </Animated.View>
      </Animated.View>
    );
  }
}

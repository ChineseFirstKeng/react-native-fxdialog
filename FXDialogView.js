"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FXDialogViewDefaultScrollConfig = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const style_1 = require("./style/style");
const types_1 = require("./types");
const FXDialogViewScrollCalculation_1 = require("./tool/FXDialogViewScrollCalculation");
const react_native_fxview_1 = require("react-native-fxview");
const FXDialogViewUpdateBuilder_1 = require("./tool/FXDialogViewUpdateBuilder");
exports.FXDialogViewDefaultScrollConfig = {
    layout: {
        maxHeightRatio: 0.8,
        maxActionsHeightRatio: 0.4,
        minActionsHeight: 90,
    },
    getRuntimeDimensions() {
        const { height: screenHeight } = react_native_1.Dimensions.get("window");
        const maxHeight = screenHeight * this.layout.maxHeightRatio;
        return {
            maxHeight,
            maxActionsHeight: maxHeight * this.layout.maxActionsHeightRatio,
            minActionsHeight: this.layout.minActionsHeight,
        };
    },
};
class FXDialogView extends react_1.Component {
    constructor(props) {
        super(props);
        this.handleContentLayout = (event) => {
            if (!this.state.measureContents || this.state.hasMeasuredContent)
                return;
            const { height } = event.nativeEvent.layout;
            this.setState({ measureContentHeight: height, hasMeasuredContent: true }, this.checkIfBothMeasured);
        };
        this.handleActionsLayout = (event) => {
            if (!this.state.measureActions || this.state.hasMeasuredActions)
                return;
            const { height } = event.nativeEvent.layout;
            this.setState({ measureActionHeight: height, hasMeasuredActions: true }, this.checkIfBothMeasured);
        };
        this.checkIfBothMeasured = () => {
            if (this.state.hasMeasuredContent && this.state.hasMeasuredActions) {
                this.debouncedCalculateScrollState();
            }
        };
        this.debouncedCalculateScrollState = (0, FXDialogViewScrollCalculation_1.Debounce)(() => {
            this.calculateScrollState();
        }, 16);
        this.calculateScrollState = () => {
            if (!this.state.hasMeasuredContent || !this.state.hasMeasuredActions)
                return;
            const { measureContentHeight, measureActionHeight } = this.state;
            const scrollState = this.scrollCalculation.calculateScrollState(measureContentHeight, measureActionHeight);
            this.setState((prev) => {
                var _a, _b;
                return ({
                    ...scrollState,
                    // ✅ 测量完成后一次性替换可见内容
                    displayContents: (_a = prev.measureContents) !== null && _a !== void 0 ? _a : prev.displayContents,
                    measureContents: undefined,
                    displayActions: (_b = prev.measureActions) !== null && _b !== void 0 ? _b : prev.displayActions,
                    measureActions: undefined,
                });
            });
        };
        this.handleBackdropPress = () => {
            const { closeOnClickBackground = true, close } = this.props;
            if (closeOnClickBackground && close) {
                close(types_1.FXDialogCloseSystemType.Background);
            }
        };
        this.handleActionPress = (action) => {
            const { closeOnClick = true } = action;
            if (action.onPress) {
                action.onPress();
            }
            const closeTypeMap = {
                [types_1.FXDialogActionType.Cancel]: types_1.FXDialogCloseSystemType.ActionCancel,
                [types_1.FXDialogActionType.Default]: types_1.FXDialogCloseSystemType.ActionDefault,
                [types_1.FXDialogActionType.Highlight]: types_1.FXDialogCloseSystemType.ActionHighlight,
            };
            if (closeOnClick && this.props.close) {
                const actionCloseType = closeTypeMap[action.type || types_1.FXDialogActionType.Default];
                this.props.close(action.closeType ? action.closeType : actionCloseType);
            }
        };
        this.categorizeContents = (contents) => {
            const contentComponents = [];
            contents.forEach((child, index) => {
                const component = this.renderSingleContent(child, index);
                if (component) {
                    contentComponents.push(component);
                }
            });
            return contentComponents;
        };
        this.allActions = (actions) => {
            const actionComponents = [];
            actions.forEach((action, index) => {
                const component = this.renderSingleAction(action, index);
                if (component) {
                    actionComponents.push(component);
                }
            });
            return actionComponents;
        };
        this.renderTitle = (title) => {
            const style = this.style.title;
            const containerStyle = this.style.titleContainer;
            // 根据是否有 onPress 决定使用 TouchableOpacity 还是 View
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const WrapperComponent = title.onPress
                ? react_native_1.TouchableOpacity
                : react_native_1.View;
            return (<WrapperComponent style={[containerStyle, title.containerStyle]} onPress={title.onPress}>
        <react_native_1.Text style={[style, title.style]} numberOfLines={title.numberOfLines || types_1.FXDialogMaxNumberOfLines} ellipsizeMode={title.ellipsizeMode || "tail"}>
          {title.title}
        </react_native_1.Text>
      </WrapperComponent>);
        };
        this.renderMessage = (message) => {
            const style = this.style.message;
            const containerStyle = this.style.messageContainer;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const WrapperComponent = message.onPress
                ? react_native_1.TouchableOpacity
                : react_native_1.View;
            return (<WrapperComponent style={[containerStyle, message.containerStyle]} onPress={message.onPress}>
        <react_native_1.Text style={[style, message.style]} numberOfLines={message.numberOfLines || types_1.FXDialogMaxNumberOfLines} ellipsizeMode={message.ellipsizeMode || "tail"}>
          {message.message}
        </react_native_1.Text>
      </WrapperComponent>);
        };
        this.renderCustomContent = (content) => {
            return <react_native_1.View style={content.containerStyle}>{content.content}</react_native_1.View>;
        };
        this.renderSingleContent = (content, index) => {
            const dialogType = (0, types_1.resolveDialogContentKind)(content);
            switch (dialogType) {
                case types_1.FXDialogContentKind.Title:
                    return react_1.default.cloneElement(this.renderTitle(content), {
                        key: index,
                    });
                case types_1.FXDialogContentKind.Message:
                    return react_1.default.cloneElement(this.renderMessage(content), { key: index });
                case types_1.FXDialogContentKind.Custom: {
                    return react_1.default.cloneElement(this.renderCustomContent(content), { key: index });
                }
                default:
                    return null;
            }
        };
        this.renderSuspensions = () => {
            const { suspensions } = this.state;
            return suspensions === null || suspensions === void 0 ? void 0 : suspensions.map((suspension, index) => {
                if (react_1.default.isValidElement(suspension)) {
                    return react_1.default.cloneElement(suspension, {
                        key: index,
                        // 这里注意，是默认样式覆盖自定义样式，必须保证position: "absolute"
                        style: [suspension.props.style, this.style.suspension],
                    });
                }
                return null;
            });
        };
        this.renderActions = (actions) => {
            const { actionsScrollable, adjustedActionsHeight, measureActions, actionsContainerStyle, } = this.state;
            if (actions.length === 0) {
                return (<react_native_1.View onLayout={measureActions ? this.handleActionsLayout : undefined}/>);
            }
            const containerStyle = this.style.actionsContainer;
            const actionsButtons = this.allActions(actions);
            return (<react_native_1.ScrollView style={actionsScrollable ? { height: adjustedActionsHeight } : undefined} scrollEnabled={actionsScrollable} showsVerticalScrollIndicator={false} bounces={false} nestedScrollEnabled={true}>
        <react_native_1.View onLayout={measureActions ? this.handleActionsLayout : undefined}>
          <react_native_1.View style={[containerStyle, actionsContainerStyle]}>
            {actionsButtons}
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.ScrollView>);
        };
        this.renderContents = (contents) => {
            const { contentScrollable, adjustedContentHeight, measureContents, contentsContainerStyle, } = this.state;
            const contentComponents = this.categorizeContents(contents);
            if (!contents || contents.length === 0) {
                return (<react_native_1.View onLayout={measureContents ? this.handleContentLayout : undefined}/>);
            }
            return (<react_native_1.ScrollView style={[contentScrollable && { height: adjustedContentHeight }]} scrollEnabled={contentScrollable} showsVerticalScrollIndicator={false} bounces={false} nestedScrollEnabled={true}>
        <react_native_1.View onLayout={measureContents ? this.handleContentLayout : undefined}>
          <react_native_1.View style={[this.style.contentsContainer, contentsContainerStyle]}>
            {contentComponents}
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.ScrollView>);
        };
        this.renderAllArea = (contents, actions) => {
            return (<>
        {this.renderContents(contents)}
        {this.renderActions(actions)}
      </>);
        };
        react_native_fxview_1.logger.log("DialogView:", props);
        this.animator = this.props.animator;
        const { maxHeight, minActionsHeight, maxActionsHeight } = exports.FXDialogViewDefaultScrollConfig.getRuntimeDimensions();
        this.scrollCalculation = new FXDialogViewScrollCalculation_1.FXDialogViewScrollCalculation(this.props.containerScrollMaxHeight || maxHeight, this.props.actionsScrollMinHeight || minActionsHeight, this.props.actionsScrollMaxHeight || maxActionsHeight);
        this.style = style_1.DialogStyleFactory.getStyle(this.props.type || types_1.FXDialogType.Alert);
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
        react_native_fxview_1.logger.log("DialogView: constructor", this.state.appendBackground);
    }
    componentDidMount() {
        react_native_fxview_1.logger.log("DialogView: componentDidMount");
    }
    componentWillUnmount() {
        react_native_fxview_1.logger.log("DialogView: componentWillUnmount");
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.displayContents !== nextState.displayContents ||
            this.state.displayActions !== nextState.displayActions ||
            this.state.measureContents !== nextState.measureContents ||
            this.state.measureActions !== nextState.measureActions) {
            return true;
        }
        if (this.state.containerStyle !== nextState.containerStyle ||
            this.state.backgroundStyle !== nextState.backgroundStyle) {
            return true;
        }
        if (this.state.contentScrollable !== nextState.contentScrollable ||
            this.state.actionsScrollable !== nextState.actionsScrollable) {
            return true;
        }
        if (this.state.adjustedContentHeight !== nextState.adjustedContentHeight ||
            this.state.adjustedActionsHeight !== nextState.adjustedActionsHeight) {
            return true;
        }
        return this.props !== nextProps;
    }
    update(updates) {
        if ((!updates.contents || updates.contents.length === 0) &&
            (!updates.actions || updates.actions.length === 0) &&
            !updates.backgroundStyle &&
            !updates.containerStyle &&
            !updates.contentsContainerStyle &&
            !updates.actionsContainerStyle) {
            return;
        }
        const updatedContents = FXDialogViewUpdateBuilder_1.FXDialogViewUpdateBuilder.buildUpdatedContents(updates.contents || [], this.state.displayContents || []);
        const updatedActions = FXDialogViewUpdateBuilder_1.FXDialogViewUpdateBuilder.buildUpdatedActions(updates.actions || [], this.state.displayActions || []);
        const stateUpdates = {
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
    renderSingleAction(action, index) {
        const buttonStyle = this.style.actionButton;
        const buttonStyles = [buttonStyle || {}];
        const textStyle = [this.style.actionText];
        if (action.type === types_1.FXDialogActionType.Cancel) {
            textStyle.push(this.style.actionCancelText);
        }
        else if (action.type === types_1.FXDialogActionType.Highlight) {
            textStyle.push(this.style.actionHighlightText);
        }
        const isDefaultAction = (0, types_1.checkIsDefaultAction)(action);
        return (<react_native_1.TouchableOpacity key={index} style={[...buttonStyles, action.containerStyle]} onPress={() => this.handleActionPress(action)}>
        {isDefaultAction && this.renderActionBackground(action)}
        {isDefaultAction ? (<react_native_1.Text style={[textStyle, action.style]} numberOfLines={action.numberOfLines || 1} ellipsizeMode={action.ellipsizeMode || "tail"}>
            {action.action}
          </react_native_1.Text>) : (action.action)}
      </react_native_1.TouchableOpacity>);
    }
    // 创建智能背景渲染方法
    renderAppendBackground() {
        const { appendBackground } = this.state;
        // 如果是 React 元素，克隆并添加样式
        if (react_1.default.isValidElement(appendBackground)) {
            react_native_fxview_1.logger.info("appendBackground - style", {
                ...this.style.appendBackground,
                ...appendBackground.props.style,
            });
            return react_1.default.cloneElement(appendBackground, {
                // 这里注意，是默认样式覆盖自定义样式，必须保证position: "absolute" …… 几个属性
                style: [appendBackground.props.style, this.style.appendBackground],
            });
        }
        return null;
    }
    renderAppendContainer() {
        const { appendContainer } = this.props;
        // 如果是 React 元素，克隆并添加样式
        if (react_1.default.isValidElement(appendContainer)) {
            return react_1.default.cloneElement(appendContainer, {
                // 这里注意，是默认样式覆盖自定义样式，必须保证position: "absolute" …… 几个属性
                style: [appendContainer.props.style, this.style.appendContainer],
            });
        }
        return null;
    }
    renderActionBackground(action) {
        const { background } = action;
        if (react_1.default.isValidElement(background)) {
            return react_1.default.cloneElement(background, {
                style: [background.props.style, this.style.actionBackground],
            });
        }
        return null;
    }
    render() {
        var _a, _b;
        const { containerStyle, backgroundStyle, displayContents, displayActions, measureContents, measureActions, } = this.state;
        const overlayStyles = [
            style_1.styles.overlay,
            backgroundStyle || {},
            ((_a = this.animator) === null || _a === void 0 ? void 0 : _a.backgroundStyle()) || {},
        ];
        const containerStyles = [
            this.style.container,
            containerStyle || {},
            ((_b = this.animator) === null || _b === void 0 ? void 0 : _b.containerStyle()) || {},
        ];
        // ✅ 可见层：始终展示旧内容
        const displayLayer = this.renderAllArea(displayContents || [], displayActions || []);
        // ✅ 隐藏测量层：只在 measureElements 存在时渲染
        const measureLayer = measureContents || measureActions ? (<react_native_1.View style={{ position: "absolute", opacity: 0, top: 9999 }}>
          {this.renderAllArea(measureContents || [], measureActions || [])}
        </react_native_1.View>) : null;
        return (<react_native_1.Animated.View style={overlayStyles}>
        {this.renderAppendBackground()}
        <react_native_1.TouchableWithoutFeedback onPress={this.handleBackdropPress}>
          <react_native_1.View style={style_1.styles.responder}/>
        </react_native_1.TouchableWithoutFeedback>

        <react_native_1.Animated.View style={containerStyles}>
          {this.renderAppendContainer()}
          {displayLayer}
          {measureLayer}
          {this.renderSuspensions()}
        </react_native_1.Animated.View>
      </react_native_1.Animated.View>);
    }
}
exports.default = FXDialogView;

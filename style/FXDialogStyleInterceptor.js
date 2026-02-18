"use strict";
/**
 * 样式拦截器 - 在show之前调用，处理布局逻辑
 *
 * 作用：处理默认样式不够用的情况，比如alert需要纵向布局，默认横向。需要加线分割，让alert更美观。
 *
 * 布局优先级：外部设置的样式 > 拦截器设置的默认样式 > style默认样式
 * 所以可以看到拦截器代码的样式覆盖是props的样式覆盖这里的样式，而在dialogView内部会有props的样式覆盖默认样式。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FXDialogStyleInterceptorSystem = exports.PopupStyleInterceptor = exports.ActionSheetStyleInterceptor = exports.AlertStyleInterceptor = void 0;
const react_native_fxview_1 = require("react-native-fxview");
const types_1 = require("../types");
const react_native_1 = require("react-native");
/**
 * Alert样式拦截器
 * 处理Alert类型的自动布局（横向/纵向）和边框
 */
exports.AlertStyleInterceptor = {
    intercept(props) {
        const { actions } = props;
        react_native_fxview_1.logger.warn("Alert style interceptor", actions === null || actions === void 0 ? void 0 : actions.length);
        if (!actions || actions.length === 0)
            return props;
        const actionsContainerStyle = {
            borderTopWidth: react_native_1.StyleSheet.hairlineWidth,
            borderTopColor: "#E5E5E5",
        };
        if (actions.length > 2) {
            // 纵向布局：超过2个按钮，这里的顺序注意动不了，样式优先级低于props本身的样式
            return Object.assign(Object.assign({}, props), { actionsContainerStyle: Object.assign(Object.assign(Object.assign({}, actionsContainerStyle), { flexDirection: "column" }), props.actionsContainerStyle), actions: actions.map((action, index) => (Object.assign(Object.assign({}, action), { containerStyle: Object.assign({ borderBottomWidth: index < actions.length - 1 ? react_native_1.StyleSheet.hairlineWidth : 0, borderBottomColor: index < actions.length - 1 ? "#E5E5E5" : undefined }, action.containerStyle) }))) });
        }
        else {
            // 横向布局：1-2个按钮，添加右边框
            return Object.assign(Object.assign({}, props), { actionsContainerStyle: Object.assign(Object.assign({}, actionsContainerStyle), props.actionsContainerStyle), actions: actions.map((action, index) => (Object.assign(Object.assign({}, action), { containerStyle: Object.assign({ borderRightWidth: index < actions.length - 1 ? react_native_1.StyleSheet.hairlineWidth : 0, borderRightColor: index < actions.length - 1 ? "#E5E5E5" : undefined }, action.containerStyle) }))) });
        }
    },
};
/**
 * ActionSheet样式拦截器
 * ActionSheet默认纵向布局，主要处理按钮间距和边框
 */
exports.ActionSheetStyleInterceptor = {
    intercept(props) {
        const { actions } = props;
        if (!actions || actions.length === 0)
            return props;
        const actionsContainerStyle = {
            borderTopWidth: react_native_1.StyleSheet.hairlineWidth,
            borderTopColor: "#E5E5E5",
        };
        return Object.assign(Object.assign({}, props), { actionsContainerStyle: Object.assign(Object.assign({}, actionsContainerStyle), props.actionsContainerStyle), actions: actions.map((action, index) => (Object.assign(Object.assign({}, action), { containerStyle: Object.assign({ marginTop: action.type === types_1.FXDialogActionType.Cancel ? 8 : 0, borderBottomWidth: index < actions.length - 1 ? react_native_1.StyleSheet.hairlineWidth : undefined, borderBottomColor: index < actions.length - 1 ? "#E5E5E5" : undefined }, action.containerStyle) }))) });
    },
};
/**
 * Popup样式拦截器
 * Popup通常从底部弹出，可以添加特殊处理
 */
exports.PopupStyleInterceptor = {
    intercept(props) {
        const { actions } = props;
        if (!actions || actions.length === 0)
            return props;
        if (actions.length > 2) {
            // 纵向布局：超过2个按钮，这里的顺序注意动不了，样式优先级低于props本身的样式
            return Object.assign(Object.assign({}, props), { actionsContainerStyle: Object.assign({ flexDirection: "column" }, props.actionsContainerStyle) });
        }
        return props;
    },
};
/**
 * 样式拦截器链
 * 统一管理所有类型的样式拦截
 */
exports.FXDialogStyleInterceptorSystem = {
    /**
     * 统一拦截入口
     */
    intercept(props) {
        const { type } = props;
        switch (type) {
            case types_1.FXDialogType.Alert:
                return this.interceptAlert(props);
            case types_1.FXDialogType.ActionSheet:
                return this.interceptActionSheet(props);
            case types_1.FXDialogType.Popup:
                return this.interceptPopup(props);
            default:
                return props;
        }
    },
    /**
     * Alert拦截器入口
     */
    interceptAlert(props) {
        return exports.AlertStyleInterceptor.intercept(props);
    },
    /**
     * ActionSheet拦截器入口
     */
    interceptActionSheet(props) {
        return exports.ActionSheetStyleInterceptor.intercept(props);
    },
    /**
     * Popup拦截器入口
     */
    interceptPopup(props) {
        return exports.PopupStyleInterceptor.intercept(props);
    },
};

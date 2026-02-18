/**
 * 样式拦截器 - 在show之前调用，处理布局逻辑
 *
 * 作用：处理默认样式不够用的情况，比如alert需要纵向布局，默认横向。需要加线分割，让alert更美观。
 *
 * 布局优先级：外部设置的样式 > 拦截器设置的默认样式 > style默认样式
 * 所以可以看到拦截器代码的样式覆盖是props的样式覆盖这里的样式，而在dialogView内部会有props的样式覆盖默认样式。
 */

import { logger } from "react-native-fxview";
import { FXDialogViewProps } from "../FXDialogView";
import { FXDialogActionType, FXDialogType } from "../types";
import { StyleSheet } from "react-native";

/**
 * 样式拦截器接口
 */
export interface FXDialogStyleInterceptor {
  intercept: (props: FXDialogViewProps) => FXDialogViewProps;
}

/**
 * Alert样式拦截器
 * 处理Alert类型的自动布局（横向/纵向）和边框
 */
export const AlertStyleInterceptor = {
  intercept(props: FXDialogViewProps): FXDialogViewProps {
    const { actions } = props;
    logger.warn("Alert style interceptor", actions?.length);
    if (!actions || actions.length === 0) return props;

    const actionsContainerStyle = {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: "#E5E5E5",
    };
    if (actions.length > 2) {
      // 纵向布局：超过2个按钮，这里的顺序注意动不了，样式优先级低于props本身的样式
      return {
        ...props,
        actionsContainerStyle: {
          ...actionsContainerStyle,
          flexDirection: "column",
          ...props.actionsContainerStyle,
        },
        actions: actions.map((action, index) => ({
          ...action,
          containerStyle: {
            borderBottomWidth:
              index < actions.length - 1 ? StyleSheet.hairlineWidth : 0,
            borderBottomColor:
              index < actions.length - 1 ? "#E5E5E5" : undefined,
            ...action.containerStyle,
          },
        })),
      };
    } else {
      // 横向布局：1-2个按钮，添加右边框
      return {
        ...props,
        actionsContainerStyle: {
          ...actionsContainerStyle,
          ...props.actionsContainerStyle,
        },
        actions: actions.map((action, index) => ({
          ...action,
          containerStyle: {
            borderRightWidth:
              index < actions.length - 1 ? StyleSheet.hairlineWidth : 0,
            borderRightColor:
              index < actions.length - 1 ? "#E5E5E5" : undefined,
            ...action.containerStyle,
          },
        })),
      };
    }
  },
};

/**
 * ActionSheet样式拦截器
 * ActionSheet默认纵向布局，主要处理按钮间距和边框
 */
export const ActionSheetStyleInterceptor = {
  intercept(props: FXDialogViewProps): FXDialogViewProps {
    const { actions } = props;
    if (!actions || actions.length === 0) return props;

    const actionsContainerStyle = {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: "#E5E5E5",
    };
    return {
      ...props,
      actionsContainerStyle: {
        ...actionsContainerStyle,
        ...props.actionsContainerStyle,
      },
      actions: actions.map((action, index) => ({
        ...action,
        containerStyle: {
          marginTop: action.type === FXDialogActionType.Cancel ? 8 : 0,
          borderBottomWidth:
            index < actions.length - 1 ? StyleSheet.hairlineWidth : undefined,
          borderBottomColor: index < actions.length - 1 ? "#E5E5E5" : undefined,
          ...action.containerStyle,
        },
      })),
    };
  },
};

/**
 * Popup样式拦截器
 * Popup通常从底部弹出，可以添加特殊处理
 */
export const PopupStyleInterceptor = {
  intercept(props: FXDialogViewProps): FXDialogViewProps {
    const { actions } = props;
    if (!actions || actions.length === 0) return props;

    if (actions.length > 2) {
      // 纵向布局：超过2个按钮，这里的顺序注意动不了，样式优先级低于props本身的样式
      return {
        ...props,
        actionsContainerStyle: {
          flexDirection: "column",
          ...props.actionsContainerStyle,
        },
      };
    }
    return props;
  },
};

/**
 * 样式拦截器链
 * 统一管理所有类型的样式拦截
 */
export const FXDialogStyleInterceptorSystem: FXDialogStyleInterceptor & {
  interceptAlert: (props: FXDialogViewProps) => FXDialogViewProps;
  interceptActionSheet: (props: FXDialogViewProps) => FXDialogViewProps;
  interceptPopup: (props: FXDialogViewProps) => FXDialogViewProps;
} = {
  /**
   * 统一拦截入口
   */
  intercept(props: FXDialogViewProps): FXDialogViewProps {
    const { type } = props;

    switch (type) {
      case FXDialogType.Alert:
        return this.interceptAlert(props);
      case FXDialogType.ActionSheet:
        return this.interceptActionSheet(props);
      case FXDialogType.Popup:
        return this.interceptPopup(props);
      default:
        return props;
    }
  },

  /**
   * Alert拦截器入口
   */
  interceptAlert(props: FXDialogViewProps): FXDialogViewProps {
    return AlertStyleInterceptor.intercept(props);
  },

  /**
   * ActionSheet拦截器入口
   */
  interceptActionSheet(props: FXDialogViewProps): FXDialogViewProps {
    return ActionSheetStyleInterceptor.intercept(props);
  },

  /**
   * Popup拦截器入口
   */
  interceptPopup(props: FXDialogViewProps): FXDialogViewProps {
    return PopupStyleInterceptor.intercept(props);
  },
};

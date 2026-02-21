import {
  checkIsDefaultAction,
  FXDialog,
  FXDialogActionType,
  FXDialogDefaultAction,
  FXDialogMessage,
  FXDialogStyleInterceptor,
  FXDialogType,
} from "react-native-fxdialog";
import {
  FXDialogContentKind,
  FXDialogTitle,
  resolveDialogContentKind,
} from "react-native-fxdialog";
import { logger } from "react-native-fxview";

const NeonDialogStyleInterceptor: FXDialogStyleInterceptor = {
  intercept(props) {
    const { actions, contents } = props;
    const returnContents = (contents || [])?.map((content) => {
      const contentKind = resolveDialogContentKind(content);
      if (contentKind === FXDialogContentKind.Title) {
        return {
          ...content,
          style: {
            color: "#00FFFF",
            fontSize: 22,
            lineHeight: 28,
            fontWeight: "bold",
            textShadowColor: "#00FFFF",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 15,
            ...(content as FXDialogTitle).style,
          },
        } as FXDialogTitle;
      } else if (contentKind === FXDialogContentKind.Message) {
        return {
          ...content,
          style: {
            color: "#FF00FF",
            fontSize: 16,
            textShadowColor: "#FF00FF",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
            ...(content as FXDialogMessage).style,
          },
        } as FXDialogMessage;
      }
      return content;
    });
    const returnActions = (actions || [])?.map((action) => {
      if (checkIsDefaultAction(action)) {
        const noRightBorderStyle = {
          borderRightWidth: undefined,
          borderRightColor: undefined,
        };
        const noBottomBorderStyle = {
          borderBottomWidth: undefined,
          borderBottomColor: undefined,
        };
        if (action.type === FXDialogActionType.Highlight) {
          return {
            ...action,
            style: {
              color: "#00FFFF",
              fontSize: 16,
              fontWeight: "bold",
              textShadowColor: "#00FFFF",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
              ...action.style,
            },
            containerStyle: {
              ...noRightBorderStyle,
              ...noBottomBorderStyle,
              backgroundColor: undefined, // 剔除背景色,自带的actionSheet有背景色
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "#00FFFF",
              shadowColor: "#00FFFF",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 10,
              ...action.containerStyle,
            },
          } as FXDialogDefaultAction;
        } else {
          return {
            ...action,
            style: {
              color: "#FFFFFF",
              fontSize: 16,
              textShadowColor: "#FFFFFF",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
              ...action.style,
            },
            containerStyle: {
              backgroundColor: undefined, // 剔除背景色,自带的actionSheet有背景色
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "#00FFFF",
              shadowColor: "#00FFFF",
            },
          } as FXDialogDefaultAction; // 其他按钮不显示文本，只显示霓虹边框
        }
      }
      return action;
    });
    logger.warn(
      "NeonDialogStyleInterceptor applied",
      props.actionsContainerStyle,
    );
    const isVertical = () => {
      if (props.type === FXDialogType.ActionSheet) return true;
      if (actions && actions.length >= 3) return true;
      return false;
    };
    return {
      ...props,
      contents: returnContents,
      actions: returnActions,
      backgroundStyle: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        ...props.backgroundStyle,
      },
      containerStyle: {
        backgroundColor: "#0A0A0A",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#00FFFF",
        shadowColor: "#00FFFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
        ...props.containerStyle,
      },
      actionsContainerStyle: {
        backgroundColor: undefined, // actionSheet默认背景色去掉，改为按钮的背景色
        flexDirection: isVertical() ? "column" : "row",
        ...props.actionsContainerStyle,
      },
    };
  },
};

export class NeonDialog extends FXDialog {
  constructor() {
    super();
    this._styleInterceptor = NeonDialogStyleInterceptor;
  }
}

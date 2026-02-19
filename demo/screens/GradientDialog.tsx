import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";
import {
  checkIsDefaultAction,
  FXDialog,
  FXDialogContentKind,
  FXDialogCustomAction,
  FXDialogMessage,
  FXDialogStyleInterceptor,
  FXDialogTitle,
  resolveDialogContentKind,
} from "react-native-fxdialog";

const GlassmorphismDialogStyleInterceptor: FXDialogStyleInterceptor = {
  intercept(props) {
    const { contents, actions } = props;
    const returnContents = (contents || [])?.map((content) => {
      if (resolveDialogContentKind(content) === FXDialogContentKind.Title) {
        return {
          ...content,
          color: "#FFFFFF",
          fontSize: 20,
          lineHeight: 28,
          fontWeight: "bold",
          ...(content as FXDialogTitle).style,
        };
      } else if (
        resolveDialogContentKind(content) === FXDialogContentKind.Message
      ) {
        return {
          ...content,
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: 16,
          ...(content as FXDialogMessage).style,
        };
      }
      return content;
    });
    const returnActions = actions?.map((action, index) => {
      if (checkIsDefaultAction(action)) {
        return {
          action: (
            <LinearGradient
              key={index}
              colors={["red", "yellow"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "600",
                  ...action.style,
                }}
              >
                {action.action}
              </Text>
            </LinearGradient>
          ),
          containerStyle: {
            borderRadius: 20,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            ...action.containerStyle,
          },
        } as FXDialogCustomAction;
      }
      return action;
    });
    const gradient = (
      <LinearGradient
        colors={["blue", "purple"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
    return {
      ...props,
      appendContainer: props.appendContainer || gradient,
      actionsContainerStyle: {
        backgroundColor: undefined,
        gap: props.actionsContainerStyle?.gap ?? 5,
        paddingHorizontal: props.actionsContainerStyle?.paddingHorizontal ?? 8,
        ...props.actionsContainerStyle,
      },
      actions: returnActions,
      contents: returnContents,
    };
  },
};
// 🎨 自定义样式类 - 美观酷炫
export class GradientDialog extends FXDialog {
  constructor() {
    super();
    this._styleInterceptor = GlassmorphismDialogStyleInterceptor;
  }
}

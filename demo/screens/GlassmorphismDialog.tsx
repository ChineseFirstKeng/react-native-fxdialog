import { BlurView } from "expo-blur";
import { FXDialog, FXDialogStyleInterceptor } from "react-native-fxdialog";
import { FXDialogStyleInterceptorSystem } from "react-native-fxdialog";

const GlassmorphismDialogStyleInterceptor: FXDialogStyleInterceptor = {
  intercept(props) {
    props = FXDialogStyleInterceptorSystem.intercept(props);
    return {
      ...props,
      appendBackground: props.appendBackground || <BlurView intensity={25} />,
      appendContainer: props.appendContainer || <BlurView intensity={25} />,
    };
  },
};
// 🎨 自定义样式类 - 美观酷炫
export class GlassmorphismDialog extends FXDialog {
  constructor() {
    super();
    this._styleInterceptor = GlassmorphismDialogStyleInterceptor;
  }
}

import { Animated, ViewStyle } from "react-native";
import { FXDialogAnimationImpl, FXDialogAnimationType } from "../types";
export declare class FXDialogAnimation implements FXDialogAnimationImpl {
    private animatedValue;
    private backgroundOpacity;
    animationType: FXDialogAnimationType;
    showDuration: number;
    closeDuration: number;
    constructor(animationType?: FXDialogAnimationType, showDuration?: number, closeDuration?: number);
    /**
     * 执行显示动画
     */
    show(): Promise<void>;
    /**
     * 执行关闭动画
     */
    close(): Promise<void>;
    stop(): void;
    getConfig(): {
        showDuration: number;
        closeDuration: number;
    };
    containerStyle(): ViewStyle;
    backgroundStyle(): {
        opacity: Animated.Value;
    };
    setAnimationType(animationType: FXDialogAnimationType): void;
}
//# sourceMappingURL=FXDialogAnimation.d.ts.map
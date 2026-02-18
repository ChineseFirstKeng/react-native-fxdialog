import { Animated, Dimensions, ViewStyle } from "react-native";
import { logger } from "react-native-fxview";
import { FXDialogAnimationImpl, FXDialogAnimationType } from "../types";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export class FXDialogAnimation implements FXDialogAnimationImpl {
  private animatedValue: Animated.Value = new Animated.Value(0);
  private backgroundOpacity: Animated.Value = new Animated.Value(0);
  animationType: FXDialogAnimationType;
  showDuration: number;
  closeDuration: number;

  constructor(
    animationType: FXDialogAnimationType = FXDialogAnimationType.Scale,
    showDuration: number = 300,
    closeDuration: number = 200,
  ) {
    logger.log(
      "FXDialogAnimation.constructor() called",
      animationType,
      showDuration,
      closeDuration,
    );
    this.animationType = animationType;
    this.showDuration = showDuration;
    this.closeDuration = closeDuration;
  }

  /**
   * 执行显示动画
   */
  show(): Promise<void> {
    logger.log("FXDialogAnimation.show() called", this.showDuration);
    return new Promise((resolve) => {
      const animations = [
        Animated.timing(this.backgroundOpacity, {
          toValue: 1,
          duration: this.showDuration,
          useNativeDriver: true,
        }),
      ];

      if (this.animationType !== FXDialogAnimationType.None) {
        animations.push(
          Animated.spring(this.animatedValue, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        );
      } else {
        // None 类型也要设置值
        this.animatedValue.setValue(1);
      }

      Animated.parallel(animations).start(({ finished }) => {
        if (finished) {
          resolve();
        }
      });
    });
  }

  /**
   * 执行关闭动画
   */
  close(): Promise<void> {
    logger.log("FXDialogAnimation.close() called", this.closeDuration);
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(this.backgroundOpacity, {
          toValue: 0,
          duration: this.closeDuration,
          useNativeDriver: true,
        }),
        Animated.timing(this.animatedValue, {
          toValue: 0,
          duration: this.closeDuration,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          resolve();
        }
      });
    });
  }

  stop(): void {
    this.animatedValue.stopAnimation();
    this.backgroundOpacity.stopAnimation();
    // 重置状态 直接展示
    this.animatedValue.setValue(1);
    this.backgroundOpacity.setValue(1);
  }

  getConfig() {
    return {
      showDuration: this.showDuration,
      closeDuration: this.closeDuration,
    };
  }

  // 获取动画样式
  containerStyle() {
    const baseStyle: ViewStyle = {
      opacity: this.animatedValue,
    };

    switch (this.animationType) {
      case FXDialogAnimationType.Scale:
        return {
          ...baseStyle,
          transform: [
            {
              scale: this.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };

      case FXDialogAnimationType.SlideUp:
        return {
          ...baseStyle,
          transform: [
            {
              translateY: this.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [SCREEN_HEIGHT, 0],
              }),
            },
          ],
        };

      case FXDialogAnimationType.SlideDown:
        return {
          ...baseStyle,
          transform: [
            {
              translateY: this.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-SCREEN_HEIGHT, 0],
              }),
            },
          ],
        };

      case FXDialogAnimationType.Fade:
        return baseStyle;

      default:
        return {};
    }
  }

  // 获取背景透明度
  backgroundStyle() {
    return {
      opacity: this.backgroundOpacity,
    };
  }

  setAnimationType(animationType: FXDialogAnimationType) {
    this.animationType = animationType;
  }
}

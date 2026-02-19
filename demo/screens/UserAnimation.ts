import { Animated, Easing, ViewStyle } from "react-native";
import { FXDialogAnimationImpl } from "react-native-fxdialog";

// ✅ 每次调用创建新实例
const createAnimator = () => ({
  bgOpacity: new Animated.Value(0), // 每次都是新的！
  scale: new Animated.Value(0.6),
  rotate: new Animated.Value(0),
  flicker: new Animated.Value(0),
});

type AnimatorParams = ReturnType<typeof createAnimator>;
// let loopAnim: Animated.CompositeAnimation | null = null;

export const userAnimator = (
  { bgOpacity, scale, rotate, flicker }: AnimatorParams = createAnimator(),
): FXDialogAnimationImpl => {
  return {
    show(): Promise<void> {
      const entrance = Animated.parallel([
        Animated.timing(bgOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 8,
          stiffness: 180,
          mass: 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);

      //   const disco = Animated.loop(
      //     Animated.sequence([
      //       Animated.timing(flicker, {
      //         toValue: 1,
      //         duration: 120,
      //         easing: Easing.linear,
      //         useNativeDriver: true,
      //       }),
      //       Animated.timing(flicker, {
      //         toValue: 0,
      //         duration: 120,
      //         easing: Easing.linear,
      //         useNativeDriver: true,
      //       }),
      //     ]),
      //   );

      // loopAnim = disco;
      return new Promise((resolve) => {
        entrance.start((finished) => {
          // loopAnim?.start();
          if (finished) {
            resolve();
          }
        });
      });
    },
    close(): Promise<void> {
      // if (loopAnim) {
      //   loopAnim.stop();
      //   loopAnim = null;
      // }
      const entrance = Animated.parallel([
        Animated.timing(bgOpacity, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);
      return new Promise((resolve) => {
        entrance.start((finished) => {
          if (finished) {
            resolve();
          }
        });
      });
    },
    backgroundStyle(): ViewStyle {
      return {
        opacity: bgOpacity,
      } as ViewStyle;
    },
    containerStyle(): ViewStyle {
      const rotateDeg = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
      });
      const pulse = flicker.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.12],
      });
      const opacity = flicker.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.55],
      });
      return {
        transform: [
          { scale: Animated.multiply(scale, pulse) },
          { rotate: rotateDeg },
        ],
        opacity,
      } as ViewStyle;
    },
    getConfig() {
      return {
        showDuration: 400,
        closeDuration: 250,
      };
    },
  } as FXDialogAnimationImpl;
};

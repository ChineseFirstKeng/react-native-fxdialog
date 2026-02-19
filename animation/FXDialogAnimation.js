"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FXDialogAnimation = void 0;
const react_native_1 = require("react-native");
const react_native_fxview_1 = require("react-native-fxview");
const types_1 = require("../types");
const { height: SCREEN_HEIGHT } = react_native_1.Dimensions.get("window");
class FXDialogAnimation {
    constructor(animationType = types_1.FXDialogAnimationType.Scale, showDuration = 300, closeDuration = 200) {
        this.animatedValue = new react_native_1.Animated.Value(0);
        this.backgroundOpacity = new react_native_1.Animated.Value(0);
        react_native_fxview_1.logger.log("FXDialogAnimation.constructor() called", animationType, showDuration, closeDuration);
        this.animationType = animationType;
        this.showDuration = showDuration;
        this.closeDuration = closeDuration;
    }
    /**
     * 执行显示动画
     */
    show() {
        react_native_fxview_1.logger.log("FXDialogAnimation.show() called", this.showDuration);
        return new Promise((resolve) => {
            const animations = [
                react_native_1.Animated.timing(this.backgroundOpacity, {
                    toValue: 1,
                    duration: this.showDuration,
                    useNativeDriver: true,
                }),
            ];
            if (this.animationType !== types_1.FXDialogAnimationType.None) {
                animations.push(react_native_1.Animated.spring(this.animatedValue, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }));
            }
            else {
                // None 类型也要设置值
                this.animatedValue.setValue(1);
            }
            react_native_1.Animated.parallel(animations).start(({ finished }) => {
                if (finished) {
                    resolve();
                }
            });
        });
    }
    /**
     * 执行关闭动画
     */
    close() {
        react_native_fxview_1.logger.log("FXDialogAnimation.close() called", this.closeDuration);
        return new Promise((resolve) => {
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(this.backgroundOpacity, {
                    toValue: 0,
                    duration: this.closeDuration,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(this.animatedValue, {
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
    stop() {
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
        const baseStyle = {
            opacity: this.animatedValue,
        };
        switch (this.animationType) {
            case types_1.FXDialogAnimationType.Scale:
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
            case types_1.FXDialogAnimationType.SlideUp:
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
            case types_1.FXDialogAnimationType.SlideDown:
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
            case types_1.FXDialogAnimationType.Fade:
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
    setAnimationType(animationType) {
        this.animationType = animationType;
    }
}
exports.FXDialogAnimation = FXDialogAnimation;

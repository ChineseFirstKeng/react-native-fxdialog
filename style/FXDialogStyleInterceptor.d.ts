/**
 * 样式拦截器 - 在show之前调用，处理布局逻辑
 *
 * 作用：处理默认样式不够用的情况，比如alert需要纵向布局，默认横向。需要加线分割，让alert更美观。
 *
 * 布局优先级：外部设置的样式 > 拦截器设置的默认样式 > style默认样式
 * 所以可以看到拦截器代码的样式覆盖是props的样式覆盖这里的样式，而在dialogView内部会有props的样式覆盖默认样式。
 */
import { FXDialogViewProps } from "../FXDialogView";
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
export declare const AlertStyleInterceptor: {
    intercept(props: FXDialogViewProps): FXDialogViewProps;
};
/**
 * ActionSheet样式拦截器
 * ActionSheet默认纵向布局，主要处理按钮间距和边框
 */
export declare const ActionSheetStyleInterceptor: {
    intercept(props: FXDialogViewProps): FXDialogViewProps;
};
/**
 * Popup样式拦截器
 * Popup通常从底部弹出，可以添加特殊处理
 */
export declare const PopupStyleInterceptor: {
    intercept(props: FXDialogViewProps): FXDialogViewProps;
};
/**
 * 样式拦截器链
 * 统一管理所有类型的样式拦截
 */
export declare const FXDialogStyleInterceptorSystem: FXDialogStyleInterceptor & {
    interceptAlert: (props: FXDialogViewProps) => FXDialogViewProps;
    interceptActionSheet: (props: FXDialogViewProps) => FXDialogViewProps;
    interceptPopup: (props: FXDialogViewProps) => FXDialogViewProps;
};
//# sourceMappingURL=FXDialogStyleInterceptor.d.ts.map
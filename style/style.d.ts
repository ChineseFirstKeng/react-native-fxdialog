/**
 * 这里的样式是默认样式，优先级最低
 */
import { TextStyle, ViewStyle } from "react-native";
import { FXDialogType } from "../types";
export declare const styles: {
    overlay: {
        position: "absolute";
        top: number;
        left: number;
        right: number;
        bottom: number;
        justifyContent: "center";
        alignItems: "center";
        backgroundColor: string;
    };
    responder: {
        position: "absolute";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    };
    appendBackground: {
        margin: number;
        padding: number;
        width: undefined;
        height: undefined;
        transform: undefined;
        position: "absolute";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    };
    appendContainer: {
        margin: number;
        padding: number;
        width: undefined;
        height: undefined;
        transform: undefined;
        position: "absolute";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    };
    actionBackground: {
        margin: number;
        padding: number;
        width: undefined;
        height: undefined;
        transform: undefined;
        position: "absolute";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    };
    suspension: {
        position: "absolute";
    };
};
/**
 * 统一的样式协议接口
 * 所有弹窗类型都必须实现此协议
 */
export interface FXDialogStyleProtocol {
    overlay: ViewStyle;
    responder: ViewStyle;
    appendBackground: ViewStyle;
    appendContainer: ViewStyle;
    suspension: ViewStyle;
    container: ViewStyle;
    contentsContainer: ViewStyle;
    titleContainer: ViewStyle;
    title: TextStyle;
    messageContainer: ViewStyle;
    message: TextStyle;
    actionsContainer: ViewStyle;
    actionButton: ViewStyle;
    actionBackground: ViewStyle;
    actionText: TextStyle;
    actionCancelText: TextStyle;
    actionHighlightText: TextStyle;
}
export declare const alertStyle: FXDialogStyleProtocol;
export declare const actionSheetStyle: FXDialogStyleProtocol;
export declare const popupStyle: FXDialogStyleProtocol;
export declare const DialogStyleFactory: {
    allStyleMap(): Record<FXDialogType, FXDialogStyleProtocol>;
    getStyle(type: FXDialogType): FXDialogStyleProtocol;
};
//# sourceMappingURL=style.d.ts.map
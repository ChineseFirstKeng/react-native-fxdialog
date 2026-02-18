/**
 * 这里的样式是默认样式，优先级最低
 */
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { FXDialogType } from "../types";

export const styles = StyleSheet.create({
  // 覆盖层样式
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  responder: {
    ...StyleSheet.absoluteFillObject,
  },
  appendBackground: {
    ...StyleSheet.absoluteFillObject,
    margin: 0,
    padding: 0,
    width: undefined,
    height: undefined,
    transform: undefined,
  },
  appendContainer: {
    ...StyleSheet.absoluteFillObject,
    margin: 0,
    padding: 0,
    width: undefined,
    height: undefined,
    transform: undefined,
  },
  actionBackground: {
    ...StyleSheet.absoluteFillObject,
    margin: 0,
    padding: 0,
    width: undefined,
    height: undefined,
    transform: undefined,
  },
  suspension: {
    position: "absolute",
  },
});

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
  // 容器样式
  container: ViewStyle;
  contentsContainer: ViewStyle;

  // 标题样式
  titleContainer: ViewStyle;
  title: TextStyle;

  // 消息样式
  messageContainer: ViewStyle;
  message: TextStyle;

  // 按钮容器样式（横向和纵向）
  actionsContainer: ViewStyle;

  // 按钮样式
  actionButton: ViewStyle;
  actionBackground: ViewStyle;

  // 按钮文本样式
  actionText: TextStyle;
  actionCancelText: TextStyle;
  actionHighlightText: TextStyle;
}

export const alertStyle: FXDialogStyleProtocol = {
  overlay: styles.overlay,
  responder: styles.responder,
  appendBackground: styles.appendBackground,
  appendContainer: styles.appendContainer,
  suspension: styles.suspension,
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: 280,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden",
  },
  contentsContainer: {
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000000",
    textAlign: "center",
    lineHeight: 22,
  },
  messageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  message: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 21,
    textAlign: "center",
    fontWeight: "400",
  },
  actionsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    height: 48,
  },
  actionBackground: styles.actionBackground,
  actionText: {
    fontSize: 17,
    color: "#000000",
    fontWeight: "400",
    textAlignVertical: "center",
  },
  actionCancelText: {
    fontSize: 17,
    textAlignVertical: "center",
    color: "#666666",
    fontWeight: "400",
  },
  actionHighlightText: {
    fontSize: 17,
    fontWeight: "400",
    textAlignVertical: "center",
    color: "#07C160",
  },
};

export const actionSheetStyle: FXDialogStyleProtocol = {
  overlay: styles.overlay,
  responder: styles.responder,
  appendBackground: styles.appendBackground,
  appendContainer: styles.appendContainer,
  suspension: styles.suspension,
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
  },
  contentsContainer: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    color: "#888888",
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 18,
  },
  messageContainer: {
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: "#888888",
    lineHeight: 18,
    textAlign: "center",
    fontWeight: "400",
  },
  actionsContainer: {
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "#F7F7F7",
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: 54,
  },
  actionBackground: styles.actionBackground,
  actionText: {
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
    fontWeight: "400",
  },
  actionCancelText: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
    fontWeight: "400",
  },
  actionHighlightText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "400",
    color: "#07C160",
  },
};

export const popupStyle: FXDialogStyleProtocol = {
  overlay: styles.overlay,
  responder: styles.responder,
  appendBackground: styles.appendBackground,
  appendContainer: styles.appendContainer,
  suspension: styles.suspension,
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  contentsContainer: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000000",
    textAlign: "center",
    lineHeight: 24,
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 21,
    textAlign: "center",
    fontWeight: "400",
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  actionBackground: styles.actionBackground,
  actionText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
  },
  actionCancelText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "400",
  },
  actionHighlightText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#07C160",
  },
};

export const DialogStyleFactory = {
  allStyleMap(): Record<FXDialogType, FXDialogStyleProtocol> {
    return {
      [FXDialogType.Alert]: alertStyle,
      [FXDialogType.ActionSheet]: actionSheetStyle,
      [FXDialogType.Popup]: popupStyle,
    };
  },
  getStyle(type: FXDialogType): FXDialogStyleProtocol {
    return this.allStyleMap()[type] || alertStyle;
  },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_fxview_1 = require("react-native-fxview");
const FXDialogViewController_1 = require("./FXDialogViewController");
/**
 * Dialog 管理器
 */
class DialogManager {
    constructor() {
        this.viewControllerMap = new Map();
    }
    static getInstance() {
        if (!DialogManager.instance) {
            DialogManager.instance = new DialogManager();
        }
        return DialogManager.instance;
    }
    show(entry) {
        try {
            const fxViewId = entry.fxViewId || react_native_fxview_1.FXManager.getLatestFXViewId();
            if (!fxViewId) {
                react_native_fxview_1.logger.warn("[DialogManager] No available FXView");
                return null;
            }
            const viewController = this.getOrCreateViewController(fxViewId);
            return viewController.show(entry);
        }
        catch (error) {
            react_native_fxview_1.logger.error("[DialogManager] Failed to show dialog", error);
            return null;
        }
    }
    close(param, closeType) {
        try {
            if (!param || typeof param === "string") {
                const fxViewId = param || react_native_fxview_1.FXManager.getLatestFXViewId();
                if (!fxViewId) {
                    react_native_fxview_1.logger.warn("[DialogManager] No available FXView");
                    return;
                }
                const viewController = this.viewControllerMap.get(fxViewId);
                if (!viewController) {
                    react_native_fxview_1.logger.warn(`[DialogManager] No viewController found for fxViewId: ${fxViewId}`);
                    return;
                }
                viewController.close(undefined, closeType);
            }
            else {
                const viewController = this.viewControllerMap.get(param.fxViewId);
                if (!viewController) {
                    react_native_fxview_1.logger.warn(`[DialogManager] No viewController found for fxViewId: ${param.fxViewId}`);
                    return;
                }
                viewController.close(param, closeType);
            }
        }
        catch (error) {
            react_native_fxview_1.logger.error("[DialogManager] Failed to close dialog", error);
        }
    }
    clearViewController(fxViewId) {
        const viewController = this.viewControllerMap.get(fxViewId);
        viewController === null || viewController === void 0 ? void 0 : viewController.clear();
        this.viewControllerMap.delete(fxViewId);
    }
    getDebugInfo(fxViewId) {
        if (fxViewId) {
            const viewController = this.viewControllerMap.get(fxViewId);
            return (viewController === null || viewController === void 0 ? void 0 : viewController.getDebugInfo()) || {};
        }
        const allInfo = {};
        this.viewControllerMap.forEach((vc, id) => {
            allInfo[id] = vc.getDebugInfo();
        });
        return allInfo;
    }
    getOrCreateViewController(fxViewId) {
        let viewController = this.viewControllerMap.get(fxViewId);
        if (!viewController) {
            viewController = new FXDialogViewController_1.FXDialogViewController(fxViewId);
            this.viewControllerMap.set(fxViewId, viewController);
        }
        return viewController;
    }
}
exports.default = DialogManager;

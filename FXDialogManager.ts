import { FXManager, logger } from "react-native-fxview";
import { FXDialogViewController } from "./FXDialogViewController";
import { FXDialogShowItem, FXDialogShowEntry } from "./types";

/**
 * FXDialog 管理器
 */
class FXDialogManager {
  private static instance: FXDialogManager;
  private viewControllerMap: Map<string, FXDialogViewController> = new Map();
  static getInstance(): FXDialogManager {
    if (!FXDialogManager.instance) {
      FXDialogManager.instance = new FXDialogManager();
    }
    return FXDialogManager.instance;
  }

  show(entry: FXDialogShowEntry): FXDialogShowItem | null {
    try {
      const fxViewId = entry.fxViewId || FXManager.getLatestFXViewId();
      if (!fxViewId) {
        logger.warn("[DialogManager] No available FXView");
        return null;
      }
      const viewController = this.getOrCreateViewController(fxViewId);
      return viewController.show(entry);
    } catch (error) {
      logger.error("[DialogManager] Failed to show dialog", error);
      return null;
    }
  }

  close(param?: string | FXDialogShowItem, closeType?: string): void {
    try {
      if (!param || typeof param === "string") {
        const fxViewId = param || FXManager.getLatestFXViewId();
        if (!fxViewId) {
          logger.warn("[DialogManager] No available FXView");
          return;
        }
        const viewController = this.viewControllerMap.get(fxViewId);
        if (!viewController) {
          logger.warn(
            `[DialogManager] No viewController found for fxViewId: ${fxViewId}`,
          );
          return;
        }
        viewController.close(undefined, closeType);
      } else {
        const viewController = this.viewControllerMap.get(param.fxViewId);
        if (!viewController) {
          logger.warn(
            `[DialogManager] No viewController found for fxViewId: ${param.fxViewId}`,
          );
          return;
        }
        viewController.close(param, closeType);
      }
    } catch (error) {
      logger.error("[DialogManager] Failed to close dialog", error);
    }
  }

  clearViewController(fxViewId: string): void {
    const viewController = this.viewControllerMap.get(fxViewId);
    viewController?.clear();
    this.viewControllerMap.delete(fxViewId);
  }

  getDebugInfo(fxViewId?: string): object {
    if (fxViewId) {
      const viewController = this.viewControllerMap.get(fxViewId);
      return viewController?.getDebugInfo() || {};
    }

    const allInfo: Record<string, object> = {};
    this.viewControllerMap.forEach((vc, id) => {
      allInfo[id] = vc.getDebugInfo();
    });
    return allInfo;
  }

  private getOrCreateViewController(fxViewId: string): FXDialogViewController {
    let viewController = this.viewControllerMap.get(fxViewId);

    if (!viewController) {
      viewController = new FXDialogViewController(fxViewId);
      this.viewControllerMap.set(fxViewId, viewController);
    }

    return viewController;
  }
}

export default FXDialogManager;

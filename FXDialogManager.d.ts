import { FXDialogQueueItem, FXDialogShowEntry } from "./types";
/**
 * Dialog 管理器
 */
declare class DialogManager {
    private static instance;
    private viewControllerMap;
    static getInstance(): DialogManager;
    show(entry: FXDialogShowEntry): FXDialogQueueItem | null;
    close(param?: string | FXDialogQueueItem, closeType?: string): void;
    clearViewController(fxViewId: string): void;
    getDebugInfo(fxViewId?: string): object;
    private getOrCreateViewController;
}
export default DialogManager;
//# sourceMappingURL=FXDialogManager.d.ts.map
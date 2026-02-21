import { FXDialogShowItem, FXDialogShowEntry } from "./types";
/**
 * FXDialog 管理器
 */
declare class FXDialogManager {
    private static instance;
    private viewControllerMap;
    static getInstance(): FXDialogManager;
    show(entry: FXDialogShowEntry): FXDialogShowItem | null;
    close(param?: string | FXDialogShowItem, closeType?: string): void;
    clearViewController(fxViewId: string): void;
    getDebugInfo(fxViewId?: string): object;
    private getOrCreateViewController;
}
export default FXDialogManager;
//# sourceMappingURL=FXDialogManager.d.ts.map
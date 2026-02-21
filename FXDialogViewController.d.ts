import { FXDialogShowItem, FXDialogShowEntry } from "./types";
export declare class FXDialogViewController {
    private fxViewId;
    private pendingQueue;
    private currentItem;
    private isProcessing;
    private needsReevaluation;
    constructor(fxViewId: string);
    /**
     * 显示弹窗
     */
    show(entry: FXDialogShowEntry): FXDialogShowItem;
    /**
     * 不入队的处理
     */
    private showImmediately;
    /**
     * 入队
     */
    private enqueueItem;
    /**
     * 处理下一个项
     */
    private processNext;
    /**
     * 尝试显示下一个项
     */
    private tryShowNext;
    /**
     * 判断是否应该替换
     */
    private shouldReplace;
    private removeInvalidPendingItems;
    /**
     * 显示项
     */
    private showItem;
    /**
     * 关闭项
     */
    private closeItem;
    /**
     * 手动关闭
     */
    close(item?: FXDialogShowItem, closeType?: string): void;
    /**
     * 清空所有项
     */
    clear(): void;
    private createShowItem;
    getDebugInfo(): object;
}
//# sourceMappingURL=FXDialogViewController.d.ts.map
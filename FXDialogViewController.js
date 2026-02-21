"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FXDialogViewController = void 0;
const react_1 = __importDefault(require("react"));
const react_native_fxview_1 = require("react-native-fxview");
const types_1 = require("./types");
const react_native_fxview_2 = require("react-native-fxview");
const FXDialogView_1 = __importDefault(require("./FXDialogView"));
class FXDialogViewController {
    constructor(fxViewId) {
        this.currentItem = null; // ✅ 只有一个，不需要队列
        this.isProcessing = false;
        this.needsReevaluation = false;
        this.fxViewId = fxViewId;
        this.pendingQueue = new react_native_fxview_2.PriorityQueue(react_native_fxview_2.HeapType.MAX_HEAP, react_native_fxview_2.PriorityOrder.LIFO);
    }
    /**
     * 显示弹窗
     */
    show(entry) {
        react_native_fxview_1.logger.log(`[DialogViewController] show`, entry);
        const showItem = this.createShowItem(entry);
        if (showItem.enqueue) {
            this.enqueueItem(showItem);
        }
        else {
            this.showImmediately(showItem);
        }
        return showItem;
    }
    /**
     * 不入队的处理
     */
    showImmediately(item) {
        var _a, _b;
        react_native_fxview_1.logger.log(`[DialogViewController] showImmediately`, item.componentId, `priority=${item.priority}`);
        // 规则 1：和当前显示的比较
        if (this.currentItem) {
            if (!this.shouldReplace(item, this.currentItem)) {
                react_native_fxview_1.logger.log(`[DialogViewController] skip: priority <= current`, `${item.priority} <= ${this.currentItem.priority}`);
                (_a = item.controller) === null || _a === void 0 ? void 0 : _a.remove();
                return;
            }
        }
        // 规则 2：和等待队列的队首比较
        const topPending = this.pendingQueue.peek();
        if (topPending) {
            if (!this.shouldReplace(item, topPending)) {
                react_native_fxview_1.logger.log(`[DialogViewController] skip: priority <= top pending`, `${item.priority} <= ${topPending.priority}`);
                (_b = item.controller) === null || _b === void 0 ? void 0 : _b.remove();
                return;
            }
        }
        // 满足条件：入队 && 删除等待队列中所有 立即展示不入队的项
        react_native_fxview_1.logger.log(`[DialogViewController] showImmediately: conditions met, enqueue`, item.componentId);
        this.removeInvalidPendingItems();
        this.enqueueItem(item);
    }
    /**
     * 入队
     */
    enqueueItem(item) {
        react_native_fxview_1.logger.log(`[DialogViewController] enqueue`, item.componentId, `priority=${item.priority}`);
        this.pendingQueue.enqueue(item, item.priority, item.timestamp);
        react_native_fxview_1.logger.log(`[DialogViewController] enqueue done, pending:`, this.pendingQueue.size());
        // ✅ 如果正在处理，只标记
        if (this.isProcessing) {
            react_native_fxview_1.logger.log(`[DialogViewController] already processing, mark needsReevaluation`);
            this.needsReevaluation = true;
            return;
        }
        // ✅ 开始处理
        this.processNext();
    }
    /**
     * 处理下一个项
     */
    processNext() {
        // ✅ 设置 isProcessing
        this.isProcessing = true;
        this.needsReevaluation = false;
        react_native_fxview_1.logger.log(`[DialogViewController] processNext, pending:`, this.pendingQueue.size());
        this.tryShowNext()
            .then(() => {
            react_native_fxview_1.logger.log(`[DialogViewController] process completed`);
        })
            .catch((error) => {
            react_native_fxview_1.logger.error(`[DialogViewController] process error`, error);
        })
            .finally(() => {
            react_native_fxview_1.logger.log(`[DialogViewController] process finally done`);
            // ✅ 清除 isProcessing
            this.isProcessing = false;
            // ✅ 检查是否需要重新评估
            if (this.needsReevaluation) {
                react_native_fxview_1.logger.log(`[DialogViewController] re-evaluate queue`);
                this.processNext();
            }
        });
    }
    /**
     * 尝试显示下一个项
     */
    tryShowNext() {
        const pendingItem = this.pendingQueue.peek();
        if (!pendingItem) {
            react_native_fxview_1.logger.log(`[DialogViewController] no pending items`);
            return Promise.resolve();
        }
        // ✅ 如果没有当前项，直接显示
        if (!this.currentItem) {
            react_native_fxview_1.logger.log(`[DialogViewController] no current, show directly`);
            return this.showItem(pendingItem);
        }
        // ✅ 判断是否需要替换
        if (this.shouldReplace(pendingItem, this.currentItem)) {
            react_native_fxview_1.logger.log(`[DialogViewController] need replace current`, this.currentItem.componentId, "→", pendingItem.componentId);
            // ✅ 先关闭当前的，再显示新的
            const oldItem = this.currentItem;
            return this.closeItem(oldItem, "queue_replace").then(() => {
                return this.showItem(pendingItem);
            });
        }
        // ✅ 不需要替换，等待
        react_native_fxview_1.logger.log(`[DialogViewController] wait for current to finish`);
        return Promise.resolve();
    }
    /**
     * 判断是否应该替换
     */
    shouldReplace(newItem, targetItem) {
        if (newItem.priority > targetItem.priority) {
            return true;
        }
        if (newItem.priority === targetItem.priority &&
            newItem.timestamp > targetItem.timestamp) {
            return true;
        }
        return false;
    }
    removeInvalidPendingItems() {
        const toRemove = this.pendingQueue.getAll().filter((item) => !item.enqueue);
        toRemove.forEach((item) => {
            this.pendingQueue.remove(item);
        });
    }
    /**
     * 显示项
     */
    showItem(item) {
        var _a, _b;
        react_native_fxview_1.logger.log(`[DialogViewController] >>> showItem start`, item.componentId);
        // ✅ 从 pending 移除，设为 current
        this.pendingQueue.remove(item);
        this.currentItem = item;
        (_a = item.controller) === null || _a === void 0 ? void 0 : _a.show();
        const animationPromise = ((_b = item.animationController) === null || _b === void 0 ? void 0 : _b.show()) || Promise.resolve();
        return animationPromise
            .then(() => {
            var _a;
            react_native_fxview_1.logger.log(`[DialogViewController] >>> showItem done`, item.componentId);
            (_a = item.didShow) === null || _a === void 0 ? void 0 : _a.call(item);
        })
            .catch((error) => {
            var _a;
            react_native_fxview_1.logger.error(`[DialogViewController] showItem error`, error);
            (_a = item.didShow) === null || _a === void 0 ? void 0 : _a.call(item);
        });
    }
    /**
     * 关闭项
     */
    closeItem(item, closeType) {
        var _a;
        react_native_fxview_1.logger.log(`[DialogViewController] >>> closeItem start`, item.componentId, closeType);
        const animationPromise = ((_a = item.animationController) === null || _a === void 0 ? void 0 : _a.close()) || Promise.resolve();
        return animationPromise
            .then(() => {
            var _a, _b, _c;
            react_native_fxview_1.logger.log(`[DialogViewController] >>> closeItem done`, item.componentId);
            // ✅ 清除 current
            if (this.currentItem === item) {
                this.currentItem = null;
            }
            const isQueueReplace = closeType === "queue_replace";
            if (isQueueReplace && item.enqueue) {
                // ✅ 替换：重新入队
                (_a = item.controller) === null || _a === void 0 ? void 0 : _a.hide();
                this.pendingQueue.enqueue(item, item.priority, item.timestamp);
            }
            else {
                // ✅ 彻底关闭
                (_b = item.controller) === null || _b === void 0 ? void 0 : _b.remove();
            }
            (_c = item.didClose) === null || _c === void 0 ? void 0 : _c.call(item, closeType);
        })
            .catch((error) => {
            var _a, _b;
            react_native_fxview_1.logger.error(`[DialogViewController] closeItem error`, error);
            if (this.currentItem === item) {
                this.currentItem = null;
            }
            (_a = item.controller) === null || _a === void 0 ? void 0 : _a.remove();
            (_b = item.didClose) === null || _b === void 0 ? void 0 : _b.call(item, closeType);
        });
    }
    /**
     * 手动关闭
     */
    close(item, closeType) {
        const targetItem = item || this.currentItem;
        if (!targetItem) {
            react_native_fxview_1.logger.warn(`[DialogViewController] no item to close`);
            return;
        }
        react_native_fxview_1.logger.log(`[DialogViewController] manual close`, targetItem.componentId);
        // ✅ 设置 isProcessing
        this.isProcessing = true;
        this.closeItem(targetItem, closeType || "custom")
            .then(() => {
            react_native_fxview_1.logger.log(`[DialogViewController] manual close done`);
        })
            .catch((error) => {
            react_native_fxview_1.logger.error(`[DialogViewController] manual close error`, error);
        })
            .finally(() => {
            // ✅ 清除 isProcessing
            this.isProcessing = false;
            // ✅ 关闭后继续处理
            this.processNext();
        });
    }
    /**
     * 清空所有项
     */
    clear() {
        react_native_fxview_1.logger.log(`[DialogViewController] clear all`);
        if (this.currentItem) {
            this.isProcessing = true;
            this.closeItem(this.currentItem, "clear").finally(() => {
                this.isProcessing = false;
            });
        }
        this.pendingQueue.forEach((item) => {
            var _a;
            (_a = item.controller) === null || _a === void 0 ? void 0 : _a.remove();
        });
        this.pendingQueue.clear();
        this.currentItem = null;
        react_native_fxview_1.logger.log(`[DialogViewController] clear all done`);
    }
    createShowItem(entry) {
        var _a;
        const componentId = `dialog_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`;
        const showItem = {
            fxViewId: this.fxViewId,
            componentId,
            priority: entry.priority || 0,
            timestamp: Date.now(),
            enqueue: entry.enqueue !== undefined ? entry.enqueue : false,
            didShow: entry.didShow,
            didClose: entry.didClose,
            dialogProps: entry.dialogProps,
            animationController: (_a = entry.dialogProps) === null || _a === void 0 ? void 0 : _a.animator,
        };
        const dialogViewRef = react_1.default.createRef();
        showItem.dialogViewRef = dialogViewRef;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        showItem.dialogView = react_1.default.createElement(FXDialogView_1.default, {
            ...entry.dialogProps,
            ref: dialogViewRef,
            close: (closeType) => {
                this.close(showItem, closeType);
            },
        });
        showItem.controller = react_native_fxview_1.FXManager.build(showItem.dialogView, this.fxViewId, types_1.FXDialogFXViewCategory, componentId);
        return showItem;
    }
    getDebugInfo() {
        var _a, _b, _c;
        return {
            fxViewId: this.fxViewId,
            pending: this.pendingQueue.size(),
            current: ((_a = this.currentItem) === null || _a === void 0 ? void 0 : _a.componentId) || null,
            currentPriority: ((_b = this.currentItem) === null || _b === void 0 ? void 0 : _b.priority) || null,
            isProcessing: this.isProcessing,
            needsReevaluation: this.needsReevaluation,
            topPending: ((_c = this.pendingQueue.peek()) === null || _c === void 0 ? void 0 : _c.componentId) || null,
        };
    }
}
exports.FXDialogViewController = FXDialogViewController;

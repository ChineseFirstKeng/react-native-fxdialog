import React from "react";
import { FXManager, logger } from "react-native-fxview";
import {
  FXDialogFXViewCategory,
  FXDialogShowItem,
  FXDialogShowEntry,
} from "./types";
import { PriorityQueue, HeapType, PriorityOrder } from "react-native-fxview";
import FXDialogView from "./FXDialogView";

export class FXDialogViewController {
  private fxViewId: string;

  private pendingQueue: PriorityQueue<FXDialogShowItem>;
  private currentItem: FXDialogShowItem | null = null; // ✅ 只有一个，不需要队列

  private isProcessing: boolean = false;
  private needsReevaluation: boolean = false;

  constructor(fxViewId: string) {
    this.fxViewId = fxViewId;

    this.pendingQueue = new PriorityQueue<FXDialogShowItem>(
      HeapType.MAX_HEAP,
      PriorityOrder.LIFO,
    );
  }

  /**
   * 显示弹窗
   */
  show(entry: FXDialogShowEntry): FXDialogShowItem {
    logger.log(`[DialogViewController] show`, entry);

    const showItem = this.createShowItem(entry);

    if (showItem.enqueue) {
      this.enqueueItem(showItem);
    } else {
      this.showImmediately(showItem);
    }

    return showItem;
  }

  /**
   * 不入队的处理
   */
  private showImmediately(item: FXDialogShowItem): void {
    logger.log(
      `[DialogViewController] showImmediately`,
      item.componentId,
      `priority=${item.priority}`,
    );

    // 规则 1：和当前显示的比较
    if (this.currentItem) {
      if (!this.shouldReplace(item, this.currentItem)) {
        logger.log(
          `[DialogViewController] skip: priority <= current`,
          `${item.priority} <= ${this.currentItem.priority}`,
        );
        item.controller?.remove();
        return;
      }
    }

    // 规则 2：和等待队列的队首比较
    const topPending = this.pendingQueue.peek();
    if (topPending) {
      if (!this.shouldReplace(item, topPending)) {
        logger.log(
          `[DialogViewController] skip: priority <= top pending`,
          `${item.priority} <= ${topPending.priority}`,
        );
        item.controller?.remove();
        return;
      }
    }

    // 满足条件：入队 && 删除等待队列中所有 立即展示不入队的项
    logger.log(
      `[DialogViewController] showImmediately: conditions met, enqueue`,
      item.componentId,
    );
    this.removeInvalidPendingItems();
    this.enqueueItem(item);
  }

  /**
   * 入队
   */
  private enqueueItem(item: FXDialogShowItem): void {
    logger.log(
      `[DialogViewController] enqueue`,
      item.componentId,
      `priority=${item.priority}`,
    );

    this.pendingQueue.enqueue(item, item.priority, item.timestamp);

    logger.log(
      `[DialogViewController] enqueue done, pending:`,
      this.pendingQueue.size(),
    );

    // ✅ 如果正在处理，只标记
    if (this.isProcessing) {
      logger.log(
        `[DialogViewController] already processing, mark needsReevaluation`,
      );
      this.needsReevaluation = true;
      return;
    }

    // ✅ 开始处理
    this.processNext();
  }

  /**
   * 处理下一个项
   */
  private processNext(): void {
    // ✅ 设置 isProcessing
    this.isProcessing = true;
    this.needsReevaluation = false;

    logger.log(
      `[DialogViewController] processNext, pending:`,
      this.pendingQueue.size(),
    );

    this.tryShowNext()
      .then(() => {
        logger.log(`[DialogViewController] process completed`);
      })
      .catch((error) => {
        logger.error(`[DialogViewController] process error`, error);
      })
      .finally(() => {
        logger.log(`[DialogViewController] process finally done`);
        // ✅ 清除 isProcessing
        this.isProcessing = false;

        // ✅ 检查是否需要重新评估
        if (this.needsReevaluation) {
          logger.log(`[DialogViewController] re-evaluate queue`);
          this.processNext();
        }
      });
  }

  /**
   * 尝试显示下一个项
   */
  private tryShowNext(): Promise<void> {
    const pendingItem = this.pendingQueue.peek();

    if (!pendingItem) {
      logger.log(`[DialogViewController] no pending items`);
      return Promise.resolve();
    }

    // ✅ 如果没有当前项，直接显示
    if (!this.currentItem) {
      logger.log(`[DialogViewController] no current, show directly`);
      return this.showItem(pendingItem);
    }

    // ✅ 判断是否需要替换
    if (this.shouldReplace(pendingItem, this.currentItem)) {
      logger.log(
        `[DialogViewController] need replace current`,
        this.currentItem.componentId,
        "→",
        pendingItem.componentId,
      );

      // ✅ 先关闭当前的，再显示新的
      const oldItem = this.currentItem;

      return this.closeItem(oldItem, "queue_replace").then(() => {
        return this.showItem(pendingItem);
      });
    }

    // ✅ 不需要替换，等待
    logger.log(`[DialogViewController] wait for current to finish`);
    return Promise.resolve();
  }

  /**
   * 判断是否应该替换
   */
  private shouldReplace(
    newItem: FXDialogShowItem,
    targetItem: FXDialogShowItem,
  ): boolean {
    if (newItem.priority > targetItem.priority) {
      return true;
    }
    if (
      newItem.priority === targetItem.priority &&
      newItem.timestamp > targetItem.timestamp
    ) {
      return true;
    }

    return false;
  }

  private removeInvalidPendingItems(): void {
    const toRemove = this.pendingQueue.getAll().filter((item) => !item.enqueue);
    toRemove.forEach((item) => {
      this.pendingQueue.remove(item);
    });
  }

  /**
   * 显示项
   */
  private showItem(item: FXDialogShowItem): Promise<void> {
    logger.log(`[DialogViewController] >>> showItem start`, item.componentId);

    // ✅ 从 pending 移除，设为 current
    this.pendingQueue.remove(item);
    this.currentItem = item;

    item.controller?.show();

    const animationPromise =
      item.animationController?.show() || Promise.resolve();

    return animationPromise
      .then(() => {
        logger.log(
          `[DialogViewController] >>> showItem done`,
          item.componentId,
        );
        item.didShow?.();
      })
      .catch((error) => {
        logger.error(`[DialogViewController] showItem error`, error);
        item.didShow?.();
      });
  }

  /**
   * 关闭项
   */
  private closeItem(item: FXDialogShowItem, closeType: string): Promise<void> {
    logger.log(
      `[DialogViewController] >>> closeItem start`,
      item.componentId,
      closeType,
    );

    const animationPromise =
      item.animationController?.close() || Promise.resolve();

    return animationPromise
      .then(() => {
        logger.log(
          `[DialogViewController] >>> closeItem done`,
          item.componentId,
        );

        // ✅ 清除 current
        if (this.currentItem === item) {
          this.currentItem = null;
        }

        const isQueueReplace = closeType === "queue_replace";
        if (isQueueReplace && item.enqueue) {
          // ✅ 替换：重新入队
          item.controller?.hide();
          this.pendingQueue.enqueue(item, item.priority, item.timestamp);
        } else {
          // ✅ 彻底关闭
          item.controller?.remove();
        }
        item.didClose?.(closeType);
      })
      .catch((error) => {
        logger.error(`[DialogViewController] closeItem error`, error);

        if (this.currentItem === item) {
          this.currentItem = null;
        }

        item.controller?.remove();
        item.didClose?.(closeType);
      });
  }

  /**
   * 手动关闭
   */
  close(item?: FXDialogShowItem, closeType?: string): void {
    const targetItem = item || this.currentItem;

    if (!targetItem) {
      logger.warn(`[DialogViewController] no item to close`);
      return;
    }

    logger.log(`[DialogViewController] manual close`, targetItem.componentId);

    // ✅ 设置 isProcessing
    this.isProcessing = true;

    this.closeItem(targetItem, closeType || "custom")
      .then(() => {
        logger.log(`[DialogViewController] manual close done`);
      })
      .catch((error) => {
        logger.error(`[DialogViewController] manual close error`, error);
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
  clear(): void {
    logger.log(`[DialogViewController] clear all`);

    if (this.currentItem) {
      this.isProcessing = true;

      this.closeItem(this.currentItem, "clear").finally(() => {
        this.isProcessing = false;
      });
    }

    this.pendingQueue.forEach((item) => {
      item.controller?.remove();
    });

    this.pendingQueue.clear();
    this.currentItem = null;

    logger.log(`[DialogViewController] clear all done`);
  }

  private createShowItem(entry: FXDialogShowEntry): FXDialogShowItem {
    const componentId = `dialog_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const showItem: FXDialogShowItem = {
      fxViewId: this.fxViewId,
      componentId,
      priority: entry.priority || 0,
      timestamp: Date.now(),
      enqueue: entry.enqueue !== undefined ? entry.enqueue : false,
      didShow: entry.didShow,
      didClose: entry.didClose,
      dialogProps: entry.dialogProps,
      animationController: entry.dialogProps?.animator,
    };

    const dialogViewRef = React.createRef<FXDialogView | null>();
    showItem.dialogViewRef = dialogViewRef;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showItem.dialogView = React.createElement(FXDialogView as any, {
      ...entry.dialogProps,
      ref: dialogViewRef,
      close: (closeType?: string) => {
        this.close(showItem, closeType);
      },
    });

    showItem.controller = FXManager.build(
      showItem.dialogView,
      this.fxViewId,
      FXDialogFXViewCategory,
      componentId,
    );

    return showItem;
  }

  getDebugInfo(): object {
    return {
      fxViewId: this.fxViewId,
      pending: this.pendingQueue.size(),
      current: this.currentItem?.componentId || null,
      currentPriority: this.currentItem?.priority || null,
      isProcessing: this.isProcessing,
      needsReevaluation: this.needsReevaluation,
      topPending: this.pendingQueue.peek()?.componentId || null,
    };
  }
}

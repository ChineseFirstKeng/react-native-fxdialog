import { logger } from "react-native-fxview";
import { FXDialogAction, FXDialogContent } from "../types";

/**
 * 通用构建更新映射表函数
 */
function buildUpdateMap<T extends { id?: string }>(
  items: T[] | undefined,
): Map<string, T> {
  const map = new Map<string, T>();
  items?.forEach((item) => {
    if (!item.id) {
      logger.warn(`[DialogViewUpdateBuilder] Update  missing ID:`, item);
      return;
    }
    map.set(item.id, item);
  });
  return map;
}

/**
 * 通用更新数组函数
 */
function buildUpdatedArray<T extends { id?: string }>(
  updateItems: T[],
  currentItems: T[],
): {
  items: T[];
  changed: boolean;
} {
  const updateMap = buildUpdateMap(updateItems);
  if (updateMap.size === 0) {
    return { items: currentItems, changed: false };
  }
  let isChanged = false;
  const updatedItems = currentItems.map((item) => {
    const itemId = item.id;
    if (itemId && updateMap.has(itemId)) {
      const updatedItem = updateMap.get(itemId);
      if (updatedItem) {
        isChanged = true;
        logger.log(`[DialogViewUpdateBuilder] update Map has Id:`, updatedItem);
        return updatedItem;
      }
    }
    return item;
  });

  return { items: updatedItems, changed: isChanged };
}

export const FXDialogViewUpdateBuilder = {
  /**
   * 构建内容更新映射表
   */
  buildUpdateContentMap(
    updateContents: FXDialogContent[] | undefined,
  ): Map<string, FXDialogContent> {
    return buildUpdateMap(updateContents);
  },

  /**
   * 构建按钮更新映射表
   */
  buildUpdateActionMap(
    updateActions: FXDialogAction[] | undefined,
  ): Map<string, FXDialogAction> {
    return buildUpdateMap(updateActions);
  },

  /**
   * 更新内容数组
   */
  buildUpdatedContents(
    updateContents: FXDialogContent[],
    currentContents: FXDialogContent[],
  ): {
    contents: FXDialogContent[];
    changed: boolean;
  } {
    const result = buildUpdatedArray(updateContents, currentContents);
    return { contents: result.items, changed: result.changed };
  },

  /**
   * 更新按钮数组
   */
  buildUpdatedActions(
    updateActions: FXDialogAction[],
    currentActions: FXDialogAction[],
  ): {
    actions: FXDialogAction[];
    changed: boolean;
  } {
    const result = buildUpdatedArray(updateActions, currentActions);
    return { actions: result.items, changed: result.changed };
  },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FXDialogViewUpdateBuilder = void 0;
const react_native_fxview_1 = require("react-native-fxview");
/**
 * 通用构建更新映射表函数
 */
function buildUpdateMap(items) {
    const map = new Map();
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        if (!item.id) {
            react_native_fxview_1.logger.warn(`[DialogViewUpdateBuilder] Update  missing ID:`, item);
            return;
        }
        map.set(item.id, item);
    });
    return map;
}
/**
 * 通用更新数组函数
 */
function buildUpdatedArray(updateItems, currentItems) {
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
                react_native_fxview_1.logger.log(`[DialogViewUpdateBuilder] update Map has Id:`, updatedItem);
                return updatedItem;
            }
        }
        return item;
    });
    return { items: updatedItems, changed: isChanged };
}
exports.FXDialogViewUpdateBuilder = {
    /**
     * 构建内容更新映射表
     */
    buildUpdateContentMap(updateContents) {
        return buildUpdateMap(updateContents);
    },
    /**
     * 构建按钮更新映射表
     */
    buildUpdateActionMap(updateActions) {
        return buildUpdateMap(updateActions);
    },
    /**
     * 更新内容数组
     */
    buildUpdatedContents(updateContents, currentContents) {
        const result = buildUpdatedArray(updateContents, currentContents);
        return { contents: result.items, changed: result.changed };
    },
    /**
     * 更新按钮数组
     */
    buildUpdatedActions(updateActions, currentActions) {
        const result = buildUpdatedArray(updateActions, currentActions);
        return { actions: result.items, changed: result.changed };
    },
};

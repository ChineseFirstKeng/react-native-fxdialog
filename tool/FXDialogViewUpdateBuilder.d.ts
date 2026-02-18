import { FXDialogAction, FXDialogContent } from "../types";
export declare const FXDialogViewUpdateBuilder: {
    /**
     * 构建内容更新映射表
     */
    buildUpdateContentMap(updateContents: FXDialogContent[] | undefined): Map<string, FXDialogContent>;
    /**
     * 构建按钮更新映射表
     */
    buildUpdateActionMap(updateActions: FXDialogAction[] | undefined): Map<string, FXDialogAction>;
    /**
     * 更新内容数组
     */
    buildUpdatedContents(updateContents: FXDialogContent[], currentContents: FXDialogContent[]): {
        contents: FXDialogContent[];
        changed: boolean;
    };
    /**
     * 更新按钮数组
     */
    buildUpdatedActions(updateActions: FXDialogAction[], currentActions: FXDialogAction[]): {
        actions: FXDialogAction[];
        changed: boolean;
    };
};
//# sourceMappingURL=FXDialogViewUpdateBuilder.d.ts.map
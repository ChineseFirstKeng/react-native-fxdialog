import React, { Component } from "react";
import { ViewStyle } from "react-native";
import { FXDialogType, FXDialogAction, FXDialogAnimationImpl, FXDialogUpdateConfig, FXDialogContent, FXDialogDefaultAction } from "./types";
export interface FXDialogViewProps {
    type?: FXDialogType;
    contents?: FXDialogContent[];
    actions?: FXDialogAction[];
    suspensions?: React.ReactNode[];
    backgroundStyle?: ViewStyle;
    containerStyle?: ViewStyle;
    contentsContainerStyle?: ViewStyle;
    actionsContainerStyle?: ViewStyle;
    appendBackground?: React.ReactNode;
    appendContainer?: React.ReactNode;
    animator?: FXDialogAnimationImpl;
    closeOnClickBackground?: boolean;
    actionsScrollMinHeight?: number;
    actionsScrollMaxHeight?: number;
    containerScrollMaxHeight?: number;
    close?: (closeType?: string) => void;
}
interface FXDialogViewState {
    hasMeasuredContent: boolean;
    hasMeasuredActions: boolean;
    measureContentHeight: number;
    measureActionHeight: number;
    suspensions?: React.ReactNode[];
    contentScrollable: boolean;
    actionsScrollable: boolean;
    adjustedContentHeight: number;
    adjustedActionsHeight: number;
    displayContents?: FXDialogContent[];
    displayActions?: FXDialogAction[];
    measureContents?: FXDialogContent[];
    measureActions?: FXDialogAction[];
    containerStyle?: ViewStyle;
    backgroundStyle?: ViewStyle;
    contentsContainerStyle?: ViewStyle;
    actionsContainerStyle?: ViewStyle;
    appendBackground?: React.ReactNode;
    appendContainer?: React.ReactNode;
}
export declare const FXDialogViewDefaultScrollConfig: {
    layout: {
        maxHeightRatio: number;
        maxActionsHeightRatio: number;
        minActionsHeight: number;
    };
    getRuntimeDimensions(): {
        maxHeight: number;
        maxActionsHeight: number;
        minActionsHeight: number;
    };
};
export default class FXDialogView extends Component<FXDialogViewProps, FXDialogViewState> {
    private animator?;
    private scrollCalculation;
    private style;
    constructor(props: FXDialogViewProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: FXDialogViewProps, nextState: FXDialogViewState): boolean;
    update(updates: FXDialogUpdateConfig): void;
    private handleContentLayout;
    private handleActionsLayout;
    private checkIfBothMeasured;
    private debouncedCalculateScrollState;
    private calculateScrollState;
    handleBackdropPress: () => void;
    handleActionPress: (action: FXDialogAction) => void;
    private categorizeContents;
    private allActions;
    private renderTitle;
    private renderMessage;
    private renderCustomContent;
    private renderSingleContent;
    private renderSingleAction;
    renderAppendBackground(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
    renderAppendContainer(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
    renderActionBackground(action: FXDialogDefaultAction): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
    renderSuspensions: () => (React.ReactElement<any, string | React.JSXElementConstructor<any>> | null)[] | undefined;
    renderActions: (actions: FXDialogAction[]) => React.JSX.Element;
    renderContents: (contents: FXDialogContent[]) => React.JSX.Element;
    renderAllArea: (contents: FXDialogContent[], actions: FXDialogAction[]) => React.JSX.Element;
    render(): React.JSX.Element;
}
export {};
//# sourceMappingURL=FXDialogView.d.ts.map
/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { PropsWithChildren } from "react";
import { ModalProps } from "react-native";
import { ImageSource } from "./@types";
declare type Props = {
    images: ImageSource[];
    keyExtractor?: (imageSrc: ImageSource, index: number) => string;
    imageIndex: number;
    visible: boolean;
    onRequestClose: () => void;
    onLongPress?: (image: ImageSource) => void;
    onImageIndexChange?: (imageIndex: number) => void;
    presentationStyle?: ModalProps["presentationStyle"];
    animationType?: ModalProps["animationType"];
    backgroundColor?: string;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
    delayLongPress?: number;
    HeaderComponent?: ({ imageIndex }: PropsWithChildren<{
        imageIndex: number;
    }>) => JSX.Element;
    FooterComponent?: ({ imageIndex }: PropsWithChildren<{
        imageIndex: number;
    }>) => JSX.Element;
    hideComponents?: boolean;
    children?: React.ReactNode;
};
declare const EnhancedImageViewing: (props: Props) => React.JSX.Element;
export default EnhancedImageViewing;

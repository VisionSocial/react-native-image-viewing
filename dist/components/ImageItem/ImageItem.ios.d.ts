/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from "react";
import { IimageSrc } from "../../@types";
type Props = {
    imageSrc: IimageSrc;
    onRequestClose: () => void;
    onZoom: (scaled: boolean) => void;
    onLongPress: () => void;
    setShowOptions: (showOptions: boolean) => void;
    delayLongPress: number;
    currentImageIndex: number;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
};
declare const _default: React.MemoExoticComponent<({ imageSrc, onZoom, onRequestClose, onLongPress, setShowOptions, delayLongPress, currentImageIndex, swipeToCloseEnabled, doubleTapToZoomEnabled, }: Props) => JSX.Element>;
export default _default;

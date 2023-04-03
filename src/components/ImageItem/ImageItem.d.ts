/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import { GestureResponderEvent } from "react-native";
import { Iimages, IimageSrc } from "../../@types";

declare type Props = {
  images: Array<IimageSrc>;
  imageSrc: IimageSrc;
  onRequestClose: () => void;
  onZoom: (isZoomed: boolean) => void;
  onLongPress: (IimageSrc: IimageSrc) => void;
  delayLongPress: number;
  currentImageIndex: number;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
};

declare const _default: React.MemoExoticComponent<
  ({
    imageSrc,
    onZoom,
    onRequestClose,
    onLongPress,
    delayLongPress,
    currentImageIndex,
    swipeToCloseEnabled,
  }: Props) => JSX.Element
>;

export default _default;

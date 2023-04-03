/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableWithoutFeedback,
  Modal,
  GestureResponderEvent,
  TouchableOpacity,
} from "react-native";

import useDoubleTapToZoom from "../../hooks/useDoubleTapToZoom";
import useImageDimensions from "../../hooks/useImageDimensions";

import { getImageStyles, getImageTransform } from "../../utils";
import { Iimages, IimageSrc, ImageSource } from "../../@types";
import { ImageLoading } from "./ImageLoading";
import Video from "react-native-video";
import VideoPlayer from "react-native-video-controls";
import VideoIcon from "../videoIcon";

import RNFS from "react-native-fs";

const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.55;
const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

type Props = {
  imageSrc: IimageSrc;
  onRequestClose: () => void;
  onZoom: (scaled: boolean) => void;
  onLongPress: () => void;
  setShowOptions: (showOptions: boolean) => void;
  delayLongPress: number;
  // images: Array<Iimages>;
  currentImageIndex: number;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
};

const ImageItem = ({
  imageSrc,
  onZoom,
  // images,
  onRequestClose,
  onLongPress,
  setShowOptions,
  delayLongPress,
  currentImageIndex,
  swipeToCloseEnabled = true,
  doubleTapToZoomEnabled = true,
}: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [loaded, setLoaded] = useState(false);
  const [scaled, setScaled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { width, height } = imageSrc;
  const imageDimensions =
    width && height
      ? { width: width, height: height }
      : { width: 0, height: 0 };
  const handleDoubleTap = useDoubleTapToZoom(
    scrollViewRef,
    scaled,
    SCREEN,
    setShowOptions
  );

  const [translate, scale] = getImageTransform(imageDimensions, SCREEN);
  const scrollValueY = new Animated.Value(0);
  const scaleValue = new Animated.Value(scale || 1);
  const translateValue = new Animated.ValueXY(translate);
  const maxScale = scale && scale > 0 ? Math.max(1 / scale, 1) : 1;

  const imageOpacity = scrollValueY.interpolate({
    inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
    outputRange: [0.5, 1, 0.5],
  });
  const imagesStyles = getImageStyles(
    imageDimensions,
    translateValue,
    scaleValue
  );
  const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };

  const onScrollEndDrag = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const velocityY = nativeEvent?.velocity?.y ?? 0;
      const scaled = nativeEvent?.zoomScale > 1;

      onZoom(scaled);
      setScaled(scaled);

      if (
        !scaled &&
        swipeToCloseEnabled &&
        Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY
      ) {
        onRequestClose();
      }
    },
    [scaled]
  );

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    if (nativeEvent?.zoomScale > 1) {
      return;
    }

    scrollValueY.setValue(offsetY);
  };

  const onLongPressHandler = useCallback(
    (event: GestureResponderEvent) => {
      onLongPress();
    },
    [imageSrc, onLongPress]
  );

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.listItem}
        pinchGestureEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={maxScale}
        contentContainerStyle={styles.imageScrollContainer}
        scrollEnabled={swipeToCloseEnabled}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={1}
        {...(swipeToCloseEnabled && {
          onScroll,
        })}
      >
        {(!loaded || !imageDimensions) && <ImageLoading />}
        {imageSrc.videoType ? (
          <TouchableOpacity
            onPress={() => setShowVideo(true)}
            style={styles.videoIcon}
          >
            <VideoIcon width={100} height={100} />
          </TouchableOpacity>
        ) : null}
        <TouchableWithoutFeedback
          onPress={doubleTapToZoomEnabled ? handleDoubleTap : undefined}
          onPressIn={() => setPaused(true)}
          onPressOut={() => setPaused(false)}
          onLongPress={onLongPressHandler}
          delayLongPress={delayLongPress}
        >
          <View style={{ flex: 1 }}>
            <Animated.Image
              source={{
                uri: RNFS.DocumentDirectoryPath + "/" + imageSrc.source,
              }}
              style={imageStylesWithOpacity}
              onLoad={() => setLoaded(true)}
            />
            <Modal visible={showVideo} transparent={true}>
              <VideoPlayer
                onBack={() => setShowVideo(false)}
                fullscreen={true}
                isFullScreen={true}
                onExitFullscreen={() => setShowVideo(false)}
                playWhenInactive={false}
                playInBackground={false}
                onFullscreenPlayerDidDismiss={() => {
                  console.log(
                    "'At this point, I know the fullscreen viewer is closing and my video will be paused, but I'm assuming the side effect rather than using an event.'"
                  );
                }}
                fullscreenOrientation="all"
                source={{
                  uri: RNFS.DocumentDirectoryPath + "/" + imageSrc.video,
                }}
                style={styles.listItem}
                onReadyForDisplay={() => setLoaded(true)}
              />
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageScrollContainer: {
    height: SCREEN_HEIGHT,
  },
  videoIcon: {
    top: "40%",
    zIndex: 10,
    alignSelf: "center",
    position: "absolute",
  },
});

export default React.memo(ImageItem);

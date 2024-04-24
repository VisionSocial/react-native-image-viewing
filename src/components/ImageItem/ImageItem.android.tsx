/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useCallback, useRef, useState } from "react";

import {
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  NativeMethodsMixin,
  TouchableOpacity,
} from "react-native";
import VideoPlayer from "react-native-video-controls";
import useImageDimensions from "../../hooks/useImageDimensions";
import usePanResponder from "../../hooks/usePanResponder";

import { getImageStyles, getImageTransform } from "../../utils";
import { ImageSource } from "../../@types";
import { ImageLoading } from "./ImageLoading";
import VideoIcon from "../videoIcon";
import { Modal } from "react-native";
import { View } from "react-native";

const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.75;
const SCREEN = Dimensions.get("window");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

type Props = {
  imageSrc: ImageSource;
  onRequestClose: () => void;
  onZoom: (isZoomed: boolean) => void;
  onLongPress: (image: ImageSource) => void;
  delayLongPress: number;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  setShowComponents?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageItem = ({
  imageSrc,
  onZoom,
  onRequestClose,
  onLongPress,
  delayLongPress,
  swipeToCloseEnabled = true,
  doubleTapToZoomEnabled = true,
  setShowComponents,
}: Props) => {
  const imageContainer = useRef<ScrollView & NativeMethodsMixin>(null);
  const imageDimensions = useImageDimensions(imageSrc);
  const [translate, scale] = getImageTransform(imageDimensions, SCREEN);
  const scrollValueY = new Animated.Value(0);
  const [isLoaded, setLoadEnd] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const onLoaded = useCallback(() => setLoadEnd(true), []);
  const onZoomPerformed = useCallback(
    (isZoomed: boolean) => {
      onZoom(isZoomed);
      if (imageContainer?.current) {
        imageContainer.current.setNativeProps({
          scrollEnabled: !isZoomed,
        });
      }
    },
    [imageContainer]
  );

  const onLongPressHandler = useCallback(() => {
    onLongPress(imageSrc);
  }, [imageSrc, onLongPress]);

  const [panHandlers, scaleValue, translateValue] = usePanResponder({
    initialScale: scale || 1,
    initialTranslate: translate || { x: 0, y: 0 },
    onZoom: onZoomPerformed,
    doubleTapToZoomEnabled,
    onLongPress: onLongPressHandler,
    delayLongPress,
    setShowComponents
  }
);

  const imagesStyles = getImageStyles(
    imageDimensions,
    translateValue,
    scaleValue
  );
  const imageOpacity = scrollValueY.interpolate({
    inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
    outputRange: [0.7, 1, 0.7],
  });
  const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };

  const onScrollEndDrag = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const velocityY = nativeEvent?.velocity?.y ?? 0;
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    if (
      (Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY &&
        offsetY > SWIPE_CLOSE_OFFSET) ||
      offsetY > SCREEN_HEIGHT / 2
    ) {
      onRequestClose();
    }
  };

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    scrollValueY.setValue(offsetY);
  };

  return (
    <ScrollView
      ref={imageContainer}
      style={styles.listItem}
      pagingEnabled
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.imageScrollContainer}
      scrollEnabled={swipeToCloseEnabled}
      {...(swipeToCloseEnabled && {
        onScroll,
        onScrollEndDrag,
      })}
    >
      {imageSrc.video ? (
          <TouchableOpacity
            onPress={() => setShowVideo(true)}
            style={styles.videoIcon}
          >
            <VideoIcon width={80} height={80} />
          </TouchableOpacity>
        ) : null} 
      <TouchableWithoutFeedback 
        onPress={() => setShowComponents && setShowComponents((showComponents) => !showComponents)}
        onLongPress={onLongPressHandler}
        delayLongPress={delayLongPress}
      >
        <View style={{ flex: 1 }}>
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
                  uri: imageSrc.video
                }}
                style={styles.listItem}
                onReadyForDisplay={onLoaded}
              />
          </Modal>
          <Animated.Image 
            // For Android, we use PanResponder to handle double tap to zoom
            // For this moment, zoom on Android is not supported
            
            // {...panHandlers}
            source={{uri: imageSrc.uri}} 
            style={imageStylesWithOpacity} 
            onLoad={onLoaded}
          />
          </View>
      </TouchableWithoutFeedback>

      {(!isLoaded || !imageDimensions) && <ImageLoading />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageScrollContainer: {
      height: SCREEN_HEIGHT * 2,
  },
  videoIcon: {
    top: SCREEN_HEIGHT / 2 - 40,
    zIndex: 10,
    alignSelf: "center",
    position: "absolute",
  },
});

export default React.memo(ImageItem);

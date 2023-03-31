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
      const handleDoubleTap = useDoubleTapToZoom(scrollViewRef, scaled, SCREEN, setShowOptions);

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

  const onPressMedia = () => {
    try {
      console.log("si entra");
      if (doubleTapToZoomEnabled) {
        handleDoubleTap;
      }
      if (imageSrc.videoType) {
        setShowVideo(true);
        // videoRef.presentFullscreenPlayer()
        console.log("se entra");
      }
    } catch (error) {
      console.log("error in onPressMedia: ", error);
    }
    // imageSrc.videoType? () =>  : doubleTapToZoomEnabled ? handleDoubleTap : undefined
  };

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
            style={{
              top: "40%",
              zIndex: 10,
              alignSelf: "center",
              position: "absolute",
              // backgroundColor: "white",
            }}
          >
            <VideoIcon width={100} height={100} />
          </TouchableOpacity>
        ) : null}
        <TouchableWithoutFeedback
          // onPress={() => onPressMedia()}
          onPress={doubleTapToZoomEnabled ? handleDoubleTap : undefined}
          onPressIn={() => setPaused(true)}
          onPressOut={() => setPaused(false)}
          onLongPress={onLongPressHandler}
          delayLongPress={delayLongPress}
        >
          <View style={{flex:1}}>
            <Animated.Image
              source={{
                uri: RNFS.DocumentDirectoryPath + "/" + imageSrc.source,
              }}
              style={imageStylesWithOpacity}
              onLoad={() => setLoaded(true)}
            />
            {/* {showVideo? */}
            <Modal
              visible={showVideo}
              transparent={true}
              // ref={ videoRef }
            >
              <VideoPlayer
                // controls={true}
                onBack={() => setShowVideo(false)}
                fullscreen={true}
                isFullScreen={true}
                onExitFullscreen={() => setShowVideo(false)}
                // onEnd={() => setShowVideo(false)}
                playWhenInactive={false}
                playInBackground={false}
                onFullscreenPlayerDidDismiss={() => {
                  console.log(
                    "'At this point, I know the fullscreen viewer is closing and my video will be paused, but I'm assuming the side effect rather than using an event.'"
                  );
                }}
                // source={{uri: 'https://rawgit.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4'}}
                fullscreenOrientation="all"
                source={{
                  uri: RNFS.DocumentDirectoryPath + "/" + imageSrc.video,
                }}
                style={styles.listItem}
                // style={{width: videoWidth, height: videoHeight}}
                onReadyForDisplay={() => setLoaded(true)}
                // paused={images[currentImageIndex]._id != imageSrc._id ? true : paused}
              />
            </Modal>
            {/* : null */}
            {/* } */}
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
});

export default React.memo(ImageItem);

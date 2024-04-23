/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, Modal, } from "react-native";
// @ts-ignore
import VideoPlayer from "react-native-video-controls";
import useDoubleTapToZoom from "../../hooks/useDoubleTapToZoom";
import useImageDimensions from "../../hooks/useImageDimensions";
import { getImageStyles, getImageTransform } from "../../utils";
import { ImageLoading } from "./ImageLoading";
import VideoIcon from "../videoIcon";
const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.55;
const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;
const ImageItem = ({ imageSrc, onZoom, onRequestClose, onLongPress, delayLongPress, swipeToCloseEnabled = true, doubleTapToZoomEnabled = true, setShowComponents }) => {
    const scrollViewRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [scaled, setScaled] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const imageDimensions = useImageDimensions(imageSrc);
    const handleDoubleTap = useDoubleTapToZoom(scrollViewRef, scaled, SCREEN, setShowComponents);
    const [translate, scale] = getImageTransform(imageDimensions, SCREEN);
    const scrollValueY = new Animated.Value(0);
    const scaleValue = new Animated.Value(scale || 1);
    const translateValue = new Animated.ValueXY(translate);
    const maxScale = scale && scale > 0 ? Math.max(1 / scale, 1) : 1;
    const imageOpacity = scrollValueY.interpolate({
        inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
        outputRange: [0.5, 1, 0.5],
    });
    const imagesStyles = getImageStyles(imageDimensions, translateValue, scaleValue);
    const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };
    const onScrollEndDrag = useCallback(({ nativeEvent }) => {
        var _a, _b, _c, _d;
        const velocityY = (_c = (_b = (_a = nativeEvent) === null || _a === void 0 ? void 0 : _a.velocity) === null || _b === void 0 ? void 0 : _b.y, (_c !== null && _c !== void 0 ? _c : 0));
        const scaled = ((_d = nativeEvent) === null || _d === void 0 ? void 0 : _d.zoomScale) > 1;
        onZoom(scaled);
        setScaled(scaled);
        if (!scaled &&
            swipeToCloseEnabled &&
            Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY) {
            onRequestClose();
        }
    }, [scaled]);
    const onScroll = ({ nativeEvent, }) => {
        var _a, _b, _c, _d;
        const offsetY = (_c = (_b = (_a = nativeEvent) === null || _a === void 0 ? void 0 : _a.contentOffset) === null || _b === void 0 ? void 0 : _b.y, (_c !== null && _c !== void 0 ? _c : 0));
        if (((_d = nativeEvent) === null || _d === void 0 ? void 0 : _d.zoomScale) > 1) {
            return;
        }
        scrollValueY.setValue(offsetY);
    };
    const onLongPressHandler = useCallback((event) => {
        onLongPress(imageSrc);
    }, [imageSrc, onLongPress]);
    return (<View>
      <ScrollView ref={scrollViewRef} style={styles.listItem} pinchGestureEnabled showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} maximumZoomScale={maxScale} contentContainerStyle={styles.imageScrollContainer} scrollEnabled={swipeToCloseEnabled} onScrollEndDrag={onScrollEndDrag} scrollEventThrottle={1} {...(swipeToCloseEnabled && {
        onScroll,
    })}>
        {(!loaded || !imageDimensions) && <ImageLoading />}

        {imageSrc.thumbnail ? (<TouchableOpacity onPress={() => setShowVideo(true)} style={styles.videoIcon}>
            <VideoIcon width={100} height={100}/>
          </TouchableOpacity>) : null}
      <TouchableWithoutFeedback onPress={doubleTapToZoomEnabled ? handleDoubleTap : undefined} onLongPress={onLongPressHandler} delayLongPress={delayLongPress}>
          <View style={{ flex: 1 }}>
          <Modal visible={showVideo} transparent={true}>
              <VideoPlayer onBack={() => setShowVideo(false)} fullscreen={true} isFullScreen={true} onExitFullscreen={() => setShowVideo(false)} playWhenInactive={false} playInBackground={false} onFullscreenPlayerDidDismiss={() => {
        console.log("'At this point, I know the fullscreen viewer is closing and my video will be paused, but I'm assuming the side effect rather than using an event.'");
    }} fullscreenOrientation="all" source={{
        uri: imageSrc.uri
    }} style={styles.listItem} onReadyForDisplay={() => setLoaded(true)}/>
          </Modal>
          <Animated.Image source={imageSrc} style={imageStylesWithOpacity} onLoad={() => setLoaded(true)}/>
          </View>
      </TouchableWithoutFeedback>
      </ScrollView>
    </View>);
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

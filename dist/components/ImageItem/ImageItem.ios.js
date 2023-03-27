/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, View, TouchableWithoutFeedback, Modal, TouchableOpacity, } from "react-native";
import useDoubleTapToZoom from "../../hooks/useDoubleTapToZoom";
import { getImageStyles, getImageTransform } from "../../utils";
import { ImageLoading } from "./ImageLoading";
import VideoPlayer from "react-native-video-controls";
import VideoIcon from "../videoIcon";
import RNFS from "react-native-fs";
const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.55;
const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;
const ImageItem = ({ imageSrc, onZoom, 
// images,
onRequestClose, onLongPress, delayLongPress, currentImageIndex, swipeToCloseEnabled = true, doubleTapToZoomEnabled = true, }) => {
    const scrollViewRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [scaled, setScaled] = useState(false);
    const [paused, setPaused] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const { width, height } = imageSrc;
    const imageDimensions = width && height
        ? { width: width, height: height }
        : { width: 0, height: 0 };
    const handleDoubleTap = useDoubleTapToZoom(scrollViewRef, scaled, SCREEN);
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
        var _a, _b;
        const velocityY = (_b = (_a = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.velocity) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : 0;
        const scaled = (nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.zoomScale) > 1;
        onZoom(scaled);
        setScaled(scaled);
        if (!scaled &&
            swipeToCloseEnabled &&
            Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY) {
            onRequestClose();
        }
    }, [scaled]);
    const onScroll = ({ nativeEvent, }) => {
        var _a, _b;
        const offsetY = (_b = (_a = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.contentOffset) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : 0;
        if ((nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.zoomScale) > 1) {
            return;
        }
        scrollValueY.setValue(offsetY);
    };
    const onLongPressHandler = useCallback((event) => {
        onLongPress();
    }, [imageSrc, onLongPress]);
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
        }
        catch (error) {
            console.log("error in onPressMedia: ", error);
        }
        // imageSrc.videoType? () =>  : doubleTapToZoomEnabled ? handleDoubleTap : undefined
    };
    return (<View>
      <ScrollView ref={scrollViewRef} style={styles.listItem} pinchGestureEnabled showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} maximumZoomScale={maxScale} contentContainerStyle={styles.imageScrollContainer} scrollEnabled={swipeToCloseEnabled} onScrollEndDrag={onScrollEndDrag} scrollEventThrottle={1} {...(swipeToCloseEnabled && {
        onScroll,
    })}>
        {(!loaded || !imageDimensions) && <ImageLoading />}
        {imageSrc.videoType ? (<TouchableOpacity onPress={() => setShowVideo(true)} style={{
                top: "40%",
                zIndex: 10,
                alignSelf: "center",
                position: "absolute",
                // backgroundColor: "white",
            }}>
            <VideoIcon width={100} height={100}/>
          </TouchableOpacity>) : null}
        <TouchableWithoutFeedback 
    // onPress={() => onPressMedia()}
    onPress={doubleTapToZoomEnabled ? handleDoubleTap : undefined} onPressIn={() => setPaused(true)} onPressOut={() => setPaused(false)} onLongPress={onLongPressHandler} delayLongPress={delayLongPress}>
          <View>
            <Animated.Image source={{
            uri: RNFS.DocumentDirectoryPath + "/" + imageSrc.source,
        }} style={imageStylesWithOpacity} onLoad={() => setLoaded(true)}/>
            {/* {showVideo? */}
            <Modal visible={showVideo} transparent={true}>
              <VideoPlayer 
    // controls={true}
    onBack={() => setShowVideo(false)} fullscreen={true} isFullScreen={true} onExitFullscreen={() => setShowVideo(false)} 
    // onEnd={() => setShowVideo(false)}
    playWhenInactive={false} playInBackground={false} onFullscreenPlayerDidDismiss={() => {
            console.log("'At this point, I know the fullscreen viewer is closing and my video will be paused, but I'm assuming the side effect rather than using an event.'");
        }} 
    // source={{uri: 'https://rawgit.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4'}}
    fullscreenOrientation="all" source={{
            uri: RNFS.DocumentDirectoryPath + "/" + imageSrc.video,
        }} style={styles.listItem} 
    // style={{width: videoWidth, height: videoHeight}}
    onReadyForDisplay={() => setLoaded(true)}/>
            </Modal>
            {/* : null */}
            {/* } */}
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
});
export default React.memo(ImageItem);

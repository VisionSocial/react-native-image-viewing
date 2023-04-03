/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback, useRef, useEffect, useState, } from "react";
import { Animated, Dimensions, StyleSheet, View, VirtualizedList, Modal, TouchableOpacity, Text, } from "react-native";
import ImageItem from "./components/ImageItem/ImageItem";
import StatusBarManager from "./components/StatusBarManager";
import useAnimatedComponents from "./hooks/useAnimatedComponents";
import useImageIndexChange from "./hooks/useImageIndexChange";
import useRequestClose from "./hooks/useRequestClose";
import BackIcon from "../../../src/components/icons/backIcon";
const DEFAULT_ANIMATION_TYPE = "fade";
const DEFAULT_BG_COLOR = "#000";
const DEFAULT_DELAY_LONG_PRESS = 800;
const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;
function ImageViewing({ images, ModalsRender, actionList = [], keyExtractor, imageIndex, visible, onRequestClose, onLongPress = () => { }, onImageIndexChange, animationType = DEFAULT_ANIMATION_TYPE, backgroundColor = DEFAULT_BG_COLOR, presentationStyle, swipeToCloseEnabled, doubleTapToZoomEnabled, delayLongPress = DEFAULT_DELAY_LONG_PRESS, HeaderComponent, FooterComponent, }) {
    const imageList = useRef(null);
    const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose);
    const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN);
    const [showOptions, setShowOptions] = useState(false);
    const [headerTransform, footerTransform, toggleBarsVisible] = useAnimatedComponents();
    useEffect(() => {
        if (onImageIndexChange) {
            onImageIndexChange(currentImageIndex);
        }
    }, [currentImageIndex]);
    const onZoom = useCallback((isScaled) => {
        var _a;
        // @ts-ignore
        (_a = imageList === null || imageList === void 0 ? void 0 : imageList.current) === null || _a === void 0 ? void 0 : _a.setNativeProps({ scrollEnabled: !isScaled });
        toggleBarsVisible(!isScaled);
    }, [imageList]);
    if (!visible) {
        return null;
    }
    const bottomFn = (item) => {
        item === null || item === void 0 ? void 0 : item.func(images[currentImageIndex]);
    };
    return (<Modal transparent={presentationStyle === "overFullScreen"} visible={visible} presentationStyle={presentationStyle} animationType={animationType} onRequestClose={onRequestCloseEnhanced} supportedOrientations={["portrait"]} hardwareAccelerated>
      <StatusBarManager presentationStyle={presentationStyle}/>
      {showOptions ? (<>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => onRequestCloseEnhanced()} style={styles.headerBack}>
                <BackIcon width={24} height={24}/>
              </TouchableOpacity>
              <View style={styles.indexOf}>
                {/* eslint-disable-next-line react-native/no-inline-styles */}
                <Text style={{ color: "white" }}>
                  {currentImageIndex + 1 + " / " + images.length}
                </Text>
              </View>
              {/* eslint-disable-next-line react-native/no-inline-styles */}
              <View style={{ flex: 1 }}/>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              {actionList.map((item, index) => {
                return (<View style={styles.footerItem}>
                    <TouchableOpacity onPress={() => bottomFn(item)}>
                      {item.icon}
                    </TouchableOpacity>
                  </View>);
            })}
            </View>
          </View>
        </>) : null}
      <View style={[styles.container, { opacity, backgroundColor }]}>
        <VirtualizedList ref={imageList} data={images} horizontal pagingEnabled windowSize={2} initialNumToRender={1} maxToRenderPerBatch={1} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} initialScrollIndex={imageIndex} getItem={(_, index) => images[index]} getItemCount={() => images.length} getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
        })} renderItem={({ item: imageSrc }) => (<ImageItem opacity={opacity} onZoom={onZoom} setShowOptions={setShowOptions} currentImageIndex={currentImageIndex} imageSrc={imageSrc} onRequestClose={onRequestCloseEnhanced} onLongPress={onLongPress} delayLongPress={delayLongPress} swipeToCloseEnabled={swipeToCloseEnabled} doubleTapToZoomEnabled={doubleTapToZoomEnabled}/>)} onMomentumScrollEnd={onScroll} 
    //@ts-ignore
    keyExtractor={(imageSrc, index) => keyExtractor
            ? keyExtractor(imageSrc, index)
            : typeof imageSrc === "number"
                ? `${imageSrc}`
                : imageSrc.source}/>
        {typeof FooterComponent !== "undefined" && (<Animated.View style={[styles.footer, { transform: footerTransform }]}>
            {React.createElement(FooterComponent, {
                imageIndex: currentImageIndex,
            })}
          </Animated.View>)}
      </View>
      {ModalsRender()}
    </Modal>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    headerContent: {
        flex: 1,
        flexDirection: "row",
        paddingTop: "10%",
        justifyContent: "space-between",
        backgroundColor: "rgba(14, 20, 35, 0.9)",
    },
    header: {
        flex: 1,
        flexGrow: 1,
        top: 0,
        zIndex: 100,
        width: SCREEN_WIDTH,
        height: "9%",
        position: "absolute",
        flexDirection: "row",
    },
    headerBack: {
        flex: 1,
        paddingLeft: 10,
        justifyContent: "center",
    },
    indexOf: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    footer: {
        flex: 1,
        flexGrow: 1,
        bottom: 0,
        zIndex: 100,
        width: SCREEN_WIDTH,
        height: "9%",
        position: "absolute",
        backgroundColor: "rgba(14, 20, 35, 0.9)",
    },
    footerContent: {
        flex: 1,
        flexDirection: "row",
    },
    footerItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
const EnhancedImageViewing = (props) => (<ImageViewing key={props.imageIndex} {...props}/>);
export default EnhancedImageViewing;

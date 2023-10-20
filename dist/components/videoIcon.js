import React from 'react';
import { Svg, Path } from 'react-native-svg';
const VideoIcon = (props) => {
    const { width, height } = props;
    return (<Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
          <Path d="M49.1093 99.9513C75.9752 99.9513 98.2187 77.2662 98.2187 49.9756C98.2187 22.636 75.9269 0 49.0611 0C22.2436 0 0 22.636 0 49.9756C0 77.2662 22.2918 99.9513 49.1093 99.9513Z" fill="white"/>
            <Path d="M39.9615 69.7209C37.6505 71.1418 35.0024 70.0149 35.0024 67.5651V32.4351C35.0024 30.0344 37.843 29.0054 39.9615 30.2794L68.2235 47.3298C70.2453 48.5547 70.2937 51.4946 68.2235 52.7685L39.9615 69.7209Z" fill="#292D32"/>
        </Svg>);
};
export default VideoIcon;

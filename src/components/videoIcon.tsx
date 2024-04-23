import React from 'react';
import { Svg, Path } from 'react-native-svg';
const VideoIcon = (props) => {
    const { width, height } = props;
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path d="M11.7862 23.9883C18.234 23.9883 23.5725 18.5439 23.5725 11.9941C23.5725 5.43264 18.2225 0 11.7747 0C5.33847 0 0 5.43264 0 11.9941C0 18.5439 5.35002 23.9883 11.7862 23.9883Z" fill="white"/>
            <Path d="M9.59076 16.733C9.03611 17.074 8.40058 16.8036 8.40058 16.2156V7.78443C8.40058 7.20825 9.08233 6.96131 9.59076 7.26705L16.3736 11.3592C16.8589 11.6531 16.8705 12.3587 16.3736 12.6644L9.59076 16.733Z" fill="#292D32"/>
        </Svg>);
};
export default VideoIcon;
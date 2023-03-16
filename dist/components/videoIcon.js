import React from 'react';
import { Svg, Path } from 'react-native-svg';
const VideoIcon = (props) => {
    const { width, height } = props;
    return (<Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path d="M11.9697 22C17.4926 22 21.9697 17.5228 21.9697 12C21.9697 6.47715 17.4926 2 11.9697 2C6.44688 2 1.96973 6.47715 1.96973 12C1.96973 17.5228 6.44688 22 11.9697 22Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M8.74023 12.2299V10.5599C8.74023 8.47988 10.2102 7.62988 12.0102 8.66988L13.4602 9.50988L14.9102 10.3499C16.7102 11.3899 16.7102 13.0899 14.9102 14.1299L13.4602 14.9699L12.0102 15.8099C10.2102 16.8499 8.74023 15.9999 8.74023 13.9199V12.2299Z" fill="#292D32"/>
        </Svg>);
};
export default VideoIcon;

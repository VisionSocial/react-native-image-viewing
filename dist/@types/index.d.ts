/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import { ImageURISource, ImageRequireSource } from "react-native";
export type Dimensions = {
    width: number;
    height: number;
};
export type Position = {
    x: number;
    y: number;
};
export interface Iimages {
    story_id?: number | string;
}
export interface IBottomList {
    name: string;
    func: (file: IimageSrc) => void;
    icon: JSX.Element;
}
export interface IimageSrc {
    _id?: any;
    source?: any | string | null;
    video?: string;
    videoSize?: number;
    videoWidth?: number;
    videoHeight?: number;
    videoType?: string;
    assignee?: Array<any>;
    type?: string;
    date_added?: Date;
    date_created: Date;
    is_cover: boolean;
    fileName: string;
    fileSize: number;
    duration?: number;
    height?: number;
    width?: number;
    password?: string;
    cloud_sync?: any;
    localId?: string;
    is_deleted?: boolean;
    deleted_at?: Date;
}
export type ImageSource = ImageURISource | ImageRequireSource;

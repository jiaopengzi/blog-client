/*
 * FilePath    : blog-client\src\customElements\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

// 自定义元素名称
export enum Names {
    PayDownload = "pay-download", // 付费下载
    PayRead = "pay-read", // 付费阅读
    PayKey = "pay-key", // 付费密钥
    PayMembership = "pay-membership", // 付费会员
    PayVideo = "pay-video", // 付费视频
    VideoPlayer = "video-player", // 视频播放器
}

// 自定义元素属性
export enum Attributes {
    Id = "id", // 元素 id
    Class = "class", // 元素 class
    VideoType = "video-type", // 视频类型
    Src = "src", // 视频地址
    Title = "title", // 标题
    Description = "description", // 描述
}

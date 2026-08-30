/*
 * FilePath    : blog-client-nuxt\src\components\player\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频组件
 */

export * from "./types"

export * from "./utils"

export * from "./state"

// 如果有多个内容导出, 避免循环依赖的问题使用如下方式导出, 且导出的内容必须在最后
import VideoPlayer from "./index.vue"
export default VideoPlayer

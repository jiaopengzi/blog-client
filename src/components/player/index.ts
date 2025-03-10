/**
 * @FilePath     : \blog-client\src\components\player\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 视频组件
 */

// 将 .types.ts 文件中的所有内容导出到 index.ts 文件中
export * from "./types"

// 将 .utils.ts 文件中的所有内容导出到 index.ts 文件中
export * from "./utils"

// 将 .status.ts 文件中的所有内容导出到 index.ts 文件中
export * from "./state"

// 如果有多个内容导出,避免循环依赖的问题使用如下方式导出,且导出的内容必须在最后
import VideoPlayer from "./index.vue"
export default VideoPlayer

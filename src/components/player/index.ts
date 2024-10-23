/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-07 17:51:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-19 12:52:01
 * @FilePath     : \blog-client\src\components\player\index.ts
 * @Description  : 视频组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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

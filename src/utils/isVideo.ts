/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-07 14:01:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-07 14:01:42
 * @FilePath     : \blog-client\src\utils\isVideo.ts
 * @Description  : 判断是否为视频
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

/**
 * @description: 判断是否为视频
 * @param fileType 文件类型
 * @return {boolean} 是否为视频
 */
export const isVideo = (fileType: string): boolean => {
    return fileType.startsWith("video/")
}

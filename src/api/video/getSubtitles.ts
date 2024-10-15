/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-06 09:35:02
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 09:05:11
 * @FilePath     : \blog-client\src\api\video\getSubtitles.ts
 * @Description  : 获取视频字幕
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export interface SubtitlesResponse extends Res {
  data: {
    subtitles: string
    label: string
  }
}

export function getSubtitlesAPI(
  videoHashId: string,
  subtitlesLanguage: string
): AxiosPromise<SubtitlesResponse> {
  return request({
    url: `${routerGroup}/subtitles/${videoHashId}/${subtitlesLanguage}`,
    method: 'get'
  })
}

// 获取字幕 URL
export function getSubtitlesURL(videoHashId: string, subtitlesLanguage: string): string {
  // 使用 axios 的 getUri 方法获取完整的 URL
  const config = {
    url: `${routerGroup}/subtitles/webvtt/${videoHashId}/${subtitlesLanguage}`,
    method: 'get'
  }
  return request.getUri(config)
}

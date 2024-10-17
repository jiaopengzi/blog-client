/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-06 09:35:02
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-17 15:21:10
 * @FilePath     : \blog-client\src\api\video\getSubtitlesByAdmin.ts
 * @Description  : 获取字幕(管理员)
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export interface SubtitlesByAdminResponse extends Res {
  data: {
    subtitles: string
    label: string
  }
}

// 根据 videoHashId 和 subtitlesLanguage 获取字幕(用于管理员)
export function getSubtitlesByAdminAPI(
  videoHashId: string,
  subtitlesLanguage: string
): AxiosPromise<SubtitlesByAdminResponse> {
  return request({
    url: `${routerGroup}/subtitles/${videoHashId}/${subtitlesLanguage}`,
    method: 'get'
  })
}

/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-29 17:10:41
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-29 17:12:13
 * @FilePath     : \blog-client\src\api\upload\getFileCountGroupByFiletype.ts
 * @Description  : 文件统计
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

// 获取文件信息响应类型
export interface GetFileCountGroupByFiletypeResponse {
  code: number
  msg: string
  data: FileCountGroupByFiletype[]
}

// 获取文件信息 api 函数
export function getFileCountGroupByFiletypeAPI(): AxiosPromise<GetFileCountGroupByFiletypeResponse> {
  const urlStr = routerGroup + '/upload/count-group-by-type'
  return request({
    url: urlStr,
    method: 'get',
  })
}

// 文件统计
export interface FileCountGroupByFiletype {
  file_type: string // 文件类型
  file_extension: string // 文件扩展名
  file_count: number // 文件数量
}

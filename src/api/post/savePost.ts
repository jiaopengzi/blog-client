/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-10 17:17:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 10:47:36
 * @FilePath     : \blog-client\src\api\post\savePost.ts
 * @Description  : 保存文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import { type Res } from '@/api/responseCode'

export interface SavePostRequest {
  post: string
  title: string
  tags: string
  category: string
  summary: string
  content: string
  status: string
  isComment: string
  isTop: string
  isOriginal: string
  isPrivate: string
  password: string
  views: string
  likes: string
}

// 注册
export function RegisterAPI(requestData: SavePostRequest): AxiosPromise<Res> {
  const urlStr = routerGroup + '/post/save'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}

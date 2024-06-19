/**
 * @Author       : jiaopengzi
 * @Date         : 2024-02-24 11:10:23
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 10:26:22
 * @FilePath     : \blog-client\src\api\upload\getAllowedFileInfo.ts
 * @Description  : 获取允许上传的文件信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export function getAllowedUploadFileInfoAPI(): AxiosPromise<Res> {
  return request({
    url: routerGroup + '/upload/allowed-file-info',
    method: 'get',
  })
}

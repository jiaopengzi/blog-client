/**
 * @Author       : jiaopengzi
 * @Date         : 2024-02-24 11:10:23
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-07-23 10:08:37
 * @FilePath     : \blog-client\src\api\upload\getUploadFileRequirements.ts
 * @Description  : 上传文件的要求
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export function getUploadFileRequirementsAPI(): AxiosPromise<Res> {
  return request({
    url: routerGroup + '/upload/file-requirements',
    method: 'get',
  })
}

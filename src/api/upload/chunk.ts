/**
 * @Author       : jiaopengzi
 * @Date         : 2024-07-25 09:41:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-04 14:57:55
 * @FilePath     : \blog-client\src\api\upload\chunk.ts
 * @Description  : 分片上传
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'

export interface ChunkMetadataWithoutFileId {
  hash_key: string //哈希值
  hash_algorithm: string //哈希算法
  part_numbers: number //分片数量
  part_index: number //分片序号
  start: number //分片开始位置
  end: number //分片结束位置
}

export interface ChunkMetadata extends ChunkMetadataWithoutFileId {
  File_id: string //文件ID 后端生成
  sub_dir: string //文件路径 后端生成
}

export function uploadChunkAPI(
  formData: FormData, // FormData 对象
  chunkMetadata: ChunkMetadata, // 元信息对象
): AxiosPromise<Res> {
  // 将元信息对象转换为 JSON 字符串
  const metadataJson = JSON.stringify(chunkMetadata)

  // 添加元信息
  formData.append('metadata', metadataJson)

  return request({
    url: routerGroup + '/upload/chunk',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data', // 上传文件时指定类型
    },
  })
}

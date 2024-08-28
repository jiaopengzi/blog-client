/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-27 16:38:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-28 17:51:59
 * @FilePath     : \blog-client\src\api\upload\getFiles.ts
 * @Description  : 获取文件列表
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import type { DataWithImg, Pagination } from '@/components/common'
import { UploadCode } from '@/api/responseCode'
import { ImgFit } from '@/components/common/index'
import { convertToBeijingTime } from '@/utils/dateTime'

export interface GetMediaFilesRequest {
  current_page: number // 当前页
  page_size: number // 每页显示条数
  key_word?: string // 关键字
  File_type?: string // 角色
}

// 获取用户信息响应类型
export interface GetMediaFilesResponse {
  code: number
  msg: string
  data: Pagination<MediaFile> // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 获取用户信息 api 函数
export async function getMediaFilesAPI(
  requestData: GetMediaFilesRequest = { current_page: 1, page_size: 10 }, // 设置默认值,
  width: number = 30, // 默认值 50px
  height: number = 30, // 默认值 50px
  imgFit: ImgFit = ImgFit.cover,
): AxiosPromise<GetMediaFilesResponse> {
  const urlStr = routerGroup + '/upload/view'
  const response = await request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
  // 在这里使用 map 函数来转换每个用户对象
  if (response.data.code === UploadCode.GetAllSuccess) {
    response.data.data.records = response.data.data.records.map((file: any) =>
      formatMediaFile(file, width, height, imgFit),
    )
    return response
  } else {
    response.data.data = emptyMediaFiles()
    return response
  }
}

// 每行用户信息
export interface MediaFile extends DataWithImg {
  id: number // 用户 ID
  created_at: string // 注册时间
  file_name_display: string // 文件名
  author: string // 作者
  description: string // 描述
  slug: string // 别名
  thumbnail: string // 缩略图
  is_free: boolean // 是否免费
  is_delete_original: boolean // 是否删除原文件
  video_quality_name: string // 视频质量
}

/**
 * @description: 格式化用户信息
 * @param MediaFile 后端用户信息
 * @param width 图片宽度
 * @param height 图片高度
 * @param imgFit 图片填充方式
 * @return  {MediaFile} 格式化后的用户信息
 */
export function formatMediaFile(
  { thumbnail, created_at, ...MediaFile }: any,
  width: number,
  height: number,
  imgFit: ImgFit,
): MediaFile {
  const formattedMediaFile: MediaFile = {
    ...MediaFile,
    created_at: convertToBeijingTime(created_at), // 使用 convertToBeijingTime 进行格式化
  }

  // 如果 thumbnail 不为空，添加 img 属性
  if (thumbnail) {
    formattedMediaFile.img = {
      url: thumbnail,
      width: width,
      height: height,
      imgFit: imgFit,
    }
  }

  return formattedMediaFile
}

// 默认的 MediaFileInfo 空对象
export function emptyMediaFiles(): Pagination<MediaFile> {
  return {
    total: 0,
    current_page: 1,
    page_size: 10,
    page_count: 1,
    page_sizes: [10],
    records: [],
  }
}

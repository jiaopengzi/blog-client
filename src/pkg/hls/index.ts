/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 15:17:56
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-08 09:40:26
 * @FilePath     : \blog-client\src\pkg\hls\index.ts
 * @Description  : hls 自定义 loader
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import Hls from 'hls.js'
import type {
  HlsConfig,
  LoaderConfiguration,
  LoaderCallbacks,
  LoaderContext,
  LoaderStats,
  PlaylistLoaderContext
} from 'hls.js'

import type { KeyLoaderContext } from 'custom-hls'
import { reverseString, decryptData } from '@/utils/encrypt'
import { ResponseCode } from '@/api/responseCode'
import { getM3u8API } from '@/api/video/getM3u8'
import { getMainM3u8API } from '@/api/video/getMainM3u8'
import { getKeyAPI } from '@/api/video/getKey'

// 自定义 KeyLoader 类
export class CustomLoader extends Hls.DefaultConfig.loader {
  private static globalState: { videoId: string } = { videoId: '' } // 定义全局状态

  constructor(config: HlsConfig) {
    super(config)
  }

  // 设置 videoId
  static setVideoId(videoId: string) {
    CustomLoader.globalState.videoId = videoId
  }

  // load 方法重写
  async load(
    context: KeyLoaderContext | PlaylistLoaderContext,
    config: LoaderConfiguration,
    callbacks: LoaderCallbacks<LoaderContext>
  ): Promise<void> {
    // 初始化 loaderStats
    const loaderStats: LoaderStats = {
      aborted: false,
      loaded: 0,
      retry: 0,
      total: 0,
      chunkCount: 0,
      bwEstimate: 0,
      loading: {
        start: window.performance.now(), // 记录开始时间
        first: 0,
        end: 0
      },
      parsing: {
        start: 0,
        end: 0
      },
      buffering: {
        start: 0,
        first: 0,
        end: 0
      }
    }

    // 主 m3u8
    if ('type' in context && context.type === 'manifest') {
      // 获取 main m3u8
      await getMainM3u8API(context.url)
        .then((response) => {
          loaderStats.loading.end = window.performance.now()

          if (response.data.code === ResponseCode.GetVideoMainM3u8Success) {
            CustomLoader.setVideoId(context.url) // 成功拿到 主m3u8 后,设置 videoId, 便于后续使用
            callbacks.onSuccess(
              { url: context.url, data: response.data.data },
              loaderStats,
              context,
              null
            )
          } else {
            callbacks.onError(
              { code: response.data.code, text: response.data.msg },
              context,
              null,
              loaderStats
            )
          }
        })
        .catch((error) => {
          loaderStats.loading.end = window.performance.now()
          callbacks.onError({ code: 500, text: error.message }, context, null, loaderStats)
        })
    }

    // 子 m3u8
    else if ('type' in context && context.type === 'level') {
      // 获取 m3u8
      await getM3u8API(context.url)
        .then((response) => {
          loaderStats.loading.end = window.performance.now()

          if (response.data.code === ResponseCode.GetVideoM3u8Success) {
            // 获取 m3u8 成功
            const { base_url, m3u8 } = response.data.data

            // 将 m3u8 中的 _url_ 替换为 base_url
            const levelM3u8 = m3u8.replace(/_url_/g, base_url + '/')

            callbacks.onSuccess({ url: base_url, data: levelM3u8 }, loaderStats, context, null)
          } else {
            callbacks.onError(
              { code: response.data.code, text: response.data.msg },
              context,
              null,
              loaderStats
            )
          }
        })
        .catch((error) => {
          loaderStats.loading.end = window.performance.now()
          callbacks.onError({ code: 500, text: error.message }, context, null, loaderStats)
        })
    }

    // 判断是否有 keyInfo
    else if ('keyInfo' in context && context.keyInfo) {
      // 不使用全局 videoId, 使用 context.keyInfo.decryptdata.uri 获取 videoId
      // const videoId = context.keyInfo.decryptdata.uri.substring(
      //   context.keyInfo.decryptdata.uri.lastIndexOf('/') + 1,
      // )
      // await getKeyAPI(videoId)

      // 获取解密密钥
      await getKeyAPI(CustomLoader.globalState.videoId)
        .then((response) => {
          loaderStats.loading.first = window.performance.now() // 记录首次请求时间
          return response.data
        })
        .then((data) => {
          loaderStats.loading.end = window.performance.now() // 记录结束时间

          // 密钥获取成功
          if (data.code === ResponseCode.GetVdideoKeySuccess) {
            const decryptedKey = this.decryptKey(data.data) // 解密播放密钥
            context.keyInfo.decryptdata.key = decryptedKey // 将解密后的密钥赋值给 keyInfo

            callbacks.onSuccess(
              { url: context.keyInfo.decryptdata.uri, data: decryptedKey.buffer },
              loaderStats,
              context,
              null
            )
          } else {
            callbacks.onError({ code: data.code, text: data.msg }, context, null, loaderStats)
          }
        })
        .catch((error) => {
          loaderStats.loading.end = window.performance.now()
          callbacks.onError({ code: 500, text: error.message }, context, null, loaderStats)
        })
    } else {
      // 对于未加密的视频，直接调用父类的 load 方法
      super.load(context, config, callbacks)
    }
  }

  // 解密播放密钥
  decryptKey(encryptedKey: string): Uint8Array {
    return playKeyDecryptAES2Bin(encryptedKey)
  }
}

// 播放密钥自定义解密函数
function playKeyDecryptAES2Bin(playKeyEncrypt: string): Uint8Array {
  // 获取 playKeyEncrypt 字符长度
  const playKeyEncryptLen = playKeyEncrypt.length

  // 获取 playKeyKey 从 playKeyEncrypt 中从左至右截取 32 长度的字符串并逆序排列
  const playKeyKey = reverseString(playKeyEncrypt.substring(0, 32))

  // 获取 iv 从 playKeyEncrypt 中从右至左截取 16 长度的字符串,并逆序排列
  const iv = reverseString(playKeyEncrypt.substring(playKeyEncryptLen - 16, playKeyEncryptLen))

  // 获取 encryptedPlayKeyBase64 从 playKeyEncrypt 中从 32 开始到 playKeyEncryptLen - 16 的字符串
  const encryptedPlayKeyBase64 = playKeyEncrypt.substring(32, playKeyEncryptLen - 16)

  // 使用 AES 解密算法用 encryptKey 解密 playKey 生成解密后的密钥 encryptPlayKey 16进制字符串
  const encryptPlayKey = decryptData(encryptedPlayKeyBase64, playKeyKey, iv)

  const playKeyDecryptBin = new Uint8Array(
    encryptPlayKey.match(/[\da-f]{2}/gi)!.map(function (h) {
      return parseInt(h, 16)
    })
  )
  return playKeyDecryptBin
}

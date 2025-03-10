/**
 * @FilePath     : \blog-client\src\pkg\hls\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : hls 自定义 loader
 */

import type { KeyLoaderContext } from "custom-hls"
import type { HlsConfig, LoaderCallbacks, LoaderConfiguration, LoaderContext, LoaderStats, PlaylistLoaderContext } from "hls.js"
import Hls from "hls.js"

import { handleResErr, ResponseCode } from "@/api/response"
import { getKeyAPI } from "@/api/video/getKey"
import { getM3u8API } from "@/api/video/getM3u8"
import { getMainM3u8API } from "@/api/video/getMainM3u8"
import { decryptData, reverseString } from "@/utils/encrypt"

// 自定义 Loader 错误码
enum CustomLoaderError {
    MainM3u8 = 5001,
    LevelM3u8 = 5002,
    Key = 5003,
}

// 自定义 Loader 类
export class CustomLoader extends Hls.DefaultConfig.loader {
    constructor(config: HlsConfig) {
        super(config)
    }

    // load 方法重写
    async load(context: KeyLoaderContext | PlaylistLoaderContext, config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>): Promise<void> {
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
                end: 0,
            },
            parsing: {
                start: 0,
                end: 0,
            },
            buffering: {
                start: 0,
                first: 0,
                end: 0,
            },
        }

        // 主 m3u8
        if ("type" in context && context.type === "manifest") {
            // 获取 main m3u8
            await getMainM3u8API(context.url)
                .then((response) => {
                    loaderStats.loading.end = window.performance.now()

                    if (response.data.code === ResponseCode.GetVideoMainM3u8Success) {
                        callbacks.onSuccess({ url: context.url, data: response.data.data }, loaderStats, context, null)
                    } else {
                        const msg = handleResErr(response)
                        callbacks.onError({ code: response.data.code, text: msg }, context, null, loaderStats)
                    }
                })
                .catch((error) => {
                    loaderStats.loading.end = window.performance.now()
                    callbacks.onError({ code: CustomLoaderError.MainM3u8, text: error.message }, context, null, loaderStats)
                })
        }

        // 子 m3u8
        else if ("type" in context && context.type === "level") {
            // 获取 m3u8
            await getM3u8API(context.url)
                .then((response) => {
                    loaderStats.loading.end = window.performance.now()

                    if (response.data.code === ResponseCode.GetVideoM3u8Success) {
                        // 获取 m3u8 成功
                        const { base_url, m3u8 } = response.data.data

                        // 将 m3u8 中的 _url_ 替换为 base_url
                        const levelM3u8 = m3u8.replace(/_url_/g, base_url + "/")

                        callbacks.onSuccess({ url: base_url, data: levelM3u8 }, loaderStats, context, null)
                    } else {
                        const msg = handleResErr(response)
                        callbacks.onError({ code: response.data.code, text: msg }, context, null, loaderStats)
                    }
                })
                .catch((error) => {
                    loaderStats.loading.end = window.performance.now()
                    callbacks.onError({ code: CustomLoaderError.LevelM3u8, text: error.message }, context, null, loaderStats)
                })
        }

        // 判断是否有 keyInfo
        else if ("keyInfo" in context && context.keyInfo) {
            // context.keyInfo.decryptdata.uri 在后端使用的是相对路径，hls在这里会自动拼接成绝url路径
            // 例如:http://10.10.2.222:8081/api/v1/uploads/2024/10/17/2-7f9d0d9c/2-7f9d0d9c
            // 但是这个路径在后端是无法访问的，所以需要将这个路径截取出来，拿到 path 中最后一个 / 后面的字符串就是 videoId
            const videoId = context.keyInfo.decryptdata.uri.substring(context.keyInfo.decryptdata.uri.lastIndexOf("/") + 1)

            // 获取解密密钥
            await getKeyAPI(videoId)
                .then((response) => {
                    loaderStats.loading.first = window.performance.now() // 记录首次请求时间
                    return response.data
                })
                .then((data) => {
                    loaderStats.loading.end = window.performance.now() // 记录结束时间

                    // 密钥获取成功
                    if (data.code === ResponseCode.GetVideoKeySuccess) {
                        const decryptedKey = this.decryptKey(data.data) // 解密播放密钥
                        context.keyInfo.decryptdata.key = decryptedKey // 将解密后的密钥赋值给 keyInfo

                        callbacks.onSuccess({ url: context.keyInfo.decryptdata.uri, data: decryptedKey.buffer }, loaderStats, context, null)
                    } else {
                        const msg = handleResErr(data)
                        callbacks.onError({ code: data.code, text: msg }, context, null, loaderStats)
                    }
                })
                .catch((error) => {
                    loaderStats.loading.end = window.performance.now()
                    callbacks.onError({ code: CustomLoaderError.Key, text: error.message }, context, null, loaderStats)
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

/**
 * @description: 播放密钥解密函数
 * @param playKeyEncrypt 加密的播放密钥
 * @return  返回 Uint8Array 的二进制播放密钥
 */
export function playKeyDecryptAES2Bin(playKeyEncrypt: string): Uint8Array {
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
        }),
    )
    return playKeyDecryptBin
}

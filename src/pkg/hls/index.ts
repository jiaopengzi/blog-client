/**
 * @FilePath     : \blog-client\src\pkg\hls\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : hls 自定义 loader
 */

import type { KeyLoaderContext } from "custom-hls"
import type { HlsConfig, Loader, LoaderCallbacks, LoaderConfiguration, LoaderContext, LoaderStats, PlaylistLoaderContext } from "hls.js"
import Hls from "hls.js"

import { handleResErr, ResponseCode } from "@/api/response"
import { getKeyAdminAPI, getKeyAPI } from "@/api/video/getKey"
import { getM3u8AdminAPI, getM3u8API } from "@/api/video/getM3u8"
import { getMainM3u8AdminAPI, getMainM3u8API } from "@/api/video/getMainM3u8"
import { decryptData, reverseString } from "@/utils/encrypt"

// 自定义 Loader 错误码
enum CustomLoaderError {
    MainM3u8 = 5001,
    LevelM3u8 = 5002,
    Key = 5003,
}

/**
 * 创建一个自定义的 HLS Loader 类。
 *
 * 根据传入的 isAdmin 标志，生成一个继承自 Hls.DefaultConfig.loader 的自定义 Loader 类。
 * 该类会拦截 manifest(level)/level/key 类型的请求，分别使用自定义的 API 接口进行处理(管理员模式和普通模式使用不同的后端接口)，
 * 对非加密或非上述类型的请求则使用父类的 load 实现。
 *
 * @param isAdmin - 是否以管理员模式创建 Loader。
 *                   若为 true，则在请求主 m3u8、子 m3u8 与解密密钥时使用管理员接口(getMainM3u8AdminAPI、getM3u8AdminAPI、getKeyAdminAPI)。
 *                   否则使用普通用户接口(getMainM3u8API、getM3u8API、getKeyAPI)。
 * @returns 返回一个自定义 Loader 的类构造器 (new (config: HlsConfig) => Loader<LoaderContext>)，可直接用于 Hls 配置中的 loader 字段。
 *
 * @example
 * const CustomLoader = createCustomLoaderClass(true);
 * const hls = new Hls({ loader: CustomLoader });
 */
export function createCustomLoaderClass(isAdmin: boolean, postId: string = ""): new (config: HlsConfig) => Loader<LoaderContext> {
    /**
     * 自定义 Loader 类：扩展并覆盖默认的 HLS Loader 行为以支持通过后端接口获取 m3u8 与解密密钥。
     *
     * 主要职责：
     * - 根据 Context 的类型(manifest / level / key)调用对应的后端接口获取数据；
     * - 将后端响应转换为 HLS 所需的格式并通过 callbacks 通知 HLS(onSuccess / onError)；
     * - 对 key 请求，调用解密函数将后端返回的加密密钥转换为 Uint8Array，并将解密结果写回 context.keyInfo.decryptdata.key；
     * - 维护并传递 loader 统计信息(LoaderStats)，记录请求开始、首次响应与结束时间等。
     *
     * 特性与注意事项：
     * - 使用闭包中的 isAdmin 标志决定调用管理员端点还是普通端点；
     * - 对于未加密的视频或不需要特殊处理的请求，会调用 super.load 来保持默认行为；
     * - 在处理 m3u8 的时候，会将后端返回的占位符 _url_ 替换为真实 base_url(并保证以 '/' 结尾)，以便 HLS 正确解析片段 URL。
     */
    return class CustomLoader extends Hls.DefaultConfig.loader {
        // 用于区分是否是管理员模式
        private isAdmin: boolean
        private postId: string

        constructor(config: HlsConfig) {
            super(config)

            // 默认为 false
            this.isAdmin = isAdmin || false
            this.postId = postId || ""
        }

        /**
         * 重写 load 方法，按 context.type 或 context.keyInfo 类型分流：
         *   - manifest: 调用 handleMainM3u8，使用后端接口获取主 m3u8(索引或变体列表)；
         *   - level: 调用 handleLevelM3u8，获取实际播放的子 m3u8 并替换内部占位符为 base_url；
         *   - key (通过 context.keyInfo 判断): 调用 handleKey，从后端获取并解密播放密钥，然后把解密后的二进制设置回 context；
         *   - 其它场景: 回退到 super.load。
         * - 在每次加载前会初始化 LoaderStats(通过 initLoaderStats)。
         *
         * @param context - LoaderContext，包含请求的 URL、类型等信息。
         * @param config - LoaderConfiguration，加载配置参数。
         * @param callbacks - LoaderCallbacks，包含 onSuccess、onError 等回调函数。
         * @returns void
         */
        async load(context: KeyLoaderContext | PlaylistLoaderContext, config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>): Promise<void> {
            // 初始化 loaderStats
            const loaderStats: LoaderStats = this.initLoaderStats()

            // 主 m3u8
            if ("type" in context && context.type === "manifest") {
                await this.handleMainM3u8(context, config, callbacks, loaderStats)
            }

            // 子 m3u8
            else if ("type" in context && context.type === "level") {
                await this.handleLevelM3u8(context, config, callbacks, loaderStats)
            }

            // 判断是否有 keyInfo
            else if ("keyInfo" in context && context.keyInfo) {
                await this.handleKey(context, config, callbacks, loaderStats)
            } else {
                // 对于未加密的视频，直接调用父类的 load 方法
                super.load(context, config, callbacks)
            }
        }

        /**
         * 初始化 LoaderStats 对象
         */
        private initLoaderStats(): LoaderStats {
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
            return loaderStats
        }

        /**
         * 处理主 m3u8 请求(manifest 类型)
         */
        private async handleMainM3u8(
            context: PlaylistLoaderContext,
            config: LoaderConfiguration,
            callbacks: LoaderCallbacks<LoaderContext>,
            stats: LoaderStats,
        ): Promise<void> {
            // 获取 main m3u8
            const getMainM3u8 = this.isAdmin ? getMainM3u8AdminAPI : getMainM3u8API

            await getMainM3u8(context.url, this.postId)
                .then((response) => {
                    stats.loading.end = window.performance.now()

                    if (response.data.code === ResponseCode.GetVideoMainM3u8Success) {
                        callbacks.onSuccess({ url: context.url, data: response.data.data }, stats, context, null)
                    } else {
                        const msg = handleResErr(response)
                        callbacks.onError({ code: response.data.code, text: msg }, context, null, stats)
                    }
                })
                .catch((error) => {
                    stats.loading.end = window.performance.now()
                    callbacks.onError({ code: CustomLoaderError.MainM3u8, text: error.message }, context, null, stats)
                })
        }

        /**
         * 处理子 m3u8 请求(level 类型)
         */
        private async handleLevelM3u8(
            context: PlaylistLoaderContext,
            config: LoaderConfiguration,
            callbacks: LoaderCallbacks<LoaderContext>,
            stats: LoaderStats,
        ): Promise<void> {
            // 获取 m3u8
            const getM3u8 = this.isAdmin ? getM3u8AdminAPI : getM3u8API
            let url = context.url

            // 普通用户需要转换 resolution 参数
            if (!this.isAdmin) {
                url = convertResolutionParam(context.url)
            }

            await getM3u8(url, this.postId)
                .then((response) => {
                    stats.loading.end = window.performance.now()

                    if (response.data.code === ResponseCode.GetVideoM3u8Success) {
                        // 获取 m3u8 成功
                        const { base_url, m3u8 } = response.data.data

                        // 将 m3u8 中的 _url_ 替换为 base_url
                        const levelM3u8 = m3u8.replace(/_url_/g, base_url + "/")

                        callbacks.onSuccess({ url: base_url, data: levelM3u8 }, stats, context, null)
                    } else {
                        const msg = handleResErr(response)
                        callbacks.onError({ code: response.data.code, text: msg }, context, null, stats)
                    }
                })
                .catch((error) => {
                    stats.loading.end = window.performance.now()
                    callbacks.onError({ code: CustomLoaderError.LevelM3u8, text: error.message }, context, null, stats)
                })
        }

        /**
         * 处理密钥请求(keyInfo 类型)
         */
        private async handleKey(
            context: KeyLoaderContext,
            config: LoaderConfiguration,
            callbacks: LoaderCallbacks<LoaderContext>,
            stats: LoaderStats,
        ): Promise<void> {
            // context.keyInfo.decryptdata.uri 在后端使用的是相对路径，hls在这里会自动拼接成绝url路径
            // 例如:http://10.10.2.222:8081/api/v1/uploads/2024/10/17/2-7f9d0d9c/2-7f9d0d9c
            // 但是这个路径在后端是无法访问的，所以需要将这个路径截取出来，拿到 path 中最后一个 / 后面的字符串就是 videoId
            const videoId = context.keyInfo.decryptdata.uri.substring(context.keyInfo.decryptdata.uri.lastIndexOf("/") + 1)

            // 获取解密密钥
            const getKey = this.isAdmin ? getKeyAdminAPI : getKeyAPI
            await getKey(videoId, this.postId)
                .then((response) => {
                    stats.loading.first = window.performance.now() // 记录首次请求时间
                    return response.data
                })
                .then((data) => {
                    stats.loading.end = window.performance.now() // 记录结束时间

                    // 密钥获取成功
                    if (data.code === ResponseCode.GetVideoKeySuccess) {
                        const decryptedKey = this.decryptKey(data.data) // 解密播放密钥
                        context.keyInfo.decryptdata.key = decryptedKey // 将解密后的密钥赋值给 keyInfo

                        callbacks.onSuccess({ url: context.keyInfo.decryptdata.uri, data: decryptedKey.buffer }, stats, context, null)
                    } else {
                        const msg = handleResErr(data)
                        callbacks.onError({ code: data.code, text: msg }, context, null, stats)
                    }
                })
                .catch((error) => {
                    stats.loading.end = window.performance.now()
                    callbacks.onError({ code: CustomLoaderError.Key, text: error.message }, context, null, stats)
                })
        }

        /**
         * 播放密钥解密函数
         * @param encryptedKey 加密的播放密钥
         * @return  返回 Uint8Array 的二进制播放密钥
         */
        decryptKey(encryptedKey: string): Uint8Array<ArrayBuffer> {
            return playKeyDecryptAES2Bin(encryptedKey)
        }
    }
}

/**
 * @description: 播放密钥解密函数
 * @param playKeyEncrypt 加密的播放密钥
 * @return  返回 Uint8Array 的二进制播放密钥
    const playKeyEncrypt = "51e8bdb7f5bed6d7c8149e0c0767ecefeFJcNUsjmwT2ZQKjS+e5pV/oz0OGyxB9HKX0LsB7/LL1mB9BFXoCV4sRcHVXD8sr56fbdd4fd665d8fa"
    const expectedOutput = new Uint8Array([63, 219, 19, 240, 217, 90, 85, 53, 28, 66, 214, 119, 240, 84, 89, 53])
 */
export function playKeyDecryptAES2Bin(playKeyEncrypt: string): Uint8Array<ArrayBuffer> {
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

/**
 * @description: 将 url 转换为 fileIdHash/resolution/分辨率格式
 * @param url 原始 url，格式为 fileIdHash/分辨率，例如 m-5-8e72860c/1080p
 * @return 转换后的字符串，格式为 fileIdHash/resolution/分辨率，例如 m-5-8e72860c/resolution/1080p
 */
const convertResolutionParam = (url: string) => {
    const parts = url.split("/")
    const fileIdHash = parts[0] // m-5-8e72860c
    const resolution = parts[1] // 1080p
    return `${fileIdHash}/resolution/${resolution}`
}

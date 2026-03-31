/**
 * FilePath    : blog-client\src\components\player\hooks\hls.value.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : hls
 */

import Hls, { type ErrorData } from "hls.js"
import { type Reactive, type Ref, shallowRef } from "vue"

import { ResponseCode } from "@/api/response"
import { createCustomLoaderClass } from "@/pkg/hls"

import { PlayerStateManager } from "../state"
import { type PlayerState, type PlayLevelLabel } from "../types"
import { getVideoQualityLabel } from "../utils"

// 展示错误在播放器上
const managerShowError = (manager: PlayerStateManager, msg: string) => {
    manager.setShowError(true)
    manager.setErrMsg(msg)
}

// 清除播放器上的错误提示
const managerClearError = (manager: PlayerStateManager) => {
    manager.setShowError(false)
    manager.setErrMsg("")
}
// hls hook
export function useHls(videoRef: Ref<HTMLVideoElement | null>, localManager: PlayerStateManager, localPlayerState: Reactive<PlayerState>) {
    // 注意这里使用 shallowRef 来存储 hls 实例，避免响应式开销
    const hls = shallowRef<Hls | null>(null)

    // 显示销毁 hls 实例
    const destroyHls = () => {
        if (hls.value) {
            hls.value.stopLoad()
            hls.value.detachMedia()
            hls.value.destroy()
            hls.value = null
        }
    }

    // 加载 hls
    const loadHls = () => {
        // 确保 video 元素存在
        if (!videoRef.value) {
            return
        }

        // 销毁旧的 hls 实例
        destroyHls()

        // 检查 HLS.js 是否支持当前浏览器
        if (!Hls.isSupported()) {
            localManager.setShowError(true)
            localManager.setErrMsg("HLS 不支持当前浏览器, 请使用最新版本的 Chrome 浏览器观看视频")
            return
        }

        // 创建 hls 实例及配置
        hls.value = new Hls({
            loader: createCustomLoaderClass(localPlayerState.isAdmin, localPlayerState.postId),
            maxMaxBufferLength: 10, // 最大缓冲时间(秒)
            maxBufferLength: 10, // 缓冲时间(秒)
            maxBufferSize: 2 * 1024 * 1024, // 缓冲大小(字节), 假设每个分片大小约为1MB
            maxBufferHole: 0.5, // 最大缓冲空洞(秒)
        })

        // 加载视频源
        hls.value.loadSource(localPlayerState.videoID)

        // 绑定 video 元素
        hls.value.attachMedia(videoRef.value)

        // 当解析完成时
        hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
            // 历遍 hls.value.levels 获取清晰度信息, 保存到 state 中
            const localLevels: Record<string, number> = {}
            hls.value?.levels.forEach((level) => {
                localLevels[getVideoQualityLabel(level.height)] = level.height
            })

            // 更新 state 中的清晰度信息
            localManager.setPlayLevelAllLevels(localLevels)
        })

        // 获取当前播放清晰度
        hls.value.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
            const currentLevel = hls.value?.levels[data.level]
            const selectedLevel = getVideoQualityLabel(currentLevel?.height || 0)
            localManager.setSelectedPlayLevel(selectedLevel as PlayLevelLabel)
            // TODO 切换清晰度时, 显示提示信息
        })

        // 处理 HLS 错误
        hls.value.on(Hls.Events.ERROR, function (event, data) {
            // 处理 hls 错误，并判断是否为预期错误
            const isExpectedError = handleHlsError(hls.value, data)
            if (data.fatal && !isExpectedError) {
                console.error("non-fatal error encountered:", data)
                // 销毁 hls 实例
                destroyHls()
            }
        })
    }

    // 处理 hls 错误
    const handleHlsError = (hls: Hls | null, data: ErrorData): boolean => {
        // 返回是否为预期错误
        let isExpectedError = false

        // 确保 hls 实例和 data.response.code 存在
        if (!hls || !data.response || !data.response.code) {
            return isExpectedError
        }

        // 处理自定义 loader 中的错误

        // 將 data.response.code 转换为 number 类型
        const resCode = parseInt(data.response.code.toString())

        // 成功的 code
        const successCodes = [ResponseCode.GetVideoM3u8Success, ResponseCode.GetVideoMainM3u8Success, ResponseCode.GetVideoKeySuccess]

        // 如果是成功的 code, 则清除可能存在的错误提示并直接返回
        if (successCodes.includes(resCode)) {
            // 清除之前展示的错误信息
            managerClearError(localManager)
            isExpectedError = true
            return isExpectedError
        }

        // 根据错误码展示不同的错误信息
        const errMsgMap: Record<number, string> = {
            [ResponseCode.VideoNotFound]: "视频不存在。",
            [ResponseCode.VideoHasNoPay]: "付费视频未购买；请购买后观看。",
            [ResponseCode.UserAuthorizationEmpty]: "请登录后观看视频。",
            [ResponseCode.UserAuthorizationFormatWrong]: "登录状态异常，请重新登录后观看视频。",
            [ResponseCode.UserTokenInvalid]: "登录状态异常，请重新登录后观看视频。",
            [ResponseCode.UserTokenTypeWrong]: "登录状态异常，请重新登录后观看视频。",
            [ResponseCode.UserTokenExpired]: "登录状态异常，请重新登录后观看视频。",
            [ResponseCode.UserLoggedInElsewhere]: "您的账号已在其他设备登录，如非本人操作，请及时修改密码。",
        }

        // 如果错误码在 errMsgMap 中，直接展示对应的错误信息
        if (errMsgMap.hasOwnProperty(resCode)) {
            const errMsg = errMsgMap[resCode as keyof typeof errMsgMap] || `请求视频资源失败，错误代码: ${data.response.code}，错误信息：${data.response.text}`
            // 展示错误信息
            managerShowError(localManager, errMsg)

            // 销毁 hls 实例
            destroyHls()
            isExpectedError = true
            return isExpectedError
        }

        // 其他错误类型，并根据错误类型尝试恢复
        let errMsg = `请求视频资源失败，错误代码: ${data.response.code}，错误信息：${data.response.text}`

        // 展示错误信息
        managerShowError(localManager, errMsg)

        switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                // 尝试恢复网络错误, 清除错误提示, 等待恢复成功后不再显示
                hls.startLoad()
                managerClearError(localManager)
                isExpectedError = true
                break
            case Hls.ErrorTypes.MEDIA_ERROR:
                // 尝试恢复媒体错误, 清除错误提示, 等待恢复成功后不再显示
                hls.recoverMediaError()
                managerClearError(localManager)
                isExpectedError = true
                break
            default:
                // 无法恢复的错误
                // console.warn("fatal error encountered, destroy hls instance")
                errMsg = errMsg + ` 播放错误: ${data.details}`
                localManager.setErrMsg(errMsg)
                destroyHls()
                isExpectedError = false
        }
        return isExpectedError
    }

    return {
        hls,
        destroyHls,
        loadHls,
    }
}

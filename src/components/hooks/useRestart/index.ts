/**
 * @Author       : jiaopengzi
 * @Date         : 2025-02-05 17:34:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-02-05 18:13:37
 * @FilePath     : \blog-client\src\components\hooks\useRestart\index.ts
 * @Description  : 常规重启 hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { ref } from "vue"

import { ResponseCode } from "@/api/response"
import { isSetupAPI } from "@/api/setting/isSetup"
import { MessageUtil } from "@/utils/message"

/**
 * 重启服务端
 * @param maxWaitSeconds 最大等待秒数 默认 60 秒
 */
export function useRestart(maxWaitSeconds: number = 60) {
    const waitSeconds = ref(0) // 等待秒数
    const isShowTimer = ref(false) // 是否显示计时器
    const hasShowSuccessMsg = ref(false) // 是否已经显示成功消息

    // 重启服务端
    const showRestart = async () => {
        waitSeconds.value = 0
        isShowTimer.value = true
        hasShowSuccessMsg.value = false

        // 计时开始能包含请求中网络延迟的时间
        const timer = setInterval(() => {
            waitSeconds.value++
        }, 1000)

        // 安装成功后，服务端开始重启,同时开始轮训检查是否重启成功 间隔 5 秒重试
        const interval = setInterval(async () => {
            // 首先判断是否超时,默认60秒
            if (waitSeconds.value >= maxWaitSeconds) {
                isShowTimer.value = false
                clearInterval(interval)
                clearInterval(timer)
                MessageUtil.error("服务端重启超时，请检查网络和后台数据是否正常！", 10000)
            }

            // 轮训检查是否重启成功
            const res = await isSetupAPI()
            if (res.data.code === ResponseCode.SetupAlready) {
                if (!hasShowSuccessMsg.value) {
                    isShowTimer.value = false
                    clearInterval(interval)
                    clearInterval(timer)
                    hasShowSuccessMsg.value = true

                    // 确认成功后，执行回调函数
                    MessageUtil.success("服务端重启完成！", 5000)
                }
            }
        }, 5000)
    }

    return {
        showRestart,
        waitSeconds,
        isShowTimer,
        hasShowSuccessMsg,
    }
}

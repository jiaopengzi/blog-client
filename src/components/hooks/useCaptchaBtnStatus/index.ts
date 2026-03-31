/**
 * FilePath    : blog-client\src\components\hooks\useCaptchaBtnStatus\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 验证码相关工具
 */

import { ref } from "vue"

/**
 * 验证码按钮状态管理
 * @param timer - 倒计时秒数, 默认60秒
 * @returns 验证码按钮文本、禁用状态和倒计时函数
 */
export const useCaptchaBtnStatus = (timer: number = 60) => {
    // 初始化按钮文本和禁用状态
    const captchaBtnText = ref("发送验证码")
    const isCaptchaBtnDisabled = ref(false)

    // 保留初始时长, 避免多次调用 countdown 导致 timer 被永久修改
    const initialTimer = timer
    let intervalId: number | null = null

    // 倒计时函数
    const countdown = () => {
        // 如果已有计时器，先清理
        if (intervalId !== null) {
            clearInterval(intervalId)
            intervalId = null
        }

        // 使用局部变量保存剩余时间, 避免不必要的响应式开销
        let remaining = initialTimer
        isCaptchaBtnDisabled.value = true
        captchaBtnText.value = `${remaining}s后重新发送`

        // 启动倒计时
        intervalId = window.setInterval(() => {
            remaining -= 1
            if (remaining <= 0) {
                if (intervalId !== null) {
                    clearInterval(intervalId)
                    intervalId = null
                }
                captchaBtnText.value = "发送验证码"
                // 启用按钮
                isCaptchaBtnDisabled.value = false
            } else {
                captchaBtnText.value = `${remaining}s后重新发送`
            }
        }, 1000)
    }

    return {
        captchaBtnText,
        isCaptchaBtnDisabled,
        countdown,
    }
}

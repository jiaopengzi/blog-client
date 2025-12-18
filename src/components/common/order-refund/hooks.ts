/*
 * FilePath    : blog-client\src\components\common\order-refund\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 退款hooks
 */

import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { type Ref, ref } from "vue"

import { captchaSendRefundAPI, type CaptchaSendRefundRequest } from "@/api/captcha/sendRefund"
import { StreamStatus } from "@/api/helper/getStreamIDsStatus"
import { orderRefundAPI, type OrderRefundRequest } from "@/api/order/refund"
import { handleResErr, ResponseCode } from "@/api/response"
import { yuanToFen } from "@/utils/amount"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import type { OrderRefundForm } from "./types"

export function useOrderRefund(formRef: Ref<FormInstance | null>, formRefund: Ref<OrderRefundForm>) {
    const isCaptchaBtnDisabled = ref(false)
    const isRefundBtnLoading = ref(false)
    const captchaBtnText = ref("获取验证码")

    // 发送邮箱验证码
    const sendCaptcha = async (orderId: string) => {
        isCaptchaBtnDisabled.value = true // 禁用按钮
        const req: CaptchaSendRefundRequest = {
            order_id: orderId,
        }

        // 发送验证码
        const res = await captchaSendRefundAPI(req)
        if (res.data.code === ResponseCode.CaptchaSendSuccess) {
            // 保证有数据且包含 stream_items 字段才进行轮询
            if (res.data.data && res.data.data.stream_items) {
                const status = await pollingGetStreamIDsStatus(res.data.data.stream_items)
                if (status === StreamStatus.HandleFailed) {
                    MessageUtil.error("发送验证码过程中出现错误，请稍后重试", 3000)
                    return
                }
            }

            // 成功发送验证码
            MessageUtil.success("验证码已发送到邮箱。", 6000)
        } else {
            // 处理错误
            const msg = handleResErr(res)
            MessageUtil.error(msg, 3000)
        }

        // 按钮设置不能点击状态
        let timer = 60
        captchaBtnText.value = `${timer}s后重新发送`
        const interval = setInterval(() => {
            timer--
            if (timer === 0) {
                clearInterval(interval)
                captchaBtnText.value = "发送验证码"
                isCaptchaBtnDisabled.value = false // 启用按钮
            } else {
                captchaBtnText.value = `${timer}s后重新发送`
            }
        }, 1000)
    }

    // 执行退款
    const runRefund = async () => {
        isRefundBtnLoading.value = true // 禁用按钮
        if (!formRef || !formRef.value) {
            isRefundBtnLoading.value = false // 启用按钮
            return
        }

        await formRef.value.validate(async (valid) => {
            if (valid) {
                const req: OrderRefundRequest = {
                    id: formRefund.value.id,
                    refund_amount: yuanToFen(formRefund.value.refund_amount, true) as string,
                    reason: formRefund.value.reason,
                    captcha: formRefund.value.captcha,
                }

                // 调用退款API
                const res = await orderRefundAPI(req)
                if (res.data.code === ResponseCode.OrderRefundSuccess) {
                    MessageUtil.success("退款申请已提交，请耐心等待后端处理。", 3000)
                    // 保证有数据且包含 stream_items 字段才进行轮询
                    if (res.data.data && res.data.data.stream_items) {
                        await pollingGetStreamIDsStatus(res.data.data.stream_items)
                    }
                    formRefund.value.captcha = "" // 清空验证码
                } else {
                    const msg = handleResErr(res)
                    MessageUtil.error(msg, 3000)
                }

                isRefundBtnLoading.value = false // 启用按钮
            } else {
                isRefundBtnLoading.value = false // 启用按钮
                return
            }
        })
    }

    return {
        isCaptchaBtnDisabled,
        isRefundBtnLoading,
        captchaBtnText,
        sendCaptcha,
        runRefund,
    }
}

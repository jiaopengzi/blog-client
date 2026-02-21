<!--
 * FilePath    : blog-client\src\components\common\order-refund\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 退款申请
-->

<template>
    <div class="order-refund">
        <h4 class="title">退款</h4>
        <p class="refund-description">退款流程：1、填写退款原因，2、填写退款金额，3、发送验证码，4、填写验证码，5、提交退款。</p>
        <el-form label-position="left" label-width="100px" ref="formRef" :model="formRefund" :rules="rules" size="default">
            <el-form-item label="退款原因" prop="reason">
                <el-input v-model="formRefund.reason" show-word-limit maxlength="32" placeholder="请填写退款原因，32字以内。" />
            </el-form-item>
            <el-form-item label="退款金额" prop="refund_amount">
                <el-input-number class="refund-amount" v-model="formRefund.refund_amount" :min="0" :max="availableRefundAmount" :precision="2" :step="0.01">
                    <template #suffix>
                        <span>元</span>
                    </template>
                </el-input-number>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
                <div class="captcha-section">
                    <el-input class="email-code" v-model="formRefund.captcha" maxlength="6" clearable placeholder="请填写验证码" />
                    <el-button class="btn-captcha" type="default" :disabled="isCaptchaBtnDisabled" @click="sendCaptcha">
                        {{ captchaBtnText }}
                    </el-button>
                </div>
            </el-form-item>
        </el-form>

        <div class="refund-btn-submit">
            <el-button type="primary" :loading="isRefundBtnLoading" @click="handleRefund"> 提交退款 </el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { ref, useTemplateRef } from "vue"

import { type OrderRefundRequest } from "@/api/order/refund"

import { useOrderRefund } from "./hooks"
import type { OrderRefundForm } from "./types"
defineOptions({ name: "OrderRefund" })

const { orderId, availableRefundAmount } = defineProps<{
    orderId: string // 订单总金额
    availableRefundAmount: number // 可退款金额
}>()

// 事件
const emit = defineEmits<{
    (event: "refund-submit-success"): void // 退款提交成功
}>()

// 表单实例
const formRef = useTemplateRef<FormInstance>("formRef")

const formRefund = ref<OrderRefundForm>({
    id: orderId,
    refund_amount: 0,
    reason: "",
    captcha: "",
})

const rules: FormRules<OrderRefundRequest> = {
    reason: [{ required: true, message: "请填写退款原因", trigger: "blur" }],
    refund_amount: [
        { required: true, message: "请填写退款金额", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                // 判断数字需要大于0且小于等于可退款金额
                if (value === "" || value <= 0) {
                    callback(new Error("退款金额必须大于0"))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
    captcha: [
        { required: true, message: "请填写验证码", trigger: "blur" },
        { pattern: /^\d{6}$/, message: "验证码必须为6位数字", trigger: "blur" },
    ],
}

const { isCaptchaBtnDisabled, isRefundBtnLoading, captchaBtnText, sendCaptcha, runRefund } = useOrderRefund(formRef, formRefund)

const handleRefund = async () => {
    const success = await runRefund()
    if (success) {
        emit("refund-submit-success")
    }
}
</script>
<style lang="scss" scoped>
h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
}

.title {
    color: var(--jpz-text-color-primary);
}

.order-refund {
    margin: 20px 0;

    .refund-description {
        font-size: 14px;
        color: var(--jpz-text-color-secondary);
        margin-bottom: 10px;
    }

    .refund-amount {
        width: 100%;
    }

    .captcha-section {
        width: 100%;
        // 输入框和按钮在同一行，按钮占用实际宽度，剩余给输入框
        display: flex;
        align-items: center;
        gap: 10px;
        .email-code {
            flex: 1; // 输入框占据剩余空间
        }
        .btn-captcha {
            width: 120px;
        }
    }

    .refund-btn-submit {
        margin-top: 20px;
        text-align: center;
    }
}
</style>

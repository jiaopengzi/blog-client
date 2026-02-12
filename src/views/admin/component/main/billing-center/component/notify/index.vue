<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\component\notify\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心通知阈值设置表单
-->

<template>
    <div class="notify-form">
        <!-- 功能说明 -->
        <div class="notify-tip">
            <el-icon :size="16"><InfoFilled /></el-icon>
            <span>启用通知后, 余额低于阈值时将自动发送提醒</span>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" label-position="top">
            <el-form-item label="启用通知">
                <el-switch v-model="form.notify_enabled" active-text="已启用" inactive-text="未启用" />
            </el-form-item>

            <el-form-item label="通知阈值(元)" prop="notify_threshold">
                <el-input-number
                    class="amount-input"
                    v-model="form.notify_threshold"
                    placeholder="余额低于此值时发送通知"
                    :precision="0"
                    :step="1"
                    :min="0"
                    :max="200"
                    clearable
                    :disabled="!form.notify_enabled"
                >
                    <template #prefix>
                        <span>￥</span>
                    </template>
                </el-input-number>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" :loading="submitting" style="min-width: 120px; font-weight: 600" @click="handleSubmit"> 保存设置 </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { InfoFilled } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules } from "element-plus"
import { debounce } from "throttle-debounce"
import { onMounted, reactive, ref } from "vue"

import type { BillingCenterAccountRes } from "@/api/billingCenter/common"
import { billingCenterNotifyThresholdAPI, type BillingCenterNotifyThresholdRequest } from "@/api/billingCenter/notifyThreshold"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"
import { fenToYuan, yuanToFen } from "@/utils/amount"

// 定义 props
const props = defineProps<{
    accountInfo: BillingCenterAccountRes
}>()

// 定义事件
const emit = defineEmits<{
    (event: "notify-status", status: boolean): void
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
    notify_threshold: "",
    notify_enabled: false,
})

// 表单校验规则
const rules = reactive<FormRules>({
    notify_threshold: [
        {
            validator: (_rule, value, callback) => {
                if (form.notify_enabled) {
                    if (!value && value !== "0") {
                        callback(new Error("请输入通知阈值"))
                    } else {
                        const num = Number(value)
                        if (isNaN(num) || num < 0) {
                            callback(new Error("阈值不能为负数"))
                        } else {
                            callback()
                        }
                    }
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
})

const submitting = ref(false)

/**
 * handleSubmit 提交通知阈值设置。
 * 金额单位为元, 提交时转换为分。
 */
const handleSubmit = debounce(300, async () => {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    submitting.value = true
    try {
        // 将元转换为分
        const thresholdInCents = yuanToFen(form.notify_threshold, true) as string
        const requestData: BillingCenterNotifyThresholdRequest = {
            notify_threshold: thresholdInCents,
            notify_enabled: form.notify_enabled,
        }
        const res = await billingCenterNotifyThresholdAPI(requestData)
        if (res.data.code === ResponseCode.BillingCenterNotifyThresholdSuccess) {
            MessageUtil.success("通知设置已保存")
            emit("notify-status", true)
        } else {
            MessageUtil.error(handleResErr(res))
        }
    } finally {
        submitting.value = false
    }
})

// 初始化表单数据
onMounted(() => {
    if (props.accountInfo) {
        form.notify_enabled = props.accountInfo.notify_enabled
        // 将分转换为元显示
        form.notify_threshold = fenToYuan(props.accountInfo.notify_threshold).toString()
    }
})
</script>

<style scoped lang="scss">
.notify-tip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    border-radius: 8px;
    font-size: 13px;
    color: var(--jpz-text-color-secondary);
    border: 1px solid var(--jpz-border-color-lighter);

    .el-icon {
        color: var(--jpz-color-primary);
        flex-shrink: 0;
    }
}

.amount-input {
    width: 100%;
}
</style>

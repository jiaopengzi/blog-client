<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\component\register\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心注册表单
-->

<template>
    <div class="register-form">
        <!-- 注册说明 -->
        <div class="register-tip">
            <el-icon :size="16"><InfoFilled /></el-icon>
            <span>注册后才能使用商城功能（如付费阅读、付费下载、付费视频等）进行收款。</span>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="top">
            <el-form-item label="域名" prop="domain_name">
                <el-input v-model="form.domain_name" placeholder="请输入域名" clearable />
                <!-- 域名提示信息 -->
                <div class="domain-hint">{{ domainHint }}</div>
            </el-form-item>

            <el-form-item label="验证码" prop="captcha">
                <div class="captcha-row">
                    <el-input v-model="form.captcha" placeholder="请输入验证码" clearable />
                    <el-button type="primary" :disabled="isCaptchaBtnDisabled" :loading="captchaSending" @click="handleSendCaptcha">
                        {{ captchaBtnText }}
                    </el-button>
                </div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" :loading="submitting" style="min-width: 120px; font-weight: 600" @click="handleSubmit"> 注册 </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { InfoFilled } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules } from "element-plus"
import { debounce } from "throttle-debounce"
import { reactive, ref } from "vue"

import { BillingCenterPurpose } from "@/api/billingCenter/common"
import { billingCenterCaptchaSendAPI } from "@/api/billingCenter/captchaSend"
import { billingCenterRegisterAPI, type BillingCenterRegisterRequest } from "@/api/billingCenter/register"
import { handleResErr, ResponseCode } from "@/api/response"
import { useCaptchaBtnStatus } from "@/components/hooks/useCaptchaBtnStatus"
import { MessageUtil } from "@/utils/message"
import { domainHint } from "../../hooks"

// 定义事件
const emit = defineEmits<{
    (event: "register-status", status: boolean): void
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 当前页面域名, 默认填写
const currentDomain = window.location.hostname

// 表单数据
const form = reactive<BillingCenterRegisterRequest>({
    captcha: "",
    domain_name: currentDomain,
})

// 表单校验规则
const rules = reactive<FormRules>({
    domain_name: [{ required: true, message: "请输入域名", trigger: "blur" }],
    captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
})

// 验证码按钮状态
const { captchaBtnText, isCaptchaBtnDisabled, countdown } = useCaptchaBtnStatus()
const captchaSending = ref(false)
const submitting = ref(false)

/**
 * handleSendCaptcha 发送验证码。
 */
const handleSendCaptcha = debounce(300, async () => {
    captchaSending.value = true
    try {
        const res = await billingCenterCaptchaSendAPI({ purpose: BillingCenterPurpose.Register })
        if (res.data.code === ResponseCode.BillingCenterCaptchaSendSuccess) {
            MessageUtil.success("验证码已发送")
            countdown()
        } else {
            MessageUtil.error(handleResErr(res))
        }
    } finally {
        captchaSending.value = false
    }
})

/**
 * handleSubmit 提交注册表单。
 */
const handleSubmit = debounce(300, async () => {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    submitting.value = true
    try {
        const res = await billingCenterRegisterAPI(form)
        if (res.data.code === ResponseCode.BillingCenterRegisterSuccess) {
            MessageUtil.success("注册成功")
            emit("register-status", true)
        } else {
            MessageUtil.error(handleResErr(res))
        }
    } finally {
        submitting.value = false
    }
})
</script>

<style scoped lang="scss">
.register-tip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    background: var(--jpz-color-info-light-9);
    border-radius: 8px;
    font-size: 13px;
    color: var(--jpz-text-color-secondary);
    border: 1px solid var(--jpz-border-color-lighter);
    line-height: 1.6;

    .el-icon {
        color: var(--jpz-color-primary);
        flex-shrink: 0;
    }
}

.domain-hint {
    margin: 8px 0;
    font-size: 13px;
    color: var(--jpz-color-warning);
    line-height: 1.6;
    white-space: pre-line;
}

.captcha-row {
    display: flex;
    gap: 12px;
    width: 100%;
}
</style>

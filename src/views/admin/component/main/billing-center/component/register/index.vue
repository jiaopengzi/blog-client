<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\component\register\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心注册表单
-->

<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="top">
        <el-form-item label="域名" prop="domain_name">
            <el-input v-model="form.domain_name" placeholder="请输入域名(可选)" clearable />
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
            <el-button type="primary" :loading="submitting" @click="handleSubmit"> 注册 </el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { type FormInstance, type FormRules } from "element-plus"
import { debounce } from "throttle-debounce"
import { reactive, ref } from "vue"

import { BillingCenterPurpose } from "@/api/billingCenter/common"
import { billingCenterCaptchaSendAPI } from "@/api/billingCenter/captchaSend"
import { billingCenterRegisterAPI, type BillingCenterRegisterRequest } from "@/api/billingCenter/register"
import { handleResErr, ResponseCode } from "@/api/response"
import { useCaptchaBtnStatus } from "@/components/hooks/useCaptchaBtnStatus"
import { MessageUtil } from "@/utils/message"

// 定义事件
const emit = defineEmits<{
    (event: "register-status", status: boolean): void
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive<BillingCenterRegisterRequest>({
    captcha: "",
    domain_name: "",
})

// 表单校验规则
const rules = reactive<FormRules>({
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
.captcha-row {
    display: flex;
    gap: 12px;
    width: 100%;
}
</style>

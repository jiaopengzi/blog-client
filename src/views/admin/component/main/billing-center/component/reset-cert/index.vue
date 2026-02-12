<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\component\reset-cert\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心重置证书表单
-->

<template>
    <div class="reset-cert-form">
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

            <!-- 新证书展示 -->
            <div v-if="newCert" class="cert-result">
                <el-alert title="证书已重置成功" type="success" :closable="false" show-icon>
                    <template #default>
                        <p>请妥善保存新证书, 关闭弹窗后无法再次查看</p>
                        <el-input v-model="newCert" type="textarea" :rows="6" readonly />
                    </template>
                </el-alert>
            </div>

            <el-form-item>
                <el-button type="danger" :loading="submitting" :disabled="!!newCert" style="min-width: 120px; font-weight: 600" @click="handleSubmit">
                    重置证书
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { type FormInstance, type FormRules } from "element-plus"
import { debounce } from "throttle-debounce"
import { reactive, ref } from "vue"

import { BillingCenterPurpose } from "@/api/billingCenter/common"
import { billingCenterCaptchaSendAPI } from "@/api/billingCenter/captchaSend"
import { billingCenterResetCertAPI, type BillingCenterResetCertRequest } from "@/api/billingCenter/resetCert"
import { handleResErr, ResponseCode } from "@/api/response"
import { useCaptchaBtnStatus } from "@/components/hooks/useCaptchaBtnStatus"
import { confirmCommon } from "@/utils/confirm"
import { MessageUtil } from "@/utils/message"
import { domainHint } from "../../hooks"

// 定义事件
const emit = defineEmits<{
    (event: "reset-cert-status", status: boolean): void
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 当前页面域名, 默认填写
const currentDomain = window.location.hostname

// 表单数据
const form = reactive<BillingCenterResetCertRequest>({
    captcha: "",
    domain_name: currentDomain,
})

// 新证书
const newCert = ref("")

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
 * handleSendCaptcha 发送重置证书验证码。
 */
const handleSendCaptcha = debounce(300, async () => {
    captchaSending.value = true
    try {
        const res = await billingCenterCaptchaSendAPI({ purpose: BillingCenterPurpose.ResetCert })
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
 * handleSubmit 提交重置证书请求。
 * 提交前进行二次确认。
 */
const handleSubmit = debounce(300, async () => {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    await confirmCommon(
        "重置证书后旧证书将立即失效, 确认继续?",
        async () => {
            submitting.value = true
            try {
                const res = await billingCenterResetCertAPI(form)
                if (res.data.code === ResponseCode.BillingCenterResetCertSuccess) {
                    newCert.value = res.data.data.cert
                    MessageUtil.success("证书重置成功")
                    emit("reset-cert-status", true)
                } else {
                    MessageUtil.error(handleResErr(res))
                }
            } finally {
                submitting.value = false
            }
        },
        () => {}, // 用户取消
    )
})
</script>

<style scoped lang="scss">
.domain-hint {
    margin-top: 4px;
    font-size: 12px;
    color: var(--jpz-color-warning);
    line-height: 1.6;
    white-space: pre-line;
}

.captcha-row {
    display: flex;
    gap: 12px;
    width: 100%;
}

.cert-result {
    margin-bottom: 20px;

    p {
        margin: 4px 0 8px;
        font-size: 13px;
        color: var(--jpz-text-color-secondary);
    }
}
</style>

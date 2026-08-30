<!--
 * FilePath    : blog-client-nuxt\src\components\common\bind-email-dialog\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 绑定邮箱弹窗
-->

<template>
    <el-dialog
        v-model="showDialogBindEmail"
        :lock-scroll="false"
        :show-close="false"
        :close-on-click-modal="true"
        :close-on-press-escape="false"
        class="bind-email-dialog"
    >
        <div class="bind-email-wrapper">
            <!-- 添加滑动验证组件: SlideVerify -->
            <SlideVerify @on-success="sendCaptcha" />
            <el-form
                :label-position="labelPosition"
                label-width="100px"
                ref="bindEmailFormRef"
                :model="bindEmailForm"
                :rules="rules"
                class="bindEmail-form"
                :size="formSize"
                status-icon
            >
                <div class="header-main">
                    <h2 class="header-title">绑定邮箱</h2>
                    <p>请绑定邮箱后继续使用。</p>
                </div>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="bindEmailForm.email" />
                </el-form-item>

                <el-form-item label="验证码" prop="captcha">
                    <el-input class="email-code" v-model="bindEmailForm.captcha" />
                    <button class="btn-captcha" type="button" @click="openSlideVerify" :disabled="isCaptchaBtnDisabled">
                        {{ captchaBtnText }}
                    </button>
                </el-form-item>

                <div class="btn-submit">
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(bindEmailFormRef as FormInstance)">绑定邮箱</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { storeToRefs } from "pinia"
import { reactive, ref, useTemplateRef } from "vue"

import { captchaSendAPI, type CaptchaSendRequest } from "@/api/captcha/send"
import { CaptchaPurpose } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { bindEmailAPI, type BindEmailRequest } from "@/api/user/bindEmail"
import { checkEmailAPI, type CheckEmailRequest } from "@/api/user/checkEmail"
import SlideVerify from "@/components/common/slide-verify"
import { useCaptchaBtnStatus } from "@/components/hooks/useCaptchaBtnStatus"
import { createCaptchaRules, createEmailRules } from "@/components/hooks/useAccountFormValidation/rules"
import { useOptionsStore } from "@/stores/options"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"
import { RegexPatterns } from "@/utils/regexPatterns"

defineOptions({ name: "BindEmailDialog" })

const userStore = useUserStore()
const optionsStore = useOptionsStore()

// 打开滑动验证, 未开启时直接走成功回调
const openSlideVerify = async () => {
    // 如果没有开启滑动验证, 直接调用成功回调
    if (!optionsStore.slide_verify_enable || optionsStore.slide_verify_imgs.length === 0) {
        await sendCaptcha()
        return
    }

    optionsStore.openSlideVerify()
}

const { showDialogBindEmail } = storeToRefs(userStore)

interface BindEmailForm {
    email: string
    captcha: string
}

// 表单 label 位置 top | left | right
const labelPosition = ref<"left" | "right" | "top">("top")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref<"" | "default" | "small" | "large">("default")

const bindEmailFormRef = useTemplateRef<FormInstance>("bindEmailFormRef")

const bindEmailForm = reactive<BindEmailForm>({
    email: "",
    captcha: "",
})

/**
 * @description: 验证码发送 异步函数
 * @return Promise<void> 验证码错误返回 Promise.reject(), 否则返回 Promise.resolve()
 */
async function checkSendCaptcha(): Promise<void> {
    try {
        // 创建请求对象
        const req: CaptchaSendRequest = {
            email: bindEmailForm.email,
            purpose: CaptchaPurpose.BindEmail,
        }
        const res = await captchaSendAPI(req)

        if (res.data.code !== ResponseCode.CaptchaSendSuccess) {
            const msg = handleResErr(res)
            throw new Error(msg)
        }
    } catch (err: unknown) {
        console.log(err)
        throw err
    }
}

/**
 * @description: 邮箱查重 异步函数
 * @return
 */
async function checkEmail(email: string): Promise<void> {
    // 创建请求对象
    const req: CheckEmailRequest = {
        email: email,
    }

    try {
        const { data } = await checkEmailAPI(req)

        if (data.code === ResponseCode.UserEmailExist) {
            throw new Error(data.msg)
        }
    } catch (err: unknown) {
        console.log(err)
        throw err
    }
}

/**
 * @description: 邮箱查重 Validator
 * @param rule 校验规则
 * @param value 对应输入框的值
 * @param callback 回调函数, 如果邮箱已存在, 则传入错误提示字符串
 */
function checkEmailValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
    if (value === "" || !RegexPatterns.Email.test(value)) {
        callback()
        return
    }

    // 在这里处理异步验证逻辑
    checkEmail(value)
        .then(() => {
            callback() // 校验成功
        })
        .catch((err: Error) => {
            callback(err.message) // 如果失败 (邮箱已经存在), 则传入错误提示字符串
        })
}

/**
 * @description: 表单校验规则
 * @return  FormRules<BindEmailForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<BindEmailForm>>({
    email: createEmailRules(checkEmailValidator),
    captcha: createCaptchaRules(),
})

/**
 * @description: 提交表单
 * @param formEl 表单实例
 * @param fields 表单字段
 * @return  void
 */
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            const req: BindEmailRequest = {
                email: bindEmailForm.email,
                captcha: bindEmailForm.captcha,
            }

            const res = await bindEmailAPI(req)

            if (res.data.code === ResponseCode.BindEmailSuccess) {
                // 显示绑定成功提示
                userStore.getUserInfoByToken(true) // 强制更新用户信息
                MessageUtil.success(res.data.msg, 6000)
            } else {
                // 绑定失败
                const msg = handleResErr(res)
                MessageUtil.error(msg, 0)
            }
            console.log("submit!")
        }
    })
}

// 验证码按钮状态
const { captchaBtnText, isCaptchaBtnDisabled, countdown } = useCaptchaBtnStatus()

// 发送邮箱验证码
const sendCaptcha = async () => {
    // 手动触发 FormInstance 的校验, 校验 email 字段
    const emailResult = await bindEmailFormRef.value?.validateField("email").catch(() => false)
    if (!emailResult) {
        MessageUtil.error("请输入正确的邮箱地址。", 0)
        console.log("请输入邮箱")
        return
    }

    if (emailResult) {
        isCaptchaBtnDisabled.value = true // 将按钮设置为不可点击状态

        // 发送验证码
        checkSendCaptcha()
            .then(() => {
                // 成功发送验证码
                MessageUtil.success("验证码已发送到邮箱。", 6000)
            })
            .catch((err: Error) => {
                // 错误提示
                MessageUtil.error(err.message, 0)
            })

        countdown()
    }
}
</script>

<style lang="scss" scoped>
.bindEmail-form {
    min-width: 360px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 5px;
    padding: 20px;
    box-shadow: var(--jpz-box-shadow-lighter);
    background-color: var(--jpz-bg-color);
}

@media (max-width: pc.$width-page-main) {
    .bindEmail-form {
        // 调整 260829-03 (3): 中低宽度下保留卡片样式——原"去边框/去背景/去阴影"会与
        // el-dialog 50% 宽度叠加 (90vw 表单溢出弹窗容器), 视觉上弹窗全透明、表单错位;
        // 宽度收敛为不超过 460px, 保证卡片始终完整落在弹窗可视区域内
        width: min(90vw, 460px);
        box-sizing: border-box;
    }
}

.header-title {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--jpz-text-color-primary);
}

.email-code {
    flex: 1;
}

.btn-captcha {
    width: 120px;
    margin-left: 10px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    color: #333;
}

.btn-captcha:disabled {
    background-color: #fff;
    color: #333;
    cursor: not-allowed;
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}

.bind-email-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

p {
    font-size: 14px;
    color: red;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>

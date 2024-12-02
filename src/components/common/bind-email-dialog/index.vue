<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 18:53:25
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-02 11:55:35
 * @FilePath     : \blog-client\src\components\common\bind-email-dialog\index.vue
 * @Description  : 绑定邮箱弹窗
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <!-- 添加滑动验证组件：SlideVerify -->
    <el-dialog
        v-model="showDialogBindEmail"
        :lock-scroll="false"
        :show-close="false"
        :close-on-click-modal="true"
        :close-on-press-escape="false"
        class="bind-email-dialog"
    >
        <div class="bind-email-wrapper">
            <SlideVerify
                v-if="showSlideVerify"
                @on-close="closeSlideVerify"
                @on-success="sendCaptcha"
            ></SlideVerify>
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
                    <h2>绑定邮箱</h2>
                    <p>请绑定邮箱后继续使用。</p>
                </div>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="bindEmailForm.email" />
                </el-form-item>

                <el-form-item label="验证码" prop="captcha">
                    <el-input class="email-code" v-model="bindEmailForm.captcha" />
                    <button
                        class="btn-captcha"
                        type="button"
                        @click="openSlideVerify"
                        :disabled="btnCaptchaState.disabled"
                    >
                        {{ captcha }}
                    </button>
                </el-form-item>

                <div class="btn-submit">
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="submitForm(bindEmailFormRef as FormInstance)"
                            >绑定邮箱</el-button
                        >
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, useTemplateRef } from "vue"
import { ShowMsgTip } from "@/utils/message"
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import type { CheckEmailRequest } from "@/api/user/checkEmail"
import { CheckEmailAPI } from "@/api/user/checkEmail"
import type { BindEmailRequest } from "@/api/user/bindEmail"
import { bindEmailAPI } from "@/api/user/bindEmail"
import type { CaptchaSendRequest } from "@/api/captcha/send"
import { captchaSendAPI } from "@/api/captcha/send"
import type { CaptchaCheckRequest } from "@/api/captcha/check"
import { captchaCheckAPI } from "@/api/captcha/check"
import { ResponseCode, CaptchaPurpose, handleErrInfo } from "@/api/responseCode"
import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/user"

import SlideVerify from "@/components/common/slide-verify" // 引用滑块验证组件

defineOptions({ name: "BindEmailDialog" })

const userStore = useUserStore()

let { showDialogBindEmail } = storeToRefs(userStore)

interface BindEmailForm {
    email: string
    captcha: string
}

// 表单label位置 top | left | right
const labelPosition = ref("top")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const bindEmailFormRef = useTemplateRef<FormInstance>("bindEmailFormRef")

// 表单数据
const bindEmailForm = reactive<BindEmailForm>({
    email: "",
    captcha: "",
})

/**
 * @description: 验证码发送 异步函数
 * @return Promise<void> 验证码错误返回 Promise.reject()，否则返回 Promise.resolve()
 */
async function checkSendCaptcha(): Promise<void> {
    try {
        // 创建请求对象 加密内容
        const req: CaptchaSendRequest = {
            email: bindEmailForm.email,
            purpose: CaptchaPurpose.BindEmail,
        }
        const { data } = await captchaSendAPI(req) // 将 resStr 转换为对象

        if (data.code !== ResponseCode.CaptchaSendSuccess && data.data !== null) {
            // 历遍 data 中的错误信息 并抛出第一个key错误信息 停止循环
            for (const key in data.data) {
                if (Object.prototype.hasOwnProperty.call(data.data, key)) {
                    throw new Error(data.data[key]) // 抛出错误信息
                }
            }
        }
        if (data.code !== ResponseCode.CaptchaSendSuccess && data.data === null) {
            throw new Error(data.msg) // 抛出错误信息
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
async function checkEmail(): Promise<void> {
    // 创建请求对象 加密内容
    const req: CheckEmailRequest = {
        email: bindEmailForm.email,
    }

    try {
        const { data } = await CheckEmailAPI(req)

        if (data.code === ResponseCode.UserEmailExist) {
            throw new Error(data.msg)
        }
    } catch (err: unknown) {
        console.log(err)
        throw err
    }
}

/**
 * @description: 用户名查重 Validator
 * @param rule 校验规则
 * @param value 对应输入框的值
 * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
 */
function checkEmailValidator(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
): void {
    // 在这里处理异步验证逻辑
    checkEmail()
        .then(() => {
            callback() // 校验成功
        })
        .catch((err: Error) => {
            callback(err.message) // 如果失败（邮箱已经存在），则传入错误提示字符串
        })
}

async function checkCaptcha(): Promise<void> {
    try {
        // 创建请求对象 加密内容
        const req: CaptchaCheckRequest = {
            email: bindEmailForm.email,
            captcha: bindEmailForm.captcha,
            purpose: CaptchaPurpose.BindEmail,
        }

        const { data } = await captchaCheckAPI(req)

        if (data.code !== ResponseCode.CaptchaCheckSuccess) {
            throw new Error(data.msg)
        }
    } catch (err: unknown) {
        console.log(err)
        throw err
    }
}

function checkCaptchaValidator(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
): void {
    // 在这里处理异步验证逻辑
    checkCaptcha()
        .then(() => {
            callback() // 校验成功
        })
        .catch((err: Error) => {
            callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
        })
}

/**
 * @description: 表单校验规则
 * @return  FormRules<BindEmailForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<BindEmailForm>>({
    email: [
        { required: true, message: "请输入邮箱地址", trigger: "blur" },
        {
            pattern: /^([a-z0-9._%+-]+)@[a-z0-9.-]+\.[a-z]{2,}$/,
            message: "请输入有效的邮箱",
            trigger: "blur",
        },
        // 邮箱查重
        { validator: checkEmailValidator, trigger: "blur" },
    ],
    captcha: [
        { required: true, message: "请输入验证码", trigger: "blur" },
        { pattern: /^\d{6}$/, message: "验证码为6位的数字", trigger: "blur" },
        { validator: checkCaptchaValidator, trigger: "blur" },
    ],
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

            if (res.data.code === ResponseCode.UserBindEmailSuccess) {
                // 显示注册成功提示
                userStore.getUserInfoByToken(true) // 强制更新用户信息
                ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 6000)
            } else {
                // 注册失败
                const msg = handleErrInfo(res)
                ShowMsgTip(ShowMsgTip.MsgType.error, msg, 0)
            }
            console.log("submit!")
        }
    })
}

// 添加 showSlideVerify 响应式变量
const showSlideVerify = ref(false)

// 显示滑块验证
const openSlideVerify = () => {
    // 显示滑块验证
    console.log("打开滑块验证")
    showSlideVerify.value = true
}

const captcha = ref("发送验证码")
const btnCaptchaState = reactive({ disabled: false })

// 发送邮箱验证码

const sendCaptcha = async () => {
    // 关闭滑块验证
    showSlideVerify.value = false

    // 手动触发 FormInstance 的校验，校验 userName 和 email 字段

    const emailResult = await bindEmailFormRef.value?.validateField("email").catch(() => false)
    if (!emailResult) {
        ShowMsgTip(ShowMsgTip.MsgType.error, "请输入正确的邮箱地址。", 0)
        console.log("请输入邮箱")
        return
    }

    if (emailResult) {
        btnCaptchaState.disabled = true // 按钮设置不能点击状态

        // 发送验证码
        checkSendCaptcha()
            .then(() => {
                // 成功发送验证码
                ShowMsgTip(ShowMsgTip.MsgType.success, "验证码已发送到邮箱。", 6000)
            })
            .catch((err: Error) => {
                // 错误提示
                ShowMsgTip(ShowMsgTip.MsgType.error, err.message, 0)
            })

        // 按钮设置不能点击状态
        let timer = 5
        captcha.value = `${timer}s后重新发送`
        const interval = setInterval(() => {
            timer--
            if (timer === 0) {
                clearInterval(interval)
                captcha.value = "发送验证码"
                btnCaptchaState.disabled = false // 启用按钮
            } else {
                captcha.value = `${timer}s后重新发送`
            }
        }, 1000)
    }
}

// 关闭滑块验证
const closeSlideVerify = () => {
    showSlideVerify.value = false
}
</script>

<style lang="scss" scoped>
.bindEmail-form {
    min-width: 360px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    /* 添加阴影效果 */
    background-color: #eee;
}

@media (max-width: pc.$width-page-main) {
    .bindEmail-form {
        /* 当屏幕宽度小于 1024px 时 */
        width: 90vw;
        box-shadow: none;
        border: none;
        background-color: transparent;
    }
}

h2 {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
}

.email-code {
    flex: 5;
}

.btn-captcha {
    flex: 2;
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

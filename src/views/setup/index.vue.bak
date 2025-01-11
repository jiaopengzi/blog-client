<template>
    <div class="setup-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="setupFormRef"
            :model="setupForm"
            :rules="rules"
            class="setup-form"
            :size="formSize"
            status-icon
        >
            <div class="header-main">
                <h2>数据库配置</h2>
            </div>

            <template v-if="pgsql">
                <div class="header-main">
                    <h2>数据库配置</h2>
                </div>
                <el-form-item label="主机地址" prop="host">
                    <el-input v-model="pgsqlForm.host" />
                </el-form-item>
                <el-form-item label="端口" prop="port">
                    <el-input v-model="pgsqlForm.port" />
                </el-form-item>
                <el-form-item label="数据库名" prop="database">
                    <el-input v-model="pgsqlForm.database" />
                </el-form-item>
                <el-form-item label="用户名" prop="user">
                    <el-input v-model="pgsqlForm.user" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" show-password v-model="pgsqlForm.password" />
                </el-form-item>
                <el-form-item label="表格前缀" prop="table_prefix">
                    <el-input v-model="pgsqlForm.table_prefix" />
                </el-form-item>
            </template>

            <template v-if="redis">
                <div class="header-main">
                    <h2>数据库配置</h2>
                </div>
                <el-form-item label="主机地址" prop="host">
                    <el-input v-model="redisForm.host" />
                </el-form-item>
                <el-form-item label="端口" prop="port">
                    <el-input v-model="redisForm.port" />
                </el-form-item>
                <el-form-item label="数据库名" prop="database">
                    <el-input v-model="redisForm.database" />
                </el-form-item>
                <el-form-item label="用户名" prop="user">
                    <el-input v-model="redisForm.user" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" show-password v-model="redisForm.password" />
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, ref, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import type { CaptchaCheckRequest } from "@/api/captcha/check"
import { captchaCheckAPI } from "@/api/captcha/check"
import type { CaptchaSendRequest } from "@/api/captcha/send"
import { captchaSendAPI } from "@/api/captcha/send"
import { CaptchaPurpose } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import {
    type PgsqlSetupRequest,
    type RedisNodeSetupRequest,
    setupAPI,
    type setupRequest,
} from "@/api/setting/setup"
import type { CheckEmailRequest } from "@/api/user/checkEmail"
import type { ResetPasswordRequest } from "@/api/user/resetPassword"
import { resetPasswordAPI } from "@/api/user/resetPassword"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"

import type { ResetPasswordForm } from "./types"

// 定义组件名称
defineOptions({ name: "DatabaseForm" })

const { pgsql, redis } = defineProps<{
    pgsql?: PgsqlSetupRequest
    redis?: RedisNodeSetupRequest
}>()

// 判断 pgsql 和 redis 是否都为空
if (!pgsql && !redis) {
    throw new Error('Either "pgsql" or "redis" prop must be provided.')
}

const emit = defineEmits<{
    (event: "update-tag-list", tagList: string[]): void
}>()

// const pgsqlForm = reactive({ ...pgsql })
const redisForm = reactive({ ...redis })

const pgsqlForm = reactive<PgsqlSetupRequest>({
    host: "",
    port: 5432,
    database: "",
    user: "",
    password: "",
    table_prefix: "",
})

const router = useRouter()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const setupFormRef = useTemplateRef<FormInstance>("setupFormRef")

// 表单数据
const setupForm = reactive<ResetPasswordForm>({
    email: "jiaopengzi@qq.com",
    captcha: "123456",
    password: "123QWEasd123",
    rePassword: "123QWEasd123",
})

/**
 * @description: 确认密码 异步函数
 * @return  Promise<void> 两次输入的密码不一致返回 Promise.reject()，否则返回 Promise.resolve()
 */
async function checkRePassword(): Promise<void> {
    try {
        if (setupForm.rePassword === "") {
            throw new Error("请再次输入密码")
        } else if (setupForm.rePassword !== setupForm.password) {
            throw new Error("两次输入的密码不一致")
        }
    } catch (err: unknown) {
        console.log(err)
        throw err
    }
}

/**
 * @description: 确认密码 Validator
 * @return  void
 */
function rePasswordValidator(
    rule: unknown,
    value: string,
    callback: (error?: string | Error | undefined) => void,
): void {
    // 在这里处理异步验证逻辑
    checkRePassword()
        .then(() => {
            callback() // 校验成功
        })
        .catch((err: Error) => {
            callback(err.message)
        })
}

/**
 * @description: 验证码发送 异步函数
 * @return Promise<void> 验证码错误返回 Promise.reject()，否则返回 Promise.resolve()
 */
async function checkSendCaptcha(): Promise<void> {
    try {
        // 创建请求对象 加密内容
        const req: CaptchaSendRequest = {
            email: setupForm.email,
            purpose: CaptchaPurpose.ResetPassword,
        }

        const { data } = await captchaSendAPI(req)

        if (data.code !== ResponseCode.CaptchaSendSuccess && data.data !== null) {
            throw new Error(handleResErr(data))
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
        email: setupForm.email,
    }

    try {
        const { data } = await CheckEmailAPI(req)

        if (data.code !== ResponseCode.UserEmailExist) {
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
    rule: unknown,
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
            email: setupForm.email,
            captcha: setupForm.captcha,
            purpose: CaptchaPurpose.ResetPassword,
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
    rule: unknown,
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
 * @return  FormRules<ResetPasswordForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<ResetPasswordForm>>({
    email: [
        { required: true, message: "请输入邮箱地址", trigger: "blur" },
        {
            pattern: /^[\w.!#$%&'*+/=?^_`{|}~-]+@[\w-]+(\.\w+)+$/,
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
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        // 必须包含：大小写字母+数字,长度:6-64 特殊字符可有可无
        {
            pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?;:|[\]\\{}<>`~_+=-]{6,64}$/,
            message: "必须包含：大小写字母+数字,长度:6-64",
            trigger: "change",
        },
    ],
    rePassword: [{ required: true, validator: rePasswordValidator, trigger: "blur" }],
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
            // 创建请求对象 加密内容
            const req: ResetPasswordRequest = {
                captcha: setupForm.captcha,
                password: setupForm.password,
                re_password: setupForm.rePassword,
                email: setupForm.email,
            }

            const { data } = await resetPasswordAPI(req) // 将 resStr 转换为对象

            if (data.code === ResponseCode.UserResetPasswordSuccess) {
                // 显示注册成功提示
                MessageUtil.success(data.msg, 6000)

                // 跳转到登录页面
                setTimeout(() => {
                    router.push({ name: "login" })
                }, 3000)
            } else {
                // 注册失败
                // console.log("注册失败");
                MessageUtil.error(data.msg, 0)
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

    const emailResult = await setupFormRef.value?.validateField("email").catch(() => false)
    if (!emailResult) {
        MessageUtil.error("请输入正确的邮箱地址。", 0)
        console.log("请输入邮箱")
        return
    }

    if (emailResult) {
        btnCaptchaState.disabled = true // 按钮设置不能点击状态

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
.setup-page {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--jpz-bg-color-page);
}

.setup-form {
    width: 100%;
    border-bottom: 1px solid var(--jpz-border-color);
    padding: 20px;
    background-color: var(--jpz-bg-color);
}

h2 {
    text-align: left;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--jpz-text-color-regular);
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
    border: 1px solid var(--jpz-border-color);
    border-radius: 4px;
    background-color: var(--jpz-bg-color);
    cursor: pointer;
    color: var(--jpz-text-color-regular);
}

.btn-captcha:disabled {
    background-color: var(--jpz-bg-color);
    color: var(--jpz-text-color-disabled);
    cursor: not-allowed;
}

.go-home {
    text-align: center;
    margin-top: 20px;
}

.go-home span {
    color: var(--jpz-text-color-secondary);
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>

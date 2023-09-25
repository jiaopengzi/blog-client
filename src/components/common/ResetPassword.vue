<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-12 12:13:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-12 18:05:41
 * @FilePath     : \blog-client\src\components\common\ResetPassword.vue
 * @Description  : 重置密码
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <!-- 添加滑动验证组件：SlideVerify -->

  <SlideVerify v-if="showSlideVerify" @on-close="closeSlideVerify" @on-success="sendcaptcha"></SlideVerify>
  <el-form :label-position="labelPosition" label-width="100px" ref="fogetPasswordFormRef" :model="fogetPasswordForm"
    :rules="rules" class="fogetPassword-form" :size="formSize" status-icon>
    <div class="header-main">
      <a href="/">
        <div class="logo">
          <h2>
            <img src="@/assets/img/logo-text-rounded-rectangle-200-52.png" alt="/" />
          </h2>
        </div>
      </a>
      <h2>密码重置</h2>
    </div>


    <el-form-item label="邮箱" prop="email">
      <el-input v-model="fogetPasswordForm.email" />
    </el-form-item>

    <el-form-item label="验证码" prop="captcha">
      <el-input class="email-code" v-model="fogetPasswordForm.captcha" />
      <button class="btn-captcha" type="button" @click="openSlideVerify" :disabled="btnCaptchaState.disabled">
        {{ captcha }}
      </button>
    </el-form-item>

    <el-form-item label="新密码" prop="password">
      <el-input type="password" v-model="fogetPasswordForm.password" />
    </el-form-item>

    <el-form-item label="确认密码" prop="rePassword">
      <el-input type="password" v-model="fogetPasswordForm.rePassword" />
    </el-form-item>

    <div class="btn-submit">
      <el-form-item>
        <el-button type="primary" @click="submitForm(fogetPasswordFormRef)">重置密码</el-button>
      </el-form-item>
    </div>
    <div class="go-home">
      <router-link to="/" class="link">
        <span>首页</span>
      </router-link>
      <span> | </span>
      <router-link to="/login" class="link">
        <span>登录</span>
      </router-link>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

import type { AxiosResponse } from 'axios'
import SlideVerify from '@/components/common/SlideVerify.vue'
import { ShowMsgTip } from '@/utils/Message.ts'
import { MsgType } from '@/components/common/index.ts'

import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S

import type { CheckEmailRequest, CheckEmailResponse } from '@/api/user/CheckEmail.ts'
import { CheckEmailByJosn } from '@/api/user/CheckEmail.ts'

import type { ResetPasswordRequest, ResetPasswordResponse } from '@/api/user/ResetPassword.ts'
import { resetPasswordByJosn } from '@/api/user/ResetPassword.ts'

import type { CaptchaSendRequest, CaptchaSendResponse } from '@/api/utils/CaptchaSend.ts'
import { captchaSendByJosn } from '@/api/utils/CaptchaSend.ts'

import { getPublicIp } from '@/utils/IP.ts'

import type { CaptchaCheckRequest } from '@/api/utils/CaptchaCheck.ts'
import { captchaCheckByJosn } from '@/api/utils/CaptchaCheck.ts'

import { ResponseCode } from '@/api/responseCode.ts'

import { encryptData } from '@/utils/Encrypt.ts'
import router from '@/router/index.ts'

interface ResetPasswordForm {
  email: string
  captcha: string
  password: string
  rePassword: string
}

// 表单label位置 top | left | right
const labelPosition = ref('top')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('default')

// 表单实例
const fogetPasswordFormRef = ref<FormInstance>()

// 表单数据
const fogetPasswordForm = reactive<ResetPasswordForm>({
  email: 'jiaopengzi@qq.com',
  captcha: '123456',
  password: '123QWEasd',
  rePassword: '123QWEasd',
})

/**
 * @description: 确认密码 异步函数
 * @return  Promise<void> 两次输入的密码不一致返回 Promise.reject()，否则返回 Promise.resolve()
 */
async function checkRePassword(): Promise<void> {
  try {
    if (fogetPasswordForm.rePassword === '') {
      throw new Error('请再次输入密码')
    } else if (fogetPasswordForm.rePassword !== fogetPasswordForm.password) {
      throw new Error('两次输入的密码不一致')
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
  rule: any,
  value: string,
  callback: (error?: string | Error | undefined) => void
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
      email: fogetPasswordForm.email,
      ip: await getPublicIp(),
    }
    console.log("==========>发送验证码")
    // const requestData: string = encryptData(JSON.stringify(req)) // 将请求对象 req 转换为字符串 并加密内容
    const requestData: string = JSON.stringify(req) // 将请求对象 req 转换为字符串
    const res: AxiosResponse = await captchaSendByJosn(requestData) // 发送请求，并返回Promise
    const resStr: string = JSON.stringify(res) // 将 res 转换字符串
    const resObj: CaptchaSendResponse = JSON.parse(resStr) // 将 resStr 转换为对象

    if (resObj.code !== ResponseCode.CaptchaSendSuccess && resObj.data !== null) {
      // 历遍 data 中的错误信息 并抛出第一个key错误信息 停止循环
      for (const key in resObj.data) {
        if (Object.prototype.hasOwnProperty.call(resObj.data, key)) {
          throw new Error(resObj.data[key]) // 抛出错误信息 
        }
      }
    }
    if (resObj.code !== ResponseCode.CaptchaSendSuccess && resObj.data === null) {
      throw new Error(resObj.msg) // 抛出错误信息 
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
    email: fogetPasswordForm.email,
  }

  // const requestData: string = encryptData(JSON.stringify(req))  // 将请求对象 req 转换为字符串 并加密内容
  const requestData: string = JSON.stringify(req)  // 将请求对象 req 转换为字符串

  try {
    // 发送请求，并返回Promise
    const res: AxiosResponse = await CheckEmailByJosn(requestData)

    // 将 res 转换字符串
    const resStr: string = JSON.stringify(res)
    // 将 resStr 转换为对象
    const resObj: CheckEmailResponse = JSON.parse(resStr)

    if (resObj.code !== ResponseCode.UserEmailExist) {
      throw new Error(resObj.msg)
    }
  } catch (err: unknown) {
    console.log(err)
    throw err
  }
}

/**
 * @description: 用户名查重 Validator
 * @param rule 无用参数
 * @param value 无用参数
 * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
 */
function checkEmailValidator(
  rule: any,
  value: string,
  callback: (error?: string | Error | undefined) => void
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
      email: fogetPasswordForm.email,
      captcha: fogetPasswordForm.captcha,
    }
    // const requestData: string = encryptData(JSON.stringify(req)) // 将请求对象 req 转换为字符串 并加密内容
    const requestData: string = JSON.stringify(req) // 将请求对象 req 转换为字符串
    const res: AxiosResponse = await captchaCheckByJosn(requestData) // 发送请求，并返回Promise
    const resStr: string = JSON.stringify(res) // 将 res 转换字符串
    const resObj: CaptchaSendResponse = JSON.parse(resStr) // 将 resStr 转换为对象

    if (resObj.code !== ResponseCode.CaptchaCheckSuccess) {
      throw new Error(resObj.msg)
    }
  } catch (err: unknown) {
    console.log(err)
    throw err
  }
}

function checkCaptchaValidator(
  rule: any,
  value: string,
  callback: (error?: string | Error | undefined) => void
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
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    {
      pattern: /^[\w.!#$%&'*+/=?^_`{|}~-]+@[\w-]+(\.\w+)+$/,
      message: '请输入有效的邮箱',
      trigger: 'blur',
    },
    // 邮箱查重
    { validator: checkEmailValidator, trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码为6位的数字', trigger: 'blur' },
    { validator: checkCaptchaValidator, trigger: 'blur' },

  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    // 必须包含：大小写字母+数字,长度:6-64 特殊字符可有可无
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?;:|[\]\\{}<>`~_+=-]{6,64}$/,
      message: '必须包含：大小写字母+数字,长度:6-64',
      trigger: 'change',
    },
  ],
  rePassword: [{ required: true, validator: rePasswordValidator, trigger: 'blur' }],
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
        password: fogetPasswordForm.password,
        re_password: fogetPasswordForm.rePassword,
        email: fogetPasswordForm.email,
      }

      // const requestData: string = encryptData(JSON.stringify(req))// 将请求对象 req 转换为字符串 并加密内容
      const requestData: string = JSON.stringify(req)// 将请求对象 req 转换为字符串
      const res: AxiosResponse<ResetPasswordResponse> = await resetPasswordByJosn(requestData)// 发送请求，并返回Promise
      const resStr: string = JSON.stringify(res)// 将 res 转换字符串
      const resObj: ResetPasswordResponse = JSON.parse(resStr)// 将 resStr 转换为对象

      if (resObj.code === ResponseCode.UserResetPasswordSuccess) {
        // 显示注册成功提示
        ShowMsgTip(MsgType.success, resObj.msg, 6000)

        // 跳转到登录页面
        setTimeout(() => {
          router.push({ name: 'login' });
        }, 3000);
      } else {
        // 注册失败
        // console.log("注册失败");
        ShowMsgTip(MsgType.error, resObj.msg, 0)
      }
      console.log('submit!')
    }
  })
}


// 添加 showSlideVerify 响应式变量
const showSlideVerify = ref(false)

// 显示滑块验证
const openSlideVerify = () => {

  // 显示滑块验证
  console.log('打开滑块验证')
  showSlideVerify.value = true
}

const captcha = ref('发送验证码')
const btnCaptchaState = reactive({ disabled: false })

// 发送邮箱验证码

const sendcaptcha = async () => {
  // 关闭滑块验证
  showSlideVerify.value = false

  const emailResult = await fogetPasswordFormRef.value?.validateField('email').catch(() => false)
  if (!emailResult) {
    ShowMsgTip(MsgType.error, '请输入正确的邮箱地址。', 0)
    console.log('请输入邮箱')
    return
  }

  if (emailResult) {

    btnCaptchaState.disabled = true // 按钮设置不能点击状态

    // 发送验证码
    checkSendCaptcha()
      .then(() => {
        // 成功发送验证码
        ShowMsgTip(MsgType.success, '验证码已发送到邮箱。', 6000)
      })
      .catch((err: Error) => {
        // 错误提示
        ShowMsgTip(MsgType.error, err.message, 0)
      })

    // 按钮设置不能点击状态
    let timer = 5
    captcha.value = `${timer}s后重新发送`
    const interval = setInterval(() => {
      timer--
      if (timer === 0) {
        clearInterval(interval)
        captcha.value = '发送验证码'
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

<style lang="less" scoped>
.fogetPassword-form {
  width: 360px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  /* 添加阴影效果 */
  background-color: #eee;
}

@media (max-width: @width-page-main-pc) {
  .fogetPassword-form {
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

.go-home {
  text-align: center;
  margin-top: 20px;
}

a {
  color: #409eff;
}

.go-home span {
  color: #aaa;
}

.btn-submit {
  text-align: center;
}

.btn-submit .el-form-item {
  display: inline-block;
}
</style>
@/utils/Encrypt
@/api/user/CheckUserName@/api/user/CheckUserName
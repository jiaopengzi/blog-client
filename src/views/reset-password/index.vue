<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-22 16:05:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-23 19:46:26
 * @FilePath     : \blog-client\src\views\reset-password\index.vue
 * @Description  : 重置密码
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="reset-password-page">
    <!-- 添加滑动验证组件：SlideVerify -->
    <SlideVerify v-if="showSlideVerify" @on-close="closeSlideVerify" @on-success="sendcaptcha"></SlideVerify>
    <el-form :label-position="labelPosition" label-width="100px" ref="fogetPasswordFormRef" :model="fogetPasswordForm"
      :rules="rules" class="fogetPassword-form" :size="formSize" status-icon>
      <div class="header-main">
        <a :href="routeObj.home.path">
          <div class="logo">
            <h2>
              <img src="@/assets/img/logo-text-rounded-rectangle-200-52.png" :alt="routeObj.home.path" />
            </h2>
          </div>
        </a>
        <h2>密码重置</h2>
      </div>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="fogetPasswordForm.email" />
      </el-form-item>

      <el-form-item label="验证码" prop="captcha">
        <el-input class="email-code" v-model.trim="fogetPasswordForm.captcha" />
        <button class="btn-captcha" type="button" @click="openSlideVerify" :disabled="btnCaptchaState.disabled">
          {{ captcha }}
        </button>
      </el-form-item>

      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model.trim="fogetPasswordForm.password" />
      </el-form-item>

      <el-form-item label="确认密码" prop="rePassword">
        <el-input type="password" v-model.trim="fogetPasswordForm.rePassword" />
      </el-form-item>

      <div class="btn-submit">
        <el-form-item>
          <el-button type="primary" @click="submitForm(fogetPasswordFormRef as FormInstance)">重置密码</el-button>
        </el-form-item>
      </div>
      <div class="go-home">
        <router-link :to="routeObj.home.path" class="link">
          <span>首页</span>
        </router-link>
        <span> | </span>
        <router-link :to="routeObj.login.path" class="link">
          <span>登录</span>
        </router-link>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, useTemplateRef } from 'vue'
import { ShowMsgTip } from '@/utils/message'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
import type { CheckEmailRequest } from '@/api/user/checkEmail'
import { CheckEmailAPI } from '@/api/user/checkEmail'
import type { ResetPasswordRequest } from '@/api/user/resetPassword'
import { resetPasswordAPI } from '@/api/user/resetPassword'
import type { CaptchaSendRequest } from '@/api/captcha/send'
import { captchaSendAPI } from '@/api/captcha/send'

import type { CaptchaCheckRequest } from '@/api/captcha/check'
import { captchaCheckAPI } from '@/api/captcha/check'
import { ResponseCode, CaptchaPurpose } from '@/api/responseCode'
import { routeObj } from '@/router/routeAll'
import router from '@/router/index'
import type { ResetPasswordForm } from '@/views/reset-password'

import SlideVerify from '@/components/common/slide-verify'

// 定义组件名称
defineOptions({ name: 'ResetPassword' })

// 表单label位置 top | left | right
const labelPosition = ref('top')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('default')

// 表单实例
const fogetPasswordFormRef = useTemplateRef<FormInstance>("fogetPasswordFormRef")

// 表单数据
const fogetPasswordForm = reactive<ResetPasswordForm>({
  email: 'jiaopengzi@qq.com',
  captcha: '123456',
  password: '123QWEasd123',
  rePassword: '123QWEasd123',
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
      email: fogetPasswordForm.email,
      purpose: CaptchaPurpose.ResetPassword,
    }
    console.log('==========>发送验证码')
    const { data } = await captchaSendAPI(req)

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
    email: fogetPasswordForm.email,
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
 * @param rule 无用参数
 * @param value 无用参数
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
      email: fogetPasswordForm.email,
      captcha: fogetPasswordForm.captcha,
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
        captcha: fogetPasswordForm.captcha,
        password: fogetPasswordForm.password,
        re_password: fogetPasswordForm.rePassword,
        email: fogetPasswordForm.email,
      }

      const { data } = await resetPasswordAPI(req) // 将 resStr 转换为对象

      if (data.code === ResponseCode.UserResetPasswordSuccess) {
        // 显示注册成功提示
        ShowMsgTip(ShowMsgTip.MsgType.success, data.msg, 6000)

        // 跳转到登录页面
        setTimeout(() => {
          router.push({ name: 'login' })
        }, 3000)
      } else {
        // 注册失败
        // console.log("注册失败");
        ShowMsgTip(ShowMsgTip.MsgType.error, data.msg, 0)
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
    ShowMsgTip(ShowMsgTip.MsgType.error, '请输入正确的邮箱地址。', 0)
    console.log('请输入邮箱')
    return
  }

  if (emailResult) {
    btnCaptchaState.disabled = true // 按钮设置不能点击状态

    // 发送验证码
    checkSendCaptcha()
      .then(() => {
        // 成功发送验证码
        ShowMsgTip(ShowMsgTip.MsgType.success, '验证码已发送到邮箱。', 6000)
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

<style lang="scss" scoped>
.reset-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

@include respond-to('pc') {
  .fogetPassword-form {
    width: 360px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    /* 添加阴影效果 */
    background-color: #eee;
  }
}

@include respond-to('pad') {
  .fogetPassword-form {
    width: 360px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    /* 添加阴影效果 */
    background-color: #eee;
  }
}

@include respond-to('phone') {
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

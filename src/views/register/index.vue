<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-22 16:05:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-23 19:46:14
 * @FilePath     : \blog-client\src\views\register\index.vue
 * @Description  : 注册
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="register-page">
    <!-- 添加滑动验证组件：SlideVerify -->
    <SlideVerify
      v-if="showSlideVerify"
      @on-close="closeSlideVerify"
      @on-success="sendcaptcha"
    ></SlideVerify>
    <el-form
      :label-position="labelPosition"
      label-width="100px"
      ref="registerFormRef"
      :model="registerForm"
      :rules="rules"
      class="register-form"
      :size="formSize"
      status-icon
    >
      <div class="header-main">
        <a :href="routeObj.home.path">
          <div class="logo">
            <h2>
              <img
                src="@/assets/img/logo-text-rounded-rectangle-200-52.png"
                :alt="routeObj.home.path"
              />
            </h2>
          </div>
        </a>
        <h2>账号注册</h2>
      </div>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model.trim="registerForm.userName" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="registerForm.email" />
      </el-form-item>

      <el-form-item label="验证码" prop="captcha">
        <el-input class="email-code" v-model.trim="registerForm.captcha" />
        <button
          class="btn-captcha"
          type="button"
          @click="openSlideVerify"
          :disabled="btnCaptchaState.disabled"
        >
          {{ captcha }}
        </button>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model.trim="registerForm.password" />
      </el-form-item>

      <el-form-item label="确认密码" prop="rePassword">
        <el-input type="password" v-model.trim="registerForm.rePassword" />
      </el-form-item>

      <el-form-item prop="acceptedTerms">
        <el-checkbox
          v-model="registerForm.acceptedTerms"
          value="同意条款"
          name="acceptedTerms"
        />我已同意并接受：<a href="/">《服务条款》</a>
      </el-form-item>

      <div class="btn-submit">
        <el-form-item>
          <el-button type="primary" @click="submitForm(registerFormRef as FormInstance)"
            >注册</el-button
          >
          <el-button @click="resetForm(registerFormRef as FormInstance)">重置</el-button>
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
import { reactive, ref, toRef, useTemplateRef } from 'vue'
import { ShowMsgTip } from '@/utils/message'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
import type { RegisterRequest } from '@/api/user/register'
import { RegisterAPI } from '@/api/user/register'
import { ResponseCode } from '@/api/responseCode'
import { routeObj } from '@/router/routeAll'
import router from '@/router/index'
import type { RegisterForm } from '@/views/register'
import { useFormValidation } from '@/components/hooks/useFormValidation'
import { RegexPatterns } from '@/utils/regexPatterns'

import SlideVerify from '@/components/common/slide-verify'

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: 'Register' })

// 表单label位置 top | left | right
const labelPosition = ref('top')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('default')

// 表单实例
const registerFormRef = useTemplateRef<FormInstance>('registerFormRef')

// 表单数据
const registerForm = reactive<RegisterForm>({
  // userName: '',
  // email: '',
  // captcha: '',
  // password: '',
  // rePassword: '',
  // acceptedTerms: [],
  userName: 'jiaopengzi',
  email: 'jiaopengzi@qq.com',
  captcha: '123456',
  password: '123QWEasd',
  rePassword: '123QWEasd',
  acceptedTerms: false
})

const userNameRef = toRef(registerForm, 'userName')
const emailRef = toRef(registerForm, 'email')
const passwordRef = toRef(registerForm, 'password')
const rePasswordRef = toRef(registerForm, 'rePassword')
const captchaRef = toRef(registerForm, 'captcha')
const acceptedTermsRef = toRef(registerForm, 'acceptedTerms')

// hook 函数
const {
  checkSendCaptcha,
  checkUserNameValidator,
  checkEmailValidator,
  checkCaptchaValidator,
  rePasswordValidator,
  acceptedTermsValidator
} = useFormValidation({
  FormUserName: userNameRef,
  FormEmail: emailRef,
  FormPassword: passwordRef,
  FormRePassword: rePasswordRef,
  FormCaptcha: captchaRef,
  FormAcceptedTerms: acceptedTermsRef
})

/**
 * @description: 表单校验规则
 * @return  FormRules<RegisterForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<RegisterForm>>({
  userName: [
    { required: true, message: '请输入用户名！', trigger: 'blur' },
    // { pattern: /^[a-z0-9]{6,20}$/, message: '用户名长度:6-20的小写字母或数字', trigger: 'change' },
    {
      pattern: new RegExp(RegexPatterns.UserName),
      message: '用户名长度:6-20的小写字母或数字',
      trigger: 'change'
    },
    // 用户查重
    { validator: checkUserNameValidator, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入小写的邮箱地址', trigger: 'blur' },
    {
      pattern: new RegExp(RegexPatterns.Email),
      message: '请输入有效的邮箱',
      trigger: 'blur'
    },
    // 邮箱查重
    { validator: checkEmailValidator, trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: new RegExp(RegexPatterns.Captcha), message: '验证码为6位的数字', trigger: 'blur' },
    { validator: checkCaptchaValidator, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    // 必须包含：大小写字母+数字,长度:6-64 特殊字符可有可无
    {
      pattern: new RegExp(RegexPatterns.Password),
      message: '必须包含：大小写字母+数字,长度:6-64',
      trigger: 'change'
    }
  ],
  rePassword: [{ required: true, validator: rePasswordValidator, trigger: 'blur' }],

  acceptedTerms: [
    { type: 'boolean', required: true, validator: acceptedTermsValidator, trigger: 'change' }
  ]
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
      const req: RegisterRequest = {
        captcha: registerForm.captcha,
        user_name: registerForm.userName,
        password: registerForm.password,
        re_password: registerForm.rePassword,
        email: registerForm.email
      }

      console.log('req:', req)
      const { data } = await RegisterAPI(req)

      if (data.code === ResponseCode.UserRegisterSuccess) {
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

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 显示滑块验证 状态
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

  // 手动触发 FormInstance 的校验，校验 userName 和 email 字段
  const userNameResult = await registerFormRef.value?.validateField('userName').catch(() => false)
  if (!userNameResult) {
    ShowMsgTip(ShowMsgTip.MsgType.error, '请输入正确的用户名。', 0)
    return
  }

  const emailResult = await registerFormRef.value?.validateField('email').catch(() => false)
  if (!emailResult) {
    ShowMsgTip(ShowMsgTip.MsgType.error, '请输入正确的邮箱地址。', 0)
    console.log('请输入邮箱')
    return
  }

  if (userNameResult && emailResult) {
    btnCaptchaState.disabled = true // 按钮设置不能点击状态

    // 发送验证码
    checkSendCaptcha(registerForm.email)
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
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

@include respond-to('pc') {
  .register-form {
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
  .register-form {
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
  .register-form {
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
  /* 展示下划线 */
  // text-decoration: underline;
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
@/utils/Encrypt @/api/user/CheckUserName@/api/user/CheckUserName
@/api/user/checkEmail@/api/user/checkEmail@/api/user/register@/api/user/register@/api/utils/captchaCheck@/api/utils/captchaCheck@/api/utils/captchaSend@/api/utils/captchaSend
@/utils/ip@/utils/message

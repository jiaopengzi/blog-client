<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 19:38:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-04 23:00:34
 * @FilePath     : \blog-client\src\components\common\LoginPage.vue
 * @Description  : 登录
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->


<template>
  <!-- 添加滑动验证组件：SlideVerify -->

  <SlideVerify v-if="showSlideVerify" @on-close="closeSlideVerify" @on-success="login"></SlideVerify>
  <el-form :label-position="labelPosition" label-width="100px" ref="loginFormRef" :model="loginForm" :rules="rules"
    class="login-form" :size="formSize" status-icon>
    <div class="header-main">
      <a href="/">
        <div class="logo">
          <h2>
            <img src="@/assets/img/logo-text-rounded-rectangle-200-52.png" alt="/" />
          </h2>
        </div>
      </a>
      <h2>账号登录</h2>
    </div>
    <el-form-item label="用户名" prop="loginName">
      <el-input v-model="loginForm.loginName" placeholder="请输入用户名或邮箱" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="loginForm.password" placeholder="大小写字母 + 数字, 长度:6-64" />
    </el-form-item>
    <div class="btn-submit">
      <el-form-item>
        <el-button type="primary" @click="openSlideVerify">登录</el-button>
      </el-form-item>
    </div>
    <div class="go-home">
      <router-link to="/" class="link">
        <span>首页</span>
      </router-link>
      <span> | </span>
      <router-link to="/register" class="link">
        <span>注册</span>
      </router-link>
      <span> | </span>
      <router-link to="/reset-password" class="link">
        <span>忘记密码</span>
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
import type { LoginRequest, LoginResponse } from '@/api/user/Login.ts'
import { loginByJosn } from '@/api/user/Login.ts'
import { ResponseCode } from '@/api/responseCode.ts'
import router from '@/router/index.ts'

interface LoginForm {
  loginName: string
  password: string
}

// 表单label位置 top | left | right
const labelPosition = ref('top')

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('default')

// 表单实例
const loginFormRef = ref<FormInstance>()

// 表单数据
const loginForm = reactive<LoginForm>({
  loginName: 'jiaopengzi1@qq.com',
  password: '123QWEasd',
})


/**
 * @description: 表单校验规则
 * @return  FormRules<loginForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<LoginForm>>({
  loginName: [
    { required: true, message: '请输入用户名！', trigger: 'blur' },
    { pattern: /^[a-z0-9]{6,20}/, message: '用户名长度:6-20的小写字母或数字', trigger: 'change' },
    // 用户查重
    // { validator: checkUserNameValidator, trigger: 'blur' },
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

})

/**
 * @description: 提交表单
 * @param formEl 表单实例
 * @return  void
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      // 创建请求对象 加密内容
      const req: LoginRequest = {
        login_name: loginForm.loginName,
        password: loginForm.password,
      }

      // const requestData: string = encryptData(JSON.stringify(req))// 将请求对象 req 转换为字符串 并加密内容
      const requestData: string = JSON.stringify(req)// 将请求对象 req 转换为字符串 并加密内容
      const res: AxiosResponse<LoginResponse> = await loginByJosn(requestData)// 发送请求，并返回Promise
      const resStr: string = JSON.stringify(res)// 将 res 转换字符串
      const resObj: LoginResponse = JSON.parse(resStr).data// 将 resStr 转换为对象

      if (resObj.code === ResponseCode.UserLoginSuccess) {
        // 显示登录成功提示
        ShowMsgTip(MsgType.success, resObj.msg, 3000)

        // 登录成功 存入token
        localStorage.setItem('access_token', resObj.data.access_token)

        // 登录成功 跳转到首页
        setTimeout(() => {
          router.push({ path: '/' }); // 跳转到首页
          // router.go(-1); // 返回上一页
        }, 1000);
      } else {
        // 登录失败
        // console.log("登录失败");
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


// 关闭滑块验证
const closeSlideVerify = () => {
  showSlideVerify.value = false
}

const login = () => {
  // 关闭滑块验证
  showSlideVerify.value = false
  submitForm(loginFormRef.value)
  console.log('登录')
}

</script>

<style lang="less" scoped>
.login-form {
  width: 360px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  /* 添加阴影效果 */
  background-color: #eee;
}

@media (max-width: @width-page-main-pc) {
  .login-form {
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

.go-home {
  text-align: center;
  margin-top: 20px;
}

a {
  color: #aaa;
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

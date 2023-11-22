<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-22 16:05:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-22 16:07:23
 * @FilePath     : \blog-client\src\views\LoginView.vue
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
      <a :href="routeObj.home.path">
        <div class="logo">
          <h2>
            <img src="@/assets/img/logo-text-rounded-rectangle-200-52.png" :alt="routeObj.home.path" />
          </h2>
        </div>
      </a>
      <h2>账号登录</h2>
    </div>
    <el-form-item label="用户名" prop="loginName">
      <el-input v-model.trim="loginForm.loginName" placeholder="请输入用户名或邮箱" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model.trim="loginForm.password" placeholder="大小写字母 + 数字, 长度:6-64" />
    </el-form-item>
    <div class="btn-submit">
      <el-form-item>
        <el-button type="primary" @click="openSlideVerify">登录</el-button>
      </el-form-item>
    </div>
    <div class="social">
      <button class="social-btn" @click="loginByWeChat">

        <Icon name="wechat" customClass="iconfont icon-wechat" />
      </button>
      <button class="social-btn" @click="loginByQQ">
        <Icon name="qq" customClass="iconfont icon-qq" />
      </button>
    </div>
    <div class="go-home">
      <router-link :to="routeObj.home.path" class="link">
        <span>首页</span>
      </router-link>
      <span> | </span>
      <router-link :to="routeObj.register.path" class="link">
        <span>注册</span>
      </router-link>
      <span> | </span>
      <router-link :to="routeObj.resetPassword.path" class="link">
        <span>忘记密码</span>
      </router-link>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import SlideVerify from '@/components/common/SlideVerify.vue'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
import router from '@/router/index'
import { routeObj } from '@/router/routeAll'
import { useUserStore } from '@/stores/user'

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
  loginName: 'jiaopengzi@qq.com',
  password: '123QWEasd',
})

/**
 * @description: 表单校验规则
 * @return  FormRules<loginForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<LoginForm>>({
  loginName: [
    { required: true, message: '请输入用户名！', trigger: 'blur' },
    {
      pattern: /^([a-z0-9._%+-]+)@[a-z0-9.-]+\.[a-z]{2,}$|^[a-z0-9]{6,20}$/,
      message: '6-20位小写字母或数字 | 邮箱',
      trigger: 'change',
    },
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
const userStore = useUserStore()

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      await userStore.login(loginForm.loginName, loginForm.password) // 登录
      if (userStore.getIsLogin) {
        router.push({ path: routeObj.home.path }) // 登录成功 跳转到首页
      }
    }
  })
}

// 添加 showSlideVerify 响应式变量
const showSlideVerify = ref(false)

const openSlideVerify = () => {
  showSlideVerify.value = true // 显示滑块验证
}

const closeSlideVerify = () => {
  showSlideVerify.value = false // 关闭滑块验证
}

const login = () => {
  // 关闭滑块验证
  showSlideVerify.value = false
  submitForm(loginFormRef.value)
  // console.log('登录')
}

const loginByWeChat = () => {
  userStore.loginByWeChat()
}

const loginByQQ = () => {
  userStore.loginByQQ()
}
</script>

<style lang="scss" scoped>
.login-form {
  width: 360px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  /* 添加阴影效果 */
  background-color: #eee;
}

@media (max-width: pc.$width-page-main) {
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

.social {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.social-btn {
  border: none;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  margin-right: 10px;
}

.iconfont {
  font-size: 3em;
  color: #222;
}

.icon-wechat {
  fill: #1aad19;
}

.icon-qq {
  fill: #1296db;
}
</style>

<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-10 20:45:20
 * @FilePath     : \blog-client\src\components\common\mobile\HeaderMobileNav.vue
 * @Description  : 头部导航 移动端
 * @blog         : https://jiaopengzi.com
 * Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="login" v-if="!isLogin">
    <router-link to="/login" class="link">
      <span>登录</span>
    </router-link>
    <span>/</span>
    <router-link to="/register" class="link">
      <span>注册</span>
    </router-link>
  </div>
  <div class="login" v-if="isLogin">
    <router-link to="/info" class="link">
      <InitialAvatar :name="data.user.user_display_name" :avatar="data.user.user_avatar" />
    </router-link>
  </div>
  <div class="nav">
    <ul>
      <li>
        <router-link to="/" class="link">
          <span class="titile">首页</span>
        </router-link>
      </li>
      <li>
        <router-link to="/blog" class="link">
          <span class="iconfont icon-article"></span>
          <span class="titile">文章</span>
        </router-link>
      </li>
      <li>
        <router-link to="/video" class="link">
          <span class="iconfont icon-video"></span>
          <span class="titile">视频课</span>
        </router-link>
      </li>
      <li>
        <router-link to="/doc" class="link">
          <span class="iconfont icon-doc"></span>
          <span class="titile">文档</span>
        </router-link>
      </li>
      <li>
        <router-link to="/tool" class="link">
          <span class="iconfont icon-tool"></span>
          <span class="titile">工具下载</span>
        </router-link>
      </li>
      <li>
        <router-link to="/vip" class="link">
          <span class="iconfont icon-vip-red icon-red"></span>
          <span class="titile">加入VIP</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
// 引用图标
import '@/components/icons/iconfont.css'
import { onBeforeMount } from 'vue'

import InitialAvatar from '@/components/common/InitialAvatar.vue';
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'


// 状态是否登录
const userStore = useUserStore()
let { data, isLogin } = storeToRefs(userStore)


onBeforeMount(() => { // 组件挂载前
  // 通过本地信息 获取用户信息
  userStore.getUserInfoByToken()
})



</script>
<style scoped lang="less">
.login {
  margin-top: 100px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  /* Aligns content horizontally */
  align-items: center;
  /* Aligns content vertically */
  // height: 40px;
  // line-height: 40px;
  text-align: center;
  font-size: 16px;
  color: #888;
}

.login .link span {
  border: 1px solid #888;
  width: 60px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  display: inline-block;
  margin: 0 10px;
}

.nav ul {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
}

.nav ul li {
  height: 100%;
  width: 80%;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #888;
  padding: 5% 10%;
  border-bottom: 1px solid #ebebeb;
}

.nav ul li:first-child {
  border-top: 1px solid #ebebeb;
}

.link {
  display: flex;
  /* 使用 Flexbox 布局 */
  align-items: center;
  /* 垂直居中对齐 */
  text-decoration: none;
  /* 可选：去除链接的下划线 */
}

span {
  display: flex;
  /* 使用 Flexbox 布局 */
  align-items: center;
  /* 垂直居中对齐 */
}

.iconfont {
  font-size: 1em;
  color: #222;
  margin-right: 4px;
}

.icon-red {
  color: rgb(222, 0, 0);
}
</style>

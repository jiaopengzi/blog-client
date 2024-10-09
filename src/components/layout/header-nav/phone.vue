<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 20:57:06
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-23 19:43:02
 * @FilePath     : \blog-client\src\components\layout\header-nav\phone.vue
 * @Description  : 导航栏 手机端
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="container">
    <div class="login" v-if="!isLogin">
      <router-link :to="routeObj.login.path" class="link">
        <span>登录</span>
      </router-link>
      <router-link :to="routeObj.register.path" class="link">
        <span>注册</span>
      </router-link>
    </div>
    <div class="login" v-if="isLogin">
      <router-link :to="routeObj.userInfo.path" class="link">
        <AvatarInitials :name="data.user.user_display_name" :avatar="data.user.user_avatar" />
      </router-link>
    </div>
    <div class="nav">
      <ul>
        <li v-for="(item, index) in props.navData" :key="index">
          <router-link :to="item.path" class="link">
            <Icon
              v-if="item.iconKey"
              :name="item.iconKey"
              :customClass="'my-icon ' + item.customClass"
            />
            <span class="titile">{{ item.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { routeObj } from '@/router/routeAll'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import type { HeaderNavPropsItem } from '@/components/layout/header-nav'

import AvatarInitials from '@/components/common/avatar-initials'

defineOptions({ name: 'HeaderNavPhone' })

const props = defineProps<{ navData: HeaderNavPropsItem[] }>()

// 状态是否登录
const userStore = useUserStore()
let { data, isLogin } = storeToRefs(userStore)

onBeforeMount(() => {
  // 组件挂载前
  // 通过本地信息 获取用户信息
  userStore.getUserInfoByToken()
})
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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

    .link {
      margin: 0 5px;

      span {
        border: 1px solid #888;
        width: 60px;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        display: inline-block;
        // padding: 0 2px;
      }
    }
  }

  .nav {
    width: 100%;

    ul {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      height: 100%;
      width: 100%;

      :first-child {
        border-top: 1px solid #ebebeb;
      }

      li {
        height: 100%;
        width: 80%;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: #888;
        // padding: 0 10%;
        margin: 0 10%;
        border-bottom: 1px solid #ebebeb;

        // 让 link 充满整个 li
        .link {
          display: flex;
          /* 使用 Flexbox 布局 */
          align-items: center;
          /* 垂直居中对齐 */
          text-decoration: none;
          /* 可选：去除链接的下划线 */
          color: #333;
          border: none;
          line-height: 3em;
        }

        span {
          display: flex;
          /* 使用 Flexbox 布局 */
          align-items: center;
          /* 垂直居中对齐 */
        }
      }
    }
  }
}

.my-icon {
  font-size: 20px;
  fill: #333;
  margin-right: 4px;
}
</style>

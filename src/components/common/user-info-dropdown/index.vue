<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 10:19:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 10:22:52
 * @FilePath     : \blog-client\src\components\common\user-info-dropdown\index.vue
 * @Description  : 显示用户信息下拉菜单
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="wrapper">
        <div class="avatar" @mouseenter="() => toggleDropdown(true)" @mouseleave="() => toggleDropdown(false)">
            <AvatarInitials :name="data.user.user_display_name" :avatar="avatar" />
        </div>
        <div id="dropdown" v-if="showDropdown" class="dropdown" @mouseenter="() => toggleDropdown(true)"
            @mouseleave="() => toggleDropdown(false)">
            <div class="item">
                <p class="username">{{ data.user.user_display_name }}</p>
            </div>
            <div class="item user-center-btn">
                <button @click="userCenterBtn">用户中心</button>
            </div>
            <div class="item logout-btn">
                <button @click="logout">退出</button>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import AvatarInitials from '@/components/common/avatar-initials' // 导入 AvatarInitials 组件
import router from '@/router/index'
import { routeObj } from '@/router/routeAll'

defineOptions({ name: 'UserInfoDropdown' })

const userStore = useUserStore()
let { data, avatar } = storeToRefs(userStore)
let timer: ReturnType<typeof setTimeout> // 定时器

const showDropdown = ref(false) // 是否显示下拉菜单

// 切换下拉菜单的显示状态
const toggleDropdown = (show: boolean) => {
    clearTimeout(timer) // 清除定时器

    if (show) {
        showDropdown.value = true
    } else {
        timer = setTimeout(() => {
            showDropdown.value = false
        }, 80)
    }
}

// 跳转到用户中心
const userCenterBtn = () => {
    router.push(routeObj.userInfo.path)
}

// 退出登录
const logout = async () => {
    await userStore.logout()
}
</script>
  
<style scoped>
.wrapper {
    position: relative;
    display: inline-block;
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    padding: 5px;
    margin-top: 10px;
    /* margin-top: 0px 下拉菜单和头像之间的间隙 紧挨着才能在鼠标移动的时候不会突然消失*/
    background-color: #fdfdfd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    z-index: 999;
}

.item {
    /* 元素居左 */
    text-align: center;
    /* 上下外边距都为 5px */
    margin: 5px 5px;
}

button {
    width: 100%;
    border: none;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 15px;
    padding: 5px 10px;
    margin-bottom: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #ddd;
}

.username {
    /* 文字超出的时候显示省略号 */
    overflow: hidden;
    font-size: 15px;
    color: #555;
    margin-bottom: 10px;
    min-width: 100px;
}
</style>
  
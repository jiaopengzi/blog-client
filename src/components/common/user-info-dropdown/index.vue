<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 10:19:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-04 21:57:09
 * @FilePath     : \blog-client\src\components\common\user-info-dropdown\index.vue
 * @Description  : 显示用户信息下拉菜单
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <el-dropdown>
        <span>
            <AvatarInitials :name="data.user.user_display_name" :avatar="avatar" />
        </span>

        <template #dropdown>
            <el-dropdown-menu class="menu">
                <el-dropdown-item>
                    <h3 class="nickname">{{ data.user.user_display_name }}</h3>
                </el-dropdown-item>
                <el-dropdown-item>
                    <button @click="userCenterBtn">用户中心</button>
                </el-dropdown-item>
                <el-dropdown-item v-if="hasPermissionLoginAdmin">
                    <button @click="userAdminBtn">后台管理</button>
                </el-dropdown-item>
                <el-dropdown-item>
                    <button @click="logout">退出</button>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import router from '@/router/index'
import { routeObj } from '@/router/routeAll'
import { PermissionNames } from '@/utils/permissionRole'
import { onMounted, ref, defineAsyncComponent } from 'vue'

// import AvatarInitials from '@/components/common/avatar-initials' // 导入 AvatarInitials 组件
const AvatarInitials = defineAsyncComponent(() => import('@/components/common/avatar-initials'))

defineOptions({ name: 'UserInfoDropdown' })

const userStore = useUserStore()
let { data, avatar } = storeToRefs(userStore)

// 跳转到用户中心
const userCenterBtn = () => {
    router.push(routeObj.userInfo.path)
}

// 跳转到后台管理
const userAdminBtn = () => {
    router.push(routeObj.admin.path)
}

// 是否有后台管理权限
const hasPermissionLoginAdmin = ref(false)

// 是否有后台管理权限
const updateHasPermissionLoginAdmin = () => {
    hasPermissionLoginAdmin.value = userStore.hasPermission(PermissionNames.LoginAdmin)
}

// 退出登录
const logout = async () => {
    await userStore.logout()
}

onMounted(() => {
    updateHasPermissionLoginAdmin()
})

</script>

<style scoped lang="scss">
span {
    outline: none;
}

.menu {
    /* 菜单宽度 */
    width: 120px;
    /* 菜单背景色 */
    background-color: #fff;
    /* 菜单边框 */
    border: 1px solid #eee;
    /* 菜单圆角 */
    border-radius: 8px;
    /* 菜单阴影 */
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.nickname {
    display: inline-block;
    // 超出部分隐藏显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    text-align: center;
    font-size: 16px;
    width: 120px;
}


button {
    width: 100%;
    border: none;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
    padding: 5px 0;
    cursor: pointer;
    background-color: transparent;

    :hover {
        background-color: #ddd;
    }
}
</style>
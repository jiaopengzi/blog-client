<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 10:19:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-08 12:00:46
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
                <span class="nickname">{{ data.user.user_display_name }}</span>
                <el-dropdown-item class="dropdown-item">
                    <el-button class="btn-item" @click="userCenterBtn">用户中心</el-button>
                </el-dropdown-item>

                <el-dropdown-item v-if="isShowAdmin" class="dropdown-item">
                    <el-button class="btn-item" @click="userAdminBtn">后台管理</el-button>
                </el-dropdown-item>

                <el-dropdown-item class="dropdown-item">
                    <el-button class="btn-item" @click="logout">退出</el-button>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

import AvatarInitials from "@/components/common/avatar-initials" // 导入 AvatarInitials 组件
import { RouteNames } from "@/router"
import { useUserStore } from "@/stores/user"
import { PermissionNames } from "@/utils/permissionRole"

defineOptions({ name: "UserInfoDropdown" })

const { isHiddenAdmin = false } = defineProps<{
    isHiddenAdmin?: boolean // 是否隐藏后台管理按钮
}>()

const router = useRouter()
const userStore = useUserStore()
const { data, avatar } = storeToRefs(userStore)

// 跳转到用户中心
const userCenterBtn = () => {
    router.push({ name: RouteNames.UserInfo })
}

// 跳转到后台管理
const userAdminBtn = () => {
    router.push({ name: RouteNames.Admin })
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

// 是否显示后台管理按钮
const isShowAdmin = computed(() => {
    return hasPermissionLoginAdmin.value && !isHiddenAdmin
})

onMounted(() => {
    updateHasPermissionLoginAdmin()
})
</script>

<style scoped lang="scss">
span {
    outline: none;
}

.menu {
    width: 120px;
    background-color: var(--jpz-bg-color);
    border: 1px solid var(--jpz-border-color);
    border-radius: 8px;
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
    width: 100%;
    height: 40px;
    line-height: 40px;
}

.btn-item {
    height: 32px;
    width: 100%;
    border: none;
    padding: 5px 0;
    color: var(--jpz-text-color-primary);
    background-color: transparent;
}
</style>

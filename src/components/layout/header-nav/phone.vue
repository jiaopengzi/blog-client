<!--
 * @FilePath     : \blog-client\src\components\layout\header-nav\phone.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 导航栏 手机端
-->

<template>
    <div class="container">
        <div class="login" v-if="!isLogin">
            <router-link :to="{ name: RouteNames.Login }" class="link">
                <span>登录</span>
            </router-link>
            <router-link :to="{ name: RouteNames.Register }" class="link">
                <span>注册</span>
            </router-link>
        </div>
        <div class="login" v-if="isLogin">
            <router-link :to="{ name: RouteNames.UserInfo }" class="link">
                <AvatarInitials :name="data.user.user_display_name" :avatar="data.user.user_avatar" />
            </router-link>
        </div>
        <div class="nav">
            <ul>
                <li v-for="item in navData" :key="item.name">
                    <router-link :to="{ name: item.name }">
                        <div class="menu">
                            <j-icon v-if="item.iconKey" :name="item.iconKey" :custom-class="item.customClass ? 'my-icon ' + item.customClass : 'my-icon'" />
                            <span>{{ item.title }}</span>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>

        <div class="switch">
            <SwitchGroup :switch-items="themeSwitch" @update-status="updateStatus" />
        </div>

        <el-button v-show="isLogin" plain class="logout" @click="logout">退出</el-button>
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia"
import { onBeforeMount } from "vue"

import AvatarInitials from "@/components/common/avatar-initials"
import SwitchGroup from "@/components/common/switch-group"
import { useTheme } from "@/components/hooks/useTheme"
import { RouteNames } from "@/router"
import { useUserStore } from "@/stores/user"

import type { HeaderNavPropsItem } from "./types"

defineOptions({ name: "HeaderNavPhone" })

const { navData } = defineProps<{ navData: HeaderNavPropsItem[] }>()

// 状态是否登录
const userStore = useUserStore()
const { data, isLogin } = storeToRefs(userStore)

// 主题切换
const { themeSwitch, updateStatus } = useTheme()

// 退出登录
const logout = async () => {
    await userStore.logout()
}

onBeforeMount(() => {
    // 组件挂载前 通过本地信息 获取用户信息
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
        align-items: center;
        // height: 40px;
        // line-height: 40px;
        text-align: center;
        font-size: 16px;
        color: var(--jpz-text-color-primary);

        .link {
            margin: 0 5px;

            span {
                border: 1px solid var(--jpz-border-color);
                width: 60px;
                height: 30px;
                line-height: 30px;
                border-radius: 3px;
                display: inline-block;
                // padding: 0 2px;
                color: var(--jpz-text-color-primary);
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

            li {
                height: 100%;
                width: 80%;
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                color: var(--jpz-text-color-primary);
                // padding: 0 10%;
                margin: 0 10px;
                border-bottom: 1px solid var(--jpz-border-color);

                // 让 link 充满整个 li
                .menu {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    color: var(--jpz-text-color-primary);
                    border: none;
                    line-height: 3em;
                }
            }

            // 选中第一个 li
            li:first-child {
                .menu {
                    padding-left: 12px;
                }
            }
        }
    }
}

.my-icon {
    font-size: 20px;
    fill: var(--jpz-text-color-primary);
    width: 40px;
}

.switch {
    margin-top: 20px;
}

.logout {
    margin-top: 20px;
}
</style>

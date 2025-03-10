<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 网站设置
-->

<template>
    <div class="content">
        <el-tabs type="border-card" :tab-position="tabPosition" class="tabs" v-model="activeTab" @tab-change="tabChange">
            <el-scrollbar>
                <el-tab-pane v-for="tab in tabs" :key="tab.hash" :name="tab.hash">
                    <template #label>
                        <div class="custom-tabs-label">
                            <j-icon :name="tab.icon" custom-class="iconfont" />
                            <span>{{ tab.label }}</span>
                        </div>
                    </template>
                    <component :is="tab.component" />
                </el-tab-pane>
            </el-scrollbar>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

import { IconKeys } from "@/components/common/icons"
import { RouteNames } from "@/router"

import SettingDatabase from "./database"
import SettingEmail from "./email"
import SettingSocial from "./social"
import type { Tab } from "./types"
import SettingUpload from "./upload"

defineOptions({ name: RouteNames.Setting })

const tabPosition = ref("left") // tab位置
const activeTab = ref("database")
const router = useRouter()

const tabs: Tab[] = [
    { hash: "database", label: "数据库", icon: IconKeys.Data, component: SettingDatabase },
    {
        hash: "notification",
        label: "邮件通知",
        icon: IconKeys.Notification,
        component: SettingEmail,
    },
    { hash: "social", label: "社交登录", icon: IconKeys.Social, component: SettingSocial },
    { hash: "upload", label: "文件上传", icon: IconKeys.Upload, component: SettingUpload },
]

// 切换 tab
const tabChange = (name: string) => {
    router.push({ hash: `#${name}` }) // 更新路由
}

// 更新当前的 activeTab
const updateActiveTab = (hash: string) => {
    if (!hash) return
    activeTab.value = hash.replace("#", "")
}

onMounted(() => {
    updateActiveTab(router.currentRoute.value.hash)
})
</script>

<style scoped lang="scss">
.content {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.tabs {
    box-sizing: border-box; // 使元素的内外边距都计入宽度和高度
    width: 100%;
    min-height: 100%;
    background-color: var(--jpz-bg-page-color);
    border: none;
    // margin-bottom: 8px;
}

.custom-tabs-label {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%; // 100% 宽度才能让左对齐生效
    color: var(--jpz-text-color-regular);

    .iconfont {
        margin-right: 4px;
        fill: var(--jpz-text-color-regular);
    }
}
</style>

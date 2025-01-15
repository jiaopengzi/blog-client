<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-15 13:12:06
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="content">
        <el-tabs
            type="border-card"
            :tab-position="tabPosition"
            class="tabs"
            v-model="activeTab"
            @tab-change="tabChange"
        >
            <el-tab-pane v-for="tab in tabs" :key="tab.hash" :name="tab.hash">
                <template #label>
                    <span class="custom-tabs-label">
                        <el-icon> <component :is="tab.icon" /> </el-icon>
                        <span>{{ tab.label }}</span>
                    </span>
                </template>
                <component :is="tab.component" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ChatLineSquare, Document, Goods, Star, Tickets, View } from "@element-plus/icons-vue"
import { ref } from "vue"
import { useRouter } from "vue-router"

import { RouteNames } from "@/router"
import UserInfoComment from "@/views/user-info/component/comment"
import UserInfoFavorite from "@/views/user-info/component/favorite"
import UserInfoInfo from "@/views/user-info/component/info"
import UserInfoOrder from "@/views/user-info/component/order"
import UserInfoPost from "@/views/user-info/component/post"
import UserInfoVip from "@/views/user-info/component/vip"

import type { Tab } from "./types"

defineOptions({ name: RouteNames.Setting })

const tabPosition = ref("left") // tab位置
const activeTab = ref("info")
const router = useRouter()

const tabs: Tab[] = [
    { hash: "info", label: "我的信息", icon: View, component: UserInfoInfo },
    { hash: "order", label: "我的订单", icon: Tickets, component: UserInfoOrder },
    { hash: "vip", label: "购买会员", icon: Goods, component: UserInfoVip },
    { hash: "favorite", label: "我的文章", icon: Document, component: UserInfoPost },
]

// 根据 hash 值来设置当前的 activeTab
function tabChange(name: string) {
    router.push({ hash: `#${name}` }) // 使用哈希路由更新 URL
    // router.push({ name: name }) // 使用哈希路由更新 URL
}

const hashValue = router.currentRoute.value.hash
if (hashValue) {
    activeTab.value = hashValue.replace("#", "")
}
</script>

<style scoped lang="scss">
.content {
    width: pc.$width-page-main;
    display: flex;
    flex-direction: column;
}

.tabs {
    width: pc.$width-page-main;
    min-height: calc(100vh - pc.$height-footer - pc.$height-header);
    background-color: var(--jpz-bg-color);
    border: none;
    margin-bottom: 8px;
}

.tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.tabs .custom-tabs-label .el-icon {
    vertical-align: middle;
}

.tabs .custom-tabs-label span {
    vertical-align: middle;
    margin-left: 4px;
}
</style>

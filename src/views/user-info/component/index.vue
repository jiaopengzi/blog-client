<!--
 * FilePath    : blog-client\src\views\user-info\component\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用户信息组件
-->

<template>
    <!-- 绑定邮箱对话框弹窗 -->
    <BindEmailDialog />

    <!-- 内容页 -->
    <div class="content">
        <el-tabs type="border-card" :tab-position="tabPosition" class="tabs" v-model="activeTab" @tab-change="tabChange">
            <!-- 使用 v-for 动态生成 tab-pane -->
            <el-tab-pane v-for="tab in tabsConfig" :key="tab.hash" :name="tab.hash" class="tab-pane">
                <template #label>
                    <span class="custom-tabs-label">
                        <el-icon>
                            <component :is="tab.icon" />
                        </el-icon>
                        <span>{{ tab.label }}</span>
                    </span>
                </template>
                <!-- 使用 v-if 控制组件的挂载 -->
                <component v-if="activeTab === tab.hash" :is="tab.component" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ChatLineSquare, Goods, Star, Tickets, View } from "@element-plus/icons-vue"
import { storeToRefs } from "pinia"
import { computed, type Ref, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import BindEmailDialog from "@/components/common/bind-email-dialog"
import { DeviceType, useDeviceStore } from "@/stores/device"

import UserInfoComment from "./comment"
import UserInfoFavorite from "./favorite"
import UserInfoInfo from "./info"
import UserInfoOrder from "./order"
import { UserInfoHash } from "./types"
import UserInfoVip from "./vip"

defineOptions({ name: "UserInfo" })

// 设备类型
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)

// tab 位置，PC 端左侧，其他设备顶部
const tabPosition = computed(() => (device.value === DeviceType.PHONE ? "top" : "left"))

// 当前激活的 tab
const activeTab: Ref<UserInfoHash> = ref(UserInfoHash.Info)

const router = useRouter()
const route = useRoute()

// tab 配置, 集中管理所有 tab 信息
const tabsConfig = [
    {
        hash: UserInfoHash.Info,
        label: "我的信息",
        icon: View,
        component: UserInfoInfo,
    },
    {
        hash: UserInfoHash.Order,
        label: "我的订单",
        icon: Tickets,
        component: UserInfoOrder,
    },
    {
        hash: UserInfoHash.Vip,
        label: "购买会员",
        icon: Goods,
        component: UserInfoVip,
    },
    {
        hash: UserInfoHash.Comment,
        label: "我的评论",
        icon: ChatLineSquare,
        component: UserInfoComment,
    },
    {
        hash: UserInfoHash.Favorite,
        label: "我的收藏",
        icon: Star,
        component: UserInfoFavorite,
    },
]

// 根据 hash 值来设置当前的 activeTab
function tabChange(hash: string) {
    router.push({ hash }) // 使用哈希路由更新 URL
}

// 初始化时根据当前路由的 hash 设置 activeTab
watch(
    () => route.hash,
    (newHash) => {
        if (newHash === "") {
            activeTab.value = UserInfoHash.Info
            return
        }

        if (tabsConfig.some((tab) => tab.hash === newHash)) {
            activeTab.value = newHash as UserInfoHash
        }
    },
    { immediate: true },
)
</script>
<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: column;
}

.tabs {
    background-color: var(--jpz-bg-color);
    border: none;
    margin-bottom: 8px;
}

@include respond-to("pc") {
    .content {
        width: pc.$width-page-main;
        min-height: calc(100vh - pc.$height-footer - pc.$height-header);
    }

    .tabs {
        width: pc.$width-page-main;
        min-height: calc(100vh - pc.$height-footer - pc.$height-header);
    }
}

@include respond-to("pad") {
    .content {
        width: 100vw;
        height: calc(100vh - pad.$height-footer);
    }

    .tabs {
        width: 100vw;
        min-height: calc(100vh - pad.$height-footer - pad.$height-header);
    }
}

@include respond-to("phone") {
    .content {
        width: 100vw;
        // height: calc(100vh - phone.$height-footer);
    }

    .tabs {
        width: 100vw;
        min-height: calc(100vh - phone.$height-footer - phone.$height-header);
    }
}

.tabs > .el-tabs__content {
    padding: 32px;
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

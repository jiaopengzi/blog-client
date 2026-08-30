<!--
 * FilePath    : blog-client-nuxt\src\components\views\user-info\component\index.vue
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
        <!-- phone 端分区导航 -->
        <template v-if="isPhone">
            <PhoneSectionNav :tabs="phoneTabs" :active-value="activeTab" aria-label="用户中心分区导航" @change="tabChange" />
            <div class="phone-section-panel">
                <component :is="activeTabConfig.component" />
            </div>
        </template>

        <!-- pc/pad 端分区导航, 使用原生 el-tabs -->
        <el-tabs v-else type="border-card" :tab-position="tabPosition" class="tabs" v-model="activeTab" @tab-change="tabChange">
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
                <!-- <component :is="tab.component" /> -->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ChatLineSquare, Star, Tickets, View } from "@element-plus/icons-vue"
import { storeToRefs } from "pinia"
import { computed, type Ref, ref, watch } from "vue"

import BindEmailDialog from "@/components/common/bind-email-dialog"
import PhoneSectionNav from "@/components/common/phone-section-nav"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

import UserInfoComment from "./comment"
import UserInfoFavorite from "./favorite"
import UserInfoInfo from "./info"
import UserInfoOrder from "./order"
import { UserInfoHash } from "./types"

defineOptions({ name: "UserInfo" })

const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)

const userStore = useUserStore()

// tab 位置, PC 端左侧, 其他设备顶部
const tabPosition = computed(() => (device.value === DeviceType.PHONE ? "top" : "left"))
const isPhone = computed(() => device.value === DeviceType.PHONE)

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

const phoneTabs = computed(() => {
    return tabsConfig.map((tab) => ({
        value: tab.hash,
        label: tab.label,
        icon: tab.icon,
    }))
})

const activeTabConfig = computed(() => {
    // tabsConfig 为常量非空数组, find 未命中时回退首项(noUncheckedIndexedAccess 下显式断言非空)
    return tabsConfig.find((tab) => tab.hash === activeTab.value) || tabsConfig[0]!
})

// 调整 260829-03 (2): 未绑定邮箱时仅允许停留在"我的信息"分区, 其余分区一律拦截并弹绑定邮箱弹窗
const isTabAllowed = (hash: string): boolean => userStore.isBindEmail || hash === UserInfoHash.Info

// 分区被拦截时的统一动作: 回退到"我的信息" + 弹窗 + 警告
const blockTab = () => {
    activeTab.value = UserInfoHash.Info
    void userStore.changeShowDialogBindEmail(true)
    MessageUtil.warning("请绑定邮箱！", 6000)
}

// 点击 tab 时将 hash 写入路由, activeTab 由下方 route.hash watch 同步
// el-tabs 的 tab-change 事件参数为 TabPaneName(string | number), 此处放宽后转字符串推路由
function tabChange(hash: string | number) {
    const hashStr = String(hash)
    // 未绑定邮箱: 不写路由, el-tabs 的 v-model 已被点击切换, 这里显式拉回"我的信息"
    if (!isTabAllowed(hashStr)) {
        blockTab()
        return
    }
    router.push({ hash: hashStr })
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
            // 未绑定邮箱: 直接输入/回放受限 hash (如地址栏敲入 #order) 时强制回退, 并把地址栏归位
            if (!isTabAllowed(newHash)) {
                blockTab()
                void router.replace({ hash: UserInfoHash.Info })
                return
            }
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
        gap: 12px;
    }

    .tabs {
        width: 100vw;
        min-height: calc(100vh - phone.$height-footer - phone.$height-header);
    }

    .phone-section-panel {
        width: 100%;
        min-height: calc(100vh - phone.$height-footer - phone.$height-header - 64px);
        padding: 0 12px 16px;
        box-sizing: border-box;
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

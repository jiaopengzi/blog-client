<!--
 * FilePath    : blog-client\src\components\common\pay-content\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费内容
-->

<template>
    <div v-if="!isShowContent">
        <div class="no-pay">
            <JIcon :name="IconKeys.Lock" :custom-class="`my-icon`" class="lock" />
            <div v-if="isVideoContent">
                <PostVideo class="no-pay-video" :post-id="postId" :is-admin-video="isAdminVideo" :toc="videoToc" :is-paid="isPaid" />
                <div class="text">
                    <span>{{ protectedTargetText }}</span
                    ><template v-if="isShowPriceTip"
                        >，需付费<span class="price">{{ priceText }}</span
                        >元解锁{{ unlockActionText }}</template
                    >。
                </div>
            </div>
            <div v-else class="text">
                <span>{{ protectedTargetText }}</span
                ><template v-if="isShowPriceTip"
                    >，需付费<span class="price">{{ priceText }}</span
                    >元解锁{{ unlockActionText }}</template
                >。
            </div>

            <div v-if="isShowVipTip" class="text-vip">
                <span v-if="displayRoles.length > 0">
                    拥有 <span class="role-highlight">{{ displayRoles.join("、") }}</span> 身份可免费查看。
                </span>
                <span v-else>升级为 VIP 会员，畅享海量专属内容。</span>
            </div>

            <div class="action-btns">
                <el-button v-if="isShowPaySingleBtn" class="pay-single btn-action" :loading="loading" @click="emitPayAction('pay-single')">立即解锁</el-button>
                <el-button v-if="isShowPayVipBtn" class="pay-vip btn-action" @click="emitPayAction('pay-vip')">开通会员</el-button>
            </div>
        </div>
    </div>
    <div class="paid" v-if="isShowContent">
        <PostVideo v-if="!onlyMarkdown" :post-id="postId" :is-admin-video="isAdminVideo" :toc="videoToc" :is-paid="isPaid" />
        <template v-for="(item, index) in contentParts" :key="index">
            <div v-if="item.type === 'html'" v-stable-html="item.content"></div>

            <div v-else-if="item.type === Names.VideoPlayer" :key="(item.content as PlayerState).videoID" class="video-player-box">
                <VideoPlayer :player-state="item.content as PlayerState" />
            </div>

            <PowerBi
                v-else-if="item.type === Names.PowerBi"
                :key="`${(item.content as PowerBIState).src}-${(item.content as PowerBIState).maskcolor}`"
                :src="(item.content as PowerBIState).src"
                :maskcolor="(item.content as PowerBIState).maskcolor"
            />
        </template>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, watch } from "vue"

import { PayStrategy } from "@/api/post/common"
import JIcon, { IconKeys } from "@/components/common/icons"
import PowerBi from "@/components/common/power-bi/index.vue"
import { EditorStateManager } from "@/components/editor"
import VideoPlayer, { type PlayerState } from "@/components/player"
import { Names, parseHtmlToContentParts } from "@/customElements"
import { type PowerBIState } from "@/customElementsMount/PowerBI"
import { usePermissionRoleStore } from "@/stores/permissionRole"
import { fenToYuan } from "@/utils/amount"

import PostVideo from "../pay-video"
import { ContentPayType, type PayContentProps } from "./types.ts"

defineOptions({ name: "PayContent" })

// 定义 props
const {
    postId = "",
    isAdminVideo = false,
    videoToc = [],
    contentPayType = ContentPayType.Read,
    isPaid = false,
    payStrategy = PayStrategy.All,
    payRoles = [],
    price = "0",
    loading = false,
    markdown,
    onlyMarkdown = false,
} = defineProps<PayContentProps>()

// 事件
const emit = defineEmits<{
    (event: "pay-single", val: ContentPayType): void
    (event: "pay-vip", val: ContentPayType): void
}>()

/**
 * @description: 统一派发付费操作事件.
 * @param event 事件名称.
 * @return {void}
 */
const emitPayAction = (event: "pay-single" | "pay-vip"): void => {
    if (event === "pay-single") {
        emit("pay-single", contentPayType)
        return
    }

    emit("pay-vip", contentPayType)
}

// 内容渲染
const stateManager = new EditorStateManager()

// 角色权限
const permissionRoleStore = usePermissionRoleStore()

// 监听 markdown 内容变化，并更新 stateManager 的状态以重新渲染内容
watch(
    () => markdown,
    (newVal) => {
        if (newVal) {
            stateManager.updateState(newVal)
        }
    },
    { immediate: true },
)

// 将 stateManager 渲染的 HTML 解析为内容片段，以正确渲染 power-bi、video-player 等 Vue 组件
const contentParts = computed(() => {
    const html = stateManager.getState().html
    if (!html) return []
    return parseHtmlToContentParts(html, postId, isAdminVideo)
})

// 是否显示内容
const isShowContent = computed(() => {
    return isPaid || price === "0" || price === "0.00"
})

// 是否视频内容
const isVideoContent = computed(() => {
    return contentPayType === ContentPayType.Video
})

// 付费视频标签内是否携带资料内容
const hasVideoMaterial = computed(() => {
    return isVideoContent.value && markdown.trim() !== ""
})

// 支付策略状态计算，简化后续逻辑判断
const payStrategyState = computed(() => {
    const canBuySingle = payStrategy === PayStrategy.Buy || payStrategy === PayStrategy.All
    const canBuyVip = payStrategy === PayStrategy.VIP || payStrategy === PayStrategy.All

    return {
        canBuySingle,
        canBuyVip,
        showPriceTip: canBuySingle,
        showVipTip: canBuyVip,
    }
})

// 是否显示单次购买按钮
const isShowPaySingleBtn = computed(() => {
    if (isPaid) return false
    return payStrategyState.value.canBuySingle
})

// 是否显示会员购买按钮
const isShowPayVipBtn = computed(() => {
    if (isPaid) return false
    return payStrategyState.value.canBuyVip
})

// 是否展示价格引导文案
const isShowPriceTip = computed(() => {
    return payStrategyState.value.showPriceTip
})

// 价格文案
const priceText = computed(() => {
    return fenToYuan(price)
})

// 解锁动作文案
const unlockActionText = computed(() => {
    switch (contentPayType) {
        case ContentPayType.Download:
            return "下载"
        case ContentPayType.Video:
            return hasVideoMaterial.value ? "观看和获取" : "观看"
        default:
            return "阅读"
    }
})

// 锁定目标展示逻辑
const protectedTargetText = computed(() => {
    switch (contentPayType) {
        case ContentPayType.Download:
            return "该资料受保护"
        case ContentPayType.Video:
            return hasVideoMaterial.value ? "该视频和资料受保护" : "该视频受保护"
        default:
            return "该内容受保护"
    }
})

// 会员角色展示逻辑
const systemMembershipRoles = computed(() => {
    return permissionRoleStore.membershipRoles || []
})

/**
 * @description: 通过权限角色 store 获取会员角色, 并在未加载时补充拉取.
 * @return {Promise<void>}
 */
const fetchMembershipRoles = async (): Promise<void> => {
    // 仅购买策略时无需获取角色
    if (payStrategy === PayStrategy.Buy) return

    if (permissionRoleStore.getIsLoaded || systemMembershipRoles.value.length > 0) return

    try {
        await permissionRoleStore.updateFromServer()
    } catch (error) {
        // store 拉取失败时优雅降级, 不阻断页面展示
        console.warn("Failed to fetch permission role store", error)
    }
}

onMounted(() => {
    fetchMembershipRoles()
})

// 需要展示的交集会员角色
const displayRoles = computed(() => {
    if (!payRoles || payRoles.length === 0) return []
    if (systemMembershipRoles.value.length === 0) return []
    return payRoles.filter((role) => systemMembershipRoles.value.includes(role))
})

// 是否展示会员相关引导文案
const isShowVipTip = computed(() => {
    return payStrategyState.value.showVipTip
})
</script>
<style scoped lang="scss">
.no-pay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    position: relative;
    border: 1px solid rgba(193, 64, 31, 0.2); // 柔和的边框
    background: linear-gradient(180deg, rgba(193, 64, 31, 0.02) 0%, rgba(193, 64, 31, 0.05) 100%);
    border-radius: 12px;
    margin: 24px 0;
    padding: 32px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 6px 16px rgba(193, 64, 31, 0.08);
        border-color: rgba(193, 64, 31, 0.4);
    }

    .lock {
        position: absolute;
        top: 12px;
        left: 12px;
        opacity: 0.8;
    }

    .my-icon {
        fill: #c1401f;
        font-size: 16px;
    }

    @include respond-to("pad") {
        .no-pay-video {
            margin-top: 12px;
        }
    }

    @include respond-to("phone") {
        .no-pay-video {
            margin-top: 12px;
        }
    }

    .text,
    .text-vip {
        font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
        font-size: 15px;
        color: var(--jpz-text-color-primary);
        margin: 8px 0;
        line-height: 1.6;
    }

    .text-vip {
        font-size: 14px;
        color: var(--jpz-text-color-secondary);
        margin-bottom: 16px;

        .role-highlight {
            color: #d4a037; // 偏金色的高级感
            font-weight: 600;
            padding: 0 4px;
        }
    }

    .price {
        font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
        color: #c1401f;
        font-weight: 700;
        font-size: 1.4em;
        margin: 0 6px;
    }

    .action-btns {
        display: flex;
        gap: 16px;
        margin-top: 12px;
        flex-wrap: wrap;
        justify-content: center;
    }

    .btn-action {
        font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
        font-size: 15px;
        font-weight: 600;
        width: 120px;
        height: 42px;
        color: #ffffff;
        border: none;
        border-radius: 8px;
        transition:
            transform 0.2s,
            box-shadow 0.2s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
    }

    .pay-single {
        background: linear-gradient(135deg, #188838 0%, #1e9d44 100%);
    }

    .pay-vip {
        background: linear-gradient(135deg, #c1401f 0%, #d4502d 100%);
    }
}
</style>

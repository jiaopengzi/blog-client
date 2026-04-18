<!--
 * FilePath    : blog-client\src\components\common\login-view\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 登录查看组件，未登录时提示用户登录，已登录时显示隐藏内容
-->

<template>
    <div v-if="!isLogin" class="login-view-lock">
        <div class="login-view-info">
            <div class="login-view-title">登录后查看</div>
            <div class="login-view-tip">此部分内容需要登录后才能查看，请先登录。</div>
            <div class="login-view-action">
                <button type="button" class="login-view-btn" @click="handleLogin">去登录</button>
            </div>
        </div>
    </div>
    <div v-else class="login-view-content">
        <template v-for="(item, index) in contentParts" :key="index">
            <div v-if="item.type === 'html'" v-html="item.content"></div>

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

<script setup lang="ts">
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"

import PowerBi from "@/components/common/power-bi/index.vue"
import VideoPlayer, { type PlayerState } from "@/components/player"
import { Names, parseHtmlToContentParts } from "@/customElements"
import { type PowerBIState } from "@/customElementsMount/PowerBI"
import { useUserStore } from "@/stores/user"
import { RouteNames } from "@/router/types"

defineOptions({ name: "LoginView" })

const {
    hiddenHtml = "",
    postId = "",
    isAdminVideo = false,
} = defineProps<{
    hiddenHtml?: string
    postId?: string
    isAdminVideo?: boolean
}>()

const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)
const router = useRouter()

// 将 hiddenHtml 解析为内容片段，登录后才解析以避免无意义开销
const contentParts = computed(() => {
    if (!isLogin.value || !hiddenHtml) return []
    return parseHtmlToContentParts(hiddenHtml, postId, isAdminVideo)
})

const handleLogin = (): void => {
    router.push({ name: RouteNames.Login, query: { redirect: router.currentRoute.value.fullPath } })
}
</script>

<style scoped lang="scss">
.login-view-lock {
    margin: 24px 0;
    padding: 32px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 8px;
    background-color: var(--jpz-bg-color);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-view-content {
    margin: 24px 0;
}

.login-view-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.login-view-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--jpz-text-color-primary);
}

.login-view-tip {
    font-size: 14px;
    margin-bottom: 24px;
    color: var(--jpz-text-color-secondary);
    line-height: 1.6;
}

.login-view-action {
    display: flex;
    justify-content: center;
}

.login-view-btn {
    border: none;
    border-radius: 6px;
    padding: 10px 32px;
    font-size: 14px;
    font-weight: 500;
    background-color: var(--jpz-color-primary);
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        opacity: 0.9;
    }

    &:active {
        opacity: 0.8;
    }
}

@include respond-to("pad") {
    .login-view-lock {
        padding: 24px;
    }
}

@include respond-to("phone") {
    .login-view-lock {
        padding: 24px 16px;
    }

    .login-view-btn {
        width: 100%;
        box-sizing: border-box;
    }
}
</style>

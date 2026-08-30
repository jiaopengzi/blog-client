<!--
 * FilePath    : blog-client-nuxt\src\pages\unsubscribe.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 取消订阅页(CSR, 原 views/unsubscribe 视图已并入本页面; definePageMeta/useHead 来自原 pages 包装, 逻辑与模板来自原视图)
-->

<!--
 * 补充说明:
 * 保持原 CSR 语义: 整页模板位于 ClientOnly 内, 服务端不渲染取消订阅内容
-->

<script setup lang="ts">
// Nuxt 适配: useHead / useRoute / useRouter 为 Nuxt 自动导入(@unhead/vue, vue-router 非直接依赖)
import { onMounted, onUnmounted, reactive, ref } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { unSubscribeAPI, type UnSubscribeRequest } from "@/api/user/unSubscribe"
import FooterStatistics from "@/components/layout/footer-statistics"
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options"
import { MessageUtil } from "@/utils/message"
import { parseRouteQuery } from "@/utils/queryParam"

definePageMeta({ layout: false, name: "unsubscribe" })

defineOptions({ name: RouteNames.Unsubscribe })

useHead({
    title: "取消订阅",
})

// 路由
const route = useRoute()
const router = useRouter()
const optionsStore = useOptionsStore()

const textInfo = ref("正在取消订阅，请稍候...")
const countdown = ref(5) // 倒计时
const isShowCountdown = ref(false) // 是否显示倒计时
let intervalId: number | undefined // 定时器 id

// 查询参数
const queryParams = reactive<UnSubscribeRequest>({ token: "" })

// 更新查询参数
const updateQueryParams = async () => {
    const { hasQuery, result } = await parseRouteQuery(route.query)
    // 更新 queryParams
    if (hasQuery) {
        Object.assign(queryParams, result)
    }
}

// 取消订阅
const unSubscribe = async (req: UnSubscribeRequest) => {
    const res = await unSubscribeAPI(req)
    if (res.data.code === ResponseCode.UserUnSubscribeSuccess) {
        textInfo.value = "取消订阅成功，正在跳转到首页..."
        isShowCountdown.value = true
        MessageUtil.success("取消订阅成功")
    } else {
        textInfo.value = "取消订阅失败，请稍后重试。"
        isShowCountdown.value = false
        MessageUtil.error(handleResErr(res), 10000)
    }
}

onMounted(async () => {
    // 更新查询参数
    await updateQueryParams()
    await unSubscribe(queryParams)

    // 倒计时
    intervalId = window.setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--
        } else {
            clearInterval(intervalId)
            router.push("/")
        }
    }, 1000)
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>

<template>
    <ClientOnly>
        <div class="unsubscribe-page">
            <p class="text-info">{{ textInfo }}</p>
            <p v-if="isShowCountdown" class="countdown-text">
                将在 <span class="countdown">{{ countdown }}</span> 秒后，返回首页。
            </p>
        </div>

        <FooterStatistics v-if="optionsStore.isShowFooterStatistics" />
    </ClientOnly>
</template>

<style lang="scss" scoped>
.unsubscribe-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: var(--jpz-bg-color-secondary);
}

.text-info {
    font-size: 24px;
    color: var(--jpz-text-color-primary);
    margin: 20px;
}

.countdown-text {
    font-size: 18px;
    color: var(--jpz-text-color-secondary);
}

.countdown {
    color: red;
    font-size: 24px;
    font-weight: 700;
}
</style>

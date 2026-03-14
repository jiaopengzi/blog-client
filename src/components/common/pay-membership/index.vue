<!--
 * FilePath    : blog-client\src\components\common\pay-membership\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费会员
-->

<template>
    <!-- 注意挂载元素的样式不要和 #preview 的样式冲突重叠了 -->
    <div class="no-roles" v-if="roles.length === 0">暂无可购买的会员角色，请联系管理员。</div>
    <section class="role-list">
        <el-button v-for="item in roles" :key="item.id" class="role-item" :loading="loadingAc(item.id)" @click="handleClick(item)">
            <template #default>
                <div class="role-content">
                    <div class="role">{{ item.role }}</div>
                    <div class="price-wrap">
                        <span class="currency">￥</span>
                        <span class="price">{{ fenToYuan(item.price) }}</span>
                    </div>
                    <div class="duration-time">
                        <span class="label">有效期</span>
                        <span class="value">{{ durationTimeDisplay(item.duration_time) }}</span>
                    </div>
                    <div class="action-text">立即开通</div>
                </div>
            </template>
        </el-button>
    </section>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from "vue"

import { type MembershipRes } from "@/api/membership/common"
import { getMembershipPayRolesAPI } from "@/api/membership/getPayRoles"
import { ResponseCode } from "@/api/response"
import { Names } from "@/customElements"
import { useCustomElementsDataCacheStore } from "@/stores/customElementsDataCache"
import { fenToYuan } from "@/utils/amount"

import { type PayMembershipProps } from "./types"

defineOptions({ name: "PayMembership" })

// 定义 props
const { loading = false } = defineProps<PayMembershipProps>()

// 事件
const emit = defineEmits<{
    (event: "pay-membership", val: MembershipRes): void
}>()

// 加载状态根据点击对应的按钮，只保证一个按钮加载
const loadingAcId = ref<string | null>(null)
const loadingAc = (id: string) => loading && loadingAcId.value === id

const handleClick = (item: MembershipRes) => {
    loadingAcId.value = item.id
    emit("pay-membership", item)
}

const roles = ref<MembershipRes[]>([])

const durationTimeDisplay = (duration: string) => {
    // 将文本转换为数字（秒）
    const durationNum = parseInt(duration, 10)

    if (durationNum === 0) return "永久"

    const daysTotal = Math.floor(durationNum / (60 * 60 * 24)) // 转换为天数

    // 如果是整年就返回整年
    if (daysTotal >= 365) {
        const years = Math.floor(daysTotal / 365)
        return `${years}年`
    }

    // 如果是整月就返回整月
    if (daysTotal >= 30) {
        const months = Math.floor(daysTotal / 30)
        return `${months}月`
    }
}

// 自定义元素数据缓存 Store
const customElementsDataCacheStore = useCustomElementsDataCacheStore()

onBeforeMount(async () => {
    // 优先从缓存中获取数据, 避免重复请求
    if (customElementsDataCacheStore.hasDataCacheByKey(Names.PayMembership, Names.PayMembership)) {
        const cache = customElementsDataCacheStore.getDataCacheByKey(Names.PayMembership, Names.PayMembership)
        if (cache) {
            roles.value = cache.data as MembershipRes[]
            return
        }
    }

    // 请求数据
    const res = await getMembershipPayRolesAPI()
    if (res.data.code === ResponseCode.MembershipGetRolesSuccess) {
        roles.value = res.data.data
    }

    // 无论是否有数据都更新到缓存中
    customElementsDataCacheStore.setDataCache({
        name: Names.PayMembership,
        key: Names.PayMembership,
        data: roles.value,
    })
})
</script>
<style scoped lang="scss">
.no-roles {
    color: red;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    margin: 40px 0;
    opacity: 0.8;
}

.role-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
    align-items: center;
    padding: 20px 0;

    .role-item {
        margin: 0;
        padding: 0;
        border: 2px solid var(--jpz-border-color-lighter);
        border-radius: 16px;
        background: var(--jpz-bg-color);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        overflow: hidden;
        position: relative;
        height: 240px;
        width: 200px;
        box-shadow: var(--jpz-box-shadow-light);

        /* Reset el-button default styles to stretch fully */
        :deep(> span) {
            display: block;
            width: 100%;
            height: 100%;
        }

        &:hover {
            border-color: var(--jpz-color-primary);
            transform: translateY(-6px);
            box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.15);

            .action-text {
                background: var(--jpz-color-primary);
                color: var(--jpz-color-white);
            }
        }

        // 伪元素提示
        &::after {
            content: "点击购买";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 14px;
            font-weight: bold;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(4px);
            z-index: 10;
        }

        &:hover::after {
            opacity: 1;
        }
    }

    .role-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        height: 100%;
        padding-top: 36px;
        position: relative;
    }

    .role {
        font-family: var(--jpz-font-family-mono, "JBMonoWOFF2", "Microsoft YaHei", sans-serif);
        font-size: 24px;
        font-weight: 800;
        letter-spacing: 1px;
        color: var(--jpz-text-color-primary);
        margin-bottom: 24px;
        text-transform: uppercase;
    }

    .price-wrap {
        display: flex;
        align-items: baseline;
        justify-content: center;
        color: #c1401f;
        margin-bottom: 30px;

        .currency {
            font-size: 18px;
            font-weight: 600;
            margin-right: 2px;
        }

        .price {
            font-family: var(--jpz-font-family-mono, "JBMonoWOFF2", sans-serif);
            font-size: 40px;
            font-weight: 800;
            line-height: 1;
        }
    }

    .duration-time {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: var(--jpz-text-color-regular);
        background: var(--jpz-bg-color-page);
        padding: 8px 18px;
        border-radius: 20px;
        margin-bottom: auto;

        .value {
            font-weight: 600;
            color: var(--jpz-text-color-primary);
        }
    }

    .action-text {
        width: 100%;
        height: 52px;
        line-height: 52px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: var(--jpz-color-primary);
        background: var(--jpz-bg-color-page);
        transition: all 0.3s ease;
        margin-top: 24px;
    }
}
</style>

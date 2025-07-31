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
        <div v-for="item in roles" :key="item.id" class="role-item" @click="handleClick(item)">
            <div class="role">{{ item.role }}</div>
            <div class="price">￥{{ fenToYuan(item.price) }}</div>
            <div class="duration-time">有效期{{ durationTimeDisplay(item.duration_time) }}</div>
        </div>
    </section>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from "vue"

import { type MembershipRes } from "@/api/membership/common"
import { getMembershipPayRolesAPI } from "@/api/membership/getPayRoles"
import { ResponseCode } from "@/api/response"
import { fenToYuan } from "@/utils/amount"

defineOptions({ name: "PayMembership" })

// 事件
const emit = defineEmits<{
    (event: "pay-membership", val: MembershipRes): void
}>()

const handleClick = (item: MembershipRes) => {
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

onBeforeMount(async () => {
    const res = await getMembershipPayRolesAPI()
    if (res.data.code === ResponseCode.MembershipGetRolesSuccess) {
        roles.value = res.data.data
    }
})
</script>
<style scoped lang="scss">
.no-roles {
    color: red;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    margin: 20px 0;
}

.role-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;

    .role-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 194px;
        height: 120px;
        border: 1px solid var(--jpz-border-color);
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
        position: relative;

        &:hover {
            background-color: var(--jpz-bg-color-page);
        }

        // 伪元素提示
        &::after {
            content: "点击购买";
            position: absolute;
            bottom: 2px;
            margin: auto;
            width: 68px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            color: #fff;
            background: #c1401f;
            border-radius: 4px;
            padding: 4px;
            font-size: 12px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
        }

        &:hover::after {
            opacity: 1;
        }

        .role {
            font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
            color: var(--jpz-text-color-regular);
            text-align: center;
            height: 24px;
        }

        .price {
            font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
            color: #c1401f;
            font-weight: 700;
            font-size: 20px;
            margin-bottom: 8px;
            text-align: center;
            height: 24px;
        }

        .duration-time {
            font-family: "JBMonoWOFF2", "roboto", "Microsoft YaHei", Helvetica, Arial, sans-serif;
            font-size: 16px;
            font-weight: 500;
            color: var(--jpz-text-color-secondary);
            margin-bottom: 20px;
            text-align: center;
            height: 20px;
        }

        .description {
            margin-top: 16px;
            font-size: 14px;
            color: var(--jpz-text-color-secondary);
            line-height: 1.5;
        }
    }
}
</style>

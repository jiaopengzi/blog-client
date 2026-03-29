<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心
-->

<template>
    <section class="billing-center">
        <!-- 加载中 -->
        <div v-if="accountLoading" class="billing-loading">
            <el-skeleton :rows="5" animated />
        </div>

        <!-- 账户被禁用: 显示禁用状态 -->
        <NoUseView v-else-if="isForbidden" type="forbidden" />

        <!-- blog-server 版本过低 -->
        <NoUseView v-else-if="isVersionTooLow" type="too-low" />

        <!-- 未注册: 直接显示注册表单 -->
        <div v-else-if="!isRegistered" class="billing-register">
            <div class="billing-register-wrapper">
                <RegisterForm @register-status="handleRegisterStatus" />
            </div>
        </div>

        <!-- 已注册: 显示完整计费中心 -->
        <div v-else class="billing-content">
            <TransactionView :account-info="accountInfo!" @refresh="getAccountInfo" />
        </div>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { onBeforeMount } from "vue"

import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import RegisterForm from "./component/register"
import TransactionView from "./component/transaction-view"
import NoUseView from "./component/no-use"
import { useBillingCenter } from "./hooks"

defineOptions({ name: RouteNames.BillingCenter })

useHead({
    title: adminMenuItemMap[RouteNames.BillingCenter].text,
})

const { accountInfo, isRegistered, isForbidden, isVersionTooLow, accountLoading, getAccountInfo } = useBillingCenter()

/**
 * handleRegisterStatus 注册成功回调。
 * @param status - 注册是否成功。
 */
const handleRegisterStatus = async (status: boolean) => {
    if (status) {
        await getAccountInfo()
    }
}

onBeforeMount(async () => {
    await getAccountInfo()
})
</script>

<style scoped lang="scss">
.billing-center {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.billing-loading {
    background: var(--jpz-bg-color);
    border-radius: 8px;
    padding: 24px;
    border: 1px solid var(--jpz-border-color-lighter);
}

.billing-register,
.billing-content {
    // display: flex;
    // justify-content: center;
    padding: 48px 8px;
}

.billing-register-wrapper {
    width: 888px;
    background: var(--jpz-bg-color);
    border-radius: 12px;
    padding: 32px;
    border: 1px solid var(--jpz-border-color-lighter);
}
</style>

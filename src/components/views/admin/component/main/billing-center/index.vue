<!--
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\billing-center\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心 (bug06 260831-01: 证书失效分支补接查看协议弹窗)
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

        <!-- 证书失效: 引导用户重置证书 -->
        <div v-else-if="isCertInvalid" class="billing-register">
            <div class="billing-register-wrapper">
                <!-- bug06(260831-01 反馈第1轮): 补接 view-agreement 事件 —— 此前该事件无监听,
                     证书失效分支点击「查看协议」无任何响应(transaction-view 内的同名表单已接, 此处漏接) -->
                <ResetCertForm @reset-cert-status="handleResetCertStatus" @view-agreement="showAgreementDialog" />
            </div>
        </div>

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

        <!-- 查看协议弹窗 (bug06 260831-01 反馈第1轮: 与 transaction-view 的同名弹窗同结构) -->
        <el-dialog v-model="agreementDialogVisible" width="960px" destroy-on-close class="billing-dialog billing-dialog--agreement">
            <template #header>
                <div class="billing-dialog-header">
                    <el-icon :size="22"><Document /></el-icon>
                    <span>查看协议</span>
                </div>
            </template>
            <Agreement />
        </el-dialog>
    </section>
</template>

<script lang="ts" setup>
import { Document } from "@element-plus/icons-vue"
import { onBeforeMount, ref } from "vue"

import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/components/views/admin/component/aside"

import Agreement from "./component/agreement"
import RegisterForm from "./component/register"
import ResetCertForm from "./component/reset-cert"
import TransactionView from "./component/transaction-view"
import NoUseView from "./component/no-use"
import { useBillingCenter } from "./hooks"

defineOptions({ name: RouteNames.BillingCenter })

useHead({
    title: adminMenuItemMap[RouteNames.BillingCenter].text,
})

const { accountInfo, isRegistered, isForbidden, isVersionTooLow, isCertInvalid, accountLoading, getAccountInfo } = useBillingCenter()

// 查看协议弹窗可见性 (bug06 260831-01 反馈第1轮)
const agreementDialogVisible = ref(false)

const showAgreementDialog = () => {
    agreementDialogVisible.value = true
}

/**
 * handleRegisterStatus 注册成功回调
 * @param status - 注册是否成功
 */
const handleRegisterStatus = async (status: boolean) => {
    if (status) {
        await getAccountInfo()
    }
}

/**
 * handleResetCertStatus 重置证书成功回调
 * @param status - 重置是否成功
 */
const handleResetCertStatus = async (status: boolean) => {
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
    padding: 48px 8px;
}

.billing-register-wrapper {
    width: 888px;
    background: var(--jpz-bg-color);
    border-radius: 12px;
    padding: 32px;
    border: 1px solid var(--jpz-border-color-lighter);
}

// 弹窗统一商务风格 (bug06 260831-01 反馈第1轮: 与 transaction-view 的同名样式一致)
:deep(.billing-dialog) {
    border-radius: 12px;
    overflow: hidden;

    .el-dialog__header {
        padding: 20px 24px 16px;
        margin: 0;
        border-bottom: 1px solid var(--jpz-border-color-lighter);
        background: var(--jpz-bg-color);
    }

    .el-dialog__body {
        padding: 24px;
    }
}

// 弹窗头部图标 + 标题
.billing-dialog-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 17px;
    font-weight: 700;
    color: var(--jpz-text-color-primary);

    .el-icon {
        color: var(--jpz-color-primary);
    }
}
</style>

<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\component\account-card\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心账号信息卡片
-->

<template>
    <div class="account-card">
        <div v-if="loading" class="account-loading">
            <el-skeleton :rows="3" animated />
        </div>

        <div v-else-if="!isRegistered" class="account-register">
            <div class="register-info">
                <el-icon :size="48"><Warning /></el-icon>
                <h3>尚未注册计费中心</h3>
                <p>注册后可使用充值, 消费等计费功能</p>
            </div>
            <el-button type="primary" size="large" @click="handleRegister"> 注册计费中心 </el-button>
        </div>

        <div v-else class="account-info">
            <div class="info-header">
                <h3>计费中心概览</h3>
                <div class="header-actions">
                    <el-button class="btn-recharge" @click="handleRecharge"> 充值 </el-button>
                    <el-button @click="handleNotify"> 通知设置 </el-button>
                    <el-button @click="handleResetCert"> 重置证书 </el-button>
                </div>
            </div>

            <div class="info-grid">
                <div class="info-item balance">
                    <span class="info-label">当前余额</span>
                    <span class="info-value">¥{{ formatAmount(accountInfo!.balance) }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">总充值</span>
                    <span class="info-value">¥{{ formatAmount(accountInfo!.total_recharge) }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">总消费</span>
                    <span class="info-value">¥{{ formatAmount(accountInfo!.total_consume) }}</span>
                </div>
                <!-- 消费比例: 分子/分母 -->
                <div class="info-item">
                    <span class="info-label">消费比例</span>
                    <span class="info-value"> {{ accountInfo!.consume_spent_numerator }}/{{ accountInfo!.consume_spent_denominator }} </span>
                </div>
                <!-- 最低消费: 分转元 -->
                <div class="info-item">
                    <span class="info-label">最低消费</span>
                    <span class="info-value">¥{{ formatAmount(accountInfo!.consume_spent_min_amount) }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">通知阈值</span>
                    <span class="info-value">
                        {{ accountInfo!.notify_enabled ? `¥${formatAmount(accountInfo!.notify_threshold)}` : "未启用" }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Warning } from "@element-plus/icons-vue"
import { debounce } from "throttle-debounce"

import type { BillingCenterAccountRes } from "@/api/billingCenter/common"
import { useBillingCenter } from "../../hooks"

defineOptions({ name: "AccountCard" })

defineProps<{
    /** 加载中 */
    loading: boolean
    /** 是否已注册 */
    isRegistered: boolean
    /** 账户信息 */
    accountInfo: BillingCenterAccountRes | null
}>()

const emit = defineEmits<{
    (e: "register"): void
    (e: "recharge"): void
    (e: "notify"): void
    (e: "reset-cert"): void
}>()

const handleRegister = debounce(300, () => emit("register"))
const handleRecharge = debounce(300, () => emit("recharge"))
const handleNotify = debounce(300, () => emit("notify"))
const handleResetCert = debounce(300, () => emit("reset-cert"))

const { formatAmount } = useBillingCenter()
</script>

<style scoped lang="scss">
.account-card {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 24px;
    border: 1px solid var(--el-border-color-lighter);
}

.account-loading {
    padding: 20px 0;
}

.account-register {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 40px 0;

    .register-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        color: var(--el-text-color-secondary);

        h3 {
            margin: 0;
            font-size: 18px;
            color: var(--el-text-color-primary);
        }

        p {
            margin: 0;
            font-size: 14px;
        }
    }
}

.account-info {
    .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
        }

        .header-actions {
            display: flex;
            gap: 8px;

            // 充值按钮使用副色
            .btn-recharge {
                --el-button-bg-color: var(--jpz-color-secondary);
                --el-button-text-color: #fff;
                --el-button-border-color: var(--jpz-color-secondary);
                --el-button-hover-bg-color: var(--jpz-color-secondary);
                --el-button-hover-border-color: var(--jpz-color-secondary);
                --el-button-hover-text-color: #fff;
                --el-button-active-bg-color: var(--jpz-color-secondary);
                --el-button-active-border-color: var(--jpz-color-secondary);
                --el-button-active-text-color: #fff;
                opacity: 1;

                &:hover,
                &:focus {
                    opacity: 0.85;
                }
            }
        }
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 16px;

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 16px;
            background: var(--el-fill-color-lighter);
            border-radius: 6px;

            .info-label {
                font-size: 13px;
                color: var(--el-text-color-secondary);
            }

            .info-value {
                font-size: 20px;
                font-weight: 600;
                color: var(--el-text-color-primary);
            }

            &.balance {
                .info-value {
                    color: var(--el-color-primary);
                    font-size: 24px;
                }
            }
        }
    }
}
</style>

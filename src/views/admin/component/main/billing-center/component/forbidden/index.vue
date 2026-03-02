<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\component\forbidden\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心账户禁用状态展示
 -->

<template>
    <div class="billing-forbidden">
        <div class="forbidden-card">
            <el-icon class="forbidden-icon" :size="64"><CircleCloseFilled /></el-icon>
            <h2 class="forbidden-title">账户已被禁用</h2>
            <p class="forbidden-desc">您的计费中心账户已被禁用，无法使用相关功能。</p>
            <p class="forbidden-hint">如有疑问，请联系管理员处理。</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CircleCloseFilled } from "@element-plus/icons-vue"

defineOptions({ name: "BillingForbidden" })
</script>

<style scoped lang="scss">
.billing-forbidden {
    display: flex;
    justify-content: center;
    padding: 48px 8px;
}

.forbidden-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 560px;
    background: var(--jpz-bg-color);
    border-radius: 12px;
    padding: 48px 32px;
    border: 1px solid var(--jpz-border-color-lighter);
    text-align: center;
}

.forbidden-icon {
    color: var(--jpz-color-danger);
}

.forbidden-title {
    margin: 8px 0 0;
    font-size: 22px;
    font-weight: 700;
    color: var(--jpz-text-color-primary);
}

.forbidden-desc {
    margin: 0;
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
    line-height: 1.6;
}

.forbidden-hint {
    margin: 0;
    font-size: 13px;
    color: var(--jpz-text-color-placeholder);
    line-height: 1.6;
}
</style>

<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\component\no-use\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心不可用状态通用展示
-->

<template>
    <div class="billing-no-use">
        <div class="no-use-card">
            <el-icon class="no-use-icon" :size="64" :style="{ color: config.iconColor }">
                <component :is="config.icon" />
            </el-icon>
            <h2 class="no-use-title">{{ config.title }}</h2>
            <p class="no-use-desc">{{ config.desc }}</p>
            <p class="no-use-hint">{{ config.hint }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { CircleCloseFilled, WarnTriangleFilled } from "@element-plus/icons-vue"

defineOptions({ name: "BillingNoUse" })

const props = defineProps<{
    type: "forbidden" | "too-low"
}>()

const config = computed(() => {
    if (props.type === "forbidden") {
        return {
            icon: CircleCloseFilled,
            iconColor: "var(--jpz-color-danger)",
            title: "账户已被禁用",
            desc: "您的计费中心账户已被禁用，无法使用相关功能。",
            hint: "如有疑问，请联系计费中心管理员处理。",
        }
    }
    return {
        icon: WarnTriangleFilled,
        iconColor: "var(--jpz-color-warning)",
        title: "版本过低，请升级",
        desc: "当前 blog-server 版本过低，无法正常使用计费中心功能。",
        hint: "请将 blog-server 升级至最低要求版本后重试。",
    }
})
</script>

<style scoped lang="scss">
.billing-no-use {
    display: flex;
    justify-content: center;
    padding: 48px 8px;
}
.no-use-card {
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
.no-use-title {
    margin: 8px 0 0;
    font-size: 22px;
    font-weight: 700;
    color: var(--jpz-text-color-primary);
}
.no-use-desc {
    margin: 0;
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
    line-height: 1.6;
}
.no-use-hint {
    margin: 0;
    font-size: 13px;
    color: var(--jpz-text-color-placeholder);
    line-height: 1.6;
}
</style>

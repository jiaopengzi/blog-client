<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\no-permission\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 无权限页面
-->

<template>
    <div class="no-permission-container">
        <section class="no-permission-panel">
            <div class="panel-head">
                <span class="status-chip">ACCESS CONTROL</span>
                <span class="status-code">403</span>
            </div>

            <div class="hero-mark">No Access</div>

            <h1 class="title">无权限访问</h1>

            <p class="description">
                当前账号没有访问
                <strong>{{ pathDisplay || path || "该页面" }}</strong>
                的权限。
            </p>

            <div class="detail-list">
                <div class="detail-item detail-item-status">
                    <span class="detail-value">已拒绝</span>
                </div>
                <div class="detail-item detail-item-action">
                    <span class="detail-value">联系管理员申请权限或切换可访问账号</span>
                </div>
            </div>

            <div class="tips">如需继续操作, 请确认当前角色的菜单和接口授权配置。</div>
        </section>
    </div>
</template>
<script setup lang="ts">
import { useHead } from "@unhead/vue"
import { computed } from "vue"

import { RouteNames } from "@/router"

defineOptions({ name: RouteNames.NoPermission })

// 定义 props
const { headTitle, path, pathDisplay } = defineProps<{
    headTitle?: string
    pathDisplay?: string
    path?: string
}>()

const title = computed(() => headTitle || "后台管理 - 无权限")

useHead({
    title,
})
</script>
<style scoped lang="scss">
.no-permission-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 200px);
    padding: 40px 20px;
}

.no-permission-panel {
    width: min(760px, 100%);
    padding: 40px 36px;
    border-radius: 28px;
    border: 1px solid color-mix(in srgb, var(--jpz-color-secondary) 16%, var(--el-border-color));
    background:
        linear-gradient(145deg, color-mix(in srgb, var(--jpz-color-secondary) 6%, transparent), transparent 42%),
        linear-gradient(180deg, color-mix(in srgb, var(--el-bg-color-overlay) 96%, transparent), var(--el-bg-color));
    box-shadow:
        0 24px 60px rgb(15 23 42 / 8%),
        inset 0 1px 0 rgb(255 255 255 / 24%);
}

.panel-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.status-chip,
.status-code {
    font-size: 12px;
    letter-spacing: 0.16em;
    color: var(--jpz-text-color-secondary);
}

.status-chip {
    padding: 6px 10px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--el-fill-color-light) 84%, transparent);
    border: 1px solid var(--el-border-color-lighter);
}

.hero-mark {
    font-size: clamp(32px, 6vw, 64px);
    line-height: 1;
    letter-spacing: -0.04em;
    font-weight: 700;
    color: color-mix(in srgb, var(--jpz-text-color-primary) 92%, var(--jpz-color-secondary));
    margin-bottom: 18px;
}

.title {
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700;
    margin: 0 0 14px;
    color: var(--jpz-text-color-primary);
}

.description {
    margin: 0;
    max-width: 580px;
    font-size: 16px;
    line-height: 1.8;
    color: var(--jpz-text-color-secondary);

    strong {
        color: var(--jpz-color-secondary);
        font-weight: 700;
    }
}

.detail-list {
    display: grid;
    gap: 12px;
    margin: 32px 0 24px;
}

.detail-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    min-height: 56px;
    padding: 12px 0;
}

.detail-item-status {
    padding-top: 0;
}

.detail-value {
    color: var(--jpz-text-color-primary);
    font-weight: 600;
    text-align: right;
}

.tips {
    font-size: 14px;
    line-height: 1.8;
    color: var(--jpz-text-color-secondary);
}

@include respond-to("phone") {
    .no-permission-container {
        padding: 24px 12px 40px;
    }

    .no-permission-panel {
        padding: 28px 20px;
        border-radius: 22px;
    }

    .detail-item {
        justify-content: flex-start;
    }

    .detail-value {
        text-align: left;
    }
}
</style>

<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\no-permission\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 无权限页面
-->

<template>
    <div class="no-permission-container">
        <div class="no-permission">
            <h1 class="title">无权限</h1>
            <div class="message">
                您没有访问
                <strong>{{ pathDisplay || path || "该页面" }}</strong>
                的权限。
            </div>
            <div class="tips">如需访问，请联系管理员。</div>
        </div>
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
    height: calc(100vh - 200px);
}

.no-permission {
    text-align: center;

    .title {
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 20px;
        color: var(--jpz-text-color-primary);
    }

    .message {
        font-size: 18px;
        margin-bottom: 20px;

        strong {
            color: var(--jpz-color-secondary);
            font-weight: 700;
        }
    }

    .tips {
        font-size: 16px;
        color: var(--jpz-text-color-secondary);
    }
}
</style>

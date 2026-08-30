<!--
 * FilePath    : blog-client-nuxt\src\components\common\icons\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 图标组件
-->

<template>
    <div :class="iconClass ? `container ${iconClass}` : 'container'">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon">
            <use :xlink:href="iconMap[name]" />
        </svg>
    </div>
</template>

<script lang="ts" setup>
// 阶段 0 适配 (计划 7.2 前置): iconfont.js 顶层写入 window 全局, SSR 下不可加载,
// 改为仅客户端动态加载; SVG symbol 注入由客户端完成, 服务端渲染的 <use> 指向待注入 symbol
if (import.meta.client) {
    void import("./assets/iconfont.js")
}

import { computed } from "vue"

import { iconMap } from "./utils"

defineOptions({ name: "JIcon" })

const { name, customClass } = defineProps<{ name: string; customClass?: string }>()

// iconClass 为 icon 的 class 属性
const iconClass = computed(() => {
    return customClass ? `${name} ${customClass}` : name
})
</script>

<style scoped lang="scss">
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon {
    width: 1em;
    height: 1em;
    overflow: hidden;
    // fill 填充色 需要在阿里图标库中设置批量去掉去色
}
</style>

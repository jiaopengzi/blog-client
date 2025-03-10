<!--
 * @FilePath     : \blog-client\src\components\common\icons\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 图标组件
-->

<template>
    <div class="container" :class="iconClass">
        <svg class="icon" aria-hidden="true">
            <use :xlink:href="iconMap[name]" />
        </svg>
    </div>
</template>

<script lang="ts" setup>
import "./assets/iconfont.js"

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

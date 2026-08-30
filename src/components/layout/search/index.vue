<!--
 * FilePath    : blog-client-nuxt\src\components\layout\search\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 搜索
-->

<template>
    <div>
        <el-button class="search-btn" type="primary" @click="openSearch">
            <j-icon :name="IconKeys.Search" custom-class="search-icon" />
        </el-button>

        <!-- 搜索弹窗 -->
        <SearchDialog v-if="searchDialogVisible" v-model="searchDialogVisible" @search="handleSearch" />
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

import { IconKeys } from "@/components/common/icons"

import SearchDialog from "./search-dialog"

defineOptions({ name: "HeaderSearch" })

const emit = defineEmits<{
    (event: "handle-search", val: string): void
}>()

const handleSearch = (val: string) => {
    searchDialogVisible.value = false
    emit("handle-search", val)
}

const searchDialogVisible = ref(false)

const openSearch = (e: MouseEvent) => {
    // 弹窗打开前先失焦, 避免关闭时出现失焦动画
    ;(e.currentTarget as HTMLElement)?.blur()
    searchDialogVisible.value = true
}

// 弹窗关闭后让搜索按钮失焦, 避免焦点残留影响交互
watch(searchDialogVisible, (val) => {
    if (!val) {
        ;(document.activeElement as HTMLElement)?.blur()
    }
})
</script>

<style scoped lang="scss">
// bugfix(260825-02 bug02): 使用 .el-button.search-btn 双类提升优先级.
// element-plus 的 .el-button--primary:hover{background-color:...} 为 (0,2,0),
// 与本组件 scoped 编译后的 .search-btn[data-v] (0,2,0) 特异性打平;
// dev 下本样式后注入生效(hover 保持透明), preview 构建时 theme-chalk 动态 chunk CSS
// 后加载, 平局按加载顺序判定导致 hover 出现 element-plus 蓝色背景, 与 dev 表现不一致.
// 追加 .el-button 类后特异性 (0,3,0), 无论加载顺序 hover 均保持透明(透明按钮).
.el-button.search-btn {
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: none;
    padding: none;
}
.search-icon {
    font-size: 20px;
    padding: 6px;
    border-radius: 8px;
    fill: var(--el-text-color-regular);
    cursor: pointer;
    transition: color 0.6s;
    &:hover {
        fill: var(--el-text-color-primary);
        background-color: var(--jpz-bg-color-page);
    }
}
</style>

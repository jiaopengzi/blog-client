<template>
    <el-menu ellipsis class="el-menu-popper-demo" mode="horizontal" :popper-offset="16" style="max-width: 300px">
        <recursive-menu-item v-for="(item, key) in topLevelMenuItems" :key="key" :menu-item-map="menuItemMap" :menu-item="item" />
    </el-menu>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue"

import RecursiveMenuItem from "./recursive-menu-item.vue" // 引入递归菜单组件
import { testMenuItemMap } from "./utils"

// 定义组件名称
defineOptions({ name: "HeaderNav" })

// 生成菜单项索引
const menuItemMap = reactive(testMenuItemMap)

// 计算顶级菜单项
const topLevelMenuItems = computed(() => Object.values(menuItemMap).filter((item) => !item.parentIndex))
</script>

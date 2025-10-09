<!--
 * FilePath    : ./recursive-menu-item.vue
 * Description : 递归创建层级菜单
-->

<template>
    <!-- 当前菜单项没有子菜单时, 显示一个普通的菜单项 -->
    <el-menu-item :index="menuItem.index">
        <template #title>
            <span>{{ menuItem.text }}</span>
        </template>
    </el-menu-item>
</template>

<script lang="ts" setup>
import type { MenuItem, MenuItemMap } from "./types"

defineOptions({ name: "RecursiveMenuItem" })

// 定义组件属性（props）
const { menuItem } = defineProps<{
    menuItemMap: MenuItemMap<string>
    menuItem: MenuItem
}>()
</script>

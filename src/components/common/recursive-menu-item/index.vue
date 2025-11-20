<!--
 * @FilePath     : \blog-client\src\components\common\recursive-menu-item\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 递归创建层级菜单
-->

<template>
    <el-menu-item v-if="!getChildren(menuItem.index).length" :index="menuItem.index" class="no-children">
        <!-- 当前菜单项没有子菜单时，显示一个普通的菜单项 -->
        <!-- 注意 Icon 在 item 和 menu 是不同的 -->
        <img v-if="menuItem.icon?.src" :src="menuItem.icon?.src" :alt="menuItem.icon?.alt" :style="menuItem.icon?.style" class="icon-img" />
        <j-icon v-if="menuItem.icon?.name" :name="menuItem.icon.name" :custom-class="menuItem.icon.class" :style="menuItem.icon?.style" />
        <template #title>
            <span class="title">{{ menuItem.text }}</span>
        </template>
    </el-menu-item>

    <el-sub-menu v-else :index="menuItem.index">
        <!-- 当前菜单项有子菜单时，显示一个子菜单 -->
        <template #title>
            <img v-if="menuItem.icon?.src" :src="menuItem.icon?.src" :alt="menuItem.icon?.alt" :style="menuItem.icon?.style" class="icon-img" />
            <j-icon v-if="menuItem.icon?.name" :name="menuItem.icon.name" :custom-class="menuItem.icon.class" :style="menuItem.icon?.style" />
            <span class="title">{{ menuItem.text }}</span>
        </template>

        <!-- 递归调用自身组件，渲染子菜单项 -->
        <RecursiveMenuItem v-for="(item, key) in getChildren(menuItem.index)" :key="key" :menu-item-map="menuItemMap" :menu-item="item" />
    </el-sub-menu>
</template>

<script lang="ts" setup>
import type { MenuItemMapWithIndex, MenuItemWithIndex } from "./types"

defineOptions({ name: "RecursiveMenuItem" })

// 定义组件属性(props)
const { menuItemMap, menuItem } = defineProps<{
    menuItemMap: MenuItemMapWithIndex<string>
    menuItem: MenuItemWithIndex
}>()

// 根据父菜单索引获取子菜单
function getChildren(parentIndex: string) {
    return Object.values(menuItemMap).filter((item) => item.parentIndex === parentIndex)
}
</script>

<style scoped lang="scss">
.title {
    margin-left: 6px;
    font-weight: 700;
    // 文字过长时，显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.icon-img {
    width: 16px;
    height: 16px;
}
</style>

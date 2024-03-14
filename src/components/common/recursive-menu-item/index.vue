<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-17 20:28:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-14 16:48:11
 * @FilePath     : \blog-client\src\components\common\recursive-menu-item\index.vue
 * @Description  : 递归创建层级菜单
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <!-- 当前菜单项没有子菜单时，显示一个普通的菜单项 -->
    <!-- 注意 插槽的icon的位置 -->
    <el-menu-item v-if="!getChildren(menuItem.index).length" :index="menuItem.index">

        <Icon v-if="menuItem.icon" :name="menuItem.icon.name" :custom-class="menuItem.icon.class" />
        <template #title><span class="title">{{ menuItem.display }}</span></template>

    </el-menu-item>

    <!-- 当前菜单项有子菜单时，显示一个子菜单 -->
    <el-sub-menu v-else :index="menuItem.index">

        <template #title>
            <Icon v-if="menuItem.icon" :name="menuItem.icon.name" :custom-class="menuItem.icon.class" />
            <span class="title">{{ menuItem.display }}</span>
        </template>

        <!-- 递归调用自身组件，渲染子菜单项 -->
        <recursive-menu-item v-for="(item, key) in getChildren(menuItem.index)" :key="key" :menu-item-map="menuItemMap"
            :menu-item="item" />
    </el-sub-menu>
</template>

<script lang="ts" setup>

import Icon from '@/components/common/icons'
import type { MenuItemMapWithIndex, MenuItemWithIndex } from '@/components/common/recursive-menu-item'

defineOptions({ name: 'RecursiveMenuItem' })

// 定义组件属性（props）
const props = defineProps<{
    menuItemMap: MenuItemMapWithIndex<string>
    menuItem: MenuItemWithIndex
}>()

// 根据父菜单索引获取子菜单
function getChildren(parentIndex: string) {
    return Object.values(props.menuItemMap).filter((item) => item.parentIndex === parentIndex)
}
</script>

<style scoped lang="scss">
.title {
    margin-left: 10px;
    font-weight: 700;
    // 文字过长时，显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

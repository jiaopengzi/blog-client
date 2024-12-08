<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-17 20:33:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-07 15:06:54
 * @FilePath     : \blog-client\src\views\admin\component\aside\index.vue
 * @Description  : 左边菜单栏 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="aside">
        <div class="switch">
            <SwitchGroup :switch-items="isCollapseItem" @update-status="updateStatus" />
        </div>

        <el-scrollbar>
            <el-menu
                :default-openeds="['post']"
                :collapse="isCollapse"
                @select="handleSelect"
                @open="handleOpen"
                @close="handleClose"
                class="el-menu-vertical"
                :default-active="props.defaultActive"
                :router="true"
            >
                <recursive-menu-item
                    v-for="(item, key) in topLevelMenuItems"
                    :key="key"
                    :menu-item-map="menuItemMap"
                    :menu-item="item"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue"
import type { SwitchItem, SwitchItemLabel, SwitchItemColor } from "@/components/common/switch-group"
import { adminMenuItemMapWithIndex } from "@/views/admin/component/aside"
import { LocalStorageKey } from "@/api/responseCode"

import SwitchGroup from "@/components/common/switch-group"
import RecursiveMenuItem from "@/components/common/recursive-menu-item" // 引入递归菜单组件

// 定义组件名称
defineOptions({ name: "AdminAside" })

// 定义组件 props
const props = defineProps<{
    defaultActive: string | undefined // 默认选中的菜单项
}>()

// 定义组件事件
const emit = defineEmits<{
    (event: "select", index: string, keyPath: string[]): void
    (event: "collapse-status", isCollapse: boolean): void
}>()

// switch 开关 标签
const label: SwitchItemLabel = {
    labelTrue: "收起",
    labelFalse: "展开",
}

// switch 开关 颜色
const color: SwitchItemColor = {
    colorTrue: "#ffffff10",
    colorFalse: "#ffffff10",
}

// 菜单是否折叠
const savedIsCollapse = localStorage.getItem(LocalStorageKey.IsCollapse)
const isCollapse = ref(savedIsCollapse !== null ? savedIsCollapse === "true" : false)

// switch 开关
const isCollapseItem: SwitchItem[] = reactive([
    {
        name: "isCollapse",
        status: isCollapse.value,
        label: label,
        color: color,
    },
])

// 更新菜单折叠状态
const updateStatus = (items: SwitchItem[]) => {
    // 首选读取本地存储的状态 如果没有则使用默认状态
    localStorage.setItem(LocalStorageKey.IsCollapse, items[0].status.toString())
    isCollapse.value = items[0].status
    emit("collapse-status", items[0].status)
}

// 生成菜单项索引
const menuItemMap = reactive(adminMenuItemMapWithIndex)

// 计算顶级菜单项
const topLevelMenuItems = computed(() =>
    Object.values(menuItemMap).filter((item) => !item.parentIndex),
)

// 处理菜单项选中事件
const handleSelect = (index: string, keyPath: string[]) => {
    emit("select", index, keyPath)
}

// 处理菜单项展开事件
const handleOpen = (index: string, keyPath: string[]) => {
    // console.log(index, keyPath)
}

// 处理菜单项折叠事件
const handleClose = (index: string, keyPath: string[]) => {
    // console.log(index, keyPath)
}
</script>

<style scoped lang="scss">
.aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
}

.switch {
    
  
}

.el-menu-vertical {
    overflow-x: hidden;
    border-right: none;
    // --el-menu-bg-color: transparent;
    // --el-menu-text-color: #fff;
    --el-menu-active-color: #409eff;
}

// 参考官方文档：https://element-plus.org/zh-CN/component/menu.html#collapse-%E6%8A%98%E5%8F%A0%E9%9D%A2%E6%9D%BF
.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
}

:deep(.icon-menu) {
    fill: $primary-color;
    font-size: 1.2em;
}
</style>

<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-25 14:29:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-25 14:31:04
 * @FilePath     : \blog-client\src\views\admin\component\header\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div>头部</div>
    <div class="switch">
        <SwitchGroup :switch-items="themeSwitch" @update-status="updateStatus" />
    </div>
</template>
<script setup lang="ts">
import { useTheme } from "@/components/hooks/useTheme"
import SwitchGroup from "@/components/common/switch-group"
defineOptions({ name: "AdminHeader" })

// 主题切换
const { themeSwitch, updateStatus } = useTheme()
</script>
<style scoped lang="scss"></style>

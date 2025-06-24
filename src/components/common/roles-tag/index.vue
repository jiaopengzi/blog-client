<!--
 * FilePath    : blog-client\src\components\common\roles-tag\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 角色标签
-->

<template>
    <el-scrollbar max-height="300px">
        <div class="tag-box">
            <el-tag v-for="item in items" :tag-data="item" :key="item.role_name" @click="handleClick(item)" class="tag-item" size="default" :round="false">
                {{ item.role_name }} ({{ item.user_count }})
            </el-tag>
        </div>
    </el-scrollbar>
</template>

<script setup lang="ts">
import { type UserCountGroupByRole } from "@/api/user/getUserCountGroupByRole"

defineOptions({ name: "RolesTag" })

const { items } = defineProps<{
    items: UserCountGroupByRole[]
}>()
const emit = defineEmits<{
    (event: "click", item: UserCountGroupByRole): void
}>()

const handleClick = (tagItemData: UserCountGroupByRole) => {
    emit("click", tagItemData)
}
</script>
<style scoped lang="scss">
.tag-box {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 10px 0;
}

.tag-item {
    cursor: pointer;
    border: none;
}
</style>

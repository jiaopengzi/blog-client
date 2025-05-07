<!--
 * @FilePath     : \blog-client\src\components\common\tag-item\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 标签组件
-->

<template>
    <tag-item-base :tag-base="tagBase" @click-item="handleClick" />
</template>

<script lang="ts" setup>
import { computed, type ComputedRef } from "vue"

import { type PostTag } from "@/api/postTag/view"

import TagItemBase, { type TagBase } from "../tag-item-base"

defineOptions({ name: "TagItem" })

const { tagData, isAdmin = false } = defineProps<{
    isAdmin?: boolean
    tagData: PostTag
}>()

const emit = defineEmits<{
    (event: "click", tagItemData: PostTag): void
}>()

const tagBase: ComputedRef<TagBase> = computed(() => {
    let display = ""
    if (isAdmin) {
        display = `${tagData.name}(${tagData.post_count_admin})`
    } else {
        display = `${tagData.name}(${tagData.post_count})`
    }

    return {
        id: tagData.id,
        display,
    }
})

// 点击标签跳转到标签页面
const handleClick = () => {
    emit("click", tagData)
}
</script>

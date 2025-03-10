<!--
 * @FilePath     : \blog-client\src\components\common\add-tag\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 添加标签
-->

<template>
    <div class="tag-group">
        <el-tag v-for="tag in dynamicTags" :key="tag" class="tag-item" size="large" closable :disable-transitions="false" @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input class="tag-input" v-if="inputVisible" ref="InputRef" v-model="inputValue" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button class="tag-input" v-else @click="showInput"> + 新标签 </el-button>
        <el-button type="primary" class="show-all-tag" @click="changeIsShowAllTag">选择标签</el-button>
    </div>

    <PostTag v-if="isShowAllTag" :is-admin="true" class="el-aside-item" @click="handleTagClick" />
</template>

<script lang="ts" setup>
import type { ElInput } from "element-plus"
import { computed, nextTick, ref, useTemplateRef } from "vue"

import { type PostTag as PostTagType } from "@/api/postTag/view"
import PostTag from "@/components/layout/aside/post-tag"

defineOptions({ name: "AddTag" })

const props = defineProps<{
    tagListIn: string[]
}>()

const emit = defineEmits<{
    (event: "update-tag-list", tagList: string[]): void
}>()

const inputValue = ref("")
const dynamicTags = computed(() => [...props.tagListIn])
const inputVisible = ref(false)
const InputRef = useTemplateRef<InstanceType<typeof ElInput>>("InputRef")
const isShowAllTag = ref(false)

const handleClose = (tag: string) => {
    console.log(tag)
    // 根据 tag 的值,从 dynamicTags 获取该 tag 的索引 index 移除该 tag
    const newTags = [...dynamicTags.value]
    newTags.splice(newTags.indexOf(tag), 1)

    // 根据 tag 的值,从 dynamicTags 中删除该 tag 使用 filter ,大型数据量时不推荐使用
    // const newTags = dynamicTags.value.filter((item) => item !== tag)
    emit("update-tag-list", newTags)
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}

const handleInputConfirm = () => {
    if (inputValue.value) {
        let newTags = [...dynamicTags.value]
        // 检查是否包含半角逗号,如果包含则分割成数组
        if (inputValue.value.includes(",")) {
            const tags = inputValue.value.split(",")
            tags.forEach((tag) => {
                // 去除首尾空格
                tag = tag.trim()
                newTags.push(tag)
            })
        } else {
            newTags.push(inputValue.value)
        }
        // 对 dynamicTags 进行去重
        newTags = Array.from(new Set(newTags))
        emit("update-tag-list", newTags)
    }
    inputVisible.value = false
    inputValue.value = ""
}

const handleTagClick = (tagItemData: PostTagType) => {
    const newTags = [...dynamicTags.value, tagItemData.name]
    emit("update-tag-list", Array.from(new Set(newTags)))
}

const changeIsShowAllTag = () => {
    isShowAllTag.value = !isShowAllTag.value
}
</script>

<style scoped lang="scss">
.tag-item {
    margin: 4px 4px;
}
.tag-input {
    width: 80px;
    margin: 4px 4px;
}

.show-all-tag {
    margin: 4px 4px;
    width: 80px;
}
</style>

<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 15:40:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-04 22:01:36
 * @FilePath     : \blog-client\src\components\common\add-tag\index.vue
 * @Description  : 添加标签组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="tag-group">
        <el-tag v-for="tag in dynamicTags" :key="tag" class="tag-item" size="large" closable
            :disable-transitions="false" @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input class="tag-input" v-if="inputVisible" ref="InputRef" v-model="inputValue"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button class="tag-input" v-else @click="showInput"> + 新标签 </el-button>
    </div>
    <el-button type="primary" class="show-all-tag" @click="changeIsShowAllTag">从常用标签中选择</el-button>
    <PostTag v-if="isShowAllTag" class="el-aside-item" @click="handleTagClick" />
</template>

<script lang="ts" setup>
import { nextTick, ref, computed, useTemplateRef } from 'vue'
import type { ElInput } from 'element-plus'

import type { TagDataObj } from '@/components/common/tag-item'

import PostTag from '@/components/layout/aside/post-tag'


defineOptions({ name: 'AddTag' })

const props = defineProps<{
    tagListIn: string[]
}>()

const emit = defineEmits<{
    (evnet: 'update-tag-list', tagList: string[]): void
}>()


const inputValue = ref('')
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
    emit('update-tag-list', newTags)
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
        if (inputValue.value.includes(',')) {
            const tags = inputValue.value.split(',')
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
        emit('update-tag-list', newTags)
    }
    inputVisible.value = false
    inputValue.value = ''
}

const handleTagClick = (tagItemData: TagDataObj) => {
    const newTags = [...dynamicTags.value, tagItemData.label]
    emit('update-tag-list', Array.from(new Set(newTags)))
}

const changeIsShowAllTag = () => {
    isShowAllTag.value = !isShowAllTag.value
}

</script>

<style scoped lang="scss">
.tag-group {

    .tag-item {
        margin: 2px 2px;
    }

    .tag-input {
        width: 100px;
        margin-left: 2px;
    }
}

.show-all-tag {
    // 宽度刚好适应文本宽度
    width: fit-content;
    margin-top: 4px;
}
</style>
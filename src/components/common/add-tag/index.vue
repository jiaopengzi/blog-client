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

    <PostTag v-if="isShowAllTag" :is-admin="true" :items="postTags" class="el-aside-item" @click="handleTagClick" />
</template>

<script lang="ts" setup>
import type { ElInput } from "element-plus"
import { computed, nextTick, onBeforeMount, ref, useTemplateRef } from "vue"

import { type PostTag as PostTagType } from "@/api/postTag/view"
import PostTag, { usePostTagData } from "@/components/layout/aside/post-tag"
import MessageUtil from "@/utils/message"

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

/**
 * 标签验证结果类型
 */
interface TagValidationResult {
    /** 是否验证通过 */
    valid: boolean;
    /** 错误信息（验证失败时） */
    error?: string;
    /** 解析后的标签数组（验证成功时） */
    tags?: string[];
}

/**
 * 验证标签输入并返回验证结果和解析后的标签数组
 * @param raw - 待验证的原始标签字符串
 * @returns 包含验证状态、错误信息和标签数组的对象
 */
const validateAndParseTags = (raw: string): TagValidationResult => {
    // 检查标签是否为空
    if (!raw) {
        return { valid: false, error: "标签不能为空" }
    }

    let tags: string[] = []

    // 处理包含半角逗号的多标签情况
    if (raw.includes(",")) {
        const parts = raw.split(",")
        // 遍历每个分割后的标签部分进行验证
        for (let p of parts) {
            if (p !== p.trim()) {
                return { valid: false, error: "标签前后不能有空格" }
            }
            if (p.trim().length === 0) {
                return { valid: false, error: "标签不能为空" }
            }
            tags.push(p.trim())
        }
    } else {
        // 单标签情况下直接检查前后是否有空格
        if (raw !== raw.trim()) {
            return { valid: false, error: "标签前后不能有空格" }
        }
        tags.push(raw.trim())
    }

    return { valid: true, tags }
}

const handleInputConfirm = () => {
    const rawValue = inputValue.value
    
    // 若为空输入则直接关闭输入框
    if (!rawValue) {
        inputVisible.value = false
        inputValue.value = ""
        return
    }

    // 验证并解析标签
    const result = validateAndParseTags(rawValue)
    
    // 验证失败，显示错误信息并保持输入框聚焦
    if (!result.valid) {
        MessageUtil.warning(result.error!)
        inputVisible.value = true
        nextTick(() => {
            InputRef.value!.input!.focus()
        })
        return
    }

    // 验证通过，处理标签
    const parsedTags = result.tags!
    if (parsedTags.length === 0) {
        inputVisible.value = false
        inputValue.value = ""
        return
    }

    let newTags = [...dynamicTags.value]
    parsedTags.forEach((tag) => {
        newTags.push(tag)
    })
    
    // 对 dynamicTags 进行去重
    newTags = Array.from(new Set(newTags))
    emit("update-tag-list", newTags)

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

// 获取文章标签数据
const { items: postTags, getTagTopN } = usePostTagData(true)
onBeforeMount(async () => {
    await getTagTopN()
})
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

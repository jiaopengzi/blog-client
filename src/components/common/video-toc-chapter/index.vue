<!--
 * FilePath    : blog-client\src\components\common\video-toc-chapter\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频目录章节
-->
<template>
    <div class="demo-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Consistency" name="1">
                <div>第1集</div>
                <div>第2集</div>
                <div>第3集</div>
                <div>第4集</div>
            </el-collapse-item>
            <el-collapse-item title="Feedback" name="2">
                <div>第5集</div>
                <div>第6集</div>
                <div>第7集</div>
                <div>第8集</div>

                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item title="Consistency" name="1">
                        <div>第1集</div>
                        <div>第2集</div>
                        <div>第3集</div>
                        <div>第4集</div>
                    </el-collapse-item>
                    <el-collapse-item title="Feedback" name="2">
                        <div>第5集</div>
                        <div>第6集</div>
                        <div>第7集</div>
                        <div>第8集</div>
                    </el-collapse-item>
                </el-collapse>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script lang="ts" setup>
import type { CollapseModelValue } from "element-plus"
import { ref } from "vue"

defineOptions({ name: "VideoTocChapter" })

const {
    order = 1,
    orderTotal = 1,
    text = "",
} = defineProps<{
    order?: number // 序号
    orderTotal?: number // 总数
    text?: string // 文本
}>()

// 事件
const emit = defineEmits<{
    (event: "finishEdit", val: string): void
}>()
const activeNames = ref(["1"])
const handleChange = (val: CollapseModelValue) => {
    console.log(val)
}
</script>
<style lang="scss" scoped></style>

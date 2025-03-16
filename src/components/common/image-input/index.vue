<!--
 * @FilePath     : \blog-client\src\components\common\image-input\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 图片文件选择插入框
-->

<template>
    <div :class="modelValue ? 'media-container-show-image' : 'media-container'">
        <div class="media-input">
            <el-input class="media-input-item" :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" v-bind="$attrs" />
            <el-button class="media-input-item media-input-btn" type="primary" @click="mediaDialogVisible = true">
                <span>选择</span>
            </el-button>
        </div>

        <!-- 显示出选择的图片 -->
        <el-image class="media-show" v-if="modelValue" style="height: 100px; width: auto" :src="modelValue" fit="contain" />
    </div>

    <!-- 媒体文件选择弹窗 -->
    <SelectMedia v-model="mediaDialogVisible" @insert-data="insertData" />
</template>

<script lang="ts" setup>
import { ref } from "vue"

import type { TableData } from "@/components/common/base-table"
import SelectMedia from "@/components/common/media-select"
import { MessageUtil } from "@/utils/message"

// 定义组件名称
defineOptions({ name: "ImageInput", inheritAttrs: false })

const { modelValue = "" } = defineProps<{
    modelValue: string // 绑定值
}>()

// 定义 emits 事件
const emit = defineEmits(["update:modelValue"])

const mediaDialogVisible = ref(false)
const insertData = (data: TableData[]) => {
    // 不满足条件直接返回
    if (data.length === 0) return

    if (data.length > 1) {
        MessageUtil.warning("只能选择一个媒体文件")
        return
    }

    // 遍历数据插入到编辑器
    for (const item of data) {
        // 判断 file_type 是否在 item 中, 即为 Media 类型
        if (!("file_type" in item)) return

        // 判断是否为图片类型
        if (item.file_type.startsWith("image")) {
            emit("update:modelValue", item.url_belong + item.path)
        } else {
            MessageUtil.warning("只能选择图片文件")
            return
        }
    }

    // 关闭弹窗
    mediaDialogVisible.value = false
}
</script>

<style scoped lang="scss">
.media-container {
    display: flex;
    flex-direction: column;
    padding: 10px 0;
}

.media-container-show-image {
    // 继承 media-container 样式
    @extend .media-container;

    border-bottom: 1px solid var(--jpz-border-color);
}

.media-input {
    display: flex;
    justify-content: center;
    align-items: center;

    .media-input-btn {
        margin-left: 10px;
    }
}

.media-show {
    margin-top: 10px;
}
</style>

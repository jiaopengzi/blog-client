<!--
 * FilePath    : blog-client-nuxt\src\components\common\slide-verify-manage\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 滑动验证图片管理(卡片式布局, 字段 label 同行左置, 图片链接支持媒体库选择, 复用 ImageInput)
-->

<!--
 * 补充说明:
 * 每条图片为一个独立卡片: 头部为序号 + 删除按钮; 字段 label 左置同行显示
 * (label-position left + 固定 label-width, 与 app-option 页其他表单项一致, bug01 260903-01);
 * ImageInput 自带输入行 + 预览行, 高度自适应
-->

<template>
    <div class="form-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="formRef"
            :model="formData"
            :rules="rules"
            class="form-content"
            :size="formSize"
            status-icon
        >
            <div v-for="(fItem, index) in formData" :key="index" class="item-card">
                <div class="item-card__header">
                    <span class="item-card__title">滑动验证图 {{ index + 1 }}</span>
                    <el-button type="danger" link size="small" @click="remove(index)">删除</el-button>
                </div>
                <el-form-item label="图片链接" :prop="`[${index}].imageUrl`" :rules="rules.imageUrl">
                    <ImageInput v-model="fItem.imageUrl" placeholder="图片链接" clearable />
                </el-form-item>
            </div>
            <el-button type="primary" plain class="form-row-add" @click="add">+ 增加滑动验证图片</el-button>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, ref, toRaw, useTemplateRef, watch } from "vue"

import ImageInput from "@/components/common/image-input"

import { type SlideVerifyImgItem } from "./types"

defineOptions({ name: "SlideVerifyManage" })

const { data = [] } = defineProps<{
    data?: SlideVerifyImgItem[]
}>()

// 表单 label 位置 top | left | right; left 配合固定 label-width 与 app-option 页其他表单项一致, 同行显示 (bug01 260903-01)
const labelPosition = ref<"left" | "right" | "top">("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref<"" | "default" | "small" | "large">("default")

// 表单实例
const formRef = useTemplateRef<FormInstance>("formRef")

// 表单数据
const formData = ref<SlideVerifyImgItem[]>(data)

// 添加
const add = () => {
    formData.value.push({
        imageUrl: "",
    })
}

// 删除
const remove = (index: number) => {
    formData.value.splice(index, 1)
}

watch(
    () => data,
    (newVal) => {
        formData.value = newVal
    },
    {
        deep: true,
    },
)

// 验证规则
const rules = reactive<FormRules<SlideVerifyImgItem>>({
    imageUrl: [
        { required: true, message: "请输入图片链接", trigger: "blur" },
        { type: "url", message: "请输入正确图片链接", trigger: "blur" },
    ],
})

defineExpose({
    get formDataResult() {
        return toRaw(formData.value)
    },
    validateForm: async (): Promise<boolean> => {
        if (formRef.value) {
            try {
                await formRef.value.validate()
                return true
            } catch {
                return false
            }
        }
        return false
    },
})
</script>

<style lang="scss" scoped>
// 透明背景融入 base-form 白卡片, 由 item-card 边框提供结构层次
.form-page {
    width: 100%;
    margin: 16px 0 8px;
}

.form-content {
    width: 100%;

    .item-card {
        padding: 14px 16px 0;
        border: 1px solid var(--jpz-border-color-lighter);
        border-radius: 8px;
        background-color: var(--jpz-bg-color);

        & + .item-card {
            margin-top: 12px;
        }
    }

    .item-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .item-card__title {
        font-size: 13px;
        font-weight: 600;
        color: var(--jpz-text-color-regular);
    }
}

// 增加按钮: 通栏虚线, 与卡片形成"可追加"的视觉暗示
.form-row-add {
    width: 100%;
    margin-top: 12px;
    border-style: dashed;
}
</style>

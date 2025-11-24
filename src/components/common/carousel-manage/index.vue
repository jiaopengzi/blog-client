<!--
 * FilePath    : blog-client-dev\src\components\common\carousel-manage\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 轮播图管理
-->

<template>
    <div class="form-page">
        <el-form :label-position="labelPosition" ref="formRef" :model="formData" :rules="rules" class="form-content" :size="formSize" status-icon>
            <el-form-item v-for="(fItem, index) in formData" :key="index" class="form-row">
                <el-form-item label="图片链接" :prop="`[${index}].imageUrl`" :rules="rules.imageUrl" class="form-cell">
                    <el-input v-model="fItem.imageUrl" placeholder="图片链接" clearable />
                    <!-- 预览效果 -->
                    <el-image class="img-preview" v-if="fItem.imageUrl" :src="fItem.imageUrl" alt="预览" fit="contain" />
                </el-form-item>
                <el-form-item label="跳转链接" :prop="`[${index}].linkUrl`" :rules="rules.linkUrl" class="form-cell">
                    <el-input v-model="fItem.linkUrl" placeholder="跳转链接" clearable />
                </el-form-item>
                <el-form-item label="图片替代文本" :prop="`[${index}].altText`" :rules="rules.altText" class="form-cell">
                    <el-input v-model="fItem.altText" placeholder="图片替代文字" clearable />
                </el-form-item>
                <el-button type="danger" @click="removeRule(index)" size="small" class="form-cell">删除</el-button>
            </el-form-item>
            <el-button type="primary" @click="addRule" size="small" class="form-row-add">增加轮播图</el-button>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, ref, toRaw, useTemplateRef, watch } from "vue"

import { type CarouselItem } from "./types"

defineOptions({ name: "CarouselManage" })

const { data = [] } = defineProps<{
    data?: CarouselItem[]
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const formRef = useTemplateRef<FormInstance>("formRef")

// 表单数据
const formData = ref<CarouselItem[]>(data)

// 添加规则
const addRule = () => {
    formData.value.push({
        imageUrl: "",
        linkUrl: "",
        altText: "",
    })
}

// 删除规则
const removeRule = (index: number) => {
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
const rules = reactive<FormRules<CarouselItem>>({
    imageUrl: [
        { required: true, message: "请输入轮播图链接", trigger: "blur" },
        { type: "url", message: "请输入正确的链接地址", trigger: "blur" },
    ],
    linkUrl: [{ type: "url", message: "请输入正确的跳转链接地址", trigger: "blur" }],
    altText: [{ max: 100, message: "图片替代文本不能超过100个字符", trigger: "blur" }],
})

defineExpose({
    get formDataResult() {
        return toRaw(formData.value) // 使用 toRaw 获取原始数据
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
.form-page {
    height: 100%;
    width: 100%;
    background-color: var(--jpz-bg-color-page);
    margin: 40px 0;
}

.form-content {
    width: 100%;
    // border: 1px solid var(--jpz-border-color);
    // border-radius: 5px;
    // padding: 20px;
    // box-shadow: var(--jpz-box-shadow-light);
    background-color: var(--jpz-bg-color);

    .form-row {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .form-cell {
            margin: 0 10px;
            height: 32px;

            .img-preview {
                width: 86px;
                height: 32px;
                margin: 0 5px;
            }
        }
    }

    .el-input {
        width: 140px;
    }
}
</style>

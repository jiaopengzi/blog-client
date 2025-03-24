<!--
 * FilePath    : blog-client\src\views\admin\component\main\app-option\base\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 网站选项基础组件
-->

<template>
    <el-form
        label-position="left"
        :label-width="labelWidth ? `${labelWidth}px` : '100px'"
        ref="formRef"
        :model="formDataResult"
        :rules="rules"
        class="base-form"
        size="default"
        status-icon
        :scroll-to-error="true"
        :scroll-into-view-options="{ behavior: 'smooth', block: 'center' }"
        :style="{ width: formWidth ? `${formWidth}px` : '100%' }"
    >
        <h2 class="title">{{ title }}</h2>
        <template v-for="(item, index) in formItems" :key="index">
            <!-- 如果是分类标题，则使用 h4 显示在表单项外 -->
            <h4 v-if="item.isCategoryTitle" class="category-title">{{ item.label }}</h4>

            <!-- 否则就是普通表单项 -->
            <el-form-item v-else :label="item.label" :prop="item.prop">
                <el-checkbox v-if="item.isCheckbox" v-model="formDataResult[item.prop as keyof APPOptionForm]" />
                <ImageInput
                    v-else-if="item.isImageInput"
                    v-model="formDataResult[item.prop as keyof APPOptionForm] as string"
                    :type="item.type"
                    :placeholder="item.placeholder"
                    clearable
                />
                <el-input v-else v-model="formDataResult[item.prop as keyof APPOptionForm]" :type="item.type" :placeholder="item.placeholder" clearable />
            </el-form-item>
        </template>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, useTemplateRef } from "vue"

import ImageInput from "@/components/common/image-input"

import { type APPOptionForm } from "./types"

defineOptions({ name: "BaseForm" })

const { title, formData, rules, formItems, formWidth, labelWidth } = defineProps<{
    title: string
    formData: APPOptionForm
    rules: FormRules
    formItems: Array<{
        label: string
        prop?: string
        type?: string
        placeholder?: string
        isImageInput?: boolean
        isCheckbox?: boolean
        isCategoryTitle?: boolean
    }>
    formWidth?: number
    labelWidth?: number
}>()

const formRef = useTemplateRef<FormInstance>("formRef")

const formDataResult = reactive<APPOptionForm>(formData)

defineExpose({
    formDataResult,
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
.base-form {
    width: 100%;
    // border-bottom: 1px solid var(--jpz-border-color);
    padding: 20px;
    background-color: var(--jpz-bg-color);
    // .el-input {
    //     --el-input-width: 220px;
    // }
    border-radius: 6px;
    box-shadow: var(--jpz-box-shadow-light);
}

.title {
    text-align: left;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--jpz-text-color-regular);
}
.category-title {
    font-size: 14px;
    font-weight: 700;
    margin-top: 40px;
    margin-bottom: 10px;
    color: var(--jpz-text-color-regular);
    // padding-bottom: 4px;
    // border-bottom: 1px solid var(--jpz-border-color);
}
</style>

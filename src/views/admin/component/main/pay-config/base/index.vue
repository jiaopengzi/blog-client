<!--
 * FilePath    : blog-client\src\views\admin\component\main\pay-config\base\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 支付配置基础组件
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
            <el-form-item :label="item.label" :prop="item.prop">
                <div class="form-item">
                    <div class="input-wrapper">
                        <el-checkbox v-if="item.isCheckbox" v-model="formDataResult[item.prop as KeyofFormView]" />
                        <el-input
                            v-else-if="item.type === 'password'"
                            v-model="formDataResult[item.prop as KeyofFormView]"
                            :type="item.type"
                            :placeholder="item.placeholder"
                            show-password
                            clearable
                        />
                        <el-input v-else v-model="formDataResult[item.prop as KeyofFormView]" :type="item.type" :placeholder="item.placeholder" clearable />
                    </div>
                    <!-- 说明文字 -->
                    <div v-if="item.description" class="description">{{ item.description }}</div>
                </div>
            </el-form-item>
        </template>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, useTemplateRef, watch } from "vue"

import type { FormView, KeyofFormView } from "./types"

defineOptions({ name: "BaseForm" })

const { title, formData, rules, formItems, formWidth, labelWidth } = defineProps<{
    title: string
    formData: FormView
    rules: FormRules
    formItems: Array<{
        label: string
        prop?: string
        type?: string
        placeholder?: string
        isCheckbox?: boolean
        description?: string
    }>
    formWidth?: number
    labelWidth?: number
}>()

const formRef = useTemplateRef<FormInstance>("formRef")

const formDataResult = reactive<FormView>(formData)

// 监听 formData 的变化，更新 formDataResult
watch(
    () => formData,
    (newData) => {
        Object.assign(formDataResult, newData)
    },
    { deep: true, immediate: true },
)

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

.form-item {
    display: flex;
    flex-direction: column;
    width: 100%;

    .input-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .description {
        font-size: 12px;
        color: var(--jpz-text-color-placeholder);
    }
}
</style>

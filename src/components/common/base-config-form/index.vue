<!--
 * @FilePath     : \blog-client\src\components\common\base-config-form\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 配置表单-基础组件
-->

<template>
    <el-form
        label-position="left"
        :label-width="labelWidth ? `${labelWidth}px` : '100px'"
        ref="formRef"
        :model="configFormData"
        :rules="rules"
        class="config-form"
        size="default"
        status-icon
        :scroll-to-error="true"
        :scroll-into-view-options="{ behavior: 'smooth', block: 'center' }"
        :style="{ width: formWidth ? `${formWidth}px` : '100%' }"
    >
        <h2 class="title">{{ title }}</h2>

        <el-form-item v-for="item in formItems" :key="item.prop" :label="item.label" :prop="item.prop">
            <el-input
                v-if="!item.isCheckbox"
                v-model="configFormData[item.prop as keyof BaseConfigFormType]"
                :type="item.type"
                :placeholder="item.placeholder"
                :show-password="item.showPassword"
                clearable
            />

            <el-checkbox v-if="item.isCheckbox" v-model="configFormData[item.prop as keyof BaseConfigFormType]" />
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, useTemplateRef } from "vue"

import { type BaseConfigFormType } from "./types"

defineOptions({ name: "BaseConfigForm" })

const { title, formData, rules, formItems, formWidth, labelWidth } = defineProps<{
    title: string
    formData: BaseConfigFormType
    rules: FormRules
    formItems: Array<{
        label: string
        prop: string
        type?: string
        placeholder?: string
        showPassword?: boolean
        isCheckbox?: boolean
    }>
    formWidth?: number
    labelWidth?: number
}>()

const formRef = useTemplateRef<FormInstance>("formRef")

const configFormData = reactive<BaseConfigFormType>(formData)

defineExpose({
    configFormData,
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
.config-form {
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
</style>

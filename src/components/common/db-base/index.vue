<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-08 17:43:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-17 14:44:11
 * @FilePath     : \blog-client\src\components\common\db-base\index.vue
 * @Description  : 数据库配置表单-基础组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="db-form-page">
        <el-form
            label-position="left"
            label-width="100px"
            ref="formRef"
            :model="dbFormData"
            :rules="rules"
            class="db-form"
            size="default"
            status-icon
            :scroll-to-error="true"
            :scroll-into-view-options="{ behavior: 'smooth', block: 'center' }"
            :style="{ width: formWidth ? `${formWidth}px` : '100%' }"
        >
            <h2>{{ title }}</h2>

            <el-form-item v-for="item in formItems" :key="item.prop" :label="item.label" :prop="item.prop">
                <el-input
                    v-model="dbFormData[item.prop as keyof DbFormType]"
                    :type="item.type"
                    :placeholder="item.placeholder"
                    :show-password="item.showPassword"
                    clearable
                />
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, useTemplateRef } from "vue"

import { type DbFormType } from "./types"

defineOptions({ name: "DatabaseForm" })

const { title, db, rules, formItems } = defineProps<{
    title: string
    db: DbFormType
    rules: FormRules
    formItems: Array<{
        label: string
        prop: string
        type?: string
        placeholder?: string
        showPassword?: boolean
    }>
    formWidth?: number
}>()

const formRef = useTemplateRef<FormInstance>("formRef")

const dbFormData = reactive<DbFormType>(db)

defineExpose({
    dbFormData,
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
.db-form-page {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--jpz-bg-color-page);
}

.db-form {
    width: 100%;
    // border-bottom: 1px solid var(--jpz-border-color);
    padding: 20px;
    background-color: var(--jpz-bg-color);
    // .el-input {
    //     --el-input-width: 220px;
    // }
    border-radius: 6px;
}

h2 {
    text-align: left;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--jpz-text-color-regular);
}
</style>

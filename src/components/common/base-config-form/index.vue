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
        <div class="attention" v-if="attention !== ''">{{ attention }}</div>

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

        <!-- 额外内容插槽, 用于在表单卡片内部添加自定义内容 -->
        <slot />

        <!-- 云存储配置校验区域, 仅在传入 cloudType 时显示 -->
        <div v-if="cloudType" class="check-config-area">
            <el-button type="primary" size="small" :loading="checking" @click="handleCheckConfig">校验配置</el-button>
            <span class="check-config-tip">请先启用，并保存配置后，再校验</span>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, useTemplateRef } from "vue"

import { type CloudType, useCheckCloudConfig } from "@/components/hooks/useCheckCloudConfig"

import { type BaseConfigFormType } from "./types"

defineOptions({ name: "BaseConfigForm" })

const {
    title,
    formData,
    rules,
    formItems,
    formWidth,
    labelWidth,
    attention = "",
    cloudType,
} = defineProps<{
    title: string // 表单标题
    attention?: string // 注意事项
    formData: BaseConfigFormType // 表单数据
    rules: FormRules // 表单验证规则
    formItems: Array<{
        label: string // 标签
        prop: string // 字段名
        type?: string // 输入框类型
        placeholder?: string // 输入框占位符
        showPassword?: boolean // 是否显示密码切换按钮
        isCheckbox?: boolean // 是否为复选框
    }>
    formWidth?: number // 表单宽度
    labelWidth?: number // 标签宽度
    cloudType?: CloudType // 云存储类型, 传入时显示校验配置按钮
}>()

const formRef = useTemplateRef<FormInstance>("formRef")

const configFormData = reactive<BaseConfigFormType>(formData)

// 云存储配置校验, 仅在传入 cloudType 时初始化
const { checking, handleCheckConfig } = cloudType ? useCheckCloudConfig(cloudType) : { checking: undefined, handleCheckConfig: undefined }

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

.attention {
    color: var(--jpz-text-color-regular);
    font-size: 14px;
    font-weight: 700;
    margin: 20px 0;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
}

.check-config-area {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 10px;
}

.check-config-tip {
    color: var(--jpz-text-color-regular);
    font-size: 14px;
    font-weight: 700;
    margin: 20px 0;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
}
</style>

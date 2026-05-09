<!--
 * FilePath    : blog-client\src\components\editor\components\settings\vim-settings\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Vim 默认映射设置表单组件
-->

<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="快捷键映射" prop="mappingText">
            <el-input v-model="form.mappingText" type="textarea" :rows="7" :placeholder="mappingPlaceholderText" />
            <div class="mapping-tip">留空则保持原生 Vim 行为. 如需快速填入系统剪贴板映射, 可点击下方“推荐配置”.</div>
        </el-form-item>
    </el-form>
    <div class="settings-footer" style="display: flex; justify-content: flex-end; gap: 8px">
        <el-button @click="emit('cancel')">取消</el-button>
        <el-button @click="handleApplyRecommendedMappings">推荐配置</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { nextTick, reactive, useTemplateRef, watch } from "vue"

import { buildVimMappingText, getDefaultVimDefaults, parseVimMappingText, type VimDefaults } from "@/stores/editor-defaults"

defineOptions({ name: "VimSettings" })

const props = defineProps<{
    initialValues: VimDefaults | null
}>()

const emit = defineEmits<{
    (event: "save", data: VimDefaults): void
    (event: "cancel"): void
}>()

const formRef = useTemplateRef<FormInstance>("formRef")

const form = reactive({ mappingText: "" })
const recommendedMappingText = buildVimMappingText([
    { lhs: "yy", rhs: '"+yy', context: "normal" },
    { lhs: "p", rhs: '"+p', context: "normal" },
])
const mappingPlaceholderText = ['每行一个映射, 使用 ("lhs", "rhs", "normal") 格式.', "例如:", '("jj", "<Esc>", "insert")'].join("\n")

/**
 * getInitialMappingText 返回当前表单应展示的映射文本.
 * @returns 多行映射文本.
 */
const getInitialMappingText = (): string => {
    return buildVimMappingText(props.initialValues?.mappings ?? getDefaultVimDefaults().mappings)
}

const rules = reactive<FormRules>({
    mappingText: [
        {
            validator: (_rule, value: string, callback) => {
                try {
                    parseVimMappingText(value ?? "")
                    callback()
                } catch (error) {
                    callback(error instanceof Error ? error : new Error("映射格式无效"))
                }
            },
            trigger: "blur",
        },
    ],
})

watch(
    () => props.initialValues,
    () => {
        form.mappingText = getInitialMappingText()
        nextTick(() => formRef.value?.clearValidate())
    },
    { immediate: true },
)

/**
 * handleApplyRecommendedMappings 将表单填充为推荐映射文本.
 * 推荐配置会显式接通 `yy` 与 `p` 的系统剪贴板映射, 便于用户快速启用.
 * @returns 无返回值.
 */
const handleApplyRecommendedMappings = (): void => {
    form.mappingText = recommendedMappingText
    nextTick(() => formRef.value?.clearValidate("mappingText"))
}

/**
 * handleSave 校验成功后保存 Vim 映射配置.
 * @returns 无返回值.
 */
const handleSave = async (): Promise<void> => {
    const formEl = formRef.value
    if (!formEl) {
        return
    }

    await formEl.validate((valid) => {
        if (!valid) {
            return
        }

        emit("save", {
            enabled: props.initialValues?.enabled ?? false,
            mappings: parseVimMappingText(form.mappingText),
        })
    })
}
</script>

<style scoped lang="scss">
.mapping-tip {
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--jpz-text-color-secondary);
}
</style>

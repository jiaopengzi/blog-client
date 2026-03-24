<!--
 * FilePath    : blog-client-dev\src\components\editor\components\settings\powerbi-settings\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : PowerBi 默认值设置表单组件
-->

<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="遮罩颜色 (maskcolor)" prop="maskcolor">
            <el-input v-model="form.maskcolor" placeholder="例如 #ffffff" clearable />
        </el-form-item>
    </el-form>
    <div class="settings-footer" style="display: flex; justify-content: flex-end">
        <el-button @click="emit('cancel')">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { nextTick, reactive, useTemplateRef, watch } from "vue"

import type { PowerBiDefaults } from "@/stores/editor-defaults"

defineOptions({ name: "PowerbiSettings" })

const props = defineProps<{
    /** 初始值，来自 loadPowerBiDefaults() */
    initialValues: PowerBiDefaults | null
}>()

const emit = defineEmits<{
    /** 校验通过后发送保存数据；data 为 null 表示清空（所有字段为空） */
    (event: "save", data: PowerBiDefaults | null): void
    (event: "cancel"): void
}>()

const formRef = useTemplateRef<FormInstance>("formRef")

const form = reactive<PowerBiDefaults>({ maskcolor: "" })

const rules = reactive<FormRules>({
    maskcolor: [{ pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, message: "请输入有效的 HEX 颜色值，例如 #fff 或 #ffffff", trigger: "blur" }],
})

// 当父组件更新 initialValues 时，回填表单并清除校验状态
watch(
    () => props.initialValues,
    (val) => {
        form.maskcolor = val?.maskcolor ?? ""
        nextTick(() => formRef.value?.clearValidate())
    },
    { immediate: true },
)

/** 校验通过后 emit save，空值时 emit null（触发 clear） */
const handleSave = async () => {
    const formEl = formRef.value
    if (!formEl) return
    await formEl.validate((valid) => {
        if (!valid) return
        if (form.maskcolor.trim()) {
            emit("save", { maskcolor: form.maskcolor.trim() })
        } else {
            emit("save", null)
        }
    })
}
</script>

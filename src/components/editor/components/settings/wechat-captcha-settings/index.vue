<!--
 * FilePath    : blog-client\src\components\editor\components\settings\wechat-captcha-settings\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : WechatCaptcha 默认值设置表单组件
-->

<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="公众号名称 (name)" prop="name">
            <el-input v-model="form.name" placeholder="例如: 您的公众号名称" clearable />
        </el-form-item>
        <el-form-item label="二维码链接 (codeurl)" prop="codeurl">
            <el-input v-model="form.codeurl" placeholder="例如: https://example.com/qr.png" clearable />
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

import type { WechatCaptchaDefaults } from "@/stores/editor-defaults"

defineOptions({ name: "WechatCaptchaSettings" })

const props = defineProps<{
    /** 初始值，来自 loadWechatCaptchaDefaults() */
    initialValues: WechatCaptchaDefaults | null
}>()

const emit = defineEmits<{
    /** 校验通过后发送保存数据；data 为 null 表示清空（所有字段为空） */
    (event: "save", data: WechatCaptchaDefaults | null): void
    (event: "cancel"): void
}>()

const formRef = useTemplateRef<FormInstance>("formRef")

const form = reactive<WechatCaptchaDefaults>({ name: "", codeurl: "" })

const rules = reactive<FormRules>({
    name: [{ pattern: /^(?!\s).*(?<!\s)$/, message: "前后不能有空格", trigger: "blur" }],
    codeurl: [{ pattern: /^https?:\/\//, message: "请输入有效的 URL，以 http:// 或 https:// 开头", trigger: "blur" }],
})

// 当父组件更新 initialValues 时，回填表单并清除校验状态
watch(
    () => props.initialValues,
    (val) => {
        form.name = val?.name ?? ""
        form.codeurl = val?.codeurl ?? ""
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
        const hasName = form.name.trim()
        const hasCodeurl = form.codeurl.trim()
        if (hasName || hasCodeurl) {
            emit("save", { name: form.name.trim(), codeurl: form.codeurl.trim() })
        } else {
            emit("save", null)
        }
    })
}
</script>

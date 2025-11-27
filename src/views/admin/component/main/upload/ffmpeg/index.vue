<!--
 * FilePath    : blog-client\src\views\admin\component\main\upload\ffmpeg\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : ffmpeg
-->

<template>
    <ConfigForm
        ref="formRef"
        title="FFmpeg 上传配置"
        :form-data="formData"
        :rules="rules"
        :form-items="formItems"
        :form-width="formWidth"
        :label-width="labelWidth"
        :attention="attention"
    />
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus"
import { reactive, useTemplateRef, watch } from "vue"

import type { FFmpeg } from "@/api/setting/getUpload"
import ConfigForm, { type BaseConfigFormRef, uploadRules } from "@/components/common/base-config-form"

defineOptions({ name: "FFmpegForm" })

const formRef = useTemplateRef<BaseConfigFormRef>("formRef")

const {
    config,
    formWidth,
    labelWidth,
    attention = "",
} = defineProps<{
    config: FFmpeg
    formWidth?: number
    labelWidth?: number
    attention?: string // 注意事项
}>()

const formData = reactive<FFmpeg>(config)

const rules = reactive<FormRules<FFmpeg>>({
    ...uploadRules,
})

const formItems = [
    { label: "生成 HLS", prop: "is_generate_hls", isCheckbox: true },
    { label: "HlS 多分辨率", prop: "is_generate_multi_resolution", isCheckbox: true },
    { label: "删除源视频", prop: "is_delete_original", isCheckbox: true },
]

watch(
    () => config,
    (newDb) => {
        Object.assign(formData, newDb)
    },
    { deep: true, immediate: true },
)

defineExpose({
    formRef,
})
</script>

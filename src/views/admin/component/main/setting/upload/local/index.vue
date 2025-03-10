<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\upload\local\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 本地上传配置
-->

<template>
    <ConfigForm
        ref="formRef"
        title="本地上传配置"
        :form-data="formData"
        :rules="rules"
        :form-items="formItems"
        :form-width="formWidth"
        :label-width="labelWidth"
    />
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus"
import { reactive, useTemplateRef, watch } from "vue"

import type { Local } from "@/api/setting/getUpload"
import ConfigForm, { type BaseConfigFormRef, uploadRules } from "@/components/common/base-config-form"

defineOptions({ name: "LocalForm" })

const formRef = useTemplateRef<BaseConfigFormRef>("formRef")

const { config, formWidth } = defineProps<{
    config: Local
    formWidth?: number
    labelWidth?: number
}>()

const formData = reactive<Local>(config)

const rules = reactive<FormRules<Local>>({
    ...uploadRules,
})

const formItems = [
    { label: "启用", prop: "is_enabled", isCheckbox: true },
    { label: "URL归属", prop: "is_url_belong", isCheckbox: true },
    { label: "path", prop: "path" },
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

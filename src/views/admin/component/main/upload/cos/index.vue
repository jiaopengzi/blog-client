<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\upload\cos\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 腾讯云 COS 上传配置
-->

<template>
    <ConfigForm
        ref="formRef"
        title="腾讯云 COS 上传配置"
        :form-data="formData"
        :rules="rules"
        :form-items="formItems"
        :form-width="formWidth"
        :label-width="labelWidth"
        :attention="attention"
        cloud-type="cos"
    />
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus"
import { reactive, useTemplateRef, watch } from "vue"

import type { COS } from "@/api/setting/getUpload"
import ConfigForm, { type BaseConfigFormRef, uploadRules } from "@/components/common/base-config-form"

defineOptions({ name: "COSForm" })

const formRef = useTemplateRef<BaseConfigFormRef>("formRef")

const {
    config,
    formWidth,
    labelWidth,
    attention = "",
} = defineProps<{
    config: COS
    formWidth?: number
    labelWidth?: number
    attention?: string // 注意事项
}>()

const formData = reactive<COS>(config)

const rules = reactive<FormRules<COS>>({
    ...uploadRules,
    secret_id: [{ required: true, message: "SecretId 为必填项", trigger: "blur" }],
    secret_key: [{ required: true, message: "SecretKey 为必填项", trigger: "blur" }],
    region: [{ required: true, message: "地域为必填项", trigger: "blur" }],
    bucket_name: [{ required: true, message: "Bucket 名称为必填项", trigger: "blur" }],
    parallel_num: [
        { required: true, message: "并行上传数量为必填项", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 10) {
                    callback(new Error("并行上传数量只能为数字且在1-10之间"))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
})

const formItems = [
    { label: "启用", prop: "is_enabled", isCheckbox: true },
    { label: "URL归属", prop: "is_url_belong", isCheckbox: true },
    { label: "访问域名", prop: "domain", placeholder: "访问域名" },
    { label: "文件上传路径", prop: "path", placeholder: "文件上传路径" },
    { label: "SecretId", prop: "secret_id", placeholder: "腾讯云 SecretId" },
    { label: "SecretKey", prop: "secret_key", type: "password", showPassword: true, placeholder: "腾讯云 SecretKey" },
    { label: "地域", prop: "region", placeholder: "地域" },
    { label: "Bucket 名称", prop: "bucket_name", placeholder: "Bucket 名称 (含 APPID, 例: my-bucket-1250000000)" },
    { label: "并行上传数量", prop: "parallel_num", placeholder: "根据网络带宽设置建议范围：1-10" },
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

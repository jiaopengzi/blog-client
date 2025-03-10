<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\upload\oss\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 阿里云OSS上传配置
-->

<template>
    <ConfigForm
        ref="formRef"
        title="阿里云 OSS 上传配置"
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

import type { OSS } from "@/api/setting/getUpload"
import ConfigForm, { type BaseConfigFormRef, uploadRules } from "@/components/common/base-config-form"

defineOptions({ name: "OSSForm" })

const formRef = useTemplateRef<BaseConfigFormRef>("formRef")

const { config, formWidth, labelWidth } = defineProps<{
    config: OSS
    formWidth?: number
    labelWidth?: number
}>()

const formData = reactive<OSS>(config)

const rules = reactive<FormRules<OSS>>({
    ...uploadRules,
    key_id: [{ required: true, message: "AccessKey ID 为必填项", trigger: "blur" }],
    key_secret: [{ required: true, message: "AccessKey Secret 为必填项", trigger: "blur" }],
    region: [{ required: true, message: "地域为必填项", trigger: "blur" }],
    endpoint: [{ required: true, message: "外网域名为必填项", trigger: "blur" }],
    bucket_name: [{ required: true, message: "Bucket 名称为必填项", trigger: "blur" }],
    endpoint_internal: [{ required: true, message: "内网域名为必填项", trigger: "blur" }],
    parallel_num: [
        { required: true, message: "并行上传数量为必填项", trigger: "blur" },
        {
            // 结尾为'_'且长度不超过50,不包含空格
            validator: (rule, value, callback) => {
                // 只能为数字且在1-10之间
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
    { label: "path", prop: "path", placeholder: "文件上传路径" },
    { label: "AccessKey ID", prop: "key_id", placeholder: "阿里云账号的AccessKey ID" },
    { label: "AccessKey Secret", prop: "key_secret", type: "password", showPassword: true, placeholder: "阿里云账号的AccessKey Secret" },
    { label: "地域", prop: "region", placeholder: "地域" },
    { label: "外网域名", prop: "endpoint", placeholder: "外网域名" },
    { label: "Bucket 名称", prop: "bucket_name", placeholder: "Bucket 名称" },
    { label: "内网域名", prop: "endpoint_internal", placeholder: "内网域名" },
    { label: "并行上传数量", prop: "parallel_num", placeholder: "根据网络带宽设置建议范围：1-10" },
    { label: "内网传输", prop: "is_internal", isCheckbox: true },
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

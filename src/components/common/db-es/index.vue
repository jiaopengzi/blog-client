<!--
 * @FilePath     : \blog-client\src\components\common\db-es\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : es 配置表单
-->

<template>
    <BaseConfigForm ref="formRef" title="Elasticsearch" :form-data="dbData" :rules="rules" :form-items="formItems" :form-width="formWidth" />
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus"
import { reactive, useTemplateRef, watch } from "vue"

import BaseConfigForm, { type BaseConfigFormRef, dbRules, prefixValidatorFunc, urlListValidatorFunc } from "@/components/common/base-config-form"

import { type ESForm } from "./types"

defineOptions({ name: "ElasticsearchForm" })

const formRef = useTemplateRef<BaseConfigFormRef>("formRef")

const {
    db = {
        addresses: "",
        user_name: "",
        password: "",
        index_prefix: "",
    },
    formWidth,
} = defineProps<{
    db?: ESForm
    formWidth?: number
}>()

const dbData = reactive<ESForm>(db)

const rules = reactive<FormRules<ESForm>>({
    ...dbRules,
    addresses: [
        { required: true, message: "请输入地址", trigger: "blur" },
        {
            // urlList校验 以逗号分隔的url列表,每个url必须以http或https开头
            validator: urlListValidatorFunc,
            trigger: "blur",
        },
    ],
    index_prefix: [
        { required: true, message: "请输索引格前缀", trigger: "blur" },
        {
            // 结尾为'_'且长度不超过50,不包含空格
            validator: prefixValidatorFunc,
            trigger: "blur",
        },
    ],
})

const formItems = [
    { label: "主机地址", prop: "addresses" },
    { label: "用户名", prop: "user_name" },
    { label: "密码", prop: "password", type: "password", showPassword: true },
    { label: "索引前缀", prop: "index_prefix", placeholder: "例如:blog_" },
]

watch(
    () => db,
    (newDb) => {
        Object.assign(dbData, newDb)
    },
    { deep: true, immediate: true },
)

defineExpose({
    formRef,
})
</script>

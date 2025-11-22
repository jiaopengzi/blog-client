<!--
 * @FilePath     : \blog-client\src\components\common\db-es\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : es 配置表单
-->

<template>
    <BaseConfigForm
        ref="formRef"
        title="Elasticsearch"
        :form-data="dbData"
        :rules="rules"
        :form-items="formItems"
        :form-width="formWidth"
        :label-width="labelWidth"
    />
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus"
import { computed, type ComputedRef, reactive, useTemplateRef, watch } from "vue"

import BaseConfigForm, { type BaseConfigFormRef, dbRules, prefixValidatorFunc, urlListValidatorFunc } from "@/components/common/base-config-form"

import { type ESForm } from "./types"

defineOptions({ name: "ElasticsearchForm" })

const formRef = useTemplateRef<BaseConfigFormRef>("formRef")

const {
    db = {
        addresses: "",
        user: "",
        password: "",
        index_prefix: "",
        ca_cert: "",
        use_ca_cert: false,
    },
    formWidth,
    labelWidth,
} = defineProps<{
    db?: ESForm
    formWidth?: number
    labelWidth?: number
}>()

const dbData = reactive<ESForm>(db)

const rules: ComputedRef<FormRules<ESForm>> = computed(() => {
    const use_ca_cert = !!dbData.use_ca_cert
    return {
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

        // ca_cert 根据 use_ca_cert 动态校验必填项
        ca_cert: [{ required: use_ca_cert, message: "请输入地址", trigger: "blur" }],
    }
})

const formItems = [
    { label: "主机地址", prop: "addresses", placeholder: "例如:https://localhost:9200" },
    { label: "用户名", prop: "user", placeholder: "例如:elastic" },
    { label: "密码", prop: "password", type: "password", showPassword: true, placeholder: "请输入密码" },
    { label: "索引前缀", prop: "index_prefix", placeholder: "例如:blog_" },
    { label: "使用CA认证", prop: "use_ca_cert", isCheckbox: true },
    { label: "CA证书（可选）", prop: "ca_cert", type: "textarea", placeholder: "请输入CA证书内容" },
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

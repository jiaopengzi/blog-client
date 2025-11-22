<!--
 * @FilePath     : \blog-client\src\components\common\db-pgsql\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : pgsql 数据库配置表单
-->

<template>
    <BaseConfigForm
        ref="formRef"
        title="pgsql数据库"
        :form-data="dbData"
        :rules="rules"
        :form-items="formItems"
        :form-width="formWidth"
        :label-width="labelWidth"
    />
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus"
import { reactive, useTemplateRef, watch } from "vue"

import { type PgsqlSetupRequest } from "@/api/setting/setup"
import BaseConfigForm, { type BaseConfigFormRef, dbRules, prefixValidatorFunc } from "@/components/common/base-config-form"

defineOptions({ name: "PgsqlDatabaseForm" })

const formRef = useTemplateRef<BaseConfigFormRef>("formRef")

const {
    db = {
        host: "",
        port: 5432,
        database: "",
        user: "",
        password: "",
        table_prefix: "",
    },
    formWidth,
    labelWidth,
} = defineProps<{
    db?: PgsqlSetupRequest
    formWidth?: number
    labelWidth?: number
}>()

const dbData = reactive<PgsqlSetupRequest>(db)

const rules = reactive<FormRules<PgsqlSetupRequest>>({
    ...dbRules,
    table_prefix: [
        { required: true, message: "请输入表格前缀", trigger: "blur" },
        {
            // 结尾为'_'且长度不超过50,不包含空格
            validator: prefixValidatorFunc,
            trigger: "blur",
        },
    ],
})

const formItems = [
    { label: "主机地址", prop: "host", placeholder: "例如:localhost" },
    { label: "端口", prop: "port", placeholder: "例如:5432" },
    { label: "数据库名", prop: "database", placeholder: "例如:blog_server_jpz" },
    { label: "用户名", prop: "user", placeholder: "例如:user_blog" },
    { label: "密码", prop: "password", type: "password", showPassword: true, placeholder: "请输入密码" },
    { label: "表格前缀", prop: "table_prefix", placeholder: "例如:blog_" },
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

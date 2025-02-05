<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-07 19:35:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-02-05 15:18:55
 * @FilePath     : \blog-client\src\components\common\db-pgsql\index.vue
 * @Description  : pgsql数据库配置表单
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <BaseConfigForm ref="formRef" title="pgsql数据库" :form-data="dbData" :rules="rules" :form-items="formItems" :form-width="formWidth" />
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus"
import { reactive, useTemplateRef, watch } from "vue"

import { type PgsqlSetupRequest } from "@/api/setting/setup"
import BaseConfigForm, { type BaseConfigFormRef, dbRules } from "@/components/common/base-config-form"

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
} = defineProps<{
    db?: PgsqlSetupRequest
    formWidth?: number
}>()

const dbData = reactive<PgsqlSetupRequest>(db)

const rules = reactive<FormRules<PgsqlSetupRequest>>({
    ...dbRules,
    table_prefix: [
        { required: true, message: "请输入表格前缀", trigger: "blur" },
        {
            // 结尾为'_'且长度不超过50,不包含空格
            validator: (rule, value, callback) => {
                if (!value.endsWith("_") || value.length > 50 || /\s/.test(value)) {
                    callback(new Error("表格前缀必须以'_'结尾,长度不超过50,不包含空格"))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
})

const formItems = [
    { label: "主机地址", prop: "host" },
    { label: "端口", prop: "port" },
    { label: "数据库名", prop: "database" },
    { label: "用户名", prop: "user" },
    { label: "密码", prop: "password", type: "password", showPassword: true },
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

<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-07 19:35:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-09 21:24:25
 * @FilePath     : \blog-client\src\components\common\db-pgsql\index.vue
 * @Description  : pgsql数据库配置表单
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <DatabaseForm
        ref="databaseFormRef"
        :title="'pgsql数据库'"
        :db="db"
        :rules="rules"
        :formItems="formItems"
    />
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus"
import { reactive, useTemplateRef } from "vue"

import { type PgsqlSetupRequest } from "@/api/setting/setup"
import DatabaseForm, { commonRules } from "@/components/common/db-base"

defineOptions({ name: "PgsqlDatabaseForm" })

const databaseFormRef = useTemplateRef<InstanceType<typeof DatabaseForm>>("databaseFormRef")

const {
    db = {
        host: "",
        port: 5432,
        database: "",
        user: "",
        password: "",
        table_prefix: "",
    },
} = defineProps<{
    db?: PgsqlSetupRequest
}>()

const rules = reactive<FormRules<PgsqlSetupRequest>>({
    ...commonRules,
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

defineExpose({
    databaseFormRef,
})
</script>

<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-07 19:35:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-09 21:31:29
 * @FilePath     : \blog-client\src\components\common\db-redis\index.vue
 * @Description  : redis数据库配置表单
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <DatabaseForm
        ref="databaseFormRef"
        :title="nodeName"
        :db="db"
        :rules="rules"
        :formItems="formItems"
    />
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus"
import { reactive, useTemplateRef } from "vue"

import { type RedisNodeSetupRequest } from "@/api/setting/setup"
import DatabaseForm, { commonRules } from "@/components/common/db-base"

defineOptions({ name: "RedisDatabaseForm" })

const databaseFormRef = useTemplateRef<InstanceType<typeof DatabaseForm>>("databaseFormRef")

const {
    node,
    db = {
        host: "",
        port: 6379,
        database: 0,
        user: "default",
        password: "",
    },
} = defineProps<{
    node?: number
    db?: RedisNodeSetupRequest
}>()

const nodeName = node ? `redis节点${node}` : "redis数据库"

const rules = reactive<FormRules<RedisNodeSetupRequest>>({
    ...commonRules,
    database: [
        { required: true, message: "请输入数据库名称", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                const dbIndex = Number(value)
                if (isNaN(dbIndex) || dbIndex < 0 || dbIndex > 15) {
                    callback(new Error("数据库索引必须在 0 到 15 之间"))
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
]

defineExpose({
    databaseFormRef,
})
</script>

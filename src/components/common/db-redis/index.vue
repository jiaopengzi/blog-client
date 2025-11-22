<!--
 * @FilePath     : \blog-client\src\components\common\db-redis\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : redis 数据库配置表单
-->

<template>
    <BaseConfigForm ref="formRef" :title="nodeName" :form-data="db" :rules="rules" :form-items="formItems" :form-width="formWidth" :label-width="labelWidth" />
</template>

<script lang="ts" setup>
import type { FormRules } from "element-plus"
import { reactive, useTemplateRef } from "vue"

import { type RedisNodeSetupRequest } from "@/api/setting/setup"
import BaseConfigForm, { type BaseConfigFormRef, dbRules } from "@/components/common/base-config-form"

defineOptions({ name: "RedisDatabaseForm" })

const formRef = useTemplateRef<BaseConfigFormRef>("formRef")

const {
    node,
    db = {
        host: "",
        port: 6379,
        database: 0,
        user: "default",
        password: "",
    },
    formWidth,
    labelWidth,
} = defineProps<{
    node?: number
    db?: RedisNodeSetupRequest
    formWidth?: number
    labelWidth?: number
}>()

const nodeName = node ? `redis节点${node}` : "redis数据库"

const rules = reactive<FormRules<RedisNodeSetupRequest>>({
    ...dbRules,
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
    { label: "主机地址", prop: "host", placeholder: "例如:localhost" },
    { label: "端口", prop: "port", placeholder: "例如:6379" },
    { label: "数据库索引", prop: "database", placeholder: "例如:0 (范围0-15)" },
    { label: "用户名", prop: "user", placeholder: "例如:default" },
    { label: "密码", prop: "password", type: "password", showPassword: true, placeholder: "请输入密码" },
]

defineExpose({
    formRef,
})
</script>

<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-07 19:35:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-17 14:20:17
 * @FilePath     : \blog-client\src\views\setup\index.vue
 * @Description  : 数据库配置页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <RestartDialog :is-show-timer="isShowTimer" :wait-seconds="waitSeconds" />
    <div class="page">
        <div class="setup">
            <AccountFormHeader :a-tag="{ href: 'https://www.jiaopengzi.com', target: '_blank' }" title="数据库配置" />

            <PgsqlForm class="data-form" ref="pgsqlFormRef" :form-width="330" />
            <div class="redis-forms">
                <div class="redis-header">
                    <span class="redis-count">redis数量：</span>
                    <el-input-number v-model="redisNodeCount" :min="1" :max="99" />
                </div>

                <RedisForm
                    class="redis-form data-form"
                    v-for="i in redisNodeCount"
                    :key="i"
                    :ref="
                        (el) => {
                            if (el) redisFormRefs[i] = el as RedisDatabaseFormRef
                        }
                    "
                    :node="i"
                    :form-width="330"
                />
            </div>
            <el-button class="submit-btn" type="primary" @click="setupSubmit">提交</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { ResponseCode } from "@/api/response"
import { isSetupAPI } from "@/api/setting/isSetup"
import { setupAPI } from "@/api/setting/setup"
import AccountFormHeader from "@/components/common/account-form-header"
import PgsqlForm, { type PgsqlDatabaseFormRef } from "@/components/common/db-pgsql"
import RedisForm, { type RedisDatabaseFormRef } from "@/components/common/db-redis"
import RestartDialog from "@/components/common/restart-dialog"
import { useDatabase } from "@/components/hooks/useDatabase"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"

defineOptions({ name: "SetupForm" })

const pgsqlFormRef = useTemplateRef<PgsqlDatabaseFormRef>("pgsqlFormRef")

const redisNodeCount = ref(1)
// 使用一个对象来存储所有 RedisForm 的 refs
const redisFormRefs = reactive<{ [key: number]: RedisDatabaseFormRef | undefined }>({})

const router = useRouter()

const confirmFunc = () => {
    MessageUtil.success("服务端重启完成,及时完成管理员注册！", 10000)
    router.push({ name: RouteNames.RegisterAdmin })
}

const setupSubmit = async () => {
    localStorage.clear()
    await submit()
}

const { submit, waitSeconds, isShowTimer } = useDatabase(
    pgsqlFormRef,
    redisFormRefs,
    setupAPI,
    ResponseCode.SetupSuccess,
    isSetupAPI,
    ResponseCode.SetupAlready,
    confirmFunc,
)
</script>

<style scoped lang="scss">
.page {
    height: 100%;
    width: 100vw;
}

.setup {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.redis-header {
    display: flex;
    align-items: center;
    margin: 20px;

    .redis-count {
        margin-right: 10px;
        color: var(--jpz-text-color-regular);
        font-size: 16px;
        font-weight: 700;
    }
}

.data-form {
    box-shadow: var(--jpz-box-shadow-light);
}

.redis-form {
    margin: 20px 0;
}

.submit-btn {
    margin-bottom: 20px;
}
</style>

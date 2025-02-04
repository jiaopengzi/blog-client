<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-15 15:27:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-21 18:31:54
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\database\index.vue
 * @Description  : 数据库配置页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <RestartDialog :is-show-timer="isShowTimer" :wait-seconds="waitSeconds" />

    <div class="content">
        <el-button class="submit-btn" type="primary" @click="submit">保存</el-button>
        <div :class="[isMultiRedisNode ? 'forms-multi' : 'forms']">
            <PgsqlForm class="forms-item" ref="pgsqlFormRef" :db="dbPgsql" :formWidth="formWidth" />

            <RedisForm
                class="forms-item"
                v-for="(item, index) in dbRedis"
                :key="index"
                :ref="
                    (el) => {
                        if (el) redisFormRefs[index] = el as RedisDatabaseFormRef
                    }
                "
                :node="isShowRedisNodeNumber ? index + 1 : void 0"
                :db="item"
                :formWidth="formWidth"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, reactive, ref, useTemplateRef } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { getDBsAPI } from "@/api/setting/getDBs"
import { isSetupAPI } from "@/api/setting/isSetup"
import { type PgsqlSetupRequest, type RedisNodeSetupRequest } from "@/api/setting/setup"
import { updateDbsPasswordAPI } from "@/api/setting/updateDbsPassword"
import PgsqlForm, { type PgsqlDatabaseFormRef } from "@/components/common/db-pgsql"
import RedisForm, { type RedisDatabaseFormRef } from "@/components/common/db-redis"
import RestartDialog from "@/components/common/restart-dialog"
import { useDatabase } from "@/components/hooks/useDatabase"
import { MessageUtil } from "@/utils/message"

defineOptions({ name: "DatabaseUpdateForm" })

const dbPgsql = ref<PgsqlSetupRequest>({} as PgsqlSetupRequest)
const dbRedis = ref<RedisNodeSetupRequest[]>([])

const pgsqlFormRef = useTemplateRef<PgsqlDatabaseFormRef>("pgsqlFormRef")
const redisFormRefs = reactive<{ [key: number]: RedisDatabaseFormRef | undefined }>({})

const isShowRedisNodeNumber = computed(() => {
    return dbRedis.value.length > 1
})

const isMultiRedisNode = computed(() => {
    return dbRedis.value.length > 4
})

const formWidth = computed(() => {
    if (isMultiRedisNode.value) {
        return 330
    }

    return 660
})

// 确认函数
const confirmFunc = () => {
    MessageUtil.success("服务端重启完成！", 5000)
}

// hooks
const { submit, waitSeconds, isShowTimer } = useDatabase(
    pgsqlFormRef,
    redisFormRefs,
    updateDbsPasswordAPI,
    ResponseCode.DBsUpdateSuccess,
    isSetupAPI,
    ResponseCode.SetupAlready,
    confirmFunc,
)

// 获取数据库配置
onBeforeMount(async () => {
    const res = await getDBsAPI()
    if (res.data.code === ResponseCode.GetDBsSuccess) {
        dbPgsql.value = res.data.data.pgsql
        dbRedis.value = res.data.data.redis
    } else {
        MessageUtil.error(handleResErr(res), 10000)
    }
})
</script>

<style scoped lang="scss">
.forms-multi {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    gap: 20px;
    align-items: flex-start;
}

.forms {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.forms-item {
    margin-bottom: 10px;
}

.submit-btn {
    margin-bottom: 10px;
}
</style>

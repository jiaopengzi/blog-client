<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\database\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 数据库配置页面
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

            <ElasticsearchForm class="forms-item" ref="esFormRef" :db="dbES" :formWidth="formWidth" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { computed, onBeforeMount, reactive, ref, useTemplateRef } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { getDBsAPI } from "@/api/setting/getDBs"
import type { PgsqlSetupRequest, RedisNodeSetupRequest } from "@/api/setting/setup"
import { updateDbsPasswordAPI } from "@/api/setting/updateDbsPassword"
import ElasticsearchForm, { type ElasticsearchFormRef, type ESForm } from "@/components/common/db-es"
import PgsqlForm, { type PgsqlDatabaseFormRef } from "@/components/common/db-pgsql"
import RedisForm, { type RedisDatabaseFormRef } from "@/components/common/db-redis"
import RestartDialog from "@/components/common/restart-dialog"
import { useDatabase } from "@/components/hooks/useDatabase"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

defineOptions({ name: RouteNames.SettingDatabase })

useHead({
    title: adminMenuItemMap[RouteNames.SettingDatabase].text,
})

const dbPgsql = ref<PgsqlSetupRequest>({} as PgsqlSetupRequest)
const dbRedis = ref<RedisNodeSetupRequest[]>([])
const dbES = ref<ESForm>({} as ESForm)

const pgsqlFormRef = useTemplateRef<PgsqlDatabaseFormRef>("pgsqlFormRef")
const redisFormRefs = reactive<{ [key: number]: RedisDatabaseFormRef | undefined }>({})
const esFormRef = useTemplateRef<ElasticsearchFormRef>("esFormRef")

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

// hooks
const { submit, waitSeconds, isShowTimer } = useDatabase(pgsqlFormRef, redisFormRefs, esFormRef, updateDbsPasswordAPI, ResponseCode.DBsUpdateSuccess)

// 获取数据库配置
onBeforeMount(async () => {
    const res = await getDBsAPI()
    if (res.data.code === ResponseCode.GetDBsSuccess) {
        dbPgsql.value = res.data.data.pgsql
        dbRedis.value = res.data.data.redis

        const esData = res.data.data.es
        dbES.value = {
            addresses: esData.addresses.join(","), // 转为字符串,使用逗号分隔便于展示
            user: esData.user,
            password: esData.password,
            index_prefix: esData.index_prefix,
        }
    } else {
        MessageUtil.error(handleResErr(res), 10000)
    }
})
</script>

<style scoped lang="scss">
.content {
    padding-top: 10px;
    padding-left: 10px;
}

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

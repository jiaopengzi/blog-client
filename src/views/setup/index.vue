<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-07 19:35:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-14 16:19:13
 * @FilePath     : \blog-client\src\views\setup\index.vue
 * @Description  : 数据库配置页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <el-dialog
        v-model="isShowTimer"
        title="Tips"
        width="500"
        :show-close="false"
        :align-center="true"
        :lock-scroll="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <template #header>
            <div class="dialog-header">请稍等...</div>
        </template>
        <template #footer>
            <div class="dialog-footer">
                若超过 60 秒未重启成功，请检查网络和提供的数据库是否连接正常！
            </div>
        </template>
        <div class="timer">
            <h1>服务端正在重启，请勿刷新页面！</h1>
            <h2>等待时间：{{ waitSeconds }} 秒</h2>
        </div>
    </el-dialog>
    <div class="page">
        <div class="setup">
            <AccountFormHeader
                :a-tag="{ href: 'https://www.jiaopengzi.com', target: '_blank' }"
                title="数据库配置"
            />

            <PgsqlForm class="data-form" ref="pgsqlFormRef" />
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
                            if (el) redisFormRefs[i] = el as InstanceType<typeof RedisForm>
                        }
                    "
                    :node="i"
                />
            </div>
            <el-button class="submit-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { handleResErr, ResponseCode } from "@/api/response"
import { isSetupAPI } from "@/api/setting/isSetup"
import {
    type PgsqlSetupRequest,
    type RedisNodeSetupRequest,
    setupAPI,
    type SetupRequest,
} from "@/api/setting/setup"
import AccountFormHeader from "@/components/common/account-form-header"
import PgsqlForm from "@/components/common/db-pgsql"
import RedisForm from "@/components/common/db-redis"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"

defineOptions({ name: "SetupForm" })

const router = useRouter()

const pgsqlFormRef = useTemplateRef<InstanceType<typeof PgsqlForm>>("pgsqlFormRef")

const redisNodeCount = ref(1)
// 使用一个对象来存储所有 RedisForm 的 refs
const redisFormRefs = reactive<{ [key: number]: InstanceType<typeof RedisForm> | undefined }>({})

const validateForms = async (): Promise<boolean[]> => {
    const promises: Promise<boolean>[] = []

    // 添加 pgsqlForm 的验证
    if (pgsqlFormRef.value && pgsqlFormRef.value.databaseFormRef?.validateForm) {
        promises.push(pgsqlFormRef.value.databaseFormRef.validateForm())
    }

    // 添加每个 RedisForm 的验证
    for (const key in redisFormRefs) {
        if (redisFormRefs[key] && redisFormRefs[key]?.databaseFormRef?.validateForm) {
            promises.push(redisFormRefs[key]?.databaseFormRef.validateForm())
        }
    }

    // 等待所有验证完成
    return await Promise.all(promises)
}

// 等待时间
const waitSeconds = ref(0)
const isShowTimer = ref(false)
const hasShowSuccessMsg = ref(false)

const submit = async () => {
    // 清空本地存储
    localStorage.clear()

    const isValid = await validateForms()
    // isShowTimer.value = true

    if (isValid.every((v) => v)) {
        isShowTimer.value = true
        waitSeconds.value = 0

        const pgsqlData = pgsqlFormRef.value?.databaseFormRef?.dbForm

        // 转换为 number 类型
        if (pgsqlData) {
            pgsqlData.port = Number(pgsqlData.port)
        }

        const redisData = Object.values(redisFormRefs)
            .map((ref) => {
                // 转换为 number 类型
                if (ref?.databaseFormRef?.dbForm) {
                    ref.databaseFormRef.dbForm.port = Number(ref.databaseFormRef.dbForm.port)
                    ref.databaseFormRef.dbForm.database = Number(
                        ref.databaseFormRef.dbForm.database,
                    )
                    return ref.databaseFormRef.dbForm
                }
            })
            .filter((item) => item !== undefined) // 过滤掉 undefined

        const req: SetupRequest = {
            pgsql: pgsqlData as PgsqlSetupRequest,
            redis: redisData as RedisNodeSetupRequest[],
        }

        // 从参数校验成功，即请求开始，计时开始能包含请求中网络延迟的时间
        const timer = setInterval(() => {
            waitSeconds.value++
        }, 1000)

        try {
            // 等待完成
            const res = await setupAPI(req)

            if (res.data.code === ResponseCode.SetupSuccess) {
                // 安装成功后，服务端开始重启,同时开始轮训检查是否重启成功 间隔 5 秒重试
                const interval = setInterval(async () => {
                    // 首先判断是否超时60秒
                    if (waitSeconds.value >= 60) {
                        isShowTimer.value = false
                        clearInterval(interval)
                        clearInterval(timer)
                        MessageUtil.error("后台重启超时，请检查网络和后台数据是否正常！", 10000)
                    }

                    const res = await isSetupAPI()
                    if (res.data.code === ResponseCode.SetupAlready) {
                        if (!hasShowSuccessMsg.value) {
                            isShowTimer.value = false
                            clearInterval(interval)
                            clearInterval(timer)
                            hasShowSuccessMsg.value = true
                            MessageUtil.success("后台重启完成,及时完成管理员注册！", 10000)
                            router.push({ name: RouteNames.RegisterAdmin })
                        }
                    }
                }, 5000)
            } else {
                isShowTimer.value = false
                clearInterval(timer)
                MessageUtil.error(handleResErr(res), 10000)
            }
        } catch (error) {
            isShowTimer.value = false
            clearInterval(timer)
            MessageUtil.error("请求失败，请稍后重试！", 10000)
            console.error(error)
        }
    }
}
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

.header-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin: 20px;

    h2 {
        margin-top: 20px;
        font-size: 24px;
        font-weight: 700;
        color: var(--jpz-text-color-primary);
    }
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

.timer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;

    h1 {
        font-size: 24px;
        font-weight: 700;
        color: var(--jpz-text-color-primary);
        margin-bottom: 10px;
    }
    h2 {
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: 700;
        color: var(--jpz-text-color-secondary);
    }
}

.dialog-header {
    font-size: 16px;
    color: var(--jpz-text-color-secondary);
}

.dialog-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
}
</style>

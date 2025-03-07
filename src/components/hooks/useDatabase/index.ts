/**
 * @FilePath     : \blog-client\src\components\hooks\useDatabase\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 数据库 hooks
 */

import { type Reactive, type Ref, ref } from "vue"

import { handleResErr, type Res, ResponseCode, type ResPromise } from "@/api/response"
import type { ESSetupRequest, PgsqlSetupRequest, SetupRequest } from "@/api/setting/setup"
import type { ElasticsearchFormRef, ESForm } from "@/components/common/db-es"
import { type PgsqlDatabaseFormRef } from "@/components/common/db-pgsql"
import { type RedisDatabaseFormRef } from "@/components/common/db-redis"
import { MessageUtil } from "@/utils/message"

/**
 * 数据库设置 hooks
 *
 * @param pgsqlFormRef pgsql 表单
 * @param redisFormRefs redis 表单
 * @param esFormRef es 表单
 * @param submitAPI 提交请求
 * @param submitResCode 提交请求返回码
 * @param confirmAPI 确认请求
 * @param confirmResCode 确认请求返回码
 * @param confirmFunc 确认成功后的回调函数
 * @param maxWaitSeconds 最大等待秒数 默认 60 秒
 */
export function useDatabase<K extends SetupRequest>(
    pgsqlFormRef: Ref<PgsqlDatabaseFormRef | null>,
    redisFormRefs: Reactive<{ [key: number]: RedisDatabaseFormRef | undefined }>,
    esFormRef: Ref<ElasticsearchFormRef | null>,
    submitAPI: (params: K) => ResPromise<Res<unknown>>,
    submitResCode: ResponseCode,
    confirmAPI: () => ResPromise<Res<unknown>>,
    confirmResCode: ResponseCode,
    confirmFunc: () => void,
    maxWaitSeconds: number = 60,
) {
    const waitSeconds = ref(0) // 等待秒数
    const isShowTimer = ref(false) // 是否显示计时器
    const hasShowSuccessMsg = ref(false) // 是否已经显示成功消息

    // 验证所有表单
    const validateForms = async (): Promise<boolean[]> => {
        const promises: Promise<boolean>[] = []

        // 添加 pgsqlForm 的验证
        if (pgsqlFormRef.value) {
            promises.push(pgsqlFormRef.value.formRef.validateForm())
        }

        // 添加每个 RedisForm 的验证
        for (const key in redisFormRefs) {
            if (redisFormRefs[key]) {
                promises.push(redisFormRefs[key].formRef.validateForm())
            }
        }

        // 添加 esFormRef 的验证
        if (esFormRef.value) {
            promises.push(esFormRef.value.formRef.validateForm())
        }

        // 等待所有验证完成
        return await Promise.all(promises)
    }

    // 提交表单
    const submit = async () => {
        const isValid = await validateForms()

        if (isValid.every((v) => v)) {
            isShowTimer.value = true
            waitSeconds.value = 0

            const pgsqlData = pgsqlFormRef.value?.formRef?.configFormData as PgsqlSetupRequest

            // 转换为 number 类型
            if (pgsqlData) {
                pgsqlData.port = Number(pgsqlData.port)
            }

            const redisData = Object.values(redisFormRefs)
                .map((ref) => {
                    // 转换为 number 类型
                    if (ref?.formRef?.configFormData) {
                        if ("port" in ref.formRef.configFormData) {
                            ref.formRef.configFormData.port = Number(ref.formRef.configFormData.port)
                        }
                        if ("database" in ref.formRef.configFormData) {
                            ref.formRef.configFormData.database = Number(ref.formRef.configFormData.database)
                        }
                        return ref.formRef.configFormData
                    }
                })
                .filter((item) => item !== undefined) // 过滤掉 undefined

            // es 数据
            const esData = esFormRef.value?.formRef?.configFormData as ESForm
            const esDataRequest: ESSetupRequest = {
                addresses: esData.addresses.split(","), // 将地址字符串转换为数组
                user_name: esData.user_name,
                password: esData.password,
                index_prefix: esData.index_prefix,
            }

            // 构造请求参数
            const req = {
                pgsql: pgsqlData,
                redis: redisData,
                es: esDataRequest,
            }

            // 从参数校验成功，即请求开始，计时开始能包含请求中网络延迟的时间
            const timer = setInterval(() => {
                waitSeconds.value++
            }, 1000)

            try {
                // 等待完成
                hasShowSuccessMsg.value = false
                const res = await submitAPI(req as K)

                if (res.data.code === submitResCode) {
                    // 安装成功后，服务端开始重启,同时开始轮训检查是否重启成功 间隔 5 秒重试
                    const interval = setInterval(async () => {
                        // 首先判断是否超时,默认60秒
                        if (waitSeconds.value >= maxWaitSeconds) {
                            isShowTimer.value = false
                            clearInterval(interval)
                            clearInterval(timer)
                            MessageUtil.error("服务端重启超时，请检查网络和后台数据是否正常！", 10000)
                        }

                        const res = await confirmAPI()
                        if (res.data.code === confirmResCode) {
                            if (!hasShowSuccessMsg.value) {
                                isShowTimer.value = false
                                clearInterval(interval)
                                clearInterval(timer)
                                hasShowSuccessMsg.value = true

                                // 确认成功后，执行回调函数
                                confirmFunc()
                            }
                        }
                    }, 5000)
                } else {
                    isShowTimer.value = false
                    clearInterval(timer)

                    // 警告提示
                    const warnCodes = [ResponseCode.DBsNoUpdated, ResponseCode.DBsUpdateOnlyPassword]
                    if (warnCodes.includes(res.data.code)) {
                        MessageUtil.warning(handleResErr(res), 10000)
                        return
                    }

                    // 错误提示
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

    return {
        submit,
        waitSeconds,
        isShowTimer,
        hasShowSuccessMsg,
    }
}

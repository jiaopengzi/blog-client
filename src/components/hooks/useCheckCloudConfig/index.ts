/**
 * @FilePath     : \blog-client\src\components\hooks\useCheckCloudConfig\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 校验云存储配置 hook
 */

import { ref } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { checkCloudStorageConfigAPI } from "@/api/setting/checkCloudStorageConfig"
import { MessageUtil } from "@/utils/message"

/** 云存储类型 */
export type CloudType = "oss" | "cos"

/**
 * useCheckCloudConfig 校验云存储配置。
 * @param cloudType - 云存储类型: "oss" 或 "cos"。
 * @returns checking, 是否正在校验; handleCheckConfig, 执行校验的异步方法。
 */
export function useCheckCloudConfig(cloudType: CloudType) {
    const checking = ref(false)

    /** handleCheckConfig 调用后端接口校验指定类型的云存储配置 */
    const handleCheckConfig = async () => {
        checking.value = true
        try {
            const res = await checkCloudStorageConfigAPI(cloudType)
            if (res.data.code === ResponseCode.CheckCloudStorageConfigSuccess) {
                MessageUtil.success(res.data.msg)
            } else {
                MessageUtil.error(handleResErr(res), 10000)
            }
        } catch {
            MessageUtil.error("校验云存储配置请求失败", 10000)
        } finally {
            checking.value = false
        }
    }

    return { checking, handleCheckConfig }
}

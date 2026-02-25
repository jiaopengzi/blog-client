/*
 * FilePath    : blog-client\src\components\hooks\useSettingUpload\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 上传配置的 hook
 */

import { ref } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import type { FFmpeg as FFmpegType, FileAllowed as FileAllowedType, Local as LocalType, OSS as OSSType, COS as COSType } from "@/api/setting/getUpload"
import { getUploadAPI } from "@/api/setting/getUpload"
import { MessageUtil } from "@/utils/message"

export function useSettingUpload() {
    const fileAllowedList = ref<FileAllowedType[]>([]) // 允许上传的文件类型
    const ffmpegData = ref<FFmpegType>({} as FFmpegType) // ffmpeg 配置
    const localData = ref<LocalType>({} as LocalType) // 本地存储配置
    const ossData = ref<OSSType>({} as OSSType) // OSS 配置
    const cosData = ref<COSType>({} as COSType) // COS 配置

    // 获取上传配置
    const fetchData = async () => {
        const res = await getUploadAPI()
        if (res.data.code === ResponseCode.GetUploadSuccess) {
            const data = res.data.data
            fileAllowedList.value = data.file_allowed
            ffmpegData.value = data.ffmpeg
            localData.value = data.local
            ossData.value = data.oss
            cosData.value = data.cos
        } else {
            MessageUtil.error(handleResErr(res), 10000)
        }
    }

    return {
        fileAllowedList,
        ffmpegData,
        localData,
        ossData,
        cosData,
        fetchData,
    }
}

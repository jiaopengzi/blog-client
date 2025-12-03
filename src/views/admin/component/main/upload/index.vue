<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\upload\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 文件上传设置 
-->

<template>
    <div class="components">
        <el-button class="component-item" type="primary" @click="submitForm">保存</el-button>

        <!-- 本地上传 -->
        <UploadLocal
            ref="localRef"
            class="component-item"
            :config="localData"
            :form-width="1080"
            :label-width="140"
            attention="注意：【URL归属】在多个上传配置都开启的情况下，只能开启其中之一，否则会导致配置冲突。"
        />

        <!-- 阿里云 OSS -->
        <UploadOSS
            ref="ossRef"
            class="component-item"
            :config="ossData"
            :form-width="1080"
            :label-width="140"
            attention="注意：【URL归属】在多个上传配置都开启的情况下，只能开启其中之一，否则会导致配置冲突。"
        />

        <!-- ffmpeg配置 -->
        <FFmpegForm
            ref="ffmpegRef"
            class="component-item"
            :config="ffmpegData"
            :form-width="1080"
            :label-width="140"
            attention="注意：HLS 多分辨率对小机器 CPU 不友好，建议小于4核不开启；若开启上传视频等待时间明显变长，大概率会对主业务有影响。"
        />
        <!-- 上传限制 -->
        <FileAllowed ref="fileAllowedRef" class="component-item" :data="fileAllowedList" />
    </div>
    <RestartDialog :is-show-timer="isShowTimer" :wait-seconds="waitSeconds" />
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { onBeforeMount, useTemplateRef } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import type { FFmpeg as FFmpegType, Local as LocalType, OSS as OSSType } from "@/api/setting/getUpload"
import { updateUploadAPI, type UpdateUploadRequest } from "@/api/setting/updateUpload"
import RestartDialog from "@/components/common/restart-dialog"
import { useRestart } from "@/components/hooks/useRestart"
import { useSettingUpload } from "@/components/hooks/useSettingUpload"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import FFmpegForm, { type UploadFFmpegFormRef } from "./ffmpeg"
import FileAllowed, { type FileAllowedRef } from "./file-allowed"
import UploadLocal, { type UploadLocalFormRef } from "./local"
import UploadOSS, { type UploadOSSFormRef } from "./oss"

defineOptions({ name: RouteNames.SettingUpload })

useHead({
    title: adminMenuItemMap[RouteNames.SettingUpload].text,
})

// 表单实例
const fileAllowedRef = useTemplateRef<FileAllowedRef>("fileAllowedRef")
const ffmpegRef = useTemplateRef<UploadFFmpegFormRef>("ffmpegRef")
const localRef = useTemplateRef<UploadLocalFormRef>("localRef")
const ossRef = useTemplateRef<UploadOSSFormRef>("ossRef")

// 配置的 hooks
const { fileAllowedList, ffmpegData, localData, ossData, fetchData } = useSettingUpload()

// 重启的 hooks
const { showRestart, waitSeconds, isShowTimer } = useRestart()

const submitForm = async () => {
    const req: UpdateUploadRequest = {} as UpdateUploadRequest

    // 校验表单
    if (fileAllowedRef.value) {
        if (!(await fileAllowedRef.value.validateForm())) {
            return
        }
    }
    req.file_allowed = fileAllowedRef.value?.formDataResult || []

    if (ffmpegRef.value) {
        if (!(await ffmpegRef.value.formRef.validateForm())) {
            return
        }
    }
    req.ffmpeg = ffmpegRef.value?.formRef.configFormData as FFmpegType

    if (localRef.value) {
        if (!(await localRef.value.formRef.validateForm())) {
            return
        }
    }
    req.local = localRef.value?.formRef.configFormData as LocalType

    if (ossRef.value) {
        if (!(await ossRef.value.formRef.validateForm())) {
            return
        }
    }
    req.oss = ossRef.value?.formRef.configFormData as OSSType

    const res = await updateUploadAPI(req)

    if (res.data.code === ResponseCode.UploadUpdateSuccess) {
        await showRestart()
        MessageUtil.success("保存成功")
    } else if (res.data.code === ResponseCode.UploadNoUpdate) {
        MessageUtil.warning(handleResErr(res), 5000)
    } else {
        MessageUtil.error(handleResErr(res), 10000)
    }
}

onBeforeMount(async () => {
    // 获取数据
    await fetchData()
})
</script>

<style lang="scss" scoped>
.components {
    padding-top: 10px;
    padding-left: 10px;
}

.component-item {
    margin-bottom: 10px;
}

.btn-submit {
    text-align: center;
}

.callback-description {
    margin: 10px 0;
    color: var(--jpz-text-color-secondary);
    font-size: 14px;

    // 行间距
    p {
        margin: 10px 0;
    }

    .strong {
        color: var(--jpz-text-color-regular);
        font-weight: 700;
    }
}
</style>

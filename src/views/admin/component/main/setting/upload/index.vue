<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-15 15:42:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-02-04 20:35:16
 * @FilePath     : \blog-client\src\views\admin\component\main\setting\upload\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="components">
        <el-button class="component-item" type="primary" @click="submitForm">保存</el-button>
        <FileAllowed ref="fileAllowedRef" class="component-item" :data="fileAllowedList"> </FileAllowed>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, useTemplateRef } from "vue"

import { SocialLoginType } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import type { FileAllowed as FileAllowedType, GetUploadResponse, Local as LocalType, OSS as OSSType } from "@/api/setting/getUpload"
import { getUploadAPI } from "@/api/setting/getUpload"
import { updateUploadAPI, type UpdateUploadRequest } from "@/api/setting/updateUpload"
import { MessageUtil } from "@/utils/message"

import FileAllowed, { type FileAllowedRef } from "./file-allowed"

defineOptions({ name: "SettingUpload" })

const fileAllowedList = ref<FileAllowedType[]>([])

// 表单实例
const fileAllowedRef = useTemplateRef<FileAllowedRef>("fileAllowedRef")

const submitForm = async () => {
    const req: UpdateUploadRequest = {} as UpdateUploadRequest

    // 校验表单
    if (fileAllowedRef.value) {
        if (!(await fileAllowedRef.value?.validateForm())) {
            return
        }
    }

    req.file_allowed = fileAllowedList.value

    const res = await updateUploadAPI(req)
    if (res.data.code === ResponseCode.UploadUpdateSuccess) {
        MessageUtil.success("保存成功")
    } else {
        MessageUtil.error(handleResErr(res), 10000)
    }
}

onBeforeMount(async () => {
    const res = await getUploadAPI()
    if (res.data.code === ResponseCode.GetUploadSuccess) {
        fileAllowedList.value = res.data.data.file_allowed
    } else {
        handleResErr(res.data)
        MessageUtil.error(handleResErr(res), 10000)
    }
})
</script>

<style lang="scss" scoped>
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

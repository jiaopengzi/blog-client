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
        <FileAllowed ref="fileAllowedRef" class="component-item" :data="fileAllowedList" />
        <UploadLocal ref="localRef" class="component-item" :config="localData" :form-width="1080" :label-width="140" />
        <UploadOSS ref="ossRef" class="component-item" :config="ossData" :form-width="1080" :label-width="140" />
    </div>
    <RestartDialog :is-show-timer="isShowTimer" :wait-seconds="waitSeconds" />
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { onBeforeMount, ref, useTemplateRef } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import type { FileAllowed as FileAllowedType, Local as LocalType, OSS as OSSType } from "@/api/setting/getUpload"
import { getUploadAPI } from "@/api/setting/getUpload"
import { updateUploadAPI, type UpdateUploadRequest } from "@/api/setting/updateUpload"
import RestartDialog from "@/components/common/restart-dialog"
import { useRestart } from "@/components/hooks/useRestart"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import FileAllowed, { type FileAllowedRef } from "./file-allowed"
import UploadLocal, { type UploadLocalFormRef } from "./local"
import UploadOSS, { type UploadOSSFormRef } from "./oss"

defineOptions({ name: RouteNames.SettingUpload })

useHead({
    title: adminMenuItemMap[RouteNames.SettingUpload].text,
})

const fileAllowedList = ref<FileAllowedType[]>([])
const localData = ref<LocalType>({} as LocalType)
const ossData = ref<OSSType>({} as OSSType)

// 表单实例
const fileAllowedRef = useTemplateRef<FileAllowedRef>("fileAllowedRef")
const localRef = useTemplateRef<UploadLocalFormRef>("localRef")
const ossRef = useTemplateRef<UploadOSSFormRef>("ossRef")

// hooks
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
    const res = await getUploadAPI()
    if (res.data.code === ResponseCode.GetUploadSuccess) {
        fileAllowedList.value = res.data.data.file_allowed
        localData.value = res.data.data.local
        ossData.value = res.data.data.oss
    } else {
        handleResErr(res.data)
        MessageUtil.error(handleResErr(res), 10000)
    }
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

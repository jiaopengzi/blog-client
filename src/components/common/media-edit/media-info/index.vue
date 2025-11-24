<!--
 * FilePath    : blog-client-dev\src\components\common\media-edit\media-info\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 媒体编辑的信息
-->

<template>
    <el-form :label-position="labelPosition" label-width="100px" ref="mediaInfoRef" :model="mediaInfo" :size="formSize" status-icon :rules="rulesEditMedia">
        <el-form-item label="文件ID" prop="file_ID">
            <el-input v-model="mediaInfo.file_id" disabled />
        </el-form-item>

        <el-form-item label="是否为HLS" prop="is_generate_hls" v-if="mediaInfo.is_video">
            <el-tag type="success">
                {{ mediaInfo.is_generate_hls ? "是" : "否" }}
            </el-tag>
        </el-form-item>

        <el-form-item label="文件名" prop="file_name_display">
            <el-input v-model="mediaInfo.file_name_display" :rows="5" type="textarea" />
        </el-form-item>

        <el-form-item v-if="mediaInfo.is_video" label="视频免费" prop="is_free">
            <el-switch
                class="switch"
                v-model="mediaInfo.is_free"
                :disabled="!mediaInfo.is_generate_hls"
                inline-prompt
                active-text="免费"
                inactive-text="收费"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
        </el-form-item>

        <el-form-item label="文件ID哈希" prop="file_id_hash">
            <el-input v-model="mediaInfo.file_id_hash" />
        </el-form-item>

        <el-form-item label="文件URL" prop="file_url">
            <el-input v-model="mediaInfo.file_url" />
        </el-form-item>

        <el-form-item label="说明" prop="description">
            <el-input v-model="mediaInfo.description" type="textarea" :rows="10" placeholder="文件说明" />
        </el-form-item>

        <div class="btn-submit">
            <el-button type="primary" :loading="loadingEditMedia" @click="submitForm(mediaInfoRef as FormInstance)">更新</el-button>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, ref, useTemplateRef } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { updateFileAPI, type UpdateFileRequest } from "@/api/upload/updateFile"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

import type { MediaInfoProps } from "./types"

// 定义组件名称
defineOptions({ name: "MediaInfo" })

// props
const { data } = defineProps<{
    data: MediaInfoProps // 编辑媒体数据
}>()

// emits
const emit = defineEmits<{
    (event: "edit-media-status", value: boolean): void // 编辑Media状态
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

const mediaInfoRef = useTemplateRef<FormInstance>("mediaInfoRef")

// 表单数据
const mediaInfo = reactive<MediaInfoProps>(data)

/**
 * @description: 表单校验规则
 * @return  FormRules<MediaInfoProps> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rulesEditMedia = reactive<FormRules<MediaInfoProps>>({
    file_name_display: [{ required: true, message: "请输入文件名", trigger: "blur" }],
})

const loadingEditMedia = ref(false)

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    // 如果校验不通过直接返回
    if (!(await formEl.validate())) return

    // 请求参数
    const params: UpdateFileRequest = {
        file_id: data.file_id,
        is_generate_hls: mediaInfo.is_generate_hls,
        file_name_display: mediaInfo.file_name_display,
        description: mediaInfo.description,
        is_free: mediaInfo.is_free,
        is_video: mediaInfo.is_video,
    }

    loadingEditMedia.value = true

    // 调用后端接口
    await updateFileAPI(params).then(async (res) => {
        if (res.data.code === ResponseCode.UpdateFileSuccess) {
            // 如果响应中包含 items，则轮询获取状态
            await pollingGetStreamIDsStatus(res.data.data.stream_items)

            loadingEditMedia.value = false
            emit("edit-media-status", true)
            MessageUtil.success("更新成功", 3000)
        } else {
            loadingEditMedia.value = false
            const errMsg = handleResErr(res, "更新失败")
            MessageUtil.error(errMsg)
        }
    })
}
</script>

<style lang="scss" scoped>
.btn-submit {
    display: flex;
    justify-content: center;
}
</style>

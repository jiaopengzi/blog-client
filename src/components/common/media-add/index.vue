<!--
 * @FilePath     : \blog-client\src\components\common\media-add\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 添加媒体文件
-->

<template>
    <div class="media-add-container">
        <div class="description">
            <p>
                HLS 选项开启时，才能设置加密和收费；当前HLS状态为<span class="hls-status">{{ isShowSwitch ? "开启" : "关闭" }}</span
                >。
            </p>
            <p>在【网站配置】>【文件上传配置】>【FFmpeg 上传配置】可设置 HLS 的启用的选项。</p>
            <p>建议：收费视频加密，免费视频不加密。</p>
        </div>

        <!-- 视频选项 -->
        <div class="switch-group">
            <span v-if="isShowSwitch" class="switch">视频选项:</span>
            <el-switch
                v-if="isShowSwitch"
                class="switch"
                v-model="isEncrypt"
                inline-prompt
                active-text="加密"
                inactive-text="无密"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
            <el-switch
                v-if="isShowSwitch"
                class="switch"
                v-model="isNoFree"
                inline-prompt
                active-text="收费"
                inactive-text="免费"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
        </div>

        <!-- 上传交互 -->
        <el-upload ref="uploadRef" class="upload" drag multiple :http-request="httpRequest">
            <j-icon :name="IconKeys.Upload" custom-class="icon-upload-filled" />
            <div class="el-upload__text">将文件拖放到此处 或 <em>点击上传</em></div>
            <template #tip>
                <div class="el-upload__tip">
                    <div class="el-upload__tip_title">支持上传格式及最大限制:</div>
                    <div class="el-upload__tip_info">{{ allowedInfo }}</div>
                </div>
            </template>
        </el-upload>
    </div>
</template>

<script lang="ts" setup>
import { type ElUpload, type UploadRequestOptions } from "element-plus"
import { onBeforeMount, ref, useTemplateRef, watch } from "vue"

import { ResponseCode } from "@/api/response"
import type { FileAllowed } from "@/api/upload/getUploadFileRequirements"
import { getUploadFileRequirementsAPI } from "@/api/upload/getUploadFileRequirements"
import { IconKeys } from "@/components/common/icons"
import { useSettingUpload } from "@/components/hooks/useSettingUpload"
import { HashAlgorithm } from "@/utils/hash"

import { uploadByEl } from "./uploadByEl.ts"

defineOptions({ name: "AddMedia" })

const emit = defineEmits<{
    (event: "has-upload", value: boolean): void // 是否有上传
}>()

const uploadRef = useTemplateRef<typeof ElUpload>("uploadRef")

// 配置的 hooks
const { ffmpegData, fetchData } = useSettingUpload()

// 上传视频是否加密
const isEncrypt = ref(true)
const isNoFree = ref(true)

// 是否显示加密和收费选项
const isShowSwitch = ref(false)

watch(
    () => ffmpegData.value.is_generate_hls,
    (newVal) => {
        isShowSwitch.value = newVal
        isEncrypt.value = newVal
        isNoFree.value = newVal
    },
    { immediate: true },
)

const allowedInfo = ref("")
const fileAllowedList = ref<FileAllowed[]>([])
const chunkSizeServer = ref(1024 * 1024 * 10)
let hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256

const httpRequest = async (options: UploadRequestOptions) => {
    try {
        const result = await uploadByEl(options, isEncrypt.value, isNoFree.value, chunkSizeServer.value, hashAlgorithmServer, fileAllowedList.value)
        if (result) {
            emit("has-upload", true)
        }
    } catch (error) {
        console.error("Upload failed:", error)
    }
}

// 拿到上传文件的要求
const getAllowedInfo = async () => {
    const strList: string[] = []
    await getUploadFileRequirementsAPI().then((response) => {
        if (response.data.code === ResponseCode.GetUploadFileRequirementsSuccess) {
            const allowedInfoList = response.data.data.file_allowed
            fileAllowedList.value = allowedInfoList
            chunkSizeServer.value = response.data.data.chunk_size
            hashAlgorithmServer = response.data.data.hash_algorithm
            // for 循环遍历 allowedInfoList 数组 i 最大值为 allowedInfoList.length - 1
            for (let i = 0; i < allowedInfoList.length; i++) {
                // item的 Type按照'/'分割，取最后一个 例如：image/png => png
                const _type = allowedInfoList[i]!.extension.toUpperCase()
                // item的 MaxSize 是以字节为单位，转换为mb
                const maxSize = allowedInfoList[i]!.max_size / 1024 / 1024
                // 如果 maxSize 小于 1MB，保留两位小数 否则取整
                if (maxSize < 1) {
                    strList.push(`${_type}:${maxSize.toFixed(2)}MB`)
                } else {
                    strList.push(`${_type}:${Math.floor(maxSize)}MB`)
                }
            }
        }
        allowedInfo.value = strList.join("、") + "。"
    })
}

onBeforeMount(async () => {
    await getAllowedInfo()
    await fetchData()
})
</script>

<style lang="scss" scoped>
.switch-group {
    display: flex;
    align-items: center;
}

.switch {
    margin-right: 10px;
}

.description {
    margin-bottom: 10px;
    font-size: 14px;

    p {
        font-weight: 500;
        margin: 4px 0;
        // 行高
        line-height: 1.5;
    }

    .hls-status {
        font-weight: 700;
        color: var(--jpz-color-primary);
        margin: 0 4px;
    }
}

.icon-upload-filled {
    font-size: 6em;
    fill: var(--jpz-color-primary);
}

:deep(.el-upload-list) {
    li {
        // 上下边距
        margin: 30px 0;
        padding: 0;
    }
}

.dialog-title {
    font-size: 20px;
    font-weight: 700;
}

.el-upload__text {
    // font-size: 16px;
    font-weight: 500;
}

.el-upload__tip_title {
    margin: 10px 0;
    color: red;
}

.el-upload__tip_info {
    margin: 10px 0;
    color: red;
}
</style>

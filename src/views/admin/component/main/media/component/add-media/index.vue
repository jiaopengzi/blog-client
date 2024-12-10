<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-08-31 13:10:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-06 12:10:44
 * @FilePath     : \blog-client\src\views\admin\component\main\media\component\add-media\index.vue
 * @Description  : 添加媒体
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div>
        <div class="switch-all">
            <span class="switch">视频文件选项:</span>
            <el-switch
                class="switch"
                v-model="isEncrypt"
                inline-prompt
                active-text="加密"
                inactive-text="无密"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
            <el-switch
                class="switch"
                v-model="isNoFree"
                inline-prompt
                active-text="收费"
                inactive-text="免费"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
        </div>

        <div class="row2">建议:收费视频加密,免费视频不加密."</div>
        <el-upload ref="uploadRef" class="upload" drag multiple :http-request="httpRequest">
            <Icon :name="IconKeys.UploadFilled" custom-class="icon-upload-filled" />
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
import { ref, onBeforeMount, useTemplateRef } from "vue"
import { IconKeys } from "@/components/common/icons"
import { getUploadFileRequirementsAPI } from "@/api/upload/getUploadFileRequirements"
import { ResponseCode } from "@/api/responseCode"
import { type UploadRequestOptions, type ElUpload } from "element-plus"
import { HashAlgorithm } from "@/utils/hash"
import { uploadByEl } from "@/views/admin/component/main/media/component/add-media"

defineOptions({ name: "AddMedia" })

const emit = defineEmits<{
    (event: "has-upload", value: boolean): void // 是否有上传
}>()

const uploadRef = useTemplateRef<typeof ElUpload>("uploadRef")

const allowedInfo = ref("")
const chunkSizeServer = ref(1024 * 1024 * 10)
let hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256

// 上传视频是否加密
const isEncrypt = ref(true)
const isNoFree = ref(true)

const httpRequest = async (options: UploadRequestOptions) => {
    try {
        const result = await uploadByEl(
            options,
            isEncrypt.value,
            isNoFree.value,
            chunkSizeServer.value,
            hashAlgorithmServer,
        )
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
            chunkSizeServer.value = response.data.data.chunk_size
            hashAlgorithmServer = response.data.data.hash_algorithm
            // for 循环遍历 allowedInfoList 数组 i 最大值为 allowedInfoList.length - 1
            for (let i = 0; i < allowedInfoList.length; i++) {
                // item的 Type按照'/'分割，取最后一个 例如：image/png => png
                const _type = allowedInfoList[i].extension.toUpperCase()
                // item的 MaxSize 是以字节为单位，转换为mb
                const maxSize = allowedInfoList[i].max_size / 1024 / 1024
                // 如果 maxSize 小于 1MB，保留两位小数 否则取整
                maxSize < 1
                    ? strList.push(`${_type}:${maxSize.toFixed(2)}MB`)
                    : strList.push(`${_type}:${Math.floor(maxSize)}MB`)
            }
        }
        allowedInfo.value = strList.join("、") + "。"
    })
}

onBeforeMount(async () => {
    await getAllowedInfo()
})
</script>

<style lang="scss" scoped>
.switch-all {
    display: flex;
    align-items: center;
}

.switch {
    margin-right: 10px;
}

.row2 {
    margin: 10px 0;
    font-size: 14px;
    font-weight: 500;
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

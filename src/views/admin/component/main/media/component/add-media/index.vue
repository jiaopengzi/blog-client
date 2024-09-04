<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-08-31 13:10:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-04 19:44:46
 * @FilePath     : \blog-client\src\views\admin\component\main\media\component\add-media\index.vue
 * @Description  : 添加媒体
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->


<template>
    <div>
        <el-checkbox v-model="isEncrypt" class="is-checkbox is-encrypt">视频加密</el-checkbox>
        <el-checkbox v-model="isFree" class="is-checkbox is-free">视频加密</el-checkbox>
        <div class="row2">建议:收费视频加密,免费视频不加密.</div>
        <el-upload ref="uploadRef" class="upload" drag multiple action="http://localhost:8081/api/v1/utils/upload-file"
            :http-request="httpRequest">
            <Icon :name="IconKeys.UploadFilled" custom-class="icon-upload-filled" />
            <div class="el-upload__text">
                将文件拖放到此处 或 <em>点击上传</em>
            </div>
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
import { ref, watchEffect, onBeforeMount, useTemplateRef } from 'vue'
import { IconKeys } from '@/components/common/icons'
import { getUploadFileRequirementsAPI } from '@/api/upload/getUploadFileRequirements'
import { ShowMsgTip } from '@/utils/message'
import { UploadCode } from '@/api/responseCode'
import { type UploadRequestOptions, type ElUpload } from 'element-plus'
import type { RequestStrategy, Chunk } from '@/utils/chunkUpload'
import { type ConfirmBeforeUploadRequest, confirmBeforeUploadAPI } from '@/api/upload/confirmBeforeUpload'
import { type ChunkMetadata, uploadChunkAPI } from '@/api/upload/chunk'
import { type UploadFileInfo, UploadControllerEvents, UploadController, MultiThreadSplitor } from '@/utils/chunkUpload'
import { HashAlgorithm } from '@/utils/hash'
import type { Res } from '@/api/responseCode'
import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import { type ConfirmAfterUploadBySignedUrlRequest, confirmAfterUploadBySignedUrlAPI } from '@/api/upload/confirmAfterUploadBySignedUrl'

defineOptions({ name: "add-media" })

const props = withDefaults(defineProps<{
    isVisible: boolean // 是否显示
}>(), {
    isVisible: false, // 默认不显示
})

const uploadRef = useTemplateRef<typeof ElUpload>("uploadRef")

// 监控 IsVisible 变化,如果为 false 则清空上传文件
watchEffect(() => {
    if (!props.isVisible) {
        uploadRef.value?.clearFiles()
    }
})

const allowedInfo = ref("")
const chunkSizeServer = ref(1024 * 1024 * 10)
let hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256

const getAllowedInfo = async () => {
    const strList: string[] = []
    await getUploadFileRequirementsAPI().then((response) => {
        if (response.data.code === UploadCode.GetUploadFileRequirementsSuccess) {
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
                maxSize < 1 ? strList.push(`${_type}:${maxSize.toFixed(2)}MB`) : strList.push(`${_type}:${Math.floor(maxSize)}MB`)
            }
        }
        allowedInfo.value = strList.join("、") + '。'
    })
}

// 上传视频是否加密
const isEncrypt = ref(false)
const isFree = ref(false)

const httpRequest = async (options: UploadRequestOptions) => {

    // 定义一个请求策略
    class MyRequestStrategy implements RequestStrategy {

        uploadFileInfo: UploadFileInfo | null = null

        async confirmBeforeUpload(req: ConfirmBeforeUploadRequest): Promise<UploadFileInfo> {
            // 返回 uploadFileInfo
            return await confirmBeforeUploadAPI(req).then((response) => {
                const data = response.data.data
                if (response.data.code === UploadCode.ConfirmBeforeUploadSuccess) {
                    this.uploadFileInfo = data
                    return data
                } else {
                    if ("error_msg" in data && data.error_msg) {
                        ShowMsgTip(ShowMsgTip.MsgType.error, `${response.data.msg}:${options.file.name},${data.error_msg} `, 6000)
                    } else {
                        ShowMsgTip(ShowMsgTip.MsgType.error, `${response.data.msg}:${options.file.name}`, 6000)
                    }
                    const error: any = new Error(response.data.msg)
                    options.onError(error)
                    return
                }
            }).catch(() => {
                ShowMsgTip(ShowMsgTip.MsgType.error, '上传前确认失败，请重试')
                const error: any = new Error('上传前确认失败，请重试')
                options.onError(error)
            })

        }

        async uploadFileBySignedUrl(
            file: File,
            signedUrl: string,
            headers: Record<string, string>,
            onProgress: (percent: number) => void,
        ): Promise<any> {
            if (this.uploadFileInfo?.upload_strategy.signed_url) {
                await uploadFileBySignedUrlAPI(file, signedUrl, headers, onProgress)
            }

        }

        async confirmAfterUploadBySignedUrl(req: ConfirmAfterUploadBySignedUrlRequest): Promise<Res> {
            return (await confirmAfterUploadBySignedUrlAPI(req)).data
        }

        async uploadChunk(chunk: Chunk): Promise<Res> {
            const formData = new FormData()
            formData.append(options.filename, chunk.blob, chunk.part_index + options.file.name)
            const meta: ChunkMetadata = {
                File_id: this.uploadFileInfo?.id!,
                sub_dir: this.uploadFileInfo?.sub_dir!,
                hash_key: chunk.hash_key,
                hash_algorithm: chunk.hash_algorithm,
                part_numbers: chunk.part_numbers,
                part_index: chunk.part_index,
                start: chunk.start,
                end: chunk.end,
            }
            return (await uploadChunkAPI(formData, meta)).data
        }

    }

    // 获取一个文件对象，这通常是用户通过<input type="file"/>选择的文件
    let file: File = options.file

    // 创建一个请求策略对象
    let requestStrategy = new MyRequestStrategy()

    // 创建一个分片策略对象
    let splitStrategy = new MultiThreadSplitor(file, chunkSizeServer.value, hashAlgorithmServer)

    // 创建一个UploadController对象
    let uploadController = new UploadController(file, requestStrategy, splitStrategy)


    // 监听 progress 事件
    uploadController.on(UploadControllerEvents.PROGRESS, (progress: number) => {
        // 上传进度
        const evt: any = {
            percent: progress * 100,
        }
        // 调用 options.onProgress 方法
        options.onProgress?.(evt)
    })

    // 监听 checkWholeHash 事件
    uploadController.on(UploadControllerEvents.CHECK_WHOLE_HASH, (fileName: string) => {
        ShowMsgTip(ShowMsgTip.MsgType.info, `正在校验:${fileName},请稍后...`, 10000)
    })

    // 监听 end 事件
    uploadController.on(UploadControllerEvents.END, (fileName: string) => {
        options.onSuccess(fileName)
        const msg = `上传成功：${fileName}`
        ShowMsgTip(ShowMsgTip.MsgType.success, msg, 5000)
    })

    // 初始化UploadController
    uploadController.init(isEncrypt.value, isFree.value).catch(error => {
        // 处理错误
        console.error(error)
        options.onError(error)
    })
}

// const onRemove = (file: UploadUserFile, fileList: UploadUserFile[]) => {
//     ShowMsgTip(ShowMsgTip.MsgType.warning, `请关闭当前上传页面，在明细页面删除：${file.name}`, 2000)
// }

onBeforeMount(async () => {
    await getAllowedInfo()
})

</script>

<style lang="scss" scoped>
.is-checkbox {
    margin-right: 40px;
}

.row2 {
    margin: 10px 0;
    font-size: 14px;
    font-weight: 500;
}

.icon-upload-filled {
    font-size: 6em;
    fill: $primary-color;
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
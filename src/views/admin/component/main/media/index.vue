<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-24 14:30:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-12 17:36:49
 * @FilePath     : \blog-client\src\views\admin\component\main\media\index.vue
 * @Description  : 媒体文件管理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->


<template>
    <BaseTable :pagination="pagination" :table-column="cols" :is-show-delete-all="true"
        :add-item-dialog-visible="addItemDialogVisible" :is-show-search="true" :search-str="search"
        @update-current-page="updateCurrentPage" @update-page-sizes="updatePageSizes" @edit-row="editRow"
        @delete-row="deleteRow" @delete-rows="deleteRows" @update-search="updateSearch"
        @update-selection="updateSelection" @add-item-update-dialog-visible="addItemUpdateDialogVisible">

        <template #btns>
            <el-button type="primary" @click="handleAdd">
                新增
            </el-button>
        </template>
        <template #add-item-title>
            <span class="dialog-title">新增媒体文件</span>
        </template>

        <template #add-item>
            <el-upload ref="uploadRef" class="upload" drag multiple
                action="http://localhost:8081/api/v1/utils/upload-file" :http-request="httpRequest">
                <Icon :name="IconKeys.UploadFilled" custom-class="icon-upload-filled" />
                <div class="el-upload__text">
                    将文件拖放到此处 或 <em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        <div class="el-upload__tip_title">支持上传格式及最大限制</div>
                        <div class="el-upload__tip_info">{{ allowedInfo }}</div>
                    </div>
                </template>
            </el-upload>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue'
import BaseTable from '@/components/common/base-table'
import type { Pagination } from '@/components/common'
import type { Media, TableData, TableColumn } from '@/components/common/base-table'
import { debounce } from '@/utils/debounce'
import { AadminSideMenu } from '@/views/admin/component/aside'
import { IconKeys } from '@/components/common/icons'
import { getUploadFileRequirementsAPI } from '@/api/upload/getUploadFileRequirements'
import { ShowMsgTip } from '@/utils/message'
import { UploadCode } from '@/api/responseCode'
import type { UploadRequestOptions, ElUpload } from 'element-plus'
import type { RequestStrategy, Chunk } from '@/utils/chunkUpload'
import { type ConfirmBeforeUploadRequest, confirmBeforeUploadAPI } from '@/api/upload/confirmBeforeUpload'
import { type ChunkMetadata, uploadChunkAPI } from '@/api/upload/chunk'
import { type UploadFileInfo, UploadControllerEvents, UploadController, MultiThreadSplitor } from '@/utils/chunkUpload'
import { HashAlgorithm } from '@/utils/hash'
import type { Res } from '@/api/responseCode'
import { uploadFileBySignedUrlAPI } from '@/api/upload/uploadFileBySignedUrl'
import { type ConfirmAfterUploadBySignedUrlRequest, confirmAfterUploadBySignedUrlAPI } from '@/api/upload/confirmAfterUploadBySignedUrl'


defineOptions({ name: AadminSideMenu.Media })

const uploadRef = ref<typeof ElUpload>()

const cols: TableColumn[] = reactive([

    {
        prop: 'id',
        label: 'ID',
        sortable: true,
        width: 100,
        align: 'center',
    },
    {
        prop: 'img',
        label: '图片',
        width: 150,
        align: 'center',
        isImg: true,
    },
    {
        prop: 'fileName',
        label: '文件名',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'author',
        label: '作者',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'description',
        label: '描述',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'slug',
        label: '别名',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'uploadDate',
        label: '上传时间',
        sortable: true,
        width: 150,
        align: 'center',
    },

])

const pagination: Pagination<Media> = reactive({
    total: 10,
    current_page: 1,
    page_size: 5,
    page_count: 2,
    page_sizes: [5, 10, 20, 30],
    records: [{
        id: 1,
        fileName: 'Power BI',
        author: 'Power BI',
        uploadDate: '2021-12-12',
        description: 'Power BI',
        slug: 'power-bi',
        img: {
            url: 'https://jiaopengzi.com/wp-content/uploads/2022/01/%E7%84%A6%E6%A3%9A%E5%AD%90_avatar-64x64.png',
        }
    },
    {
        id: 1,
        fileName: 'Power BI',
        author: 'Power BI',
        uploadDate: '2021-12-12',
        description: 'Power BI',
        slug: 'power-bi',
        img: {
            url: 'https://jiaopengzi.com/wp-content/uploads/2022/01/%E7%84%A6%E6%A3%9A%E5%AD%90_avatar-64x64.png',
        }
    },

    {
        id: 1,
        fileName: 'Power BI',
        author: 'Power BI',
        uploadDate: '2021-12-12',
        description: 'Power BI',
        slug: 'power-bi',
        img: {
            url: 'https://jiaopengzi.com/wp-content/uploads/2022/01/%E7%84%A6%E6%A3%9A%E5%AD%90_avatar-64x64.png',
        }
    },],
})

const search = ref('')

const allowedInfo = ref("")
const chunkSizeServer = ref(1024 * 1024 * 10)
let hashAlgorithmServer: HashAlgorithm = HashAlgorithm.SHA256

const getAllowedInfo = () => {
    const strList: string[] = []
    getUploadFileRequirementsAPI().then((response) => {
        if (response.data.code === UploadCode.GetUploadFileRequirementsSuccess) {
            const allowedInfoList = response.data.data.file_allowed
            chunkSizeServer.value = response.data.data.chunk_size
            hashAlgorithmServer = response.data.data.hash_algorithm
            // for 循环遍历 allowedInfoList 数组 i 最大值为 allowedInfoList.length - 1
            for (let i = 0; i < allowedInfoList.length; i++) {
                // item的 Type按照'/'分割，取最后一个 例如：image/png => png
                const _type = allowedInfoList[i].Type.split("/")[1].toUpperCase()
                // item的 MaxSize 是以字节为单位，转换为mb
                const maxSize = allowedInfoList[i].MaxSize / 1024 / 1024
                // 如果 maxSize 小于 1MB，保留两位小数 否则取整
                maxSize < 1 ? strList.push(`${_type}:${maxSize.toFixed(2)}MB`) : strList.push(`${_type}:${Math.floor(maxSize)}MB`)
            }
        }
        allowedInfo.value = strList.join("、") + '。'
    })
}


const httpRequest = async (options: UploadRequestOptions) => {

    // 定义一个请求策略
    class MyRequestStrategy implements RequestStrategy {

        uploadFileInfo: UploadFileInfo | null = null

        async confirmBeforeUpload(req: ConfirmBeforeUploadRequest): Promise<UploadFileInfo> {
            // 返回 uploadFileInfo
            return await confirmBeforeUploadAPI(req).then((response) => {
                if (response.data.code === UploadCode.ConfirmBeforeUploadSuccess) {
                    this.uploadFileInfo = response.data.data
                    return response.data.data
                } else {
                    ShowMsgTip(ShowMsgTip.MsgType.error, response.data.msg, 2000)
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
    uploadController.init().catch(error => {
        // 处理错误
        console.error(error)
        options.onError(error)
    })
}

const addItemDialogVisible = ref(false)

const handleAdd = () => {
    addItemDialogVisible.value = !addItemDialogVisible.value
}

// const onRemove = (file: UploadUserFile, fileList: UploadUserFile[]) => {
//     ShowMsgTip(ShowMsgTip.MsgType.warning, `请关闭当前上传页面，在明细页面删除：${file.name}`, 2000)
// }

const updateCurrentPage = (val: number) => {
    pagination.current_page = val
    console.log("1", val)
}

const updatePageSizes = (val: number) => {
    pagination.page_size = val
    console.log("2", val)
}

const editRow = (index: number, row: TableData) => {
    console.log("3", index, row)
}

const deleteRow = (index: number, row: TableData) => {
    console.log("4", index, row)
}

const deleteRows = (rows: TableData[]) => {
    console.log("5", rows)
}

const updateSearch = debounce((val: string) => {
    search.value = val
    console.log("6", val)
}, 300)

const updateSelection = (rows: TableData[]) => {
    console.log("7", rows)
}

// 关闭上传对话框时清空上传文件列表 @update-dialog-visible="updateDialogVisible"
const addItemUpdateDialogVisible = (val: boolean) => {
    if (!val) {
        addItemDialogVisible.value = val
        uploadRef.value?.clearFiles()
    }
}


// :data="filterTableData" 
const filterTableData = computed(() =>
    pagination.records.filter(
        (data) =>
            !search.value ||
            data.fileName.toLowerCase().includes(search.value.toLowerCase())
    )
)

onMounted(() => {
    getAllowedInfo()
})

</script>

<style scoped lang="scss">
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
}
</style>@/utils/splitWorker
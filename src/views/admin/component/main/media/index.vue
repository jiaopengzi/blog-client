<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-24 14:30:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-07-23 19:52:28
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
import { uploadFileAPI } from '@/api/upload/file'
import { getUploadFileRequirementsAPI } from '@/api/upload/getUploadFileRequirements'
import { ShowMsgTip } from '@/utils/message'
import { UploadCode } from '@/api/responseCode'
import type { UploadRequestOptions, ElUpload } from 'element-plus'
import { type RequestStrategy, type Chunk, UploadController, MultiThreadSplitor } from '@/utils/chunkUpload'


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

const getAllowedInfo = () => {
    const strList: string[] = []
    getUploadFileRequirementsAPI().then((response) => {
        if (response.data.code === UploadCode.GetUploadFileRequirementsSuccess) {
            const allowedInfoList = response.data.data.file_allowed
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


const httpRequest0 = (options: UploadRequestOptions) => {
    console.log("0", options)
    console.log("1", options.file)
    console.log("2", options.file.slice(0, 10 * 1024 * 1024))

    const formData = new FormData()
    // if (options.data) {
    //     for (const [key, value] of Object.entries(options.data)) {
    //         if (Array.isArray(value) && value.length) {
    //             if (typeof value[0] === "string" || value[0] instanceof Blob) {
    //                 formData.append(key, value[0]);
    //             }
    //             if (typeof value[1] === "string") {
    //                 formData.append(key, value[1]);
    //             }
    //         } else {
    //             formData.append(key, value);
    //         }
    //     }
    // }

    formData.append(options.filename, options.file.slice(0, 10 * 1024 * 1024), options.file.name)

    // 调用 uploadAvatar 函数
    uploadFileAPI(formData, (progressEvent) => {
        if (progressEvent.progress && progressEvent.total && progressEvent.loaded) {
            const evt: any = {
                loaded: progressEvent.loaded,
                total: progressEvent.total,
                percent: progressEvent.progress * 100 > 1 ? progressEvent.progress * 100 - 1 : 0,
            }
            options.onProgress?.(evt)
        }
    })
        .then((response) => {
            if (response.data.code === UploadCode.Success) {
                ShowMsgTip(ShowMsgTip.MsgType.success, response.data.msg, 2000)
                options.onSuccess(UploadCode.Success)
                return
            } else {
                ShowMsgTip(ShowMsgTip.MsgType.error, response.data.msg + response.data.data, 2000)
                const error: any = new Error(response.data.msg)
                options.onError(error)
                return
            }
        })
        .catch(() => {
            ShowMsgTip(ShowMsgTip.MsgType.error, '上传失败，请重试')
            const error: any = new Error('上传失败，请重试')
            options.onError(error)
        })
}




const httpRequest = async (options: UploadRequestOptions) => {

    // 定义一个请求策略
    class MyRequestStrategy implements RequestStrategy {
        async createFile(file: File): Promise<string> {
            // 返回token
            return 'token'
        }

        async uploadChunk(chunk: Chunk): Promise<void> {
            const formData = new FormData()
            formData.append(options.filename, chunk.blob, options.file.name)

            // 调用 uploadAvatar 函数
            uploadFileAPI(formData, (progressEvent) => {
                if (progressEvent.progress && progressEvent.total && progressEvent.loaded) {
                    const evt: any = {
                        loaded: progressEvent.loaded,
                        total: progressEvent.total,
                        percent: progressEvent.progress * 100 > 1 ? progressEvent.progress * 100 - 1 : 0,
                    }
                    options.onProgress?.(evt)
                }
            })
                .then((response) => {
                    if (response.data.code === UploadCode.Success) {
                        ShowMsgTip(ShowMsgTip.MsgType.success, response.data.msg, 2000)
                        options.onSuccess(UploadCode.Success)
                        return
                    } else {
                        ShowMsgTip(ShowMsgTip.MsgType.error, response.data.msg + response.data.data, 2000)
                        const error: any = new Error(response.data.msg)
                        options.onError(error)
                        return
                    }
                })
                .catch(() => {
                    ShowMsgTip(ShowMsgTip.MsgType.error, '上传失败，请重试')
                    const error: any = new Error('上传失败，请重试')
                    options.onError(error)
                })
        }

        async mergeFile(token: string): Promise<string> {
            // 合并文件并返回URL
            return 'url'
        }

        async patchHash<T extends 'file' | 'chunk'>(
            token: string,
            hash: string,
            type: T,
        ): Promise<
            T extends 'file' ? { hasFile: boolean } : { hasFile: boolean; rest: number[]; url: string }
        > {
            if (type === 'file') {
                return { hasFile: false } as unknown as T extends 'file' ? { hasFile: boolean } : { hasFile: boolean; rest: number[]; url: string }
            } else {
                return { hasFile: false, rest: [], url: '' } as unknown as T extends 'file' ? { hasFile: boolean } : { hasFile: boolean; rest: number[]; url: string }
            }
        }


    }

    // 获取一个文件对象，这通常是用户通过<input type="file"/>选择的文件
    let file: File = options.file

    // 创建一个分片策略对象
    let splitStrategy = new MultiThreadSplitor(file, 1024 * 1024 * 5, 'SHA-384')

    // 创建一个请求策略对象
    let requestStrategy = new MyRequestStrategy()

    // 创建一个UploadController对象
    let uploadController = new UploadController(file, requestStrategy, splitStrategy)

    // 初始化UploadController
    uploadController.init().catch(error => {
        // handle error
        console.error(error)
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
</style>
<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\media\index copy.vue
-->

<template>
    <BaseTable :data="filterTableData" :pagination="pagination" :table-column="cols"
        @update-current-page="updateCurrentPage" @update-page-sizes="updatePageSizes" @edit-row="editRow"
        @delete-row="deleteRow" @delete-rows="deleteRows" @update-search="updateSearch" @update-selection="updateSelection">

        <template #header>
            <span>新增媒体文件</span>
        </template>

        <template #add-item>
            <el-upload class="upload" drag multiple action="http://localhost:8081/api/v1/utils/upload-file"
                :http-request="httpRequest">
                <Icon :name="IconKeys.UploadFilled" custom-class="icon-upload-filled" />
                <div class="el-upload__text">
                    将文件拖放到此处或<em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        文件大小小于 500kb 的 jpg/png 文件。
                    </div>
                </template>
            </el-upload>
        </template>
    </BaseTable>
</template>
  
<script lang="ts" setup>
// :http-request="httpRequest" multiple
import { ref, computed, reactive } from 'vue'
import BaseTable from '@/components/common/base-table'
import type { Pagination } from '@/components/common'
import type { Media, TableData, TableColumn } from '@/components/common/base-table'
import { debounce } from '@/utils/debounce'
import { AadminSideMenu } from '@/views/admin/component/aside'
import { IconKeys } from '@/components/common/icons'
import { uploadFile } from '@/api/upload/file'
import { ShowMsgTip } from '@/utils/message'
import { isArray } from '@/utils/typeOf'
import { MsgType } from '@/components/common'
import { UploadCode } from '@/api/responseCode'
import type { UploadProps, UploadUserFile, UploadRequestOptions, UploadProgressEvent } from 'element-plus'

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: AadminSideMenu.Media })

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

const pagination: Pagination = reactive({
    totalPages: 10,
    currentPage: 1,
    pageSize: 5,
    pageSizes: [5, 10, 20, 30],
})

const search = ref('')

const httpRequest = (options: UploadRequestOptions) => {
    console.log("0", options)
    const formData = new FormData()
    if (options.data) {
        for (const [key, value] of Object.entries(options.data)) {
            if (Array.isArray(value) && value.length) {
                if (typeof value[0] === "string" || value[0] instanceof Blob) {
                    formData.append(key, value[0]);
                }
                if (typeof value[1] === "string") {
                    formData.append(key, value[1]);
                }
            } else {
                formData.append(key, value);
            }
        }
    }
    formData.append(options.filename, options.file, options.file.name)

    // 调用 uploadAvatar 函数
    uploadFile(formData, (progressEvent) => {

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
                ShowMsgTip(MsgType.success, response.data.msg, 2000)
                options.onSuccess(UploadCode.Success)
                return
            } else {
                ShowMsgTip(MsgType.error, response.data.msg + '：' + response.data.data)
                return
            }
        })
        .catch(() => {
            ShowMsgTip(MsgType.error, '上传失败，请重试')
        })
}




const updateCurrentPage = (val: number) => {
    pagination.currentPage = val
    console.log("1", val)
}

const updatePageSizes = (val: number) => {
    pagination.pageSize = val
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



const medias: Media[] = reactive([
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

])

const filterTableData = computed(() =>
    medias.filter(
        (data) =>
            !search.value ||
            data.fileName.toLowerCase().includes(search.value.toLowerCase())
    )
)

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
</style>
  
  
  
  
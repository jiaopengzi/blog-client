<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-24 14:30:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-05 18:26:01
 * @FilePath     : \blog-client\src\views\admin\component\main\media\index.vue
 * @Description  : 媒体文件管理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <BaseTable :pagination="pagination" :table-column="cols" :is-show-delete-all="true"
        :add-item-dialog-visible="addItemDialogVisible" :is-show-edit="true" :is-show-search="true" :search-str="search"
        @update-current-page="updateCurrentPage" @update-page-size="updatePageSize" @edit-row="editRow"
        @delete-row="deleteRow" @delete-rows="deleteRows" @update-search="updateSearch"
        @update-selection="updateSelection" @add-item-update-dialog-visible="addItemUpdateDialogVisible">

        <template #btns>
            <el-button type="primary" @click="handleAdd">
                新增
            </el-button>
        </template>
        <template #category>
            <!-- v-for 循环 fileCountGroupByFiletype 按钮 -->
            <div class="category">
                <el-button v-for="item in fileCountGroupByFiletype" :key="item.file_type"
                    :class="{ active: item.file_type === activeFileType }"
                    @click="handleFileCountByFiletype(item.file_type)">
                    {{ item.file_extension }} ({{ item.file_count }})
                </el-button>
            </div>
        </template>

        <template #add-item-title>
            <span class="dialog-title">新增媒体文件</span>
        </template>

        <template #add-item>
            <div class="dialog-add">
                <AddMedia :is-visible="addItemDialogVisible" />
            </div>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, defineAsyncComponent } from 'vue'
import type { Pagination } from '@/components/common'
import type { TableData, TableColumn } from '@/components/common/base-table'
import type { MediaFile, GetMediaFilesRequest } from '@/api/upload/getFiles'
import { getMediaFilesAPI, emptyMediaFiles } from '@/api/upload/getFiles'
import { debounce } from '@/utils/debounce'
import { AadminSideMenu } from '@/views/admin/component/aside'
import { ShowMsgTip } from '@/utils/message'
import { UploadCode } from '@/api/responseCode'
import { ImgFit } from '@/components/common'
import router from '@/router'
import { paginationRouterPush, PaginationQueryKey } from '@/router/utils'
import { getFileCountGroupByFiletypeAPI, type FileCountGroupByFiletype } from '@/api/upload/getFileCountGroupByFiletype'
import { DeleteFileAPI, type DeleteFileRequest } from '@/api/upload/deleteFile'

// import BaseTable from '@/components/common/base-table'
// import AddMedia from '@/views/admin/component/main/media/component/add-media'
// import EditUser from '@/views/admin/component/main/user-view/component/edit-user'
const BaseTable = defineAsyncComponent(() => import('@/components/common/base-table'))
const AddMedia = defineAsyncComponent(() => import('@/views/admin/component/main/media/component/add-media'))

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
        prop: 'thumbnail',
        label: '图片',
        width: 150,
        align: 'center',
        isImg: true,
    },
    {
        prop: 'file_name_display',
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
        prop: 'created_at',
        label: '上传时间',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'is_free',
        label: '免费',
        sortable: true,
        width: 100,
        align: 'center',
        formatter: (row: TableData) => { if ("is_free" in row) { if (row.is_free) { return "是" } return "否" } }
    },
    {
        prop: 'is_encrypt',
        label: '视频加密',
        sortable: true,
        width: 140,
        align: 'center',
        formatter: (row: TableData) => { if ("is_encrypt" in row) { if (row.is_encrypt) { return "是" } return "否" } }
    },
    {
        prop: 'video_quality_name',
        label: '视频分辨率',
        sortable: true,
        width: 120,
        align: 'center',
        formatter: (row: TableData) => formatterVideoQuality(row)
    },
])

// 分页数据
const pagination = ref<Pagination<MediaFile>>({
    total: 5,
    current_page: 1,
    page_size: 5,
    page_count: 1,
    page_sizes: [5, 10, 20, 30],
    records: [],
})

const search = ref('')

const AllFileType = 'AllFileType'
const activeFileType = ref(AllFileType)

// url query key
enum queryKey {
    FileType = 'file-type',
    Search = 'search',
}

const addItemDialogVisible = ref(false)
const editItemDialogVisible = ref(false)

const handleAdd = () => {
    addItemDialogVisible.value = !addItemDialogVisible.value
}

const updateCurrentPage = (val: number) => {
    pagination.value.current_page = val
    paginationRouterPush(AadminSideMenu.Media, pagination.value.page_size, val, { [queryKey.FileType]: activeFileType.value, [queryKey.Search]: search.value })
    console.log("1", val)
}

const updatePageSize = (val: number) => {
    pagination.value.page_size = val
    paginationRouterPush(AadminSideMenu.Media, val, pagination.value.current_page, { [queryKey.FileType]: activeFileType.value, [queryKey.Search]: search.value })
    console.log("2", val)
}

const editRow = (index: number, row: TableData) => {
    console.log("3", index, row)
}

const deleteRow = (index: number, row: TableData) => {
    console.log("4", index, row)
}

const deleteRows = async (rows: TableData[]) => {
    console.log("5", rows)
    // 将 rows 中的id 组成新的 list
    const ids = rows.flatMap((item) =>
        ('id' in item) ? item.id.toString() : []
    )

    // 将 ids 转换为 DeleteFileRequest
    const req: DeleteFileRequest = { file_id_list: ids }

    // 删除文件
    await DeleteFileAPI(req).then((res) => {
        if (res.data.code === UploadCode.FileDeleteSuccess) {
            // 重新获取文件统计
            getFileCountGroupByFiletype()
            // 重新获取分页文件
            getMediaFilePaginate({
                current_page: pagination.value.current_page,
                page_size: pagination.value.page_size,
                file_type: activeFileType.value,
                key_word: search.value,
            })
            ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 3000)
        } else {
            // 显示错误信息
            ShowMsgTip(ShowMsgTip.MsgType.error, res.data.msg, 3000)
        }
    })
}

const updateSearch = debounce((val: string) => {
    search.value = val
    paginationRouterPush(AadminSideMenu.Media, pagination.value.page_size, pagination.value.current_page, { [queryKey.FileType]: activeFileType.value, [queryKey.Search]: val })
    console.log("6", val)
}, 300)

const updateSelection = (rows: TableData[]) => {
    console.log("7", rows)
}

// 添加媒体文件对话框是否显示
const addItemUpdateDialogVisible = (val: boolean) => {
    addItemDialogVisible.value = val
    if (!val) {
        // 关闭对话框的时候重新获取分页数据
        getMediaFilePaginate({
            current_page: pagination.value.current_page,
            page_size: pagination.value.page_size,
            file_type: activeFileType.value,
            key_word: search.value,
        })
    }
}


// 获取分页用户
async function getMediaFilePaginate(req: GetMediaFilesRequest) {
    // 如果 key_word 为空 则不传 key_word
    if (!req.key_word) {
        delete req.key_word
    }

    // 如果 file_type 为 AllFileType 则不传 file_type
    if (req.file_type === AllFileType) {
        delete req.file_type
    }

    // 获取用户列表 // 宽高 50px 50px
    await getMediaFilesAPI(req, 100, 100, ImgFit.Cover, 60).then((res) => {
        if (res.data.code === UploadCode.GetAllSuccess) {
            pagination.value = res.data.data
            console.log("11============", pagination.value)
        } else {
            pagination.value = emptyMediaFiles()
        }
    })
}


// 从路由中query中获取值
function getValueFromQuery() {
    pagination.value.page_size = Number(router.currentRoute.value.query[PaginationQueryKey.PageSize]) || 10
    pagination.value.current_page = Number(router.currentRoute.value.query[PaginationQueryKey.CurrentPage]) || 1
    activeFileType.value = router.currentRoute.value.query[queryKey.FileType] as string || AllFileType
    search.value = router.currentRoute.value.query[queryKey.Search] as string || ''
    console.log("12============", search.value)
}


const formatterVideoQuality = (row: TableData) => {
    if ("video_quality_name" in row && "is_server_process" in row) {
        if (row.is_server_process && row.video_quality_name == "") {
            return "服务器处理中..."
        }
        if (!row.is_server_process) {
            return "-"
        }
        return row.video_quality_name
    }
}

// 文件统计
const fileCountGroupByFiletype = ref<FileCountGroupByFiletype[]>([])

// 获取文件统计
async function getFileCountGroupByFiletype() {
    await getFileCountGroupByFiletypeAPI().then((res) => {
        if (res.data.code === UploadCode.GetFileCountGroupByTypeSuccess) {
            const filetypeALL = res.data.data
            const total = filetypeALL.reduce((prev, cur) => {
                return prev + cur.file_count
            }, 0)
            const newFiletypeALL: FileCountGroupByFiletype = {
                file_type: AllFileType,
                file_extension: "全部",
                file_count: total
            }
            fileCountGroupByFiletype.value = [newFiletypeALL, ...filetypeALL]
        }
    })
}

const handleFileCountByFiletype = async (fileType: string) => {
    activeFileType.value = fileType
    // 添加路由跳转
    console.log("10============")
    console.log(activeFileType.value)
    paginationRouterPush(AadminSideMenu.Media, pagination.value.page_size, pagination.value.current_page, { [queryKey.FileType]: fileType, [queryKey.Search]: search.value })
}



onBeforeMount(async () => {
    getValueFromQuery()
    await getFileCountGroupByFiletype()
    await getMediaFilePaginate({
        current_page: pagination.value.current_page,
        page_size: pagination.value.page_size,
        file_type: activeFileType.value,
        key_word: search.value,
    })
})

</script>

<style scoped lang="scss">
.category {
    margin-top: 10px;
    display: flex;
    align-items: center;

    .el-button {


        position: relative;
        // 背景透明
        background-color: transparent;
        // 无边框
        border: none;

        &.active {
            font-weight: bold;
            color: $primary-color;
        }

        &::after {
            content: '';
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            height: 61.8%;
            border-right: 1px solid $primary-color;
        }

        &:last-child::after {
            display: none;
        }
    }
}

.dialog-title {
    font-size: 20px;
    font-weight: 700;
}

.dialog-edit {
    width: 100%;
    // 浮动 水平居中
    display: flex;
    justify-content: center;
}
</style>
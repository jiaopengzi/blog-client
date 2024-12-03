<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-24 14:30:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-03 17:02:57
 * @FilePath     : \blog-client\src\views\admin\component\main\media\index.vue
 * @Description  : 媒体文件管理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <BaseTable
        :pagination="pagination"
        :table-column="cols"
        :is-show-delete-all="true"
        :is-show-list-or-grid="true"
        :show-list-or-grid-status="isShowListOrGrid"
        :add-item-dialog-visible="addItemDialogVisible"
        :edit-item-dialog-visible="editItemDialogVisible"
        :is-show-edit="true"
        :is-show-search="true"
        :search-str="search"
        :edit-width="editWidth"
        :edit-top="editTop"
        @update-current-page="updateCurrentPage"
        @update-page-size="updatePageSize"
        @edit-row="editRow"
        @delete-row="deleteRow"
        @delete-rows="deleteRows"
        @update-search="updateSearch"
        @update-selection="updateSelection"
        @click-row-by-picture="clickRowByPicture"
        @add-item-update-dialog-visible="addItemUpdateDialogVisible"
        @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
        @is-show-list-or-grid="updateIsShowListOrGrid"
    >
        <template #btns>
            <el-button type="primary" @click="handleAdd"> 新增 </el-button>
        </template>
        <template #category>
            <!-- v-for 循环 fileCountGroupByFiletype 按钮 -->
            <div class="category">
                <el-button
                    v-for="item in fileCountGroupByFiletype"
                    :key="item.file_type"
                    :class="{ active: item.file_type === activeFileType }"
                    @click="handleFileCountByFiletype(item.file_type)"
                >
                    {{ item.file_extension }} ({{ item.file_count }})
                </el-button>
            </div>
        </template>

        <!-- 新增弹窗 -->
        <template #add-item-title>
            <span class="dialog-title">新增媒体文件</span>
        </template>

        <template #add-item>
            <div class="dialog-add">
                <AddMedia :is-visible="addItemDialogVisible" />
            </div>
        </template>

        <!-- 编辑弹窗  -->
        <template #edit-item-title>
            <span class="dialog-title">编辑媒体文件</span>
        </template>

        <template #edit-item>
            <EditMedia
                :edit-media-data="editMediaData"
                @edit-media-status="updateMedia"
                @update-subtitles="updateSubtitles"
                @delete-subtitles="deleteSubtitles"
            />
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import type { Pagination } from "@/components/common"
import type { TableData, TableColumn } from "@/components/common/base-table"
import type { MediaFile, GetMediaFilesRequest } from "@/api/upload/getFiles"
import { getMediaFilesAPI, emptyMediaFiles } from "@/api/upload/getFiles"
import { debounce } from "throttle-debounce"
import { AdminSideMenu } from "@/views/admin/component/aside"
import { ShowMsgTip } from "@/utils/message"
import { ResponseCode, LocalStorageKey, handleErrInfo } from "@/api/responseCode"
import { ImgFit } from "@/components/common"
import router from "@/router"
import { paginationRouterPush, PaginationQueryKey } from "@/router/utils"
import {
    getFileCountGroupByFiletypeAPI,
    type FileCountGroupByFiletype,
} from "@/api/upload/getFileCountGroupByFiletype"
import { DeleteFileAPI, type DeleteFileRequest } from "@/api/upload/deleteFile"
import type { EditMediaProps } from "@/views/admin/component/main/media/component/edit-media"
import { useGetData } from "@/components/hooks/useGetData"
import { isVideo } from "@/utils/isVideo"

import BaseTable from "@/components/common/base-table"
import AddMedia from "@/views/admin/component/main/media/component/add-media"
import EditMedia from "@/views/admin/component/main/media/component/edit-media"

defineOptions({ name: AdminSideMenu.Media })

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        width: 100,
        align: "center",
    },
    {
        prop: "thumbnail",
        label: "图片",
        width: 130,
        align: "center",
        isImg: true,
    },
    {
        prop: "file_name_display",
        label: "文件名",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "author",
        label: "作者",
        sortable: true,
        width: 150,
        align: "center",
    },
    {
        prop: "description",
        label: "描述",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "slug",
        label: "别名",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "created_at",
        label: "上传时间",
        sortable: true,
        width: 140,
        align: "center",
    },
    {
        prop: "is_free",
        label: "视频收费",
        width: 100,
        align: "center",
        formatter: (row: TableData) => formatterVideoIsFree(row),
    },
    {
        prop: "is_encrypt",
        label: "视频加密",
        width: 100,
        align: "center",
        formatter: (row: TableData) => formatterVideoIsEncrypt(row),
    },
    {
        prop: "is_generate_hls",
        label: "HLS",
        minWidth: 60,
        align: "center",
        formatter: (row: TableData) => formatterVideoIsHLS(row),
    },
    {
        prop: "video_quality_name",
        label: "视频分辨率",
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => formatterVideoQuality(row),
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

const search = ref("")

const AllFileType = "AllFileType"
const activeFileType = ref(AllFileType)

// url query key
enum queryKey {
    FileType = "file-type",
    Search = "search",
}

// 是否显示列表或网格
const isShowListOrGrid = ref(
    localStorage.getItem(LocalStorageKey.IsShowListOrGridAtMedia) == "true",
)

console.log("0============>", isShowListOrGrid.value)

// 更新是否显示列表或网格
const updateIsShowListOrGrid = (status: boolean) => {
    isShowListOrGrid.value = status
    localStorage.setItem(LocalStorageKey.IsShowListOrGridAtMedia, status.toString())
}

const addItemDialogVisible = ref(false)
const editItemDialogVisible = ref(false)

const editMediaData: EditMediaProps = reactive({
    file_id: "", // 文件ID
    file_name: "", // 文件名
    file_type: "", // 文件类型
    file_url: "", // 文件地址S
    thumbnail: "", // 缩略图
    file_name_display: "", // 显示名称
    description: "", // 描述
    slug: "", // 文件别名
    is_free: false, // 是否免费
    subtitles_language_list: [], // 字幕
    editDialogVisible: false, // 编辑对话框是否显示
    is_generate_hls: true, // 是否生成HLS
})

const handleAdd = () => {
    addItemDialogVisible.value = !addItemDialogVisible.value
}

const updateCurrentPage = (val: number) => {
    pagination.value.current_page = val
    paginationRouterPush(AdminSideMenu.Media, pagination.value.page_size, val, {
        [queryKey.FileType]: activeFileType.value,
        [queryKey.Search]: search.value,
    })
    console.log("1", val)
}

const updatePageSize = (val: number) => {
    pagination.value.page_size = val
    paginationRouterPush(AdminSideMenu.Media, val, pagination.value.current_page, {
        [queryKey.FileType]: activeFileType.value,
        [queryKey.Search]: search.value,
    })
    console.log("2", val)
}

const editWidth = ref("90%")
const editTop = ref("3vh")

const editRow = (index: number, row: TableData) => {
    console.log("04============", index, row)
    // 断言 row 中有 file_name_display ts 不会报错
    if ("file_name_display" in row) {
        editMediaData.file_id = row.id.toString()
        editMediaData.file_type = row.file_type
        editMediaData.file_url = row.url_belong + row.path
        editMediaData.file_name = row.file_name
        editMediaData.file_name_display = row.file_name_display
        editMediaData.description = row.description
        editMediaData.slug = row.slug
        editMediaData.is_free = row.is_free
        editMediaData.subtitles_language_list = row.subtitles_language_list || []
        editMediaData.img = row.img
        editMediaData.editDialogVisible = true
        editMediaData.is_generate_hls = row.is_generate_hls

        // 如果是视频则设置宽高
        if (isVideo(row.file_type)) {
            editWidth.value = "90%"
            editTop.value = "3vh"
        } else {
            editWidth.value = ""
            editTop.value = ""
        }
    }

    console.log("3", index, row)
}

const deleteRow = (index: number, row: TableData) => {
    console.log("4", index, row)
}

const deleteRows = async (rows: TableData[]) => {
    console.log("5", rows)
    // 将 rows 中的id 组成新的 list
    const ids = rows.flatMap((item) => ("id" in item ? item.id.toString() : []))

    // 将 ids 转换为 DeleteFileRequest
    const req: DeleteFileRequest = { file_id_list: ids }

    // 删除文件
    await DeleteFileAPI(req).then((res) => {
        if (res.data.code === ResponseCode.FileDeleteSuccess) {
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
            const msg = handleErrInfo(res)
            ShowMsgTip(ShowMsgTip.MsgType.error, msg, 3000)
        }
    })
}

const updateSearch = debounce(300, (val: string) => {
    search.value = val
    paginationRouterPush(
        AdminSideMenu.Media,
        pagination.value.page_size,
        pagination.value.current_page,
        { [queryKey.FileType]: activeFileType.value, [queryKey.Search]: val },
    )
    console.log("6", val)
})

const updateSelection = (rows: TableData[]) => {
    console.log("7", rows)
}

const clickRowByPicture = (row: TableData) => {
    console.log("8", row)
    if ("url_belong" in row && "path" in row && row.url_belong && row.path) {
        const url = row.url_belong + row.path
        if (typeof ClipboardItem !== "undefined") {
            console.log("新版复制API")
            navigator.clipboard.writeText(url).then(() => {
                ShowMsgTip(ShowMsgTip.MsgType.success, "复制成功", 3000)
            })
        } else {
            console.log("旧版复制API")
            // 使用 execCommand
            const input = document.createElement("input")
            input.style.position = "fixed"
            input.style.top = "0"
            input.style.left = "0"
            input.style.opacity = "0"
            input.value = url
            document.body.appendChild(input)
            input.select()
            document.execCommand("copy")
            document.body.removeChild(input)
            ShowMsgTip(ShowMsgTip.MsgType.success, "复制成功", 3000)
        }
    }
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

// 编辑对话框
const editItemUpdateDialogVisible = (val: boolean) => {
    console.log("09============", val)
    editItemDialogVisible.value = val
    editMediaData.editDialogVisible = val
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
        if (res.data.code === ResponseCode.GetFilesSuccess) {
            pagination.value = res.data.data
            console.log("11============", pagination.value)
        } else {
            pagination.value = emptyMediaFiles()
        }
    })
}

// 从路由中query中获取值
function getValueFromQuery() {
    pagination.value.page_size =
        Number(router.currentRoute.value.query[PaginationQueryKey.PageSize]) || 10
    pagination.value.current_page =
        Number(router.currentRoute.value.query[PaginationQueryKey.CurrentPage]) || 1
    activeFileType.value =
        (router.currentRoute.value.query[queryKey.FileType] as string) || AllFileType
    search.value = (router.currentRoute.value.query[queryKey.Search] as string) || ""
    console.log("12============", search.value)
}

const formatterVideoIsFree = (row: TableData) => {
    if ("is_free" in row && isVideo(row.file_type)) {
        if (row.is_free) {
            return "免费"
        }
        return "收费"
    } else {
        return "-"
    }
}
const formatterVideoIsEncrypt = (row: TableData) => {
    if ("is_encrypt" in row && isVideo(row.file_type)) {
        if (row.is_encrypt) {
            return "加密"
        }
        return "无密"
    } else {
        return "-"
    }
}

const formatterVideoIsHLS = (row: TableData) => {
    if ("is_generate_hls" in row && isVideo(row.file_type)) {
        if (row.is_generate_hls) {
            return "是"
        }
        return "否"
    } else {
        return "-"
    }
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
        if (res.data.code === ResponseCode.GetFileCountGroupByTypeSuccess && res.data.data) {
            const filetypeALL = res.data.data
            const total = filetypeALL.reduce((prev, cur) => {
                return prev + cur.file_count
            }, 0)
            const newFiletypeALL: FileCountGroupByFiletype = {
                file_type: AllFileType,
                file_extension: "全部",
                file_count: total,
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
    paginationRouterPush(
        AdminSideMenu.Media,
        pagination.value.page_size,
        pagination.value.current_page,
        { [queryKey.FileType]: fileType, [queryKey.Search]: search.value },
    )
}

// 初始化数据
const getDataOnBeforeMount = async () => {
    getValueFromQuery()
    await getFileCountGroupByFiletype()
    await getMediaFilePaginate({
        current_page: pagination.value.current_page,
        page_size: pagination.value.page_size,
        file_type: activeFileType.value,
        key_word: search.value,
    })
}

// 路由变化时获取数据
const getDataOnRouteChange = async () => {
    await getMediaFilePaginate({
        current_page: pagination.value.current_page,
        page_size: pagination.value.page_size,
        file_type: activeFileType.value,
        key_word: search.value,
    })
}

const updateMedia = async (status: boolean) => {
    if (status) {
        await getDataOnRouteChange()
    }
}

// 更新字幕
const updateSubtitles = async (language: string) => {
    // 如果已经存在则不添加,否则添加
    if (!editMediaData.subtitles_language_list.includes(language)) {
        editMediaData.subtitles_language_list.push(language)
    }
    await getDataOnRouteChange()
}

// 删除字幕
const deleteSubtitles = async (language: string) => {
    editMediaData.subtitles_language_list = editMediaData.subtitles_language_list.filter(
        (item) => item !== language,
    )
    await getDataOnRouteChange()
}

// hook
useGetData([getDataOnBeforeMount], [getDataOnRouteChange])
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
            content: "";
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
</style>

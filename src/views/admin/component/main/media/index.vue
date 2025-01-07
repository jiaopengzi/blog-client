<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-24 14:30:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-03 12:36:48
 * @FilePath     : \blog-client\src\views\admin\component\main\media\index.vue
 * @Description  : 媒体文件管理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <section>
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
            height="calc(100vh - 270px)"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @edit-row="editRow"
            @delete-rows="deleteRows"
            @update-search="updateSearch"
            @run-search="runSearch"
            @click-row-by-picture="clickRowByPicture"
            @add-item-update-dialog-visible="addItemUpdateDialogVisible"
            @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
            @is-show-list-or-grid="updateIsShowListOrGrid"
        >
            <template #btns>
                <el-button type="primary" @click="toggleAddDialog"> 新增 </el-button>
            </template>
            <template #category>
                <!-- v-for 循环 fileCountGroupByFiletype 按钮 -->
                <div class="category-group">
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
                    <AddMedia @has-upload="handleHasUpload" />
                </div>
            </template>

            <!-- 编辑弹窗  -->
            <template #edit-item-title>
                <span class="dialog-title">编辑媒体文件</span>
            </template>

            <template #edit-item>
                <EditMedia
                    :edit-media-data="editMediaData"
                    @edit-media-status="editStatus"
                    @update-subtitles="updateSubtitles"
                    @delete-subtitles="deleteSubtitles"
                />
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref, watch } from "vue"

import { type QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import { deleteFileAPI, type DeleteFileRequest } from "@/api/upload/deleteFile"
import {
    type FileCountGroupByFiletype,
    getFileCountGroupByFiletypeAPI,
} from "@/api/upload/getFileCountGroupByFiletype"
import type { GetMediaFilesRequest,MediaFile } from "@/api/upload/getFiles"
import { getMediaFilesAPI } from "@/api/upload/getFiles"
import { ImgFit,type TableImg } from "@/components/common"
import type { TableColumn,TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { LocalStorageKey } from "@/stores/local"
import { isVideo } from "@/utils/isVideo"
import { MessageUtil } from "@/utils/message"
import { AdminSideMenu } from "@/views/admin/component/aside"
import AddMedia from "@/views/admin/component/main/media/component/add-media"
import type { EditMediaProps } from "@/views/admin/component/main/media/component/edit-media"
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

const AllFileType = "AllFileType"
const activeFileType = ref(AllFileType)

// url query key
enum queryKey {
    FileType = "file_type",
    KeyWord = "key_word",
}

// 查询参数
const queryParams = reactive({} as GetMediaFilesRequest)

// 图片配置
const tableImg: TableImg = { width: 100, height: 100, imgFit: ImgFit.Cover, svgFontSize: 60 }

// 字符串类型的 key
const stringKeys: StringKeys<GetMediaFilesRequest>[] = ["file_type", "key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<GetMediaFilesRequest>[] = ["current_page", "page_size"]

// 不需要请求的参数
const noRequestKeys: QueryParamsRecord<queryKey> = { [queryKey.FileType]: AllFileType }

// 是否显示列表或网格
const isShowListOrGrid = ref(
    localStorage.getItem(LocalStorageKey.IsShowListOrGridAtMedia) == "true",
)

// 更新是否显示列表或网格
const updateIsShowListOrGrid = (status: boolean) => {
    isShowListOrGrid.value = status
    localStorage.setItem(LocalStorageKey.IsShowListOrGridAtMedia, status.toString())
}

// hooks 使用
const {
    addItemDialogVisible, // 添加对话框是否可见
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    toggleAddDialog, // 切换添加对话框
    toggleEditDialog, // 切换编辑对话框
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    editStatus, // 编辑状态
    addItemUpdateDialogVisible, // 新增对话框
    editItemUpdateDialogVisible, // 编辑对话框
    deleteRows, // 删除行
    updateRouterPush, // 更新查询参数和路由
    updatePaginate, // 更新分页
} = useBaseTable<MediaFile, GetMediaFilesRequest, DeleteFileRequest>(
    AdminSideMenu.Media,
    getMediaFilesAPI,
    ResponseCode.GetFilesSuccess,
    deleteFileAPI,
    ResponseCode.FileDeleteSuccess,
    queryParams,
    { stringKeys, numberKeys, noRequestKeys, tableImg },
)

// 更新数据
const updateData = async () => {
    updateRouterPush()
    await updatePaginate()
}

// 执行搜索
const runSearch = async () => {
    await updateData()
}

// 是否有上传
const hasUpload = ref(false)
const handleHasUpload = (value: boolean) => {
    hasUpload.value = value
}

// 监控 addItemDialogVisible 从 true 变为 false 同时 hasUpload 为 true 更新列表
watch(
    () => addItemDialogVisible.value,
    async (newVal, oldVal) => {
        if (hasUpload.value && oldVal === true && newVal === false) {
            await updatePaginate()
        }
    },
)

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
    toggleEditDialog()
    console.log("3", index, row)
}

const clickRowByPicture = (row: TableData) => {
    console.log("8", row)
    if ("url_belong" in row && "path" in row && row.url_belong && row.path) {
        const url = row.url_belong + row.path
        if (typeof ClipboardItem !== "undefined") {
            console.log("新版复制API")
            navigator.clipboard.writeText(url).then(() => {
                MessageUtil.success("复制成功", 3000)
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
            MessageUtil.success("复制成功", 3000)
        }
    }
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
    // 添加路由跳转
    Object.assign(queryParams, {
        [queryKey.FileType]: fileType,
        [queryKey.KeyWord]: search.value,
    })

    await updateData()
}

// 更新字幕
const updateSubtitles = async (language: string) => {
    // 如果已经存在则不添加,否则添加
    if (!editMediaData.subtitles_language_list.includes(language)) {
        editMediaData.subtitles_language_list.push(language)
    }
    await updateData()
}

// 删除字幕
const deleteSubtitles = async (language: string) => {
    editMediaData.subtitles_language_list = editMediaData.subtitles_language_list.filter(
        (item) => item !== language,
    )
    await updateData()
}

// 在加载前将 params 解析回对应的响应式变量中
useParams(queryParams, search, pagination)

onBeforeMount(async () => {
    await getFileCountGroupByFiletype()

    const { file_type } = queryParams

    if (file_type) {
        activeFileType.value = file_type
    }
})
</script>

<style scoped lang="scss">
.dialog-title {
    font-size: 20px;
    font-weight: 700;
}
</style>

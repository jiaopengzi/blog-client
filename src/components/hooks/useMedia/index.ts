/**
 * @FilePath     : \blog-client\src\components\hooks\useMedia\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 媒体 hooks
 */

import { onBeforeMount, watch } from "vue"

import { ResponseCode } from "@/api/response"
import { deleteFileAPI, type DeleteFileRequest } from "@/api/upload/deleteFile"
import { type FileCountGroupByFileType, getFileCountGroupByFileTypeAPI } from "@/api/upload/getFileCountGroupByFileType"
import type { GetMediaFilesRequest, MediaFile } from "@/api/upload/getFiles"
import { getMediaFilesAPI } from "@/api/upload/getFiles"
import type { TableData } from "@/components/common/base-table"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { queryKey } from "@/components/hooks/useMedia/types"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { LocalStorageKey } from "@/stores/local"
import { copyText } from "@/utils/clipboard"
import { isVideo } from "@/utils/isVideo"
import { MessageUtil } from "@/utils/message"

import { useData } from "./useData"

/**
 * @description: 媒体 hooks
 * @param isUpdateRouter 是否更新路由, 默认为 true 更新路由
 */
export function useMedia() {
    // 数据 hooks
    const {
        cols,
        AllFileType,
        activeFileType,
        queryParams,
        tableImg,
        stringKeys,
        numberKeys,
        noRequestKeys,
        showListOrGridStatus,
        editMediaData,
        editWidth,
        editTop,
        hasUpload,
        fileCountGroupByFileType,
    } = useData()

    // 更新显示列表或网格状态
    const updateShowListOrGridStatus = (status: boolean) => {
        showListOrGridStatus.value = status
        localStorage.setItem(LocalStorageKey.IsShowListOrGridAtMedia, status.toString())
    }

    // baseTable hooks
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
        deleteRows: deleteRowsBase, // 删除行
        updateRouterPush, // 更新查询参数和路由
        updatePaginate, // 更新分页
        loadingDelete, // 删除加载状态
    } = useBaseTable<MediaFile, GetMediaFilesRequest, DeleteFileRequest>({
        routeName: RouteNames.Media,
        viewAPI: getMediaFilesAPI,
        viewResCode: ResponseCode.GetFilesSuccess,
        deleteAPI: deleteFileAPI,
        deleteResCode: ResponseCode.FileDeleteSuccess,
        queryParams,
        options: { stringKeys, numberKeys, noRequestKeys, tableImg },
    })

    // 更新数据
    const updateData = async (isUpdateRouter: boolean = true) => {
        if (isUpdateRouter) {
            await updateRouterPush()
        }
    }

    // 执行搜索
    const runSearch = async (isUpdateRouter: boolean = true) => {
        await updateData(isUpdateRouter)
    }

    // 监控 addItemDialogVisible 从 true 变为 false 同时 hasUpload 为 true 更新列表
    watch(
        () => addItemDialogVisible.value,
        async (newVal, oldVal) => {
            if (hasUpload.value && oldVal === true && newVal === false) {
                await getFileCountGroupByFileType()
                await updatePaginate()
            }
        },
    )

    // 编辑行
    const editRow = (index: number, row: TableData) => {
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
    }

    // 点击图片复制链接
    const clickRowByPicture = async (row: TableData) => {
        if ("url_belong" in row && "path" in row && row.url_belong && row.path) {
            const url = row.url_belong + row.path
            // 复制链接到剪贴板
            await copyText(url).then(() => {
                MessageUtil.success("复制成功", 3000)
            })
        }
    }

    // 处理是否有上传
    const handleHasUpload = (value: boolean) => {
        hasUpload.value = value
    }

    // 根据文件类型统计文件数量
    const handleFileCountByFileType = async (fileType: string, isUpdateRouter: boolean = true) => {
        activeFileType.value = fileType
        Object.assign(queryParams, {
            [queryKey.FileType]: fileType,
            [queryKey.KeyWord]: search.value,
        })

        await updateData(isUpdateRouter)
    }

    // 更新字幕
    const updateSubtitles = async (language: string, isUpdateRouter: boolean = true) => {
        // 如果已经存在则不添加,否则添加
        if (!editMediaData.subtitles_language_list.includes(language)) {
            editMediaData.subtitles_language_list.push(language)
        }
        await updateData(isUpdateRouter)
    }

    // 删除字幕
    const deleteSubtitles = async (language: string, isUpdateRouter: boolean = true) => {
        editMediaData.subtitles_language_list = editMediaData.subtitles_language_list.filter((item) => item !== language)
        await updateData(isUpdateRouter)
    }

    // 将 params 解析回对应的响应式变量中(不需要请求)
    const parseParamsNotLoaded = () => {
        // 在加载前将 params 解析回对应的响应式变量中
        const { file_type } = queryParams

        if (file_type) {
            activeFileType.value = file_type
        }
    }

    // 监控 queryParams
    watch(
        () => queryParams,
        () => {
            parseParamsNotLoaded()
        },
        { deep: true },
    )

    // 在加载前将 params 解析回对应的响应式变量中
    useParams(queryParams, pagination, search)

    // 获取文件统计
    async function getFileCountGroupByFileType() {
        await getFileCountGroupByFileTypeAPI().then((res) => {
            if (res.data.code === ResponseCode.GetFileCountGroupByTypeSuccess && res.data.data) {
                const filetypeALL = res.data.data
                const total = filetypeALL.reduce((prev, cur) => {
                    return prev + cur.file_count
                }, 0)
                const newFiletypeALL: FileCountGroupByFileType = {
                    file_type: AllFileType,
                    file_extension: "全部",
                    file_count: total,
                }
                fileCountGroupByFileType.value = [newFiletypeALL, ...filetypeALL]
            }
        })
    }

    // 在加载前获取文件统计
    onBeforeMount(async () => {
        await getFileCountGroupByFileType()

        const { file_type } = queryParams

        if (file_type) {
            activeFileType.value = file_type
        }
    })

    const deleteRows = async (rows: TableData[]) => {
        await deleteRowsBase(rows)
        await getFileCountGroupByFileType()
    }

    return {
        cols, // 列配置
        showListOrGridStatus, // 显示列表或网格状态
        updateShowListOrGridStatus, // 更新显示列表或网格状态
        updateData, // 更新数据
        queryParams, // 查询参数
        runSearch, // 执行搜索
        hasUpload, // 是否有上传
        editMediaData, // 编辑数据
        editRow, // 编辑行
        clickRowByPicture, // 点击图片复制链接
        fileCountGroupByFileType, // 文件统计
        activeFileType, // 当前文件类型
        editWidth, // 编辑宽度
        editTop, // 编辑顶部
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
        handleHasUpload, // 处理是否有上传
        handleFileCountByFileType, // 根据文件类型统计文件数量
        updateSubtitles, // 更新字幕
        deleteSubtitles, // 删除字幕
        loadingDelete, // 删除加载状态
    }
}

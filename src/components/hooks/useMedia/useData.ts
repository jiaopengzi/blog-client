/**
 * @FilePath     : \blog-client\src\components\hooks\useMedia\useData.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 数据处理
 */

import { reactive, ref } from "vue"

import { type QueryParamsRecord } from "@/api/request"
import { type FileCountGroupByFileType } from "@/api/upload/getFileCountGroupByFileType"
import type { GetMediaFilesRequest } from "@/api/upload/getFiles"
import { ImgFit, type TableImg } from "@/components/common"
import type { TableColumn, TableData } from "@/components/common/base-table"
import type { EditMediaProps } from "@/components/common/media-edit"
import { LocalStorageKey } from "@/stores/local"

import { formatterVideoIsEncrypt, formatterVideoIsFree, formatterVideoIsHLS, formatterVideoQuality } from "./formatter"
import { queryKey } from "./types"

export function useData() {
    // 列配置
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
            prop: "file_id_hash",
            label: "文件ID哈希",
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

    // 显示列表或网格状态
    const showListOrGridStatus = ref(localStorage.getItem(LocalStorageKey.IsShowListOrGridAtMedia) == "true")

    // 编辑数据
    const editMediaData: EditMediaProps = reactive({
        file_id: "", // 文件ID
        file_name: "", // 文件名
        file_type: "", // 文件类型
        file_url: "", // 文件地址S
        thumbnail: "", // 缩略图
        file_name_display: "", // 显示名称
        description: "", // 描述
        file_id_hash: "", // 文件别名
        is_free: false, // 是否免费
        subtitles_language_list: [], // 字幕
        editDialogVisible: false, // 编辑对话框是否显示
        is_generate_hls: true, // 是否生成HLS
    })

    const editWidth = ref("90%")
    const editTop = ref("3vh")

    // 是否有上传
    const hasUpload = ref(false)

    // 文件统计
    const fileCountGroupByFileType = ref<FileCountGroupByFileType[]>([])

    return {
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
    }
}

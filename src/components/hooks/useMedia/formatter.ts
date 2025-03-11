/**
 * @FilePath     : \blog-client\src\components\hooks\useMedia\formatter.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 格式化显示
 */

import type { TableData } from "@/components/common/base-table"
import { isVideo } from "@/utils/isVideo"

// 格式化视频是否免费
export const formatterVideoIsFree = (row: TableData) => {
    if ("is_free" in row && isVideo(row.file_type)) {
        if (row.is_free) {
            return "免费"
        }
        return "收费"
    } else {
        return "-"
    }
}

// 格式化是否加密
export const formatterVideoIsEncrypt = (row: TableData) => {
    if ("is_encrypt" in row && isVideo(row.file_type)) {
        if (row.is_encrypt) {
            return "加密"
        }
        return "无密"
    } else {
        return "-"
    }
}

// 格式化是否生成HLS
export const formatterVideoIsHLS = (row: TableData) => {
    if ("is_generate_hls" in row && isVideo(row.file_type)) {
        if (row.is_generate_hls) {
            return "是"
        }
        return "否"
    } else {
        return "-"
    }
}

// 格式化视频分辨率
export const formatterVideoQuality = (row: TableData) => {
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

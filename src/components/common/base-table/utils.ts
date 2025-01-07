/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 10:59:06
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 11:00:15
 * @FilePath     : \blog-client\src\components\common\base-table\utils.ts
 * @Description  : 工具
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ImgFit } from "@/components/common"
import { IconKeys } from "@/components/common/icons"
import { formatTime } from "@/utils/dateTime"

import { type FormatTableData } from "./types"

/**
 * @description: 格式化表格的图片和时间
 * @param TableData 表格数据
 * @param width 图片宽度
 * @param height 图片高度
 * @param imgFit 图片填充方式
 * @return  {T} 格式化后的用户信息
 */
export function formatTableData<T extends FormatTableData>(
    { thumbnail, created_at, updated_at, price, ...tableData }: T,
    width: number = 30, // 默认值 30px
    height: number = 30, // 默认值 30px
    imgFit: ImgFit = ImgFit.Cover, // 默认值 cover
    svgFontSize = 30, // 默认值 30px
): T {
    const formatTableData = {
        ...tableData,
        // 使用 formatTime 进行格式化
        created_at: created_at ? formatTime(created_at) : "",
        updated_at: updated_at ? formatTime(updated_at) : "",
        price: price ? Number(price) / 100 + "元" : "",
    } as T

    // 如果 thumbnail 不为空，添加 img 属性
    if (thumbnail) {
        formatTableData.img = {
            url: thumbnail,
            width: width,
            height: height,
            imgFit: imgFit,
        }
    }

    // 如果 thumbnail 为空，添加 icon 属性
    if (!thumbnail && tableData.file_type === "application/zip") {
        formatTableData.img = {
            url: "",
            svgFontSize: svgFontSize,
            iconKeyName: IconKeys.Zip,
        }
    }

    return formatTableData
}

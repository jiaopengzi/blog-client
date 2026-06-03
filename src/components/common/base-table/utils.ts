/**
 * @FilePath     : \blog-client\src\components\common\base-table\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 工具
 */

import { ImgFit } from "@/components/common"
import { IconKeys } from "@/components/common/icons"
import type { SwitchItem, SwitchItemColor, SwitchItemLabel } from "@/components/common/switch-group"
import { formatTime } from "@/utils/dateTime"

import { type BaseTableListExpose, type FormatTableData, type TableData, type TableVisibleStoreReadable } from "./types"

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
        created_at: created_at ? formatTime(created_at) : "-",
        updated_at: updated_at ? formatTime(updated_at) : "-",
        price: price ? (parseFloat(price) / 100.0).toFixed(2) : "-", //分转成元
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

/**
 * @description: 创建列表和宫格切换项.
 * @param showListOrGridStatus 当前显示状态.
 * @return 切换项数组.
 */
export function createListOrGridSwitchItems(showListOrGridStatus: boolean): SwitchItem[] {
    const switchItemLabel: SwitchItemLabel = {
        active: "表格",
        inactive: "宫格",
    }

    const switchItemColor: SwitchItemColor = {
        active: "#409EFF",
        inactive: "#409EFF",
    }

    return [
        {
            name: "listOrGrid",
            status: showListOrGridStatus,
            label: switchItemLabel,
            color: switchItemColor,
        },
    ]
}

/**
 * @description: 获取行中的图片配置.
 * @param row 当前数据行.
 * @return 图片配置.
 */
export function getRowImg(row: TableData) {
    if ("img" in row) {
        return row.img
    }

    return undefined
}

/**
 * @description: 截断搜索关键字, 与现有组件行为保持一致.
 * @param keyword 搜索关键字.
 * @return 截断后的关键字.
 */
export function truncateSearchKeyword(keyword: string): string {
    if (keyword.length > 50) {
        return keyword.substring(0, 50)
    }

    return keyword
}

/**
 * @description: 从 Element Plus 表格实例中读取当前真实可见顺序.
 * @param records 默认数据行.
 * @param tableInstance 表格实例.
 * @return 当前可见行数组.
 */
export function getElTableVisibleRows(records: TableData[], tableInstance: TableVisibleStoreReadable | null): TableData[] {
    const tableStoreData = tableInstance?.store?.states?.data

    if (Array.isArray(tableStoreData)) {
        return tableStoreData as TableData[]
    }

    if (Array.isArray(tableStoreData?.value)) {
        return tableStoreData.value as TableData[]
    }

    return records
}

/**
 * @description: 根据当前视图模式获取可见行顺序.
 * @param showListOrGridStatus 当前是否为列表模式.
 * @param records 默认数据行.
 * @param listRef 列表视图实例.
 * @return 当前可见行数组.
 */
export function getListVisibleRows(showListOrGridStatus: boolean, records: TableData[], listRef: BaseTableListExpose | null): TableData[] {
    if (!showListOrGridStatus) {
        return records
    }

    return listRef?.getVisibleRows() ?? records
}

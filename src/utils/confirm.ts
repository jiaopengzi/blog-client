/*
 * FilePath    : blog-client-nuxt\src\utils\confirm.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 确认框逻辑, 支持按调用场景指定遮罩类名
 */

// Nuxt 适配: ElMessage/ElMessageBox 显式导入(原项目由 unplugin auto-import 提供)
import { ElMessage, ElMessageBox, type ElMessageBoxOptions } from "element-plus"
import { MsgTitle, MsgType } from "@/components/common"

/**
 * @description: 删除确认框
 * @param callback 回调函数
 * @return
 * @example
 * deleteConfirmCommon(() => {
 *  console.log('删除')
 * })
 */
export const deleteConfirmCommon = (callback: () => void) => {
    ElMessageBox.confirm("是否需要删除?", MsgTitle[MsgType.warning], {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: MsgType.warning,
    })
        .then(() => {
            callback()
            ElMessage({
                type: MsgType.success,
                message: "开始删除",
            })
        })
        .catch(() => {
            ElMessage({
                type: MsgType.info,
                message: "取消删除",
            })
        })
}

/**
 * @description 通用确认框
 * @param {string} info - 消息内容
 * @param {() => void} callback - 确认回调
 * @param {() => void} cancelCallback - 取消回调
 * @param options - 可选确认框展示配置, 当前支持 modalClass.
 * @returns 无返回值.
 * @example
 * confirmCommon('确认内容?', () => {
 *   console.log('确认');
 * }, () => {
 *   console.log('取消');
 * });
 */
export const confirmCommon = async (
    info: string,
    callback: () => void,
    cancelCallback: () => void,
    options: Pick<ElMessageBoxOptions, "modalClass"> = {},
): Promise<void> => {
    try {
        await ElMessageBox.confirm(info, MsgTitle[MsgType.warning], {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: MsgType.warning,
            ...options,
        })
        callback()
    } catch {
        cancelCallback()
    }
}

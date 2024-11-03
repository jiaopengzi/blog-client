/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-20 16:06:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-03 17:26:51
 * @FilePath     : \blog-client\src\utils\confirm.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
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
): Promise<void> => {
    try {
        await ElMessageBox.confirm(info, MsgTitle[MsgType.warning], {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: MsgType.warning,
        })
        callback()
    } catch {
        cancelCallback()
    }
}

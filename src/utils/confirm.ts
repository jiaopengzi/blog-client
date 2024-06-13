/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-20 16:06:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-20 16:07:28
 * @FilePath     : \blog-client\src\utils\test.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import { MsgTitle, MsgType } from '@/components/common'

/**
 * @description: 通用确认框
 * @param callback 回调函数
 * @return
 * @example
 * handleConfirmCommon(() => {
 *  console.log('删除')
 * })
 */
export const handleConfirmCommon = (callback: () => void) => {
  ElMessageBox.confirm('是否需要删除?', MsgTitle[MsgType.warning], {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: MsgType.warning,
  })
    .then(() => {
      callback()
      ElMessage({
        type: MsgType.success,
        message: '开始删除',
      })
    })
    .catch(() => {
      ElMessage({
        type: MsgType.info,
        message: '取消删除',
      })
    })
}

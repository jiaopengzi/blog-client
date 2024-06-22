/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-22 14:41:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-22 14:50:36
 * @FilePath     : \blog-client\src\utils\msg.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import { type Res } from '@/api/responseCode'
import { formatDurationTime } from '@/utils/dateTime'
import { ResponseCode } from '@/api/responseCode'

// 获取用户禁用信息
export function getUserForbiddenMsg(res: Res) {
  let msg = ''
  const countdown = formatDurationTime(res.data)
  if (res.code === ResponseCode.UserForbidden) {
    if (res.data && res.data <= 60 * 60 * 24 * 7) {
      msg = `${res.msg}, ${countdown} 后解禁!` // 占位符替换
    } else {
      msg = res.msg
    }
  }
  return msg
}

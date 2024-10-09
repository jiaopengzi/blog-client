/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-16 20:01:16
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-23 20:36:42
 * @FilePath     : \blog-client\src\utils\message.ts
 * @Description  : 消息提示 工具类
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { ElMessage } from 'element-plus'
import { MsgType } from '@/components/common'
// 按需引入 element-plus 消息提示组件样式
import 'element-plus/theme-chalk/el-message.css'
export const ShowMsgTip = (msgtype: MsgType, msgStr: string, duration: number = 3000): void => {
  ElMessage({
    showClose: true,
    // message: MsgTitle[msgtype] + ':' + msgStr,
    message: msgStr,
    type: msgtype,
    duration: duration
  })
}
// 将 MsgType 作为 ShowMsgTip 的静态属性添加
ShowMsgTip.MsgType = MsgType

/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-16 20:01:16
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-04 20:50:17
 * @FilePath     : \blog-client\src\utils\Message.ts
 * @Description  : 消息提示 工具类
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { ElMessage } from 'element-plus'
import { MsgType, MsgTitle } from '@/components/common/index'
// 按需引入 element-plus 消息提示组件样式
import 'element-plus/theme-chalk/el-message.css'
export const ShowMsgTip = (msgtype: MsgType, msgStr: string, duration: number = 3000): void => {
  ElMessage({
    showClose: true,
    message: MsgTitle[msgtype] + ':' + msgStr,
    type: msgtype,
    duration: duration,
  })
}

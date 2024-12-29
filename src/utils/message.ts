/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-16 20:01:16
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 10:26:30
 * @FilePath     : \blog-client\src\utils\message.ts
 * @Description  : 消息提示 工具类
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { ElMessage } from "element-plus"
import { MsgType } from "@/components/common"
import "element-plus/theme-chalk/el-message.css"

export class MessageUtil {
    static success(msgStr: string, duration: number = 3000): void {
        this.showMessage(MsgType.success, msgStr, duration)
    }

    static info(msgStr: string, duration: number = 3000): void {
        this.showMessage(MsgType.info, msgStr, duration)
    }

    static warning(msgStr: string, duration: number = 3000): void {
        this.showMessage(MsgType.warning, msgStr, duration)
    }

    static error(msgStr: string, duration: number = 3000): void {
        this.showMessage(MsgType.error, msgStr, duration)
    }

    private static showMessage(msgType: MsgType, msgStr: string, duration: number): void {
        ElMessage({
            showClose: true,
            message: msgStr,
            type: msgType,
            duration: duration,
        })
    }
}

export default MessageUtil

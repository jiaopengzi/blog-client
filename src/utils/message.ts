/**
 * @FilePath     : \blog-client\src\utils\message.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 消息提示 工具类
 */

import "element-plus/theme-chalk/el-message.css"

import { ElMessage } from "element-plus"

import { MsgType } from "@/components/common"

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

    static error(msgStr: string, duration: number = 6000): void {
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

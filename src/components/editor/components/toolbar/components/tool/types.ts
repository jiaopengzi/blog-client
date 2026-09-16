/**
 * FilePath    : blog-client\src\components\editor\components\toolbar\components\tool\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { IconKeys } from "@/components/common/icons"
import { CommandsKey } from "@/components/editor/command"

export interface ToolMenuItem {
    command: CommandsKey.PowerBi | CommandsKey.WechatCaptcha | CommandsKey.LoginView
    label: string
    icon: IconKeys
    hasSettings?: boolean
}

export const toolMenuItems: ReadonlyArray<ToolMenuItem> = [
    { command: CommandsKey.PowerBi, label: "PowerBI", icon: IconKeys.PowerBiUnion, hasSettings: true },
    { command: CommandsKey.WechatCaptcha, label: "微信验证码", icon: IconKeys.Captcha, hasSettings: true },
    { command: CommandsKey.LoginView, label: "登录查看", icon: IconKeys.Lock },
]

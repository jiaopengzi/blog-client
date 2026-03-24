/**
 * FilePath    : blog-client-dev\src\components\editor\components\toolbar\components\heading\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { IconKeys } from "@/components/common/icons"
import { CommandsKey } from "@/components/editor/command"

export interface HeadingMenuItem {
    command: CommandsKey.H1 | CommandsKey.H2 | CommandsKey.H3 | CommandsKey.H4 | CommandsKey.H5 | CommandsKey.H6
    label: string
    icon: IconKeys
}

export const headingMenuItems: ReadonlyArray<HeadingMenuItem> = [
    { command: CommandsKey.H1, label: "标题1", icon: IconKeys.H1 },
    { command: CommandsKey.H2, label: "标题2", icon: IconKeys.H2 },
    { command: CommandsKey.H3, label: "标题3", icon: IconKeys.H3 },
    { command: CommandsKey.H4, label: "标题4", icon: IconKeys.H4 },
    { command: CommandsKey.H5, label: "标题5", icon: IconKeys.H5 },
    { command: CommandsKey.H6, label: "标题6", icon: IconKeys.H6 },
]

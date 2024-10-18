/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-07 22:26:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 09:54:46
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\hotkey.ts
 * @Description  : codemirror 自定义快捷键
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Extension } from "@codemirror/state"
import { keymap } from "@codemirror/view"
import { copyLineDown } from "@codemirror/commands"

const customKeymap: Extension = keymap.of([
    {
        key: "Ctrl-d",
        run: copyLineDown, // 复制当前行
    },
])

export { customKeymap }

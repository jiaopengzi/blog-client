/**
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\hotkey.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : codemirror 自定义快捷键
 */

import { copyLineDown } from "@codemirror/commands"
import type { Extension } from "@codemirror/state"
import { keymap } from "@codemirror/view"

const customKeymap: Extension = keymap.of([
    {
        key: "Ctrl-d",
        run: copyLineDown, // 复制当前行
    },
])

export { customKeymap }

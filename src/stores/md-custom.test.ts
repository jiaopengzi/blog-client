/*
 * FilePath    : blog-client-nuxt\src\stores\md-custom.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页面自定义配置状态管理测试
 */

import { afterEach, describe, expect, it } from "vitest"

import { LocalStorageKey } from "./local"
import { clearMdCustomState, loadMdCustomState, saveMdCustomState } from "./md-custom"

describe("md-custom", () => {
    afterEach(() => {
        clearMdCustomState()
    })

    it("应持久化并恢复开启的段落首行缩进", () => {
        saveMdCustomState({ paragraphIndent: "2em" })

        expect(localStorage.getItem(LocalStorageKey.MdParagraphIndent)).toBe("2em")
        expect(loadMdCustomState().paragraphIndent).toBe("2em")
    })

    it("未保存或无效的段落首行缩进应使用默认关闭状态", () => {
        expect(loadMdCustomState().paragraphIndent).toBe("0")

        localStorage.setItem(LocalStorageKey.MdParagraphIndent, "invalid")

        expect(loadMdCustomState().paragraphIndent).toBe("0")
    })
})

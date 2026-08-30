/*
 * FilePath    : blog-client-nuxt\src\pkg\codemirror\extension\mdlint\rule\__test__\004.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 测试 rule004 - 检测代码块围栏闭合
 */

import { describe, expect, it } from "vitest"

import type { DocLike } from "../../types"
import { id, run } from "../004"
import { makeDoc } from "./utils"

describe("rule004 - 代码块围栏闭合检测", () => {
    it("成对闭合时不返回诊断", () => {
        const doc = makeDoc(["```", "code", "```"])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("未闭合时返回最后一个未匹配围栏的 error", () => {
        const doc = makeDoc(["```", "code"]) // 只有一个围栏
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        expect(diags[0]).toEqual({
            from: 0,
            to: 3,
            severity: "error",
            message: "代码块未闭合：缺少 ```",
            source: id,
        })
    })
})

export default {}

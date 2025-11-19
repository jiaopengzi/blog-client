/**
 * FilePath    : blog-client-dev\src\utils\version.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 单测
 */

import { describe, expect, it } from "vitest"

import { extractLatestChangelogVersionDate } from "./version"

describe("extractLatestChangelogVersionDate - 提取最新变更日志中的版本和日期", () => {
    it("提取带 v 前缀且包含链接的版本和日期", () => {
        const changelog = `
# Changelog

## [v1.2.3](https://example.com/release/v1.2.3) - 2025-01-01

- 添加功能 X
`
        expect(extractLatestChangelogVersionDate(changelog)).toEqual({
            version: "v1.2.3",
            date: "2025-01-01",
        })
    })

    it("提取不带 v 前缀且包含预发布与构建元数据的版本和日期", () => {
        const changelog = `
## [1.0.0-alpha.1+build.123] - 2024-06-01

- 测试版发布
`
        expect(extractLatestChangelogVersionDate(changelog)).toEqual({
            version: "1.0.0-alpha.1+build.123",
            date: "2024-06-01",
        })
    })

    it("省圆略括号(链接)", () => {
        const changelog = `
## [2.3.4] - 2023-12-31

- 修复补丁
`
        expect(extractLatestChangelogVersionDate(changelog)).toEqual({
            version: "2.3.4",
            date: "2023-12-31",
        })
    })

    it("当没有匹配的标题时返回 null", () => {
        const changelog = `
# Changelog

- 初始说明
- 未包含版本标题
`
        expect(extractLatestChangelogVersionDate(changelog)).toBeNull()
    })

    it("当日期格式不正确时返回 null", () => {
        const changelog = `
## [v1.0.0] - 2024/06/01

- 错误的日期格式使用了斜杠
`
        expect(extractLatestChangelogVersionDate(changelog)).toBeNull()
    })

    it("当存在多个发布条目时选取第一个匹配项", () => {
        const changelog = `
## [1.0.0] - 2024-01-01

- 第一次发布

## [2.0.0] - 2024-06-01

- 第二次发布
`
        expect(extractLatestChangelogVersionDate(changelog)).toEqual({
            version: "1.0.0",
            date: "2024-01-01",
        })
    })
})

/**
 * FilePath    : blog-client\src\utils\version.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 单测
 */

import { describe, expect, it } from "vitest"

import { extractLatestDevChangelogVersionDate, extractLatestProChangelogVersionDate } from "./version"

// 提取最新变更日志中的版本和日期
describe("extractLatestDevChangelogVersionDate - 提取最新变更日志中的版本和日期", () => {
    it("提取带 v 前缀且包含链接的版本和日期", () => {
        const changelog = `
# Changelog

## [v1.2.3](https://example.com/release/v1.2.3) - 2025-01-01

- 添加功能 X
`
        expect(extractLatestDevChangelogVersionDate(changelog)).toEqual({
            version: "v1.2.3",
            date: "2025-01-01",
        })
    })

    it("提取不带 v 前缀且包含预发布与构建元数据的版本和日期", () => {
        const changelog = `
## [1.0.0-alpha.1+build.123] - 2024-06-01

- 测试版发布
`
        expect(extractLatestDevChangelogVersionDate(changelog)).toEqual({
            version: "1.0.0-alpha.1+build.123",
            date: "2024-06-01",
        })
    })

    it("省圆略括号(链接)", () => {
        const changelog = `
## [2.3.4] - 2023-12-31

- 修复补丁
`
        expect(extractLatestDevChangelogVersionDate(changelog)).toEqual({
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
        expect(extractLatestDevChangelogVersionDate(changelog)).toBeNull()
    })

    it("当日期格式不正确时返回 null", () => {
        const changelog = `
## [v1.0.0] - 2024/06/01

- 错误的日期格式使用了斜杠
`
        expect(extractLatestDevChangelogVersionDate(changelog)).toBeNull()
    })

    it("当存在多个发布条目时选取第一个匹配项", () => {
        const changelog = `
## [1.0.0] - 2024-01-01

- 第一次发布

## [2.0.0] - 2024-06-01

- 第二次发布
`
        expect(extractLatestDevChangelogVersionDate(changelog)).toEqual({
            version: "1.0.0",
            date: "2024-01-01",
        })
    })
})

// 提取最新变更日志中的生产环境版本和日期
describe("extractLatestProChangelogVersionDate - 提取最新变更日志中的生产环境版本和日期", () => {
    it("提取带 v 前缀且包含链接的稳定版本和日期", () => {
        const changelog = `
## [v2.3.4](https://example.com/release/v2.3.4) - 2025-02-02

- 生产发布
`
        expect(extractLatestProChangelogVersionDate(changelog)).toEqual({
            version: "v2.3.4",
            date: "2025-02-02",
        })
    })

    it("忽略预发布版本并提取第一个稳定版本", () => {
        const changelog = `
## [2.0.0-alpha.1] - 2025-01-01

- 预发布

## [2.0.0] - 2025-02-01

- 稳定发布
`
        expect(extractLatestProChangelogVersionDate(changelog)).toEqual({
            version: "2.0.0",
            date: "2025-02-01",
        })
    })

    it("当带构建元数据但不是预发布的版时返回 null", () => {
        const changelog = `
## [3.0.0+build.5] - 2025-03-03

- 生产构建
`
        expect(extractLatestProChangelogVersionDate(changelog)).toBeNull()
    })

    it("当只有预发布版本时返回 null", () => {
        const changelog = `
## [1.0.0-beta.2] - 2024-07-01

- 仅有预发布
`
        expect(extractLatestProChangelogVersionDate(changelog)).toBeNull()
    })

    it("当日期格式不正确时返回 null", () => {
        const changelog = `
## [4.0.0] - 2025/04/01

- 错误的日期格式
`
        expect(extractLatestProChangelogVersionDate(changelog)).toBeNull()
    })

    it("存在多个稳定发布时选取第一个稳定发布", () => {
        const changelog = `
## [5.0.0] - 2025-11-11

- 第一个稳定发布

## [4.0.0] - 2025-06-01

- 第二个稳定发布
`
        expect(extractLatestProChangelogVersionDate(changelog)).toEqual({
            version: "5.0.0",
            date: "2025-11-11",
        })
    })

    it("如果全是预发布没有正式版则返回 null", () => {
        const changelog = `
## [1.0.0-alpha] - 2024-05-01
- 预发布版本

## [1.0.0-beta] - 2024-06-01
- 预发布版本
`
        expect(extractLatestProChangelogVersionDate(changelog)).toBeNull()
    })
})

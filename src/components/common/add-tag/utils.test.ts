/**
 * FilePath    : blog-client\src\components\common\add-tag\utils.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : add-tag 标签排序工具测试
 */

import { describe, expect, it } from "vitest"

import { type PostTag } from "@/api/postTag/view"

import { sortPostTagsByAdminCount } from "./utils"

describe("sortPostTagsByAdminCount", () => {
    it("文章编辑页应按管理员文章数量降序排序, 不受用户口径影响", () => {
        const tags: PostTag[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "user-first",
                description: "",
                slug: "user-first",
                thumbnail: "",
                order: "0",
                post_count: "100",
                post_count_admin: "1",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "2",
                created_at: "2026-06-08 10:00:00",
                name: "admin-first",
                description: "",
                slug: "admin-first",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "50",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        const result = sortPostTagsByAdminCount(tags)

        expect(result.map((item) => item.name)).toEqual(["admin-first", "user-first"])
        expect(tags.map((item) => item.name)).toEqual(["user-first", "admin-first"])
    })

    it("非法管理员数量应按 0 处理", () => {
        const tags: PostTag[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "invalid-count",
                description: "",
                slug: "invalid-count",
                thumbnail: "",
                order: "0",
                post_count: "8",
                post_count_admin: "NaN",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "2",
                created_at: "2026-06-08 10:00:00",
                name: "normal-count",
                description: "",
                slug: "normal-count",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "2",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        expect(sortPostTagsByAdminCount(tags).map((item) => item.name)).toEqual(["normal-count", "invalid-count"])
    })

    it("管理员数量相同时应按标签名称升序排序, 兼容中文", () => {
        const tags: PostTag[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "上海",
                description: "",
                slug: "shanghai",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "2",
                created_at: "2026-06-08 10:00:00",
                name: "阿里",
                description: "",
                slug: "ali",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "3",
                created_at: "2026-06-08 10:00:00",
                name: "北京",
                description: "",
                slug: "beijing",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        expect(sortPostTagsByAdminCount(tags).map((item) => item.name)).toEqual(["阿里", "北京", "上海"])
    })

    it("管理员数量相同时中英文混排应先英文后中文, 中文按拼音排序", () => {
        const tags: PostTag[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "上海",
                description: "",
                slug: "shanghai",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "2",
                created_at: "2026-06-08 10:00:00",
                name: "beta",
                description: "",
                slug: "beta",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "3",
                created_at: "2026-06-08 10:00:00",
                name: "阿里",
                description: "",
                slug: "ali",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "4",
                created_at: "2026-06-08 10:00:00",
                name: "Alpha",
                description: "",
                slug: "alpha",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "5",
                created_at: "2026-06-08 10:00:00",
                name: "北京",
                description: "",
                slug: "beijing",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        expect(sortPostTagsByAdminCount(tags).map((item) => item.name)).toEqual(["Alpha", "beta", "阿里", "北京", "上海"])
    })
})

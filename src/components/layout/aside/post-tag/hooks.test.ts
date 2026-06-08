/**
 * FilePath    : blog-client\src\components\layout\aside\post-tag\hooks.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : post-tag hooks 排序测试
 */

import { describe, expect, it } from "vitest"

import { type PostTag } from "@/api/postTag/view"

import { sortPostTagsByActiveCount } from "./hooks"

describe("sortPostTagsByActiveCount", () => {
    it("首页标签应按用户口径降序排序", () => {
        const tags: PostTag[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "admin-more",
                description: "",
                slug: "admin-more",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "50",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "2",
                created_at: "2026-06-08 10:00:00",
                name: "user-more",
                description: "",
                slug: "user-more",
                thumbnail: "",
                order: "0",
                post_count: "100",
                post_count_admin: "2",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        expect(sortPostTagsByActiveCount(tags, false).map((item) => item.name)).toEqual(["user-more", "admin-more"])
    })

    it("文章编辑页标签应按管理员口径降序排序", () => {
        const tags: PostTag[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "user-more",
                description: "",
                slug: "user-more",
                thumbnail: "",
                order: "0",
                post_count: "100",
                post_count_admin: "1",
                img: { url: "", width: 0, height: 0 },
            },
            {
                id: "2",
                created_at: "2026-06-08 10:00:00",
                name: "admin-more",
                description: "",
                slug: "admin-more",
                thumbnail: "",
                order: "0",
                post_count: "1",
                post_count_admin: "100",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        expect(sortPostTagsByActiveCount(tags, true).map((item) => item.name)).toEqual(["admin-more", "user-more"])
    })

    it("数量相同时应按标签名称升序排序, 兼容中文", () => {
        const tags: PostTag[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "上海",
                description: "",
                slug: "shanghai",
                thumbnail: "",
                order: "0",
                post_count: "8",
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
                post_count: "8",
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
                post_count: "8",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        expect(sortPostTagsByActiveCount(tags, false).map((item) => item.name)).toEqual(["阿里", "北京", "上海"])
        expect(sortPostTagsByActiveCount(tags, true).map((item) => item.name)).toEqual(["阿里", "北京", "上海"])
    })

    it("数量相同时中英文混排应先英文后中文, 中文按拼音排序", () => {
        const tags: PostTag[] = [
            {
                id: "1",
                created_at: "2026-06-08 10:00:00",
                name: "上海",
                description: "",
                slug: "shanghai",
                thumbnail: "",
                order: "0",
                post_count: "8",
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
                post_count: "8",
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
                post_count: "8",
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
                post_count: "8",
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
                post_count: "8",
                post_count_admin: "8",
                img: { url: "", width: 0, height: 0 },
            },
        ]

        expect(sortPostTagsByActiveCount(tags, false).map((item) => item.name)).toEqual(["Alpha", "beta", "阿里", "北京", "上海"])
        expect(sortPostTagsByActiveCount(tags, true).map((item) => item.name)).toEqual(["Alpha", "beta", "阿里", "北京", "上海"])
    })
})

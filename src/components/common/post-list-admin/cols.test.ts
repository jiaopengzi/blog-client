/**
 * FilePath    : blog-client\src\components\common\post-list-admin\cols.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : post-list-admin 列配置测试
 */

import { describe, expect, it } from "vitest"

import { PostType } from "@/api/post/common"
import type { PostCategory } from "@/api/postCategory/view"

import { generateCols } from "./cols"

/**
 * 生成用于后台文章列表列排序测试的分类数据.
 * @returns 未排序的分类数组.
 */
function createCategories(): PostCategory[] {
    return [
        {
            id: "1",
            created_at: "2026-06-08 10:00:00",
            name: "北京",
            description: "",
            slug: "beijing",
            thumbnail: "",
            order: "0",
            post_count: "8",
            post_count_admin: "8",
            parent: "0",
            img: { url: "", width: 0, height: 0 },
        },
        {
            id: "2",
            created_at: "2026-06-08 10:00:00",
            name: "Alpha",
            description: "",
            slug: "alpha",
            thumbnail: "",
            order: "0",
            post_count: "8",
            post_count_admin: "8",
            parent: "0",
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
            parent: "0",
            img: { url: "", width: 0, height: 0 },
        },
    ]
}

describe("generateCols", () => {
    it("后台文章列表的分类和标签列应启用管理员口径排序", () => {
        const cols = generateCols(PostType.Post)
        const categoriesCol = cols.find((item) => item.prop === "categories")
        const tagsCol = cols.find((item) => item.prop === "tags")

        expect(categoriesCol?.itemSorter).toBeTypeOf("function")
        expect(tagsCol?.itemSorter).toBeTypeOf("function")
        expect(categoriesCol?.itemSorter?.(createCategories()).map((item) => item.name)).toEqual(["Alpha", "阿里", "北京"])
        expect(tagsCol?.itemSorter?.(createCategories()).map((item) => item.name)).toEqual(["Alpha", "阿里", "北京"])
    })
})

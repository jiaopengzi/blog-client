/*
 * FilePath    : blog-client-nuxt\src\utils\readfile.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 读取文件
 */

import { request } from "@/api/request"

export async function readFile(filepath: string): Promise<string> {
    try {
        // Nuxt 适配: request 为 ofetch 风格函数(axios 兼容签名 request({ url, method }))
        const response = await request<string>({ url: filepath, method: "get" })

        if (response.status === 200) {
            return response.data
        } else {
            throw new Error(`Error fetching markdown file, status code: ${response.status}`)
        }
    } catch (error) {
        console.error("Error loading and formatting markdown file:", error)
        return ""
    }
}

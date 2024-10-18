/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-28 10:17:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-28 11:08:15
 * @FilePath     : \blog-client\src\utils\readfile.ts
 * @Description  : 读取文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import axios from "axios"
export async function readFile(filepath: string): Promise<string> {
    try {
        const response = await axios.get(filepath)

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

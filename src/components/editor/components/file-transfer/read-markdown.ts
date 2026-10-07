/*
 * FilePath    : blog-client\src\components\editor\components\file-transfer\read-markdown.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Markdown 文件的 UTF-8 与带 BOM 的 UTF-16 严格解码
 */

/**
 * decodeMarkdownFile 保留原文换行并移除编码 BOM, 拒绝无法按声明编码解码的文件.
 * @param buffer 文件完整字节, 无 BOM 时按 UTF-8 处理.
 * @returns 解码后的 Markdown 原文.
 * @throws TypeError 文件包含非法 UTF-8 或 UTF-16 字节时抛出, 避免乱码覆盖正文.
 */
export function decodeMarkdownFile(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    const encoding = bytes[0] === 0xff && bytes[1] === 0xfe ? "utf-16le" : bytes[0] === 0xfe && bytes[1] === 0xff ? "utf-16be" : "utf-8"
    // TextDecoder 默认移除匹配的 BOM, fatal 禁止用替换字符静默吞掉编码错误.
    return new TextDecoder(encoding, { fatal: true }).decode(bytes)
}

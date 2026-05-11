/**
 * FilePath    : blog-client\src\components\common\post-upsert\imageUpload.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章编辑 页图片上传命名辅助
 */

import type { ImageUploadHandler } from "@/pkg/codemirror"
import { uploadEditor } from "@/pkg/codemirror/extension/uploadEditor"
import { MessageUtil } from "@/utils/message"

const DEFAULT_POST_IMAGE_TITLE = "未命名文章"
const DEFAULT_IMAGE_EXTENSION = "png"

/**
 * createPostImageUploadRegexCache 创建文章图片上传场景使用的正则缓存.
 * 这里沿用编辑器 createRegexCache 的组织方式, 将命名清洗相关正则集中收口, 避免散落的顶层常量.
 * @returns 正则缓存对象.
 */
function createPostImageUploadRegexCache(): {
    invalidFileNameRegex: RegExp
    whitespaceRegex: RegExp
    multipleDashRegex: RegExp
    edgeDashRegex: RegExp
} {
    return {
        invalidFileNameRegex: /[\\/:*?"<>|]/g,
        whitespaceRegex: /\s+/g,
        multipleDashRegex: /-{2,}/g,
        edgeDashRegex: /^-|-$/g,
    }
}

const regexCache = createPostImageUploadRegexCache()

/**
 * sanitizePostImageTitle 清理文章标题中的非法文件名字符.
 * @param postTitle 当前文章标题.
 * @returns 可安全用于文件名的标题片段.
 */
export function sanitizePostImageTitle(postTitle: string): string {
    const normalizedTitle = postTitle
        .trim()
        .replace(regexCache.invalidFileNameRegex, "-")
        .replace(regexCache.whitespaceRegex, "-")
        .replace(regexCache.multipleDashRegex, "-")
        .replace(regexCache.edgeDashRegex, "")

    return normalizedTitle || DEFAULT_POST_IMAGE_TITLE
}

/**
 * buildPostImageAlt 生成文章图片的 Markdown alt 文本.
 * @param imageIndex 当前图片序号.
 * @returns 用于插入 Markdown 的 alt 文本.
 */
export function buildPostImageAlt(imageIndex: number): string {
    return String(imageIndex)
}

/**
 * getNextPostImageIndex 基于编辑器 state 中的 imgUrls 计算下一张图片序号.
 * @param imageUrls 当前编辑器中已识别到的图片地址列表.
 * @returns 下一张图片序号, 从 1 开始.
 */
export function getNextPostImageIndex(imageUrls: readonly string[]): number {
    return imageUrls.length + 1
}

/**
 * buildPostImageFileName 根据文章标题和序号生成标题映射文件名.
 * @param postTitle 当前文章标题.
 * @param imageIndex 当前图片序号.
 * @param extension 目标文件扩展名.
 * @returns 规范化后的图片文件名.
 */
export function buildPostImageFileName(postTitle: string, imageIndex: number, extension: string): string {
    return `${sanitizePostImageTitle(postTitle)}-${imageIndex}.${extension}`
}

/**
 * renameUploadFile 仅修改上传文件名称, 其余文件元信息保持不变.
 * @param file 原始上传文件.
 * @param fileName 目标文件名.
 * @returns 仅完成名称替换的新文件对象.
 */
function renameUploadFile(file: File, fileName: string): File {
    return new File([file], fileName, {
        type: file.type || "image/png",
        lastModified: file.lastModified,
    })
}

/**
 * shouldRequirePostTitleBeforePasteUpload 判断当前是否应先提示用户填写标题再截图上传.
 * @param postTitle 当前文章标题.
 * @param source 当前上传来源.
 * @returns paste 且标题为空时返回 true.
 */
export function shouldRequirePostTitleBeforePasteUpload(postTitle: string, source: "paste" | "drop"): boolean {
    return source === "paste" && !postTitle.trim()
}

/**
 * preparePostImageUploadFile 基于上传来源决定是否覆盖上传文件名.
 * 这里只处理文章编辑页的命名策略, 实际上传仍然复用既有 editor 上传链路.
 * @param file 原始上传文件.
 * @param source 当前上传来源.
 * @param postTitle 当前文章标题.
 * @param imageIndex 当前图片序号.
 * @returns 已按业务规则准备好的上传文件.
 */
export function preparePostImageUploadFile(file: File, source: "paste" | "drop", postTitle: string, imageIndex: number): File {
    if (source !== "paste") {
        return file
    }

    return renameUploadFile(file, buildPostImageFileName(postTitle, imageIndex, DEFAULT_IMAGE_EXTENSION))
}

/**
 * createPostImageUploadHandler 创建文章编辑器专用的图片上传处理器.
 * 截图上传时会基于当前标题生成文件名, 拖拽上传时保留原始文件名, 两者都使用稳定序号写入 Markdown alt.
 * 上传链路本身完全复用现有 editor 上传实现, 这里只补齐截图场景的文件命名参数.
 * @param getPostTitle 获取当前文章标题的函数.
 * @param getImageIndex 获取当前文章下一张图片序号的函数.
 * @returns 可直接传给编辑器的图片上传处理器.
 */
export function createPostImageUploadHandler(getPostTitle: () => string, getImageIndex: () => number): Exclude<ImageUploadHandler, null> {
    return async (file, context) => {
        const postTitle = getPostTitle()
        if (shouldRequirePostTitleBeforePasteUpload(postTitle, context.source)) {
            MessageUtil.warning("建议先填写文章标题, 再截图上传, 这样后台媒体文件名会更友好")
            return { cancelled: true }
        }

        const imageIndex = getImageIndex()
        const normalizedFile = preparePostImageUploadFile(file, context.source, postTitle, imageIndex)
        // 上传链路仍然复用 editor 既有实现, 这里只在上传前调整截图文件名.
        const imageUrl = await uploadEditor(normalizedFile)
        if (!imageUrl) {
            return undefined
        }

        return {
            imageUrl,
            markdownAlt: buildPostImageAlt(imageIndex),
        }
    }
}

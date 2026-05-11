/**
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\imgUpload.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 图片上传
 */

import type { Extension } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

import { MessageUtil } from "@/utils/message"

import { uploadEditor } from "./uploadEditor"

import type { ImageUploadHandler, ImageUploadResult } from "../options"

const defaultImageUploadHandler: Exclude<ImageUploadHandler, null> = async (file) => {
    return await uploadEditor(file)
}

/**
 * insertImageMarkdown 将图片地址插入到编辑器当前位置。
 * @param imageUrl - 已处理完成的图片地址。
 * @param markdownAlt - Markdown 图片 alt 文本。
 * @param view - 当前 CodeMirror 实例。
 * @returns 无返回值。
 */
function insertImageMarkdown(imageUrl: string, markdownAlt: string, view: EditorView): void {
    const imageMarkdown = `![${markdownAlt}](${imageUrl})\n`
    view.dispatch({
        changes: { from: view.state.selection.main.from, insert: imageMarkdown },
    })
}

/**
 * normalizeImageUploadResult 统一兼容字符串返回值与对象返回值.
 * @param result 上传处理器的返回结果.
 * @param fallbackAlt 未显式返回 alt 时使用的默认 alt.
 * @returns 标准化后的图片地址与 alt 文本.
 */
function normalizeImageUploadResult(
    result: ImageUploadResult | string | undefined,
    fallbackAlt: string,
): {
    imageUrl?: string
    markdownAlt: string
    cancelled: boolean
} {
    if (typeof result === "string") {
        return {
            imageUrl: result,
            markdownAlt: fallbackAlt,
            cancelled: false,
        }
    }

    return {
        imageUrl: result?.imageUrl,
        markdownAlt: result?.markdownAlt || fallbackAlt,
        cancelled: result?.cancelled === true,
    }
}

/**
 * uploadImage 调用当前场景的图片处理器, 并将结果写回编辑器。
 * @param file - 用户粘贴或拖拽的图片文件。
 * @param view - 当前 CodeMirror 实例。
 * @param source - 当前上传来源。
 * @param imageUploadHandler - 当前场景使用的图片处理器。
 * @returns 无返回值。
 */
async function uploadImage(file: File, view: EditorView, source: "paste" | "drop", imageUploadHandler: Exclude<ImageUploadHandler, null>): Promise<void> {
    try {
        const uploadResult = await imageUploadHandler(file, { source })
        const { imageUrl, markdownAlt, cancelled } = normalizeImageUploadResult(uploadResult, "")

        if (cancelled) {
            return
        }

        if (!imageUrl) {
            MessageUtil.error("上传失败，请重试")
            return
        }

        insertImageMarkdown(imageUrl, markdownAlt, view)
        MessageUtil.success("图片上传成功", 2000)
    } catch (error) {
        console.error("图片处理失败", error)
        MessageUtil.error("上传失败，请重试")
    }
}

/**
 * createImageUploadExtensions 根据传入的处理器创建图片粘贴与拖拽扩展。
 * 未传入时默认沿用后台编辑器的上传 API, 以保证现有行为不变; 传入 null 时仅提示当前页面不支持直接上传。
 * @param imageUploadHandler - 当前场景的图片处理器。
 * @returns 粘贴与拖拽图片扩展。
 */
export function createImageUploadExtensions(imageUploadHandler?: ImageUploadHandler): {
    handlePasteImage: Extension
    handleDropImage: Extension
} {
    /**
     * warnImageUploadDisabled 提示当前页面不支持粘贴或拖拽上传图片。
     * @returns 无返回值。
     */
    const warnImageUploadDisabled = (): void => {
        MessageUtil.warning("当前页面不支持直接粘贴或拖拽上传图片, 请手动填写图片链接")
    }

    const handlePasteImage: Extension = EditorView.domEventHandlers({
        paste: (event, view) => {
            if (!event.clipboardData || !event.clipboardData.items) return

            let file = null
            for (const item of event.clipboardData.items) {
                if (item.type.indexOf("image") === 0) {
                    file = item.getAsFile()
                    break
                }
            }

            if (!file) return

            if (imageUploadHandler === null) {
                warnImageUploadDisabled()
                return true
            }

            console.log("图片上传开始", new Date().toISOString())
            void uploadImage(file, view, "paste", imageUploadHandler ?? defaultImageUploadHandler)

            return true
        },
    })

    const handleDropImage: Extension = EditorView.domEventHandlers({
        drop: (event, view) => {
            if (!event.dataTransfer || !event.dataTransfer.items) return

            let file = null
            for (const item of event.dataTransfer.items) {
                if (item.kind === "file" && item.type.indexOf("image") === 0) {
                    file = item.getAsFile()
                    break
                }
            }

            if (!file) return

            event.preventDefault()

            if (imageUploadHandler === null) {
                warnImageUploadDisabled()
                return true
            }

            console.log("图片上传开始", new Date().toISOString())
            void uploadImage(file, view, "drop", imageUploadHandler ?? defaultImageUploadHandler)

            return true
        },
    })

    return {
        handlePasteImage,
        handleDropImage,
    }
}

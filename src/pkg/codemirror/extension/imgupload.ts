/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-08 20:13:30
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 09:55:22
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\imgUpload.ts
 * @Description  : 图片上传
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { EditorView } from "@codemirror/view"
import type { Extension } from "@codemirror/state"
import { uploadEditor } from "@/pkg/codemirror/extension/uploadEditor"
import { ShowMsgTip } from "@/utils/message"

// 自定义键盘事件
const handlePasteImage: Extension = EditorView.domEventHandlers({
    paste: (event, view) => {
        if (!event.clipboardData || !event.clipboardData.items) return
        // 获取剪切板中的图片文件
        console.log("剪贴板", event.clipboardData.files)
        let file = null
        for (const item of event.clipboardData.items) {
            if (item.type.indexOf("image") === 0) {
                file = item.getAsFile()
                break
            }
        }

        // 没有找到图片，则不处理
        if (!file) return
        console.log("图片上传开始", new Date().toISOString())
        uploadImage(file, view)
        // 上传图片并插入编辑器

        return true
    },
})

// 上传图片
async function uploadImage(file: File, view: EditorView) {
    // 调用 uploadEditor 函数
    const imageUrl = await uploadEditor(file)
    if (imageUrl) {
        // 处理返回数据，并更新头像等信息
        const imageMarkdown = `![description](${imageUrl})\n`
        view.dispatch({
            changes: { from: view.state.selection.main.from, insert: imageMarkdown },
        })

        // 将光标移动指定位置 cursorPosMove 处 更新状态
        ShowMsgTip(ShowMsgTip.MsgType.success, "图片上传成功", 2000)
    } else {
        ShowMsgTip(ShowMsgTip.MsgType.error, "上传失败，请重试")
    }
}

// 自定义键盘事件
const handleDropImage: Extension = EditorView.domEventHandlers({
    drop: (event, view) => {
        if (!event.dataTransfer || !event.dataTransfer.items) return

        // 获取拖拽的图片文件
        let file = null
        for (const item of event.dataTransfer.items) {
            if (item.kind === "file" && item.type.indexOf("image") === 0) {
                file = item.getAsFile()
                break
            }
        }

        // 没有找到图片，则使用默认拖拽行为
        if (!file) return

        // 阻止默认事件以处理图片上传
        event.preventDefault()
        console.log("图片上传开始", new Date().toISOString())
        uploadImage(file, view)

        return true
    },
})

export { handlePasteImage, handleDropImage }

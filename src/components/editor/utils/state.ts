/**
 * FilePath    : blog-client\src\components\editor\utils\state.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器状态工厂函数
 */

import { CommandsKey } from "../command"
import { defaultCommandKeys } from "../command"
import type { EditorState, EditorStateOptions } from "../types"
import { DEFAULT_VIM_IME_PORT } from "@/stores/editor-defaults"

/**
 * @description : 创建默认的编辑器状态
 * @return      : 空值编辑器信息
 */
export function createDefaultEditorState(options: EditorStateOptions = {}): EditorState {
    const defaultState: EditorState = {
        tocMarkdown: [], // markdown 目录内容
        tocHtml: [], // html 目录内容
        tocShow: false, // 是否显示目录

        editorContent: "", // 编辑器内容
        initDocIsEmpty: true, // 初始内容是否为空, 默认为 true 即默认为空
        editorShow: true, // 是否显示编辑器
        scrollHideViewStr: "", // 滚动条隐藏的编辑器 markdown 字符串
        isSyncScroll: false, // 是否同步滚动
        isUserScrollCmEditor: true, // 是否用户滚动编辑器
        isFullScreen: false, // 是否全屏
        isShowEmojiPicker: false, // 是否显示 emoji picker
        isShortcutKey: true, // 默认开启快捷键
        headingShowCurrentIndex: 0, // 目录显示当前索引
        scrollStatus: void 0, // 滚动条状态 start 开始 end 结束
        mouseStatus: void 0, // 鼠标状态 cmEditor 编辑器 preview 预览
        cmCommand: { commandName: "" as CommandsKey, time: new Date() }, // 命令
        vimMode: false, // 是否开启 vim 模式
        vimMappings: [], // Vim 用户快捷键映射
        vimImePort: DEFAULT_VIM_IME_PORT, // Vim 输入法切换服务端口
        mentions: [], // @ 提及补全
        commandKeys: defaultCommandKeys.postPc, // 默认使用 postPc 模式的快捷键
        mode: "post", // 默认模式为文章模式

        // preview 相关内容
        previewShow: true, // 是否显示预览
        html: "", // html 内容
        imgUrls: [], // 图片地址 list
        isShowElImageViewer: false, // 是否显示图片预览
        width: "1200", // 宽度
        height: "600", // 高度
        isShowPreviewWechat: false, // 是否显示微信预览
        isUserScrollPreview: true, // 是否用户滚动预览
        isRemoveFirstH1: false, // 是否移除第一个 H1 标签
        viewCommand: { commandName: "" as CommandsKey, time: new Date() }, // 命令
    }
    return { ...defaultState, ...options }
}

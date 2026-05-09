/**
 * @FilePath     : \blog-client\src\components\editor\core\state.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 编辑器状态管理
 */

import type { Completion } from "@codemirror/autocomplete"
import { type Reactive, reactive } from "vue"

import { request } from "@/api/request"
import type { VimKeyMapping } from "@/stores/editor-defaults"

import { CommandsKey } from "./command"
import type { CmCommand } from "./components/codemirror"
import type { ViewCommand } from "./components/preview"
import type { EditorMode, EditorState, EditorStateOptions, MouseStatus, ScrollStatus } from "./types"
import { createDefaultEditorState, getMarkdownHeadingLines, getSafeHeadingCurrentIndex, htmlHandleUtf8BOM, renderMarkdownDocument } from "./utils"

/**
 * @description: 编辑器状态管理
 */
export class EditorStateManager {
    private state: Reactive<EditorState>

    // 初始化为默认状态
    constructor(options: EditorStateOptions = {}) {
        this.state = reactive(createDefaultEditorState(options)) // 响应式对象
    }

    // 获取滚动条隐藏的 html 字符串
    getScrollHideHtmlStr(): string {
        return renderMarkdownDocument(this.state.scrollHideViewStr, this.state.isRemoveFirstH1).html // markdown 转 html
    }

    // 更新编辑器 store
    updateState(markdownSrc: string): void {
        this.state.editorContent = htmlHandleUtf8BOM(markdownSrc) // 去除 BOM 头 和 windows 换行符)
        const renderedDocument = renderMarkdownDocument(this.state.editorContent, this.state.isRemoveFirstH1)

        this.state.html = renderedDocument.html // markdown 转 html
        this.state.tocMarkdown = getMarkdownHeadingLines(this.state.editorContent) // 通过正则获取 markdown 文件的目录
        this.state.tocHtml = renderedDocument.tocHtml // 获取 html 目录
        this.state.imgUrls = renderedDocument.imgUrls // 获取图片链接
        this.state.headingShowCurrentIndex = getSafeHeadingCurrentIndex(this.state.headingShowCurrentIndex, this.state.tocHtml.length)
    }

    // 设置滚动条隐藏的编辑器view 字符串
    setScrollHideViewStr(scrollHideViewStr: string): void {
        this.state.scrollHideViewStr = scrollHideViewStr
    }

    // 设置图片链接数组
    setImgUrls(imgUrls: string[]): void {
        this.state.imgUrls = imgUrls
    }

    // 设置是否显示图片预览组件
    setIsShowElImageViewer(isShowElImageViewer: boolean): void {
        this.state.isShowElImageViewer = isShowElImageViewer
    }

    // 显示图片预览组件
    showImageViewer = (imgUrls: string[], isShowElImageViewer: boolean): void => {
        this.setImgUrls(imgUrls)
        this.setIsShowElImageViewer(isShowElImageViewer)
    }

    // 设置初始化文档是否为空
    setInitDocIsEmpty(initDocIsEmpty: boolean): void {
        this.state.initDocIsEmpty = initDocIsEmpty
    }

    // 设置是否显示目录
    setEditorShow(editorShow: boolean): void {
        this.state.editorShow = editorShow
    }

    // 切换是否显示目录
    toggleEditorShow(): void {
        this.state.editorShow = !this.state.editorShow
    }

    // 设置是否显示预览
    setPreviewShow(previewShow: boolean): void {
        this.state.previewShow = previewShow
    }

    // 切换是否显示预览
    togglePreviewShow(): void {
        this.state.previewShow = !this.state.previewShow
    }

    // 设置同步滚动状态
    setIsSyncScroll(): void {
        this.state.isSyncScroll = !this.state.isSyncScroll
    }

    // 切换是否同步滚动
    toggleSyncScroll(): void {
        this.state.isSyncScroll = !this.state.isSyncScroll
    }

    // 设置是否显示目录
    setTocShow(tocShow: boolean): void {
        this.state.tocShow = tocShow
    }

    // 切换是否显示目录
    toggleTocShow(): void {
        this.state.tocShow = !this.state.tocShow
    }

    // 设置是否全屏
    setIsFullScreen(isFullScreen: boolean): void {
        this.state.isFullScreen = isFullScreen
    }

    // 切换是否全屏
    toggleFullScreen(): void {
        this.state.isFullScreen = !this.state.isFullScreen
    }

    // 设置是否显示微信预览
    setIsShowPreviewWechat(isShowPreviewWechat: boolean): void {
        this.state.isShowPreviewWechat = isShowPreviewWechat
    }

    // 切换是否显示微信预览
    toggleShowPreviewWechat(): void {
        this.state.isShowPreviewWechat = !this.state.isShowPreviewWechat
    }

    // 设置是否显示 emoji picker
    setIsShowEmojiPicker(isShowEmojiPicker: boolean): void {
        this.state.isShowEmojiPicker = isShowEmojiPicker
    }

    // 切换是否显示 emoji picker
    toggleShowEmojiPicker(): void {
        this.state.isShowEmojiPicker = !this.state.isShowEmojiPicker
    }

    // 通过 url 获取编辑器内容
    async getEditorContentFromUrl(url: string): Promise<void> {
        const res = await request.get(url)
        this.updateState(res.data)
    }

    // 设置快捷键状态
    setShortcutKeyStatus(status: boolean): void {
        this.state.isShortcutKey = status
    }

    // 切换快捷键状态
    toggleShortcutKeyStatus(): void {
        this.state.isShortcutKey = !this.state.isShortcutKey
    }

    // 设置编辑器宽度
    setEditorWidth(width: string): void {
        this.state.width = width
    }

    // 设置用户手动滚动编辑器
    setIsUserScrollCmEditor(flag: boolean): void {
        this.state.isUserScrollCmEditor = flag
    }

    // 设置用户是否滚动预览
    setIsUserScrollPreview(flag: boolean): void {
        this.state.isUserScrollPreview = flag
    }

    // 设置目录显示当前索引
    setHeadingShowCurrentIndex(index: number): void {
        this.state.headingShowCurrentIndex = index
    }

    // 设置滚动条状态
    setScrollStatus(status: ScrollStatus): void {
        this.state.scrollStatus = status
    }

    // 设置命令
    setCmCommand(command: CmCommand): void {
        this.state.cmCommand = command
    }

    // 设置预览命令
    setViewCommand(command: ViewCommand): void {
        this.state.viewCommand = command
    }

    // 设置 Vim 模式状态
    setVimMode(vimMode: boolean): void {
        this.state.vimMode = vimMode
    }

    // 切换 vim 模式
    toggleVimMode(): void {
        this.setVimMode(!this.state.vimMode)
    }

    // 设置 Vim 快捷键映射
    setVimMappings(vimMappings: VimKeyMapping[]): void {
        this.state.vimMappings = vimMappings
    }

    // 设置鼠标状态
    setMouseStatus(status: MouseStatus): void {
        this.state.mouseStatus = status
    }

    // 设置工具栏按钮
    setCommandKeys(commandKeys: CommandsKey[]): void {
        this.state.commandKeys = commandKeys
    }

    // 设置编辑器模式
    setEditorMode(mode: EditorMode): void {
        this.state.mode = mode
    }

    // set mentions
    setMentions(mentions: Completion[]): void {
        this.state.mentions = mentions
    }

    // 获取编辑器状态
    getState(): EditorState {
        return this.state
    }

    // 销毁编辑器状态
    destroy(): void {
        this.state = createDefaultEditorState()
    }
}

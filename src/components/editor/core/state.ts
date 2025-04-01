/**
 * @FilePath     : \blog-client\src\components\editor\core\state.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 编辑器状态管理
 */

import { reactive } from "vue"

import { request } from "@/api/request"
import { extractImageUrlsFromHtml } from "@/utils/img"

import type { EditorState } from "./types"
import { createEmptyEditorState, getMarkdownHeadingLines, htmlHandleUtf8BOM, markdownToHtml, matchAllHeadingToList } from "./utils"

/**
 * @description: 编辑器状态管理
 * @return    : 编辑器状态管理
 */
export class EditorStateManager {
    private state: EditorState

    // 初始化为默认状态
    constructor(initialState: EditorState = createEmptyEditorState()) {
        this.state = reactive(initialState) // 响应式对象
    }

    // 获取滚动条隐藏的 html 字符串
    get getScrollHideHtmlStr(): string {
        return markdownToHtml(this.state.scrollHideViewStr)
    }

    // 更新编辑器 store
    updateState(markdownSrc: string): void {
        this.state.editor = htmlHandleUtf8BOM(markdownSrc) // 去除 BOM 头 和 windows 换行符)
        this.state.preview = markdownToHtml(this.state.editor) // markdown 转 html
        this.state.tocMarkdown = getMarkdownHeadingLines(this.state.editor) // 通过正则获取 markdown 文件的目录
        this.state.tocHtml = matchAllHeadingToList(this.state.preview) // 获取 html 目录
        this.state.imgUrls = extractImageUrlsFromHtml(this.state.preview) // 获取图片链接
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

    // 设置是否显示目录
    setIsAsyncScroll(): void {
        this.state.isAsyncScroll = !this.state.isAsyncScroll
    }

    // 切换是否异步滚动
    toggleAsyncScroll(): void {
        this.state.isAsyncScroll = !this.state.isAsyncScroll
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
    setEditorWidth(width: number): void {
        this.state.width = width
    }

    // 设置用户是否滚动预览
    setIsUserScrollPreview(isUserScrollPreview: boolean): void {
        this.state.isUserScrollPreview = isUserScrollPreview
    }

    // 设置目录显示当前索引
    setHeadingShowCurrentIndex(index: number): void {
        this.state.headingShowCurrentIndex = index
    }

    // 切换 vim 模式
    toggleVimMode(): void {
        this.state.vimMode = !this.state.vimMode
    }

    // 获取编辑器状态
    getState(): EditorState {
        return this.state
    }

    // 销毁编辑器状态
    destroy(): void {
        this.state = createEmptyEditorState()
    }
}

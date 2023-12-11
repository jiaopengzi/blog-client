/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-09 21:36:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-11 16:04:51
 * @FilePath     : \blog-client\src\stores\editor.ts
 * @Description  : 编辑器 store
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// @ts-check
import { defineStore } from 'pinia'
import { extractImageUrlsFromHtml } from '@/utils/img'
import marked from '@/pkg/marked/new-marked'
import { getMarkdownHeadingLines } from '@/utils/lineNumbers'
import type { MarkdownHeadingLineType } from '@/utils/lineNumbers'

interface editorStore {
  tocMarkdown: MarkdownHeadingLineType[] // markdown 目录内容
  tocHtml: string // html 目录内容
  tocShow: boolean // 是否显示目录
  tocScrollTop: number // 目录滚动条位置
  editor: string // 编辑器内容
  editorShow: boolean // 是否显示编辑器
  editorScrollTop: number // 编辑器滚动条位置
  eidtorFullScreen: boolean // 编辑器是否全屏
  preview: string // 预览内容
  previewShow: boolean // 是否显示预览
  previewScrollTop: number // 编辑器滚动条位置
  previewFullScreen: boolean // 预览是否全屏
  imgUrls: string[] // 图片链接数组
  isShowElImageViewer: boolean // 是否显示图片预览组件
  scrollHideViewStr: string // 滚动条隐藏的编辑器 view 字符串
  scrollHideHtmlStr: string // 滚动条隐藏的 html 字符串
  editorDocumentTop: number // 编辑器框距离顶部的距离
}

// 创建空值编辑器信息
function createEmptyEditorStore(): editorStore {
  return {
    tocMarkdown: [], // markdown 目录内容
    tocHtml: '', // html 目录内容
    tocShow: false, // 是否显示目录
    tocScrollTop: 0, // 目录滚动条位置
    editor: '', // 编辑器内容
    editorShow: true, // 是否显示编辑器
    editorScrollTop: 0, // 编辑器滚动条位置
    eidtorFullScreen: false, // 编辑器是否全屏
    preview: '', // 预览内容
    previewShow: true, // 是否显示预览
    previewScrollTop: 0, // 编辑器滚动条位置
    previewFullScreen: false, // 预览是否全屏
    imgUrls: [], // 图片链接数组
    isShowElImageViewer: false, // 是否显示图片预览组件
    scrollHideViewStr: '', // 滚动条隐藏的编辑器 markdown 字符串
    scrollHideHtmlStr: '', // 滚动条隐藏的 html 字符串
    editorDocumentTop: 0, // 编辑器框距离顶部的距离
  }
}

export const useEditorStore = defineStore({
  id: 'editor',
  state: () => createEmptyEditorStore(),

  getters: {
    // 获取markdown目录内容
    getTocMarkdown(): MarkdownHeadingLineType[] {
      return this.tocMarkdown
    },
    // 获取html目录内容
    getTocHtml(): string {
      return this.tocHtml
    },
    // 获取是否显示目录
    getTocShow(): boolean {
      return this.tocShow
    },
    // 获取目录滚动条位置
    getTocScrollTop(): number {
      return this.tocScrollTop
    },
    // 获取编辑器内容
    getEditor(): string {
      return this.editor
    },
    // 获取是否显示编辑器
    getEditorShow(): boolean {
      return this.editorShow
    },
    // 获取编辑器滚动条位置
    getEditorScrollTop(): number {
      return this.editorScrollTop
    },
    // 获取编辑器是否全屏
    getEidtorFullScreen(): boolean {
      return this.eidtorFullScreen
    },
    // 获取预览内容
    getPreview(): string {
      return this.preview
    },
    // 获取是否显示预览
    getPreviewShow(): boolean {
      return this.previewShow
    },
    // 获取预览滚动条位置
    getPreviewScrollTop(): number {
      return this.previewScrollTop
    },
    // 获取预览是否全屏
    getPreviewFullScreen(): boolean {
      return this.previewFullScreen
    },
    // 获取图片链接数组
    getImgUrls(): string[] {
      return this.imgUrls
    },
    // 获取是否显示图片预览组件
    getIsShowElImageViewer(): boolean {
      return this.isShowElImageViewer
    },
    // 获取滚动条隐藏的编辑器view 字符串
    getScrollHideViewStr(): string {
      return this.scrollHideViewStr
    },
    // 获取滚动条隐藏的 html 字符串
    getScrollHideHtmlStr(): string {
      return this.scrollHideHtmlStr
    },
    // 获取编辑器框距离顶部的距离
    getEditorDocumentTop(): number {
      return this.editorDocumentTop
    },
  },

  actions: {
    // 设置 markdown 目录内容
    setTocMarkdown(tocMarkdown: MarkdownHeadingLineType[]): void {
      this.tocMarkdown = tocMarkdown
    },
    // 设置 html 目录内容
    setTocHtml(tocHtml: string): void {
      this.tocHtml = tocHtml
    },
    // 设置是否显示目录
    setTocShow(tocShow: boolean): void {
      this.tocShow = tocShow
    },
    // 设置目录滚动条位置
    setTocScrollTop(tocScrollTop: number): void {
      this.tocScrollTop = tocScrollTop
    },
    // 设置编辑器内容
    setEditor(editor: string): void {
      this.editor = editor
    },
    // 设置是否显示编辑器
    setEditorShow(editorShow: boolean): void {
      this.editorShow = editorShow
    },
    // 设置编辑器滚动条位置
    setEditorScrollTop(editorScrollTop: number): void {
      this.editorScrollTop = editorScrollTop
    },
    // 设置编辑器是否全屏
    setEidtorFullScreen(eidtorFullScreen: boolean): void {
      this.eidtorFullScreen = eidtorFullScreen
    },
    // 设置预览内容
    setPreview(preview: string): void {
      this.preview = preview
    },
    // 设置是否显示预览
    setPreviewShow(previewShow: boolean): void {
      this.previewShow = previewShow
    },
    // 设置预览滚动条位置
    setPreviewScrollTop(previewScrollTop: number): void {
      this.previewScrollTop = previewScrollTop
    },
    // 设置预览是否全屏
    setPreviewFullScreen(previewFullScreen: boolean): void {
      this.previewFullScreen = previewFullScreen
    },
    // 设置图片链接数组
    setImgUrls(imgUrls: string[]): void {
      this.imgUrls = imgUrls
    },
    // 设置是否显示图片预览组件
    setIsShowElImageViewer(isShowElImageViewer: boolean): void {
      this.isShowElImageViewer = isShowElImageViewer
    },
    // 设置滚动条隐藏的编辑器view 字符串
    setScrollHideViewStr(scrollHideViewStr: string): void {
      this.scrollHideViewStr = scrollHideViewStr
    },
    // 设置滚动条隐藏的 html 字符串
    setScrollHideHtmlStr(scrollHideHtmlStr: string): void {
      this.scrollHideHtmlStr = scrollHideHtmlStr
    },
    // 设置编辑器框距离顶部的距离
    setEditorDocumentTop(editorDocumentTop: number): void {
      this.editorDocumentTop = editorDocumentTop
    },
    // 更新编辑器 store
    updateEditorStore(markdownSrcCode: string): void {
      this.setEditor(markdownSrcCode)
      this.setTocMarkdown(getMarkdownHeadingLines(markdownSrcCode))
      this.setPreview(marked.parse(this.editor).toString())
      this.setImgUrls(extractImageUrlsFromHtml(this.preview))
      this.setTocHtml(matchAllH(this.preview).join(''))
    },
    // 更新滚动条隐藏的编辑器view 字符串
    updateScrollHide(): void {
      this.setScrollHideHtmlStr(marked.parse(this.scrollHideViewStr).toString())
    },
  },
})

/**
 * @description : 通过正则表达式匹配 html 中所有的 h 标签
 * @param html  : html 字符串
 * @return      : 匹配到的 h 标签数组
 */
function matchAllH(html: string): RegExpMatchArray {
  const regex = /<h\d.*?>.*?<\/h\d>/g
  const matches = html.match(regex) || []
  return matches as RegExpMatchArray
}

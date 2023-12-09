/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-09 21:36:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-09 23:53:11
 * @FilePath     : \blog-client\src\stores\editor.ts
 * @Description  : 编辑器 store
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// @ts-check
import { defineStore } from 'pinia'
import { extractImageUrlsFromHtml, shiftArray } from '@/utils/img'
import marked from '@/pkg/marked/new-marked'
// 编辑器 store 类型
interface editorStore {
  tocContent: string // 目录内容
  tocContentShow: boolean // 是否显示目录
  tocScrollTop: number // 目录滚动条位置
  editorContent: string // 编辑器内容
  editorContentShow: boolean // 是否显示编辑器
  editorScrollTop: number // 编辑器滚动条位置
  eidtorFullScreen: boolean // 编辑器是否全屏
  previewContent: string // 预览内容
  previewContentShow: boolean // 是否显示预览
  previewScrollTop: number // 编辑器滚动条位置
  previewFullScreen: boolean // 预览是否全屏
  imgUrls: string[] // 图片链接数组
  isShowElImageViewer: boolean // 是否显示图片预览组件
}

// 创建空值编辑器信息
function createEmptyEditorStore(): editorStore {
  return {
    tocContent: '', // 目录内容
    tocContentShow: false, // 是否显示目录
    tocScrollTop: 0, // 目录滚动条位置
    editorContent: '', // 编辑器内容
    editorContentShow: true, // 是否显示编辑器
    editorScrollTop: 0, // 编辑器滚动条位置
    eidtorFullScreen: false, // 编辑器是否全屏
    previewContent: '', // 预览内容
    previewContentShow: true, // 是否显示预览
    previewScrollTop: 0, // 编辑器滚动条位置
    previewFullScreen: false, // 预览是否全屏
    imgUrls: [], // 图片链接数组
    isShowElImageViewer: false, // 是否显示图片预览组件
  }
}

export const useEditorStore = defineStore({
  id: 'editor',
  state: () => createEmptyEditorStore(),

  getters: {
    // 获取目录内容
    getTocContent(): string {
      return this.tocContent
    },
    // 获取是否显示目录
    getTocContentShow(): boolean {
      return this.tocContentShow
    },
    // 获取目录滚动条位置
    getTocScrollTop(): number {
      return this.tocScrollTop
    },
    // 获取编辑器内容
    getEditorContent(): string {
      return this.editorContent
    },
    // 获取是否显示编辑器
    getEditorContentShow(): boolean {
      return this.editorContentShow
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
    getPreviewContent(): string {
      return this.previewContent
    },
    // 获取是否显示预览
    getPreviewContentShow(): boolean {
      return this.previewContentShow
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
  },

  actions: {
    // 设置目录内容
    setTocContent(tocContent: string): void {
      this.tocContent = tocContent
    },
    // 设置是否显示目录
    setTocContentShow(tocContentShow: boolean): void {
      this.tocContentShow = tocContentShow
    },
    // 设置目录滚动条位置
    setTocScrollTop(tocScrollTop: number): void {
      this.tocScrollTop = tocScrollTop
    },
    // 设置编辑器内容
    setEditorContent(editorContent: string): void {
      this.editorContent = editorContent
    },
    // 设置是否显示编辑器
    setEditorContentShow(editorContentShow: boolean): void {
      this.editorContentShow = editorContentShow
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
    setPreviewContent(previewContent: string): void {
      this.previewContent = previewContent
    },
    // 设置是否显示预览
    setPreviewContentShow(previewContentShow: boolean): void {
      this.previewContentShow = previewContentShow
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

    // 更新编辑器 store
    updateEditorStore(markdownSrcCode: string): void {
      this.setEditorContent(markdownSrcCode)
      this.setPreviewContent(marked.parse(this.editorContent).toString())
      this.setImgUrls(extractImageUrlsFromHtml(this.previewContent))
      this.setTocContent(matchAllH(this.previewContent).join(''))
    },
  },
})

// 通过正则表达式匹配 html 中所有的 h 标签
function matchAllH(html: string): RegExpMatchArray {
  const regex = /<h\d.*?>.*?<\/h\d>/g
  const matches = html.match(regex) || []
  return matches as RegExpMatchArray
}

// 获取 html 中所有的 h 标签的内容

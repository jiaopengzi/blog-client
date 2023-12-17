/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-09 21:36:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-17 12:54:30
 * @FilePath     : \blog-client\src\stores\editor.ts
 * @Description  : 编辑器 store
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// @ts-check
import { defineStore } from 'pinia'
import { extractImageUrlsFromHtml } from '@/utils/img'
import createMarked from '@/pkg/marked/new-marked'
import { getMarkdownHeadingLines } from '@/utils/lineNumbers'
import type { MarkdownHeadingLineType } from '@/utils/lineNumbers'
import axios from 'axios'

interface editorStore {
  tocMarkdown: MarkdownHeadingLineType[] // markdown 目录内容
  tocHtml: HeadingType[] // html 目录内容
  tocShow: boolean // 是否显示目录
  editor: string // 编辑器内容
  editorShow: boolean // 是否显示编辑器
  preview: string // 预览内容
  previewShow: boolean // 是否显示预览
  imgUrls: string[] // 图片链接数组
  isShowElImageViewer: boolean // 是否显示图片预览组件
  scrollHideViewStr: string // 滚动条隐藏的编辑器 view 字符串
  isAsyncScroll: boolean // 是否异步滚动
  isFullScreen: boolean // 是否全屏
}

// 创建空值编辑器信息
function createEmptyEditorStore(): editorStore {
  return {
    tocMarkdown: [], // markdown 目录内容
    tocHtml: [], // html 目录内容
    tocShow: false, // 是否显示目录
    editor: '', // 编辑器内容
    editorShow: true, // 是否显示编辑器
    preview: '', // 预览内容
    previewShow: true, // 是否显示预览
    imgUrls: [], // 图片链接数组
    isShowElImageViewer: false, // 是否显示图片预览组件
    scrollHideViewStr: '', // 滚动条隐藏的编辑器 markdown 字符串
    isAsyncScroll: true, // 是否异步滚动
    isFullScreen: false, // 是否全屏
  }
}

export const useEditorStore = defineStore({
  id: 'editor',
  state: () => createEmptyEditorStore(),

  getters: {
    // 获取滚动条隐藏的 html 字符串
    getScrollHideHtmlStr(): string {
      return createMarked().parse(this.scrollHideViewStr).toString()
    },
  },

  actions: {
    // 更新编辑器 store
    updateEditorStore(markdownSrc: string): void {
      this.editor = markdownSrc.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n') // 去除 BOM 头 和 windows 换行符)
      this.preview = createMarked().parse(markdownSrc).toString()
      this.tocMarkdown = getMarkdownHeadingLines(this.editor)
      this.tocHtml = matchAllHeadingToList(this.preview)
      this.imgUrls = extractImageUrlsFromHtml(this.preview)
    },
    // 设置滚动条隐藏的编辑器view 字符串
    setScrollHideViewStr(scrollHideViewStr: string): void {
      this.scrollHideViewStr = scrollHideViewStr
    },

    async getEditorDocFromApi(url: string) {
      const res = await axios.get(url)
      const { data } = res
      this.updateEditorStore(data)
    },
  },
})

// h 标签类型
export interface HeadingType {
  level: number
  text: string
  anchor?: string
}

/**
 * @description : 通过正则表达式匹配 html 中所有的 h 标签 并转换为 HeadingType 数组
 * @param html  : html 字符串
 * @return      : 匹配到的 h 标签数组
 */
function matchAllHeadingToList(html: string): HeadingType[] {
  const regex = /<h\d.*?>.*?<\/h\d>/g // 匹配 h 标签
  const matches = html.match(regex) || [] // 匹配到的 h 标签数组
  const headingList: HeadingType[] = [] // h 标签数组
  matches.forEach((item) => {
    // 遍历匹配到的 h 标签数组
    const level = Number(item.match(/<h(\d).*?>/)?.[1]) || 0 // h 标签的等级
    const text = item.replace(/<.*?>/g, '') // h 标签的文本
    const anchor = item.match(/id="(.*)"/)?.[1] // h 标签的锚点
    headingList.push({
      level,
      text,
      anchor,
    })
  })
  return headingList
}

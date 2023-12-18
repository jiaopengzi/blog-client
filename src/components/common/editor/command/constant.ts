/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:51:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-18 13:30:13
 * @FilePath     : \blog-client\src\components\common\editor\command\constant.ts
 * @Description  : markdown 标记常量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { undo, redo } from '@codemirror/commands'
import { EditorView } from '@/pkg/codemirror/setup'
// mardkdown 编辑器 单个命令对象 的类型
export interface MardkdownEditorCommandItemType {
  tip?: string // 提示
  prefix?: string // 前缀
  content?: string // 内容
  suffix?: string // 后缀
  hotKey?: string // 快捷键
  action?: Function // 执行函数
  isShow: boolean // 是否显示
}

export interface MardkdownEditorCommandsOrderType {
  [key: string]: MardkdownEditorCommandItemType
}

// mardkdown 编辑器 所有 排序 命令 集合对象
export const MardkdownEditorCommandsOrder: MardkdownEditorCommandsOrderType = {
  // 撤销重做
  undo: {
    tip: '撤销',
    hotKey: 'Ctrl+Z',
    action: (view: EditorView) => {
      undo(view)
    },
    isShow: true,
  },
  // 重做
  redo: {
    tip: '重做',
    hotKey: 'Ctrl+Y',
    action: (view: EditorView) => {
      redo(view)
    },
    isShow: true,
  },
  // 清空
  clear: {
    tip: '清空',
    hotKey: 'Ctrl+Shift+K',
    action: (view: EditorView) => {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: '' },
        selection: { anchor: 0, head: 0 }, // 将光标移至文档起始位置
      })
    },
    isShow: true,
  },
  // 粗体
  bold: {
    tip: '粗体',
    prefix: '**',
    suffix: '**',
    hotKey: 'Ctrl+B',
    isShow: true,
  },
  // 斜体
  italic: {
    tip: '斜体',
    prefix: '*',
    suffix: '*',
    hotKey: 'Ctrl+I',
    isShow: true,
  },
  // 删除线
  strikethrough: {
    tip: '删除线',
    prefix: '~~',
    suffix: '~~',
    hotKey: 'Ctrl+Shift+S',
    isShow: true,
  },
  // mark标记
  mark: {
    tip: 'mark标记',
    prefix: '==',
    suffix: '==',
    hotKey: 'Ctrl+Shift+M',
    isShow: true,
  },
  //   emoji
  emoji: {
    tip: 'emoji表情',
    prefix: ':',
    content: 'smile',
    suffix: ':',
    hotKey: 'Ctrl+Shift+E',
    isShow: true,
  },
  // 标题1
  h1: {
    tip: '标题1',
    prefix: '# ',
    hotKey: 'Ctrl+1',
    isShow: true,
  },
  // 标题2
  h2: {
    tip: '标题2',
    prefix: '## ',
    hotKey: 'Ctrl+2',
    isShow: true,
  },
  // 标题3
  h3: {
    tip: '标题3',
    prefix: '### ',
    hotKey: 'Ctrl+3',
    isShow: true,
  },
  // 标题4
  h4: {
    tip: '标题4',
    prefix: '#### ',
    hotKey: 'Ctrl+4',
    isShow: false,
  },
  // 标题5
  h5: {
    tip: '标题5',
    prefix: '##### ',
    hotKey: 'Ctrl+5',
    isShow: false,
  },
  // 标题6
  h6: {
    tip: '标题6',
    prefix: '###### ',
    hotKey: 'Ctrl+6',
    isShow: false,
  },
  // 有序列表
  ol: {
    tip: '有序列表',
    prefix: '1. ',
    hotKey: 'Ctrl+Shift+O',
    isShow: true,
  },
  // 无序列表
  ul: {
    tip: '无序列表',
    prefix: '- ',
    hotKey: 'Ctrl+Shift+U',
    isShow: true,
  },
  // 引用
  quote: {
    tip: '引用',
    prefix: '> ',
    hotKey: 'Ctrl+Shift+Q',
    isShow: true,
  },
  // 代码块
  codeBlock: {
    tip: '代码块',
    prefix: '``` language\n',
    content: '\n',
    suffix: '```',
    hotKey: 'Ctrl+Shift+C',
    isShow: true,
  },
  // 行内代码
  codeInline: {
    tip: '行内代码',
    prefix: '`',
    suffix: '`',
    hotKey: 'Ctrl+Shift+I',
    isShow: false,
  },
  // 链接
  link: {
    tip: '链接',
    prefix: '[',
    suffix: '](url)',
    hotKey: 'Ctrl+Shift+L',
    isShow: true,
  },
  // 图片
  image: {
    tip: '图片',
    prefix: '![alt](',
    suffix: ')',
    hotKey: 'Ctrl+Shift+P',
    isShow: true,
  },
  // 表格
  table: {
    tip: '表格',
    content: '|column1|column2|column3|\n|:---:|:---:|:---:|\n|content1|content2|content3|',
    hotKey: 'Ctrl+Shift+T',
    isShow: true,
  },
  // 分割线
  hr: {
    tip: '分割线',
    content: '---',
    hotKey: 'Ctrl+Shift+H',
    isShow: true,
  },
  // 任务列表
  taskList: {
    tip: '任务列表',
    prefix: '- [ ] ',
    hotKey: 'Ctrl+Shift+X',
    isShow: true,
  },
  // 块级数学公式
  mathBlock: {
    tip: '块级数学公式',
    prefix: '$$\n',
    content: '\n',
    suffix: '$$',
    hotKey: 'Ctrl+Shift+M',
    isShow: true,
  },
  // 行内数学公式
  mathInline: {
    tip: '行内数学公式',
    prefix: '$',
    suffix: '$',
    hotKey: 'Ctrl+Shift+N',
    isShow: false,
  },
  // 脚注
  footnote: {
    tip: '脚注',
    prefix: '[^1]',
    suffix: '\n\n[^1]:脚注内容',
    hotKey: 'Ctrl+Shift+F',
    isShow: true,
  },
  // 上标
  superscript: {
    tip: '上标',
    prefix: '^',
    suffix: '^',
    hotKey: 'Ctrl+Shift+U',
    isShow: true,
  },
  // 下标
  subscript: {
    tip: '下标',
    prefix: '~',
    suffix: '~',
    hotKey: 'Ctrl+Shift+D',
    isShow: true,
  },
  // 付费内容
  payContent: {
    tip: '付费内容',
    prefix: '<!--more-->',
    hotKey: 'Ctrl+Alt+M',
    isShow: true,
  },
  // 保存
  save: {
    tip: '保存',
    hotKey: 'Ctrl+S',
    isShow: true,
  },
  // 发布
  publish: {
    tip: '发布',
    hotKey: 'Ctrl+P',
    isShow: true,
  },
  // 预览
  preview: {
    tip: '预览',
    hotKey: 'Ctrl+Shift+V',
    isShow: true,
  },
  // 目录
  toc: {
    tip: '目录',
    hotKey: 'Ctrl+T',
    isShow: true,
  },
  // 同步滚动条
  scroll: {
    tip: '同步滚动条',
    hotKey: 'Ctrl+Shift+S',
    isShow: true,
  },
  // 全屏
  fullscreen: {
    tip: '全屏',
    hotKey: 'Ctrl+Alt+F',
    isShow: true,
  },
  // 退出全屏
  exitFullscreen: {
    tip: '退出全屏',
    hotKey: 'Esc',
    isShow: true,
  },
  // 桌面端
  desktop: {
    tip: 'Desktop',
    hotKey: 'Ctrl+Shift+D',
    isShow: true,
  },
  // 移动端
  mobile: {
    tip: 'Mobile',
    hotKey: 'Ctrl+Shift+M',
    isShow: true,
  },
  // 导出 markdown
  markdown: {
    tip: '导出 markdown',
    hotKey: 'Ctrl+Alt+M',
    isShow: true,
  },
  // 导出 html
  html: {
    tip: '导出 html',
    hotKey: 'Ctrl+Alt+H',
    isShow: true,
  },
  // 导出 pdf
  pdf: {
    tip: '导出 PDF',
    hotKey: 'Ctrl+Alt+P',
    isShow: true,
  },
  // 帮助
  help: {
    tip: '帮助',
    hotKey: 'Ctrl+Shift+P',
    isShow: true,
  },
  // 关于
  info: {
    tip: '关于',
    hotKey: 'Ctrl+Shift+I',
    isShow: true,
  },
}

// mardkdown 编辑器 所有 排序 命令 集合对象 key 的类型
export type MardkdownEditorCommandsOrderKeyType = keyof typeof MardkdownEditorCommandsOrder

// 需要滚动的元素标签
export const ScrollElementTag: string = '*'
// 需要跳转的元素标题标签
export const ScrollElementTagHeading: string = 'h1, h2, h3, h4, h5, h6'

/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:51:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-02 22:58:11
 * @FilePath     : \blog-client\src\components\common\editor\command\constant.ts
 * @Description  : markdown 标记常量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// mardkdown 编辑器 单个命令对象 的类型
export interface MardkdownEditorCommandItemType {
  tip?: string
  prefix?: string
  content?: string
  suffix?: string
  isShow: boolean
}

export interface MardkdownEditorCommandsOrderType {
  [key: string]: MardkdownEditorCommandItemType
}

// mardkdown 编辑器 所有 排序 命令 集合对象
export const MardkdownEditorCommandsOrder: MardkdownEditorCommandsOrderType = {
  // 撤销重做
  undo: {
    tip: '撤销',
    isShow: true,
  },
  // 重做
  redo: {
    tip: '重做',
    isShow: true,
  },
  // 清空
  clear: {
    tip: '清空',
    isShow: true,
  },
  // 粗体
  bold: {
    tip: '粗体',
    prefix: '**',
    suffix: '**',
    isShow: true,
  },
  // 斜体
  italic: {
    tip: '斜体',
    prefix: '*',
    suffix: '*',
    isShow: true,
  },
  // 删除线
  strikethrough: {
    tip: '删除线',
    prefix: '~~',
    suffix: '~~',
    isShow: true,
  },
  // mark标记
  mark: {
    tip: 'mark标记',
    prefix: '==',
    suffix: '==',
    isShow: true,
  },
  //   emoji
  emoji: {
    tip: 'emoji',
    prefix: ':',
    content: 'smile',
    suffix: ':',
    isShow: true,
  },
  // 标题1
  h1: {
    tip: '标题1',
    prefix: '# ',
    isShow: true,
  },
  // 标题2
  h2: {
    tip: '标题2',
    prefix: '## ',
    isShow: true,
  },
  // 标题3
  h3: {
    tip: '标题3',
    prefix: '### ',
    isShow: true,
  },
  // 标题4
  h4: {
    tip: '标题4',
    prefix: '#### ',
    isShow: false,
  },
  // 标题5
  h5: {
    tip: '标题5',
    prefix: '##### ',
    isShow: false,
  },
  // 标题6
  h6: {
    tip: '标题6',
    prefix: '###### ',
    isShow: false,
  },
  // 有序列表
  ol: {
    tip: '有序列表',
    prefix: '1. ',
    isShow: true,
  },
  // 无序列表
  ul: {
    tip: '无序列表',
    prefix: '- ',
    isShow: true,
  },
  // 引用
  quote: {
    tip: '引用',
    prefix: '> ',
    isShow: true,
  },
  // 代码块
  codeBlock: {
    tip: '代码块',
    prefix: '``` language\n',
    content: '\n',
    suffix: '```',
    isShow: true,
  },
  // 行内代码
  codeInline: {
    tip: '行内代码',
    prefix: '`',
    suffix: '`',
    isShow: false,
  },
  // 链接
  link: {
    tip: '链接',
    prefix: '[',
    suffix: '](url)',
    isShow: true,
  },
  // 图片
  image: {
    tip: '图片',
    prefix: '![alt](',
    suffix: ')',
    isShow: true,
  },
  // 表格
  table: {
    tip: '表格',
    content: '|column1|column2|column3|\n|-|-|-|\n|content1|content2|content3|',
    isShow: true,
  },
  // 分割线
  hr: {
    tip: '分割线',
    content: '---',
    isShow: true,
  },
  // 任务列表
  taskList: {
    tip: '任务列表',
    prefix: '- [ ] ',
    isShow: true,
  },
  // 块级数学公式
  mathBlock: {
    tip: '块级数学公式',
    prefix: '$$\n',
    content: '\n',
    suffix: '$$',
    isShow: true,
  },
  // 行内数学公式
  mathInline: {
    tip: '行内数学公式',
    prefix: '$',
    suffix: '$',
    isShow: false,
  },
  // 脚注
  footnote: {
    tip: '脚注',
    prefix: '[^',
    suffix: ']',
    isShow: true,
  },
  // 上标
  superscript: {
    tip: '上标',
    prefix: '^',
    suffix: '^',
    isShow: true,
  },
  // 下标
  subscript: {
    tip: '下标',
    prefix: '~',
    suffix: '~',
    isShow: true,
  },

  // 付费内容
  payContent: {
    tip: '付费内容',
    prefix: '<!--more-->',
    isShow: true,
  },
  // 保存
  save: {
    tip: '保存',
    isShow: true,
  },
  // 全屏
  fullscreen: {
    tip: '全屏',
    isShow: true,
  },
  // 退出全屏
  exitFullscreen: {
    tip: '退出全屏',
    isShow: true,
  },
}

// mardkdown 编辑器 所有 排序 命令 集合对象 key 的类型
export type MardkdownEditorCommandsOrderKeyType = keyof typeof MardkdownEditorCommandsOrder

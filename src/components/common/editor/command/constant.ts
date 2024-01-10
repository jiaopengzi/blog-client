/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:51:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-10 16:07:26
 * @FilePath     : \blog-client\src\components\common\editor\command\constant.ts
 * @Description  : markdown 标记常量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { undo, redo } from '@codemirror/commands'
import { EditorView } from '@/pkg/codemirror/setup'
import type { MardkdownEditorCommandsType } from '@/components/common/editor/command'
import { IconKeys } from '@/components/common/icons'

export enum CommandsKey {
  undo = 'undo',
  redo = 'redo',
  clear = 'clear',
  bold = 'bold',
  italic = 'italic',
  strikethrough = 'strikethrough',
  mark = 'mark',
  emoji = 'emoji',
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h5 = 'h5',
  h6 = 'h6',
  ol = 'ol',
  ul = 'ul',
  quote = 'quote',
  codeBlock = 'codeBlock',
  codeInline = 'codeInline',
  link = 'link',
  image = 'image',
  table = 'table',
  hr = 'hr',
  taskList = 'taskList',
  mathBlock = 'mathBlock',
  mathInline = 'mathInline',
  footnote = 'footnote',
  superscript = 'superscript',
  subscript = 'subscript',
  payContent = 'payContent',
  copy = 'copy',
  save = 'save',
  publish = 'publish',
  preview = 'preview',
  toc = 'toc',
  scroll = 'scroll',
  fullscreen = 'fullscreen',
  exitFullscreen = 'exitFullscreen',
  edit = 'edit',
  WeChatOfficialAccount = 'WeChatOfficialAccount',
  markdown = 'markdown',
  html = 'html',
  pdf = 'pdf',
  help = 'help',
  info = 'info',
}

// mardkdown 编辑器 所有 排序 命令 集合对象
export const MardkdownEditorCommands: MardkdownEditorCommandsType = {
  // 撤销重做
  [CommandsKey.undo]: {
    tip: '撤销',
    hotKey: 'Ctrl+Z',
    action: (view: EditorView) => {
      undo(view)
    },
    // icon: 'undo',
    icon: IconKeys.undo,
  },
  // 重做
  [CommandsKey.redo]: {
    tip: '重做',
    hotKey: 'Ctrl+Y',
    action: (view: EditorView) => {
      redo(view)
    },
    icon: IconKeys.redo,
  },
  // 清空
  [CommandsKey.clear]: {
    tip: '清空',
    hotKey: 'Ctrl+Shift+K',
    action: (view: EditorView) => {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: '' },
        selection: { anchor: 0, head: 0 }, // 将光标移至文档起始位置
      })
    },
    icon: IconKeys.clear,
  },
  // 粗体
  [CommandsKey.bold]: {
    tip: '粗体',
    prefix: '**',
    suffix: '**',
    hotKey: 'Ctrl+B',
    icon: IconKeys.bold,
  },
  // 斜体
  [CommandsKey.italic]: {
    tip: '斜体',
    prefix: '*',
    suffix: '*',
    hotKey: 'Ctrl+I',
    icon: IconKeys.italic,
  },
  // 删除线
  [CommandsKey.strikethrough]: {
    tip: '删除线',
    prefix: '~~',
    suffix: '~~',
    hotKey: 'Ctrl+Shift+S',
    icon: IconKeys.strikethrough,
  },
  // mark标记
  [CommandsKey.mark]: {
    tip: 'mark标记',
    prefix: '==',
    suffix: '==',
    hotKey: 'Ctrl+Shift+M',
    icon: IconKeys.mark,
  },
  //   emoji
  [CommandsKey.emoji]: {
    tip: 'emoji表情',
    prefix: ':',
    content: 'smile',
    suffix: ':',
    hotKey: 'Ctrl+Shift+E',
    icon: IconKeys.emoji,
  },
  // 标题1
  [CommandsKey.h1]: {
    tip: '标题1',
    prefix: '# ',
    hotKey: 'Ctrl+1',
    icon: IconKeys.h1,
  },
  // 标题2
  [CommandsKey.h2]: {
    tip: '标题2',
    prefix: '## ',
    hotKey: 'Ctrl+2',
    icon: IconKeys.h2,
  },
  // 标题3
  [CommandsKey.h3]: {
    tip: '标题3',
    prefix: '### ',
    hotKey: 'Ctrl+3',
    icon: IconKeys.h3,
  },
  // 标题4
  [CommandsKey.h4]: {
    tip: '标题4',
    prefix: '#### ',
    hotKey: 'Ctrl+4',
    icon: IconKeys.h4,
  },
  // 标题5
  [CommandsKey.h5]: {
    tip: '标题5',
    prefix: '##### ',
    hotKey: 'Ctrl+5',
    icon: IconKeys.h5,
  },
  // 标题6
  [CommandsKey.h6]: {
    tip: '标题6',
    prefix: '###### ',
    hotKey: 'Ctrl+6',
    icon: IconKeys.h6,
  },
  // 有序列表
  [CommandsKey.ol]: {
    tip: '有序列表',
    prefix: '1. ',
    hotKey: 'Ctrl+Shift+O',
    icon: IconKeys.ol,
  },
  // 无序列表
  [CommandsKey.ul]: {
    tip: '无序列表',
    prefix: '- ',
    hotKey: 'Ctrl+Shift+U',
    icon: IconKeys.ul,
  },
  // 引用
  [CommandsKey.quote]: {
    tip: '引用',
    prefix: '> ',
    hotKey: 'Ctrl+Shift+Q',
    icon: IconKeys.quote,
  },
  // 代码块
  [CommandsKey.codeBlock]: {
    tip: '代码块',
    prefix: '``` language\n',
    content: '\n',
    suffix: '```',
    hotKey: 'Ctrl+Shift+C',
    icon: IconKeys.codeBlock,
  },
  // 行内代码
  [CommandsKey.codeInline]: {
    tip: '行内代码',
    prefix: '`',
    suffix: '`',
    hotKey: 'Ctrl+Shift+I',
    icon: IconKeys.codeInline,
  },
  // 链接
  [CommandsKey.link]: {
    tip: '链接',
    prefix: '[',
    suffix: '](url)',
    hotKey: 'Ctrl+Shift+L',
    icon: IconKeys.link,
  },
  // 图片
  [CommandsKey.image]: {
    tip: '图片',
    prefix: '![alt](',
    suffix: ')',
    hotKey: 'Ctrl+Shift+P',
    icon: IconKeys.image,
  },
  // 表格
  [CommandsKey.table]: {
    tip: '表格',
    content: '|column1|column2|column3|\n|:---:|:---:|:---:|\n|content1|content2|content3|',
    hotKey: 'Ctrl+Shift+T',
    icon: IconKeys.table,
  },
  // 分割线
  [CommandsKey.hr]: {
    tip: '分割线',
    content: '---',
    hotKey: 'Ctrl+Shift+H',
    icon: IconKeys.hr,
  },
  // 任务列表
  [CommandsKey.taskList]: {
    tip: '任务列表',
    prefix: '- [ ] ',
    hotKey: 'Ctrl+Shift+X',
    icon: IconKeys.taskList,
  },
  // 块级数学公式
  [CommandsKey.mathBlock]: {
    tip: '块级数学公式',
    prefix: '$$\n',
    content: '\n',
    suffix: '$$',
    hotKey: 'Ctrl+Shift+M',
    icon: IconKeys.mathBlock,
  },
  // 行内数学公式
  [CommandsKey.mathInline]: {
    tip: '行内数学公式',
    prefix: '$',
    suffix: '$',
    hotKey: 'Ctrl+Shift+N',
    icon: IconKeys.mathInline,
  },
  // 脚注
  [CommandsKey.footnote]: {
    tip: '脚注',
    prefix: '[^1]',
    suffix: '\n\n[^1]:脚注内容',
    hotKey: 'Ctrl+Shift+F',
    icon: IconKeys.footnote,
  },
  // 上标
  [CommandsKey.superscript]: {
    tip: '上标',
    prefix: '^',
    suffix: '^',
    hotKey: 'Ctrl+Shift+U',
    icon: IconKeys.superscript,
  },
  // 下标
  [CommandsKey.subscript]: {
    tip: '下标',
    prefix: '~',
    suffix: '~',
    hotKey: 'Ctrl+Shift+D',
    icon: IconKeys.subscript,
  },
  // 付费内容
  [CommandsKey.payContent]: {
    tip: '付费内容',
    prefix: '<!--more-->',
    hotKey: 'Ctrl+Alt+M',
    icon: IconKeys.payContent,
  },
  // 复制
  [CommandsKey.copy]: {
    tip: '复制',
    hotKey: 'Alt+C',
    icon: IconKeys.copy,
  },

  // 保存
  [CommandsKey.save]: {
    tip: '保存',
    hotKey: 'Ctrl+S',
    icon: IconKeys.save,
  },
  // 发布
  [CommandsKey.publish]: {
    tip: '发布',
    hotKey: 'Ctrl+P',
    icon: IconKeys.publish,
  },
  // 预览
  [CommandsKey.preview]: {
    tip: '预览',
    hotKey: 'Ctrl+Shift+V',
    icon: IconKeys.preview,
  },
  // 目录
  [CommandsKey.toc]: {
    tip: '目录',
    hotKey: 'Ctrl+T',
    icon: IconKeys.toc,
  },
  // 同步滚动条
  [CommandsKey.scroll]: {
    tip: '同步滚动条',
    hotKey: 'Ctrl+Shift+S',
    icon: IconKeys.scroll,
  },
  // 全屏
  [CommandsKey.fullscreen]: {
    tip: '全屏',
    hotKey: 'Ctrl+Alt+F',
    icon: IconKeys.fullscreen,
  },
  // 退出全屏
  [CommandsKey.exitFullscreen]: {
    tip: '退出全屏',
    hotKey: 'Esc',
    icon: IconKeys.exitFullscreen,
  },
  // 桌面端
  [CommandsKey.edit]: {
    tip: '编辑模式',
    hotKey: 'Ctrl+Shift+D',
    icon: IconKeys.edit,
  },
  // 移动端
  [CommandsKey.WeChatOfficialAccount]: {
    tip: '微信公众号',
    hotKey: 'Ctrl+Shift+M',
    icon: IconKeys.WeChatOfficialAccount,
  },
  // 导出 markdown
  [CommandsKey.markdown]: {
    tip: '导出 markdown',
    hotKey: 'Ctrl+Alt+M',
    icon: IconKeys.markdown,
  },
  // 导出 html
  [CommandsKey.html]: {
    tip: '导出 html',
    hotKey: 'Ctrl+Alt+H',
    icon: IconKeys.html,
  },
  // 导出 pdf
  [CommandsKey.pdf]: {
    tip: '导出 PDF',
    hotKey: 'Ctrl+Alt+P',
    icon: IconKeys.pdf,
  },
  // 帮助
  [CommandsKey.help]: {
    tip: '帮助',
    hotKey: 'Ctrl+Shift+P',
    icon: IconKeys.help,
  },
  // 关于
  [CommandsKey.info]: {
    tip: '关于',
    hotKey: 'Ctrl+Shift+I',
    icon: IconKeys.info,
  },
}

// 需要滚动的元素标签
export const ScrollElementTag: string = '*'
// 需要跳转的元素标题标签
export const ScrollElementTagHeading: string = 'h1, h2, h3, h4, h5, h6'

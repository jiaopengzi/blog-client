/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:51:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-20 11:30:58
 * @FilePath     : \blog-client\src\components\editor\command\constant.ts
 * @Description  : markdown 标记常量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { undo, redo } from "@codemirror/commands"
import { EditorView } from "@/pkg/codemirror/setup"
import { IconKeys } from "@/components/common/icons"

export enum CommandsKey {
    Undo = "undo",
    Redo = "redo",
    Clear = "clear",
    Bold = "bold",
    Italic = "italic",
    Strikethrough = "strikethrough",
    Mark = "mark",
    Emoji = "emoji",
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    H6 = "h6",
    Ol = "ol",
    Ul = "ul",
    Quote = "quote",
    CodeBlock = "codeBlock",
    CodeInline = "codeInline",
    Link = "link",
    Image = "image",
    Table = "table",
    Hr = "hr",
    TaskList = "taskList",
    MathBlock = "mathBlock",
    MathInline = "mathInline",
    Footnote = "footnote",
    Superscript = "superscript",
    Subscript = "subscript",
    PayContent = "payContent",
    Video = "video",
    Copy = "copy",
    Save = "save",
    Publish = "publish",
    Preview = "preview",
    Toc = "toc",
    Scroll = "scroll",
    Fullscreen = "fullscreen",
    ExitFullscreen = "exitFullscreen",
    Edit = "edit",
    WechatOfficialAccount = "WechatOfficialAccount",
    Markdown = "markdown",
    Html = "html",
    Pdf = "pdf",
    Help = "help",
    Info = "info",
}

// markdown 编辑器 单个命令对象 的类型
export interface MarkdownEditorCommandItem {
    tip?: string // 前端提示
    prefix?: string // 前缀
    content?: string // 内容
    suffix?: string // 后缀
    hotKey?: string // 快捷键
    action?: Function // 执行函数
    icon?: IconKeys // 图标名称
}

// 使用映射类型定义 MarkdownEditorCommands 类型
export type MarkdownEditorCommands = {
    [key in CommandsKey]: MarkdownEditorCommandItem
}

/**
 * @description: 创建 markdown 编辑器 所有 排序 命令 集合对象
 * @param editorStateManager 编辑器状态管理器
 * @return {MarkdownEditorCommands} 编辑器 所有 排序 命令 集合对象
 */
export function createMarkdownEditorCommands(): MarkdownEditorCommands {
    return {
        // 撤销重做
        [CommandsKey.Undo]: {
            tip: "撤销",
            hotKey: "Ctrl+Z",
            action: (view: EditorView) => {
                undo(view)
            },
            // icon: 'undo',
            icon: IconKeys.Undo,
        },
        // 重做
        [CommandsKey.Redo]: {
            tip: "重做",
            hotKey: "Ctrl+Y",
            action: (view: EditorView) => {
                redo(view)
            },
            icon: IconKeys.Redo,
        },
        // 清空
        [CommandsKey.Clear]: {
            tip: "清空",
            hotKey: "Ctrl+Shift+K",
            action: (view: EditorView) => {
                view.dispatch({
                    changes: { from: 0, to: view.state.doc.length, insert: "" },
                    selection: { anchor: 0, head: 0 }, // 将光标移至文档起始位置
                })
            },
            icon: IconKeys.Clear,
        },
        // 粗体
        [CommandsKey.Bold]: {
            tip: "粗体",
            prefix: "**",
            suffix: "**",
            hotKey: "Ctrl+B",
            icon: IconKeys.Bold,
        },
        // 斜体
        [CommandsKey.Italic]: {
            tip: "斜体",
            prefix: "*",
            suffix: "*",
            hotKey: "Ctrl+I",
            icon: IconKeys.Italic,
        },
        // 删除线
        [CommandsKey.Strikethrough]: {
            tip: "删除线",
            prefix: "~~",
            suffix: "~~",
            hotKey: "Ctrl+Shift+S",
            icon: IconKeys.Strikethrough,
        },
        // mark标记
        [CommandsKey.Mark]: {
            tip: "mark标记",
            prefix: "==",
            suffix: "==",
            hotKey: "Ctrl+Shift+M",
            icon: IconKeys.Mark,
        },
        //   emoji
        [CommandsKey.Emoji]: {
            tip: "emoji表情",
            prefix: ":",
            content: "smile",
            suffix: ":",
            hotKey: "Ctrl+Shift+E",
            icon: IconKeys.Emoji,
        },
        // 标题1
        [CommandsKey.H1]: {
            tip: "标题1",
            prefix: "# ",
            hotKey: "Ctrl+1",
            icon: IconKeys.H1,
        },
        // 标题2
        [CommandsKey.H2]: {
            tip: "标题2",
            prefix: "## ",
            hotKey: "Ctrl+2",
            icon: IconKeys.H2,
        },
        // 标题3
        [CommandsKey.H3]: {
            tip: "标题3",
            prefix: "### ",
            hotKey: "Ctrl+3",
            icon: IconKeys.H3,
        },
        // 标题4
        [CommandsKey.H4]: {
            tip: "标题4",
            prefix: "#### ",
            hotKey: "Ctrl+4",
            icon: IconKeys.H4,
        },
        // 标题5
        [CommandsKey.H5]: {
            tip: "标题5",
            prefix: "##### ",
            hotKey: "Ctrl+5",
            icon: IconKeys.H5,
        },
        // 标题6
        [CommandsKey.H6]: {
            tip: "标题6",
            prefix: "###### ",
            hotKey: "Ctrl+6",
            icon: IconKeys.H6,
        },
        // 有序列表
        [CommandsKey.Ol]: {
            tip: "有序列表",
            prefix: "1. ",
            hotKey: "Ctrl+Shift+O",
            icon: IconKeys.Ol,
        },
        // 无序列表
        [CommandsKey.Ul]: {
            tip: "无序列表",
            prefix: "- ",
            hotKey: "Ctrl+Shift+U",
            icon: IconKeys.Ul,
        },
        // 引用
        [CommandsKey.Quote]: {
            tip: "引用",
            prefix: "> ",
            hotKey: "Ctrl+Shift+Q",
            icon: IconKeys.Quote,
        },
        // 代码块
        [CommandsKey.CodeBlock]: {
            tip: "代码块",
            prefix: "``` language\n",
            content: "\n",
            suffix: "```",
            hotKey: "Ctrl+Shift+C",
            icon: IconKeys.CodeBlock,
        },
        // 行内代码
        [CommandsKey.CodeInline]: {
            tip: "行内代码",
            prefix: "`",
            suffix: "`",
            hotKey: "Ctrl+Shift+I",
            icon: IconKeys.CodeInline,
        },
        // 链接
        [CommandsKey.Link]: {
            tip: "链接",
            prefix: "[",
            suffix: "](url)",
            hotKey: "Ctrl+Shift+L",
            icon: IconKeys.Link,
        },
        // 图片
        [CommandsKey.Image]: {
            tip: "图片",
            prefix: "![alt](",
            suffix: ")",
            hotKey: "Ctrl+Shift+P",
            icon: IconKeys.Image,
        },
        // 表格
        [CommandsKey.Table]: {
            tip: "表格",
            content: "|column1|column2|column3|\n|:---:|:---:|:---:|\n|content1|content2|content3|",
            hotKey: "Ctrl+Shift+T",
            icon: IconKeys.Table,
        },
        // 分割线
        [CommandsKey.Hr]: {
            tip: "分割线",
            content: "---",
            hotKey: "Ctrl+Shift+H",
            icon: IconKeys.Hr,
        },
        // 任务列表
        [CommandsKey.TaskList]: {
            tip: "任务列表",
            prefix: "- [ ] ",
            hotKey: "Ctrl+Shift+X",
            icon: IconKeys.TaskList,
        },
        // 块级数学公式
        [CommandsKey.MathBlock]: {
            tip: "块级数学公式",
            prefix: "$$\n",
            content: "\n",
            suffix: "$$",
            hotKey: "Ctrl+Shift+M",
            icon: IconKeys.MathBlock,
        },
        // 行内数学公式
        [CommandsKey.MathInline]: {
            tip: "行内数学公式",
            prefix: "$",
            suffix: "$",
            hotKey: "Ctrl+Shift+N",
            icon: IconKeys.MathInline,
        },
        // 脚注
        [CommandsKey.Footnote]: {
            tip: "脚注",
            prefix: "[^1]",
            suffix: "\n\n[^1]:脚注内容",
            hotKey: "Ctrl+Shift+F",
            icon: IconKeys.Footnote,
        },
        // 上标
        [CommandsKey.Superscript]: {
            tip: "上标",
            prefix: "^",
            suffix: "^",
            hotKey: "Ctrl+Shift+U",
            icon: IconKeys.Superscript,
        },
        // 下标
        [CommandsKey.Subscript]: {
            tip: "下标",
            prefix: "~",
            suffix: "~",
            hotKey: "Ctrl+Shift+D",
            icon: IconKeys.Subscript,
        },
        // 付费内容
        [CommandsKey.PayContent]: {
            tip: "付费内容",
            prefix: "<!--more-->",
            hotKey: "Ctrl+Alt+M",
            icon: IconKeys.PayContent,
        },
        // 视频
        [CommandsKey.Video]: {
            tip: "视频",
            prefix: '<div class="video-player" id="',
            suffix: '"></div>',
            hotKey: "Ctrl+Shift+V",
            icon: IconKeys.Video,
        },
        // 复制
        [CommandsKey.Copy]: {
            tip: "复制",
            hotKey: "Alt+C",
            icon: IconKeys.Copy,
        },

        // 保存
        [CommandsKey.Save]: {
            tip: "保存",
            hotKey: "Ctrl+S",
            icon: IconKeys.Save,
        },
        // 发布
        [CommandsKey.Publish]: {
            tip: "发布",
            hotKey: "Ctrl+P",
            icon: IconKeys.Publish,
        },
        // 预览
        [CommandsKey.Preview]: {
            tip: "预览",
            hotKey: "Ctrl+Shift+V",
            icon: IconKeys.Preview,
        },
        // 目录
        [CommandsKey.Toc]: {
            tip: "目录",
            hotKey: "Ctrl+T",
            icon: IconKeys.Toc,
        },
        // 同步滚动条
        [CommandsKey.Scroll]: {
            tip: "同步滚动条",
            hotKey: "Ctrl+Shift+S",
            icon: IconKeys.Scroll,
        },
        // 全屏
        [CommandsKey.Fullscreen]: {
            tip: "全屏",
            hotKey: "Ctrl+Alt+F",
            icon: IconKeys.Fullscreen,
        },
        // 退出全屏
        [CommandsKey.ExitFullscreen]: {
            tip: "退出全屏",
            hotKey: "Esc",
            icon: IconKeys.ExitFullscreen,
        },
        // 桌面端
        [CommandsKey.Edit]: {
            tip: "编辑模式",
            hotKey: "Ctrl+Shift+D",
            icon: IconKeys.Edit,
        },
        // 移动端
        [CommandsKey.WechatOfficialAccount]: {
            tip: "微信公众号",
            hotKey: "Ctrl+Shift+M",
            icon: IconKeys.WechatOfficialAccount,
        },
        // 导出 markdown
        [CommandsKey.Markdown]: {
            tip: "导出 markdown",
            hotKey: "Ctrl+Alt+M",
            icon: IconKeys.Markdown,
        },
        // 导出 html
        [CommandsKey.Html]: {
            tip: "导出 html",
            hotKey: "Ctrl+Alt+H",
            icon: IconKeys.Html,
        },
        // 导出 pdf
        [CommandsKey.Pdf]: {
            tip: "导出 PDF",
            hotKey: "Ctrl+Alt+P",
            icon: IconKeys.Pdf,
        },
        // 帮助
        [CommandsKey.Help]: {
            tip: "帮助",
            hotKey: "Ctrl+Shift+P",
            icon: IconKeys.Help,
        },
        // 关于
        [CommandsKey.Info]: {
            tip: "关于",
            hotKey: "Ctrl+Shift+I",
            icon: IconKeys.Info,
        },
    }
}

// 需要滚动的元素标签
export const ScrollElementTag: string = "*"
// 需要跳转的元素标题标签
export const ScrollElementTagHeading: string = "h1, h2, h3, h4, h5, h6"

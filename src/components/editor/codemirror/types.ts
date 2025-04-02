/**
 * @FilePath     : \blog-client\src\components\editor\codemirror\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型定义
 */

export interface CodeEditorProps {
    doc: string // 编辑器内容
    width?: string // 宽度
    height?: string // 高度
    vimMode?: boolean // 是否开启 vim 模式
}

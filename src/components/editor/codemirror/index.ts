/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-19 17:46:14
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 16:52:43
 * @FilePath     : \blog-client\src\components\common\editor\codemirror\index.ts
 * @Description  : 入口
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'

export interface CodeEditorProps {
  codemirrorDoc: string // 编辑器内容
  width?: string // 宽度
  height?: string // 高度
}

/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-06 23:36:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-07 01:53:29
 * @FilePath     : \blog-client\src\utils\marked\custom-marked.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
// 创建一个新文件 'custom-marked.ts'，重新封装 marked
import * as marked from 'marked'
import { markExtensionInline } from './mark-extension'

// marked.use({
//   lexer: {
//     inlineMethods: [...Object.keys(marked.Lexer.rules.inline), 'mark'],
//   },
//   extensions: [markExtensionInline],
// } as any) // 使用类型断言将参数转换为 any 类型

// marked.use({
//   lexer: {
//     blockMethods: [...Object.keys(marked.Lexer.rules.block), 'mark'],
//   },
//   extensions: [markExtensionBlock],
// } as any)

marked.use({ extensions: [markExtensionInline] })

export default marked

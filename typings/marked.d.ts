/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-07 00:05:18
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-07 00:11:00
 * @FilePath     : \blog-client\typings\marked.d.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import 'marked'

declare module 'marked' {
  namespace Tokens {
    export interface Mark {
      type: 'mark'
      raw: string
      text: string
      tokens: Token[]
    }
  }

  export type Token = Tokens.Mark
}

export type Token =
  | Tokens.Space
  | Tokens.Code
  | Tokens.Heading
  | Tokens.Table
  | Tokens.Hr
  | Tokens.Blockquote
  | Tokens.List
  | Tokens.ListItem
  | Tokens.Paragraph
  | Tokens.HTML
  | Tokens.Text
  | Tokens.Def
  | Tokens.Escape
  | Tokens.Tag
  | Tokens.Image
  | Tokens.Link
  | Tokens.Strong
  | Tokens.Em
  | Tokens.Codespan
  | Tokens.Br
  | Tokens.Del
  | Tokens.Generic
  | Tokens.Mark

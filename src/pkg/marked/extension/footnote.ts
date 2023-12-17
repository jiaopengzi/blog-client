/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-28 18:53:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-12 23:44:29
 * @FilePath     : \blog-client\src\pkg\marked\extension\footnote.ts
 * @Description  : 脚注配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Options } from 'marked-footnote'

const optionFootnote: Options = {
  /**
   * The prefix ID for footnotes.
   *
   * @default 'footnote-'
   */
  prefixId: 'footnote-', // 脚注前缀
  /**
   * The description of footnotes, used by `aria-labeledby` attribute.
   *
   * @default 'Footnotes'
   */
  description: 'Footnotes', // 脚注描述
  /**
   * If set to `true`, it will place footnote reference in square brackets, like this:
   * `[1]`.
   *
   * @default false
   */
  refMarkers: false, // 脚注标记;
}

export default optionFootnote

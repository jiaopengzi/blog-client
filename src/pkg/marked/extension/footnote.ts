/*
 * FilePath    : blog-client-nuxt\src\pkg\marked\extension\footnote.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 脚注配置
 */

import type { Options } from "marked-footnote"

const optionFootnote: Options = {
    /**
     * The prefix ID for footnotes.
     *
     * @default 'footnote-'
     */
    prefixId: "footnote-", // 脚注前缀
    /**
     * The description of footnotes, used by `aria-labeledby` attribute.
     *
     * @default 'Footnotes'
     */
    description: "Footnotes", // 脚注描述
    /**
     * If set to `true`, it will place footnote reference in square brackets, like this:
     * `[1]`.
     *
     * @default false
     */
    refMarkers: true, // 脚注标记
}

export default optionFootnote

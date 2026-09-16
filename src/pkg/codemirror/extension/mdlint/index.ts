/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : Markdown Linter 扩展主入口
 */

export { default as createMarkdownLinter, createAutoFixExtension } from "./core"
export { autoFixMarkdownText, lintMarkdownText } from "./service"
export type { MarkdownLintAutofixResult } from "./service"
export * from "./types"

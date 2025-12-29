/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { Diagnostic } from "@codemirror/lint"
import type { Text } from "@codemirror/state"

/**
 * MarkdownLinterOptions 接口定义, 用于配置 Markdown Linter 行为
 */
export interface MarkdownLinterOptions {
    /**
     * 是否启用 Worker 进行 linting
     */
    useWorker?: boolean

    /**
     * rules 配置, 支持多种形式:
     * - false: 禁用规则
     * - true: 启用规则, 使用默认配置
     * - 对象: 传入规则的自定义配置, 会与规则默认配置合并
     */
    rules?: { [ruleId: string]: boolean | Record<string, unknown> }
}

/**
 *  DocLike 类型定义, 提供行数和按行获取文本的方法
 */
export type DocLike = { lines: number; line: (i: number) => { from: number; to: number; text: string } }

/**
 * 通用规则定义：为每个规则提供 id/description/defaultOptions/run
 * - `Opts` 用于更精确地声明规则配置项形状；默认使用 `unknown` 保持灵活性
 */
export type RuleDefinition<Opts = unknown> = {
    /** 规则 id, 例如 'rule001' */
    id: string

    /** 规则的简短说明, 便于在 `types.ts` 中直接阅读规则意图 */
    description?: string

    /** 规则默认配置(可选) */
    defaultOptions?: Opts

    /** 规则执行函数, 返回 `Diagnostic[]` */
    run: (doc: DocLike | Text, opts?: Opts) => Diagnostic[]
}

/**
 * 已知的 Markdown 规则集合接口
 *
 * 说明：
 * - 文件中间的 `// @generated-known-rules-start` `// @generated-known-rules-end`
 *   区域可由项目脚本自动更新(脚本 `scripts/generate-mdlint-rules.js`)。
 * - 若在项目中新增规则文件(例如 `003.ts` / `004.ts`), 运行生成脚本
 *   将自动把规则 id 与注释信息写入此处, 从而在编辑器中获得提示。
 */
export interface MarkdownRules {
    // @generated-known-rules-start
    /**
     * rule001: 规则 001 检测行尾多余空格
     */
    rule001: Record<string, unknown>

    /**
     * rule002: 规则 002 检测行长度超过指定阈值
     */
    rule002: { maxLineLength?: number }

    /**
     * rule003: 规则 003 检测标题级别跳跃, 如从 H1 直接跳到 H3
     */
    rule003: Record<string, unknown>

    /**
     * rule004: 规则 004 检测代码块是否成对闭合, 即 ``` 的数量是否为偶数
     */
    rule004: Record<string, unknown>

    // @generated-known-rules-end
}

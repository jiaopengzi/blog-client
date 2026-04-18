/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { Diagnostic } from "@codemirror/lint"
import type { Text } from "@codemirror/state"

/**
 * 已知的 Markdown 规则集合接口
 *
 * 说明：
 * - 文件中间的 `// @generated-mdlint-rules-start` `// @generated-mdlint-rules-end`
 *   区域可由项目脚本自动更新(脚本 `scripts/generate-mdlint-rules.js`)。
 * - 若在项目中新增规则文件(例如 `003.ts` / `004.ts`), 运行生成脚本
 *   将自动把规则 id 与注释信息写入此处, 从而在编辑器中获得提示。
 */
export interface MarkdownRules {
    // @generated-mdlint-rules-start
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

    /**
     * rule005: 规则 005 检测付费标签是否合法(成对闭合、属性完整、标签前后空行)
     */
    rule005: Record<string, unknown>

    /**
     * rule006: 规则 006 检测 video-player 标签是否合法(成对闭合、属性完整、标签前后空行)
     */
    rule006: Record<string, unknown>

    /**
     * rule007: 规则 007 标题行前后必须有空行
     */
    rule007: Record<string, unknown>

    /**
     * rule008: 规则 008 检测 power-bi 标签是否合法(成对闭合、属性完整、标签前后空行)
     */
    rule008: Record<string, unknown>

    /**
     * rule009: 规则 009 检测 wechat-captcha 标签是否合法(成对闭合、属性完整、标签前后空行)
     */
    rule009: Record<string, unknown>

    /**
     * rule010: 规则 010 检测 login-view 标签是否合法(成对闭合、标签前后空行)
     */
    rule010: Record<string, unknown>

    // @generated-mdlint-rules-end
}

/**
 * 单独导出的规则配置类型，方便复用与导出
 */
export type MarkdownRulesConfig = { [K in keyof MarkdownRules]?: boolean | (MarkdownRules[K] & { enabled?: boolean }) }

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
     * - 对象: 传入规则的自定义配置, 会覆盖默认配置
     */
    rules?: MarkdownRulesConfig
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
    id: keyof MarkdownRules

    /** 规则的简短说明, 便于在 `types.ts` 中直接阅读规则意图 */
    description?: string

    /** 规则默认配置(可选) */
    defaultOptions?: Opts

    /** 规则执行函数, 返回 `Diagnostic[]` */
    run: (doc: DocLike | Text, opts?: Opts) => Diagnostic[]
}

/**
 * 基础上下文, 所有验证上下文共有的字段
 */
export interface BaseContext {
    /** 诊断结果数组, 验证函数将错误/警告 push 到此数组中 */
    diagnostics: Diagnostic[]

    /** 规则来源 ID, 用于标识 Diagnostic.source */
    sourceId: string

    /** 文档对象, 验证时通常需要访问文档内容(如行文本、位置等) */
    doc: DocLike
}

/**
 * 成对标签验证上下文, 用于 validateBlankLinesForPair、validateSingleLineForPair 等函数
 */
export interface PairContext extends BaseContext {
    /** 文档总行数 */
    lineCount: number
    /** 开始标签所在行号 */
    openLine: number
    /** 结束标签所在行号 */
    closeLine: number
    /** 标签名称 */
    tagName: string
    /** 开始标签起始位置 */
    openFrom: number
    /** 开始标签结束位置 */
    openTo: number
    /** 结束标签起始位置 */
    closeFrom: number
    /** 结束标签结束位置 */
    closeTo: number
}

/**
 * 单行标签内容验证上下文, 用于 validateEmptyContent
 */
export interface SingleLineContext extends BaseContext {
    /** 开始标签所在行号 */
    openLine: number
    /** 结束标签所在行号 */
    closeLine: number
    /** 开始标签在行内的起始索引 */
    openFromIndex: number
    /** 开始标签长度 */
    openLength: number
    /** 结束标签在行内的起始索引 */
    closeMatchIndex: number
    /** 标签名称 */
    tagName: string
}

/**
 * 标签内部内容校验上下文, 用于禁止自定义标签嵌套.
 */
export interface InnerContentContext extends BaseContext {
    /** 开始标签所在行号 */
    openLine: number
    /** 结束标签所在行号 */
    closeLine: number
    /** 开始标签在行内的起始索引 */
    openFromIndex: number
    /** 开始标签长度 */
    openLength: number
    /** 结束标签在行内的起始索引 */
    closeMatchIndex: number
    /** 当前外层标签名称 */
    tagName: string
    /** 需要忽略的行号集合, 例如 fenced code block 内的行 */
    ignoredLineNumbers?: Set<number>
    /** 允许嵌套的子标签名称集合, 匹配到这些标签时不报错 */
    allowedTags?: Set<string>
}

/**
 * 标签前后内容验证上下文, 用于 validateNoSurroundingContent
 */
export interface SurroundingContext extends BaseContext {
    /** 当前行文本 */
    lineText: string
    /** 当前行号 */
    lineNum: number
    /** 当前标签在行内的起始索引 */
    matchIndex: number
    /** 当前标签的完整长度 */
    fullLength: number
    /** 标签名称或完整匹配文本 */
    tagOrFullMatch: string
    /** 是否为结束标签 */
    isClosing: boolean
}

/**
 * 属性验证上下文, 用于 validateAttributesForKey 等函数
 */
export interface AttrContext extends BaseContext {
    /** 属性文本 */
    attrsText: string
    /** 开始标签起始位置 */
    openFrom: number
    /** 开始标签结束位置 */
    openTo: number
}

// video-player 标签属性接口
export interface VideoPlayerAttrs {
    "video-type"?: string
    id?: string
    src?: string
    poster?: string
}

// power-bi 标签属性接口
export interface PowerBiAttrs {
    src?: string
    maskcolor?: string
}

export interface WechatCaptchaAttrs {
    name?: string
    codeurl?: string
    key?: string
    reply?: string
}

/**
 * FilePath    : blog-client-dev\src\utils\cssValidator.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : css 校验器
 */

// CSS 校验结果接口
export interface CSSValidationResult {
    isValid: boolean
    errors: string[]
}

/**
 * @description: 验证 CSS 字符串的合法性
 * @param css CSS 字符串
 * @return 是否合法
 */
export function isValidCSS(css: string): CSSValidationResult {
    const result: CSSValidationResult = { isValid: true, errors: [] }

    // 检查是否为字符串
    if (typeof css !== "string") {
        result.isValid = false
        result.errors.push("CSS 必须为字符串。")
        return result
    }

    // 可以为空视为合法
    if (css.trim() === "") return result

    // 检测是否存在不合法的 // 风格注释
    if (/\/\/.*/.test(css)) {
        result.isValid = false
        result.errors.push("检测到不合法的 '//' 注释, 请使用 '/* ... */' 风格的注释。")
        return result
    }

    // 在移除注释前先检查注释起止符是否配对以避免误移除
    const commentErrors = checkPairedMarkers(css, "/*", "*/")
    if (commentErrors.length > 0) {
        result.isValid = false
        result.errors.push("注释未配对, 可能缺少 '/*' 或 '*/'。")
        return result
    }

    // 使用安全移除注释以免影响后续解析
    const withoutComments = removeCommentsSafe(css)

    // 检测逐行中是否存在普通字符串行(非空行但不是 CSS 行)
    const notCssLines = checkNotCssLines(withoutComments)
    if (notCssLines.length > 0) {
        result.isValid = false
        for (const ln of notCssLines) {
            result.errors.push(`无效的 CSS 内容: 第 ${ln.lineNo} 行 -> "${ln.text}"`)
        }
        return result
    }

    // 检查大括号配对情况
    const braceErrors = checkPairedMarkers(withoutComments, "{", "}")
    if (braceErrors.length > 0) {
        result.isValid = false
        for (const e of braceErrors) result.errors.push(e)
    }

    // 逐行解析並检查关键规则
    const lines = withoutComments.split(/\r?\n/)
    let depth = 0

    // 遍历每一行进行校验
    for (let lineNo = 0; lineNo < lines.length; lineNo++) {
        const rawLine = lines[lineNo] || ""
        const line = rawLine.trim()
        if (!line) continue

        // 记录当前行处理前的深度
        const depthBefore = depth

        // 在同一行内可能有多次花括号改变深度, 此处先更新 depth
        for (let i = 0; i < line.length; i++) {
            const ch = line[i]
            if (ch === "{") depth++
            else if (ch === "}") depth--
        }

        // 处理同一行内包含 { 和 } 的内联样式(例如: p { color: red; })
        // 在处理行内内联样式前 检查左花括号前是否有选择器
        const firstBraceIdx = findFirstOutsideString(line, "{")
        if (firstBraceIdx !== -1) {
            const beforeBrace = line.slice(0, firstBraceIdx).trim()
            const prevLineTrim = (lines[lineNo - 1] ?? "").trim()
            const prevLineLooksLikeSelector = prevLineTrim && (/^[.#]?[_a-zA-Z]/.test(prevLineTrim) || prevLineTrim.includes("["))
            if (beforeBrace === "" && !prevLineLooksLikeSelector) {
                result.isValid = false
                result.errors.push(`左花括号前缺少选择器: 第 ${lineNo + 1} 行 -> "${line}"`)
                continue
            }
        }

        // 处理行内内联样式块
        if (line.includes("{") && line.includes("}")) {
            const braceStart = line.indexOf("{")
            const braceEnd = line.lastIndexOf("}")
            const inner = line.slice(braceStart + 1, braceEnd).trim()

            if (inner) {
                // 如果内联块非空则进一步校验内部样式
                // 检测内联块中是否包含嵌套花括号表示嵌套规则
                if (hasBracesOutsideString(inner)) {
                    result.isValid = false
                    result.errors.push(`嵌套规则不被支持: 第 ${lineNo + 1} 行 -> "${line}"`)
                    continue
                }

                // 检测内联块中是否包含中文分号
                if (inner.includes("；")) {
                    result.isValid = false
                    result.errors.push(`使用了中文分号 '；', 请改用英文分号 ';': 第 ${lineNo + 1} 行 -> "${line}"`)
                }

                // 使用字符串安全方式查找分号
                const semicolonPos = findFirstOutsideString(inner, ";")
                if (inner.includes(":") && semicolonPos === -1) {
                    result.isValid = false
                    result.errors.push(`样式未以分号结尾: 第 ${lineNo + 1} 行 -> "${line}"`)
                }

                // 使用公共函数按不在字符串内的分号拆分样式片段
                const parts = splitDeclarationsOutsideStrings(inner)

                // 逐个片段验证属性名与属性值
                for (const part of parts) {
                    // 跳过空白片段
                    if (!part) continue

                    const colonPos = findFirstOutsideString(part, ":")
                    if (colonPos === -1) {
                        result.isValid = false
                        result.errors.push(`无效的样式格式: 第 ${lineNo + 1} 行 -> "${part}"`)
                        continue
                    }

                    // 验证属性名及属性值基本语法
                    const prop = part.slice(0, colonPos).trim()
                    const val = part.slice(colonPos + 1).trim()

                    // 使用公共函数验证属性名与属性值
                    validatePropVal(prop, val, lineNo, line, result)
                }
            }
        }

        // 忽略以 @ 开始的规则如 @media 或 @import
        if (line.startsWith("@")) continue

        // 在块外遇到包含冒号的行但不含左花括号, 需区分是选择器(伪类/伪元素)还是声明
        if (depthBefore === 0 && line.includes(":") && !line.includes("{")) {
            const colonPosOutside = findFirstOutsideString(line, ":")
            if (colonPosOutside !== -1) {
                const before = line.slice(0, colonPosOutside).trim()
                // 声明的属性名通常不包含空格、逗号、选择器符号或伪元素/伪类标记
                const looksLikePropOutside = /^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(before) || /^--[A-Za-z0-9-]+$/.test(before)
                if (!looksLikePropOutside) {
                    // 很可能是选择器包含伪类/伪元素, 忽略
                    continue
                }
            }

            result.isValid = false
            result.errors.push(`块外发现样式(可能缺少选择器或大括号): 第 ${lineNo + 1} 行 -> "${line}"`)
            continue
        }

        // 在块内遇到看起来像选择器的行表示可能缺少闭合 '}' 导致嵌套选择器
        // 放宽检测条件避免误报字符串内容
        const hasBracesOrColons = line.includes("{") || line.includes("}") || line.includes(":")
        const looksLikeSelector = !hasBracesOrColons && (/^[.#]?[a-zA-Z]/.test(line) || /^[.#]?[_a-zA-Z]/.test(line)) && !line.startsWith("@")

        // 只有当前一行存在未闭合的左花括号時才視为嵌套情況
        const prevLineIndex = lineNo - 1
        if (!lines[prevLineIndex]) continue
        const prevLine = prevLineIndex >= 0 ? lines[prevLineIndex].trim() : ""
        const hasPreviousBlock = prevLine.includes("{") && !prevLine.includes("}")

        // 如果在块内且看起来像选择器且前一行有未闭合块则视为嵌套规则
        if (depthBefore > 0 && looksLikeSelector && hasPreviousBlock) {
            result.isValid = false
            result.errors.push(`块内发现疑似选择器(可能缺少 '}'): 第 ${lineNo + 1} 行 -> "${line}"`)
            continue
        }

        // 对块内的样式进行基本校验要求形式为 属性名 : 值 ;
        // 排除选择器行(通常包含花括号或选择器语法), 只在不含花括号的行里检查声明
        if (depthBefore > 0 && line.includes(":") && !line.includes("{") && !line.includes("}")) {
            const colonPos = findFirstOutsideString(line, ":")
            if (colonPos === -1) continue

            // 识别冒号左侧是否像属性名 (排除选择器/伪类/伪元素)
            const possibleLeft = line.slice(0, colonPos).trim()
            const looksLikeProp = /^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(possibleLeft) || /^--[A-Za-z0-9-]+$/.test(possibleLeft)
            if (!looksLikeProp) {
                // 不是属性声明(可能是选择器或伪类/伪元素), 跳过
                continue
            }

            const prop = possibleLeft
            const rest = line.slice(colonPos + 1)

            // 检查是否使用中文分号 '；'
            if (rest.includes("；")) {
                result.isValid = false
                result.errors.push(`使用了中文分号 '；', 请改用英文分号 ';': 第 ${lineNo + 1} 行 -> "${line}"`)
                continue
            }

            // 要求样式以英文分号结尾
            const trimmedRest = rest.trim()
            if (!trimmedRest.endsWith(";")) {
                result.isValid = false
                result.errors.push(`样式未以分号结尾: 第 ${lineNo + 1} 行 -> "${line}"`)
                continue
            }

            // 去掉末尾分号後检查属性值并复用验证逻辑
            const rawValue = rest.trim()
            const value = rawValue.replace(/;\s*$/, "").trim()

            // 使用公共函数验证属性名与属性值
            if (!validatePropVal(prop, value, lineNo, line, result)) continue
        }
    }

    return result
}

/**
 * @description: 检查 CSS 字符串中指定的起止符是否配对(忽略字符串内容)
 * @param css CSS 字符串
 * @param open 起始符
 * @param close 结束符
 * @return 错误信息数组
 */
function checkPairedMarkers(css: string, open: string, close: string): string[] {
    const errors: string[] = []
    let count = 0
    let inString: '"' | "'" | null = null
    let escapeNext = false

    // 遍历字符串逐字符检查
    for (let i = 0; i < css.length; i++) {
        const char = css[i]

        // 处理转义字符
        if (escapeNext) {
            escapeNext = false
            continue
        }
        if (char === "\\") {
            escapeNext = true
            continue
        }

        // 进入或退出字符串状态
        if (char === '"' && inString === null) {
            inString = '"'
            continue
        } else if (char === "'" && inString === null) {
            inString = "'"
            continue
        } else if (char === inString) {
            inString = null
            continue
        }

        // 如果当前在字符串内则跳过标记检测
        if (inString) continue

        // 检查起始标记
        if (css.startsWith(open, i)) {
            count++
            i += open.length - 1
            continue
        }

        // 检查结束标记并处理多余闭合或配对
        if (css.startsWith(close, i)) {
            if (count === 0) {
                errors.push(`发现多余的闭合 '${close}'。`)
            } else {
                count--
            }
            i += close.length - 1
        }
    }

    // 检查未闭合的标记
    if (count > 0) {
        errors.push(`存在未闭合的 '${open}'。`)
    }

    return errors
}

/**
 * 安全移除注释(忽略字符串内的注释样式), 并保证行数和原始字符对齐
 * @param css 要处理的 CSS 字符串
 * @return 去掉注释后的 CSS 字符串
 */
export function removeCommentsSafe(css: string): string {
    // 输出结果字符串
    let out = ""
    let inString: '"' | "'" | null = null
    let escapeNext = false

    // 遍历输入字符串处理注释和字符串字面量
    for (let i = 0; i < css.length; i++) {
        const ch = css[i]

        // 处理转义字符并保留到输出
        if (escapeNext) {
            out += ch
            escapeNext = false
            continue
        }
        if (ch === "\\") {
            // 记录反斜杠并进入转义下一个字符状态
            out += ch
            escapeNext = true
            continue
        }

        // 处理字符串开始与结束并把字符串内容写入输出
        if (ch === '"' || ch === "'") {
            if (inString === null) {
                inString = ch
                out += ch
                continue
            }
            if (inString === ch) {
                inString = null
                out += ch
                continue
            }
            out += ch
            continue
        }

        // 如果不在字符串内且遇到注释起始符則跳过注释内容
        if (inString === null && css.startsWith("/*", i)) {
            // 支持嵌套式注释: 找到注释结束位置，同时统计注释内的换行数以保留行号
            let depth = 1
            let j = i + 2
            let newlineCount = 0
            while (j < css.length && depth > 0) {
                if (css[j] === "\n") newlineCount++

                if (css.startsWith("/*", j)) {
                    depth++
                    j += 2
                    continue
                }

                if (css.startsWith("*/", j)) {
                    depth--
                    j += 2
                    continue
                }

                if (css[j] === "\\") {
                    // 跳过被转义的字符
                    j += 2
                    continue
                }

                j++
            }

            // 将注释区域替换为同样数量的换行符以保留原始行号对齐
            if (newlineCount > 0) out += "\n".repeat(newlineCount)

            // 将主索引移动到注释末尾位置（j 已指向结束后的位置）
            i = Math.max(j - 1, i)
            continue
        }

        out += ch
    }

    return out
}

/**
 * @description: 通用的查找函数, 在字符串外查找第一个匹配字符的位置
 * @param text 要搜索的文本
 * @param predicate 接受单个字符 返回是否匹配
 * @return 匹配字符索引 找不到返回 -1
 */
export function findFirstOutsideByPredicate(text: string, predicate: (ch: string) => boolean): number {
    // 当前是否在字符串内 (记录使用的引号类型)
    let inString: '"' | "'" | null = null

    // 标记下一个字符是否被转义
    let escapeNext = false

    // 逐字符遍历输入文本
    for (let i = 0; i < text.length; i++) {
        const char = text[i] as string

        // 如果前一个字符是反斜杠, 则当前字符被转义, 跳过特殊处理
        if (escapeNext) {
            escapeNext = false
            continue
        }

        // 遇到反斜杠则标记下一个字符为被转义
        if (char === "\\") {
            escapeNext = true
            continue
        }

        // 处理字符串起始与结束：未在字符串时遇到引号进入字符串, 遇到相同引号则退出字符串
        if (char === '"' && inString === null) {
            inString = '"'
            continue
        } else if (char === "'" && inString === null) {
            inString = "'"
            continue
        } else if (char === inString) {
            // 退出当前字符串字面量
            inString = null
            continue
        }

        // 如果当前位于字符串内部, 则忽略该字符的匹配检测
        if (inString) continue

        // 仅在不在字符串内时使用 predicate 检查字符是否匹配目标
        if (predicate(char)) return i
    }

    // 未找到匹配字符则返回 -1
    return -1
}

/**
 * @description: 检测传入 CSS 文本中哪些行看起来不是 CSS(非空但不具有 CSS 行特征)
 * @param css 完整 CSS 文本, 已移除注释
 * @return 非法行数组, 包含行号(1-based)及行文本(已 trim)
 */
export function checkNotCssLines(css: string): Array<{ lineNo: number; text: string }> {
    // 需要返回的结果数组
    const res: Array<{ lineNo: number; text: string }> = []

    // 按照行拆分并逐行检查
    const lines = css.split(/\r?\n/)

    // 将正则提到循环外以提高效率, 判断是否像 CSS 行：@ 规则、包含花括号/分号、包含冒号、常见选择器符号
    const cssLinePattern = /^@|[{};]|:|[.#[]/

    // 遍历每一行进行检测
    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i]
        const line = (raw ?? "").trim()

        // 空行有效, 忽略
        if (line === "") continue

        // 判断是否像 CSS 行：@ 规则、包含花括号/分号、包含冒号、常见选择器符号或逗号分隔
        if (cssLinePattern.test(line)) continue

        // 若都不满足则视为普通字符串行
        res.push({ lineNo: i + 1, text: line })

        // 有错误直接返回不用继续检测, 提高效率
        break
    }

    return res
}

/**
 * @description: 在指定文本中查找第一个不在字符串内的冒号位置
 * @param text 要搜索的文本
 * @param target 要查找的目标字符(如果冒号 ':')
 * @return 找到则返回索引, 否则返回 -1
 */
export function findFirstOutsideString(text: string, target: string): number {
    // 使用通用查找函数 查找不在字符串內的目标字符位置
    return findFirstOutsideByPredicate(text, (ch) => ch === target)
}

/**
 * @description: 查找指定左花括号对应的右花括号位置, 忽略字符串中的花括号.
 * @param text 完整 CSS 文本.
 * @param blockStart 左花括号后第一个字符的位置.
 * @return 对应右花括号索引, 未找到则返回 -1.
 */
export function findMatchingBlockEnd(text: string, blockStart: number): number {
    let depth = 1
    let inString: '"' | "'" | null = null
    let escapeNext = false

    for (let index = blockStart; index < text.length; index++) {
        const char = text[index]

        if (escapeNext) {
            escapeNext = false
            continue
        }

        if (char === "\\") {
            escapeNext = true
            continue
        }

        if (char === '"' || char === "'") {
            if (inString === null) {
                inString = char
            } else if (inString === char) {
                inString = null
            }
            continue
        }

        if (inString) {
            continue
        }

        if (char === "{") {
            depth++
            continue
        }

        if (char === "}") {
            depth--
            if (depth === 0) {
                return index
            }
        }
    }

    return -1
}

/**
 * @description: 检查指定文本中是否存在不在字符串内的花括号({ 或 })
 * @param text 要检查的文本
 * @return 存在返回 true, 否则返回 false
 */
function hasBracesOutsideString(text: string): boolean {
    // 使用通用查找函数 判定是否存在不在字符串內的花括号
    return findFirstOutsideByPredicate(text, (ch) => ch === "{" || ch === "}") !== -1
}

/**
 * @description: 按不在字符串内的英文分号拆分样式片段
 * @param text 要拆分的文本(例如块内内容)
 * @return 去掉首尾空白的片段数组(不包含分号)
 */
function splitDeclarationsOutsideStrings(text: string): string[] {
    const parts: string[] = []
    let cur = ""
    let inString: '"' | "'" | null = null
    let esc = false
    // 遍历文本并根据不在字符串内的分号拆分片段
    for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        // 处理转义字符
        if (esc) {
            cur += ch
            esc = false
            continue
        }
        if (ch === "\\") {
            cur += ch
            esc = true
            continue
        }
        // 处理字符串进入和退出
        if (ch === '"' || ch === "'") {
            if (inString === null) {
                inString = ch
                cur += ch
                continue
            }
            if (inString === ch) {
                inString = null
                cur += ch
                continue
            }
            cur += ch
            continue
        }

        // 如果遇到不在字符串内的分号則分割当前片段
        if (ch === ";" && inString === null) {
            parts.push(cur.trim())
            cur = ""
            continue
        }

        cur += ch
    }

    // 将尾部非空片段加入结果
    if (cur.trim()) parts.push(cur.trim())
    return parts
}

/**
 * @description: 验证属性名格式 允许以 -- 开头的自定义属性 否则按普通属性名规则校验
 * @param prop 属性名
 * @param lineNo 当前行号 用于错误信息
 * @param result 用于收集错误
 * @return 是否合法
 */
function validatePropName(prop: string, lineNo: number, result: CSSValidationResult): boolean {
    // 允许以 -- 开头的 CSS 变量
    if (!/^--[A-Za-z0-9-]+$/.test(prop)) {
        // 普通属性名必须以字母或下划线开头, 后续字符可以是字母、数字、下划线或连字符
        if (!/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(prop)) {
            result.isValid = false
            result.errors.push(`无效的属性名: 第 ${lineNo + 1} 行 -> "${prop}"`)
            return false
        }
    }

    return true
}

/**
 * @description: 验证属性名与属性值的基本语义和格式
 * @param prop 属性名
 * @param val 属性值 已经去掉末尾分号
 * @param lineNo 当前行号 用于错误信息
 * @param line 当前行文本 用于错误信息
 * @param result 校验结果对象 用于收集错误
 * @return 是否通过校验
 */
function validatePropVal(prop: string, val: string, lineNo: number, line: string, result: CSSValidationResult): boolean {
    // 如果值中还包含冒号表示可能缺失分号導致多個聲明黏连
    if (findFirstOutsideString(val, ":") !== -1) {
        result.isValid = false
        result.errors.push(`样式未以分号结尾: 第 ${lineNo + 1} 行 -> "${line}"`)
        return false
    }

    // 校验属性名
    if (!validatePropName(prop, lineNo, result)) return false

    // 检查属性值不能为空
    if (val === "") {
        result.isValid = false
        result.errors.push(`属性值不能为空: 第 ${lineNo + 1} 行 -> "${prop}"`)
        return false
    }

    return true
}

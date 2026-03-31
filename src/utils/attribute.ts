/**
 * FilePath    : blog-client\src\utils\attribute.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 属性处理工具
 */

/**
 * 解析 HTML 标签属性字符串为键值对对象, 支持双引号和单引号包裹的属性值
 * @param attrText - 属性字符串, 例如: 'id="123" title="abc" description="测试"'
 * @returns 属性键值对对象, 例如: { id: "123", title: "abc", description: "测试" }
 */
export function parseAttributes(attrText: string): Record<string, string> {
    // 初始化属性对象
    const attrs: Record<string, string> = {}
    if (!attrText) return attrs

    // 支持属性名中包含字母/数字/下划线/中划线/冒号, 值支持双引号或单引号
    const attrRegex = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
    let m: RegExpExecArray | null

    // 提取所有属性键值对
    while ((m = attrRegex.exec(attrText)) !== null) {
        const key = m[1] as string

        // m[2] 为双引号捕获，m[3] 为单引号捕获
        const val = (m[2] ?? m[3] ?? "") as string

        attrs[key] = val
    }

    return attrs
}

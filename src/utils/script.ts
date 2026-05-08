/**
 * FilePath    : blog-client\src\utils\script.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 脚本加载器
 */

/**
 * 脚本加载选项.
 */
export interface LoadScriptFromStringOptions {
    /**
     * 为本次插入的 script 节点附加的自定义属性.
     */
    scriptAttributes?: Record<string, string>
}

/**
 * 将传入的 HTML 字符串中的 <script> 标签按顺序处理并执行
 * 返回一个 Promise，表示所有脚本是否成功加载和执行
 *
 * @param htmlString 包含脚本标签的 HTML 字符串
 * @param options 脚本加载选项
 * @returns Promise<boolean> 所有脚本成功加载和执行则为 true，否则为 false
 */
export async function loadScriptFromString(htmlString: string, options: LoadScriptFromStringOptions = {}): Promise<boolean> {
    // 创建一个临时容器解析 HTML
    const container = document.createElement("div")
    container.innerHTML = htmlString

    // 查找所有脚本标签
    const scripts = Array.from(container.querySelectorAll("script")) as HTMLScriptElement[]

    // 按顺序处理每个脚本，但对带 async 属性的外链脚本不会阻塞后续执行
    const loadPromises: Promise<boolean>[] = []

    try {
        for (const script of scripts) {
            // 拿到 src、type、async、defer、module 信息
            const src = script.getAttribute("src")
            const type = script.getAttribute("type") || script.type
            const isAsync = script.hasAttribute("async")
            const isDefer = script.hasAttribute("defer")
            const isModule = type === "module"

            if (src) {
                // 避免重复加载同一 src
                if (document.querySelector(`script[src="${src}"]`)) continue

                // 外链脚本：创建新的脚本元素加载
                const p = new Promise<boolean>((resolve, reject) => {
                    const s = document.createElement("script")
                    if (isModule) s.type = "module"
                    if (isAsync) s.async = true
                    if (isDefer) s.defer = true
                    s.src = src

                    // 复制其他属性
                    for (const a of Array.from(script.attributes)) {
                        if (a.name === "src") continue
                        s.setAttribute(a.name, a.value)
                    }

                    applyScriptAttributes(s, options.scriptAttributes)

                    // 监听加载完成或错误
                    s.addEventListener("load", () => resolve(true), { once: true })
                    s.addEventListener("error", () => reject(new Error(`加载脚本失败: ${src}`)), { once: true })

                    document.body.appendChild(s)
                })

                if (isAsync) {
                    // 不阻塞后续脚本，但记录 Promise 以便最终判断是否都成功
                    loadPromises.push(p)
                } else {
                    // 同步等待（按顺序执行）
                    // eslint-disable-next-line no-await-in-loop
                    await p
                }
            } else {
                // 内联脚本：直接创建并插入以执行
                const s = document.createElement("script")
                if (isModule) s.type = "module"
                for (const a of Array.from(script.attributes)) s.setAttribute(a.name, a.value)
                applyScriptAttributes(s, options.scriptAttributes)
                s.text = script.textContent ?? ""

                // 验证语法有效性
                if (!isValidJavaScript(s.text)) {
                    console.error("脚本语法错误, 加载中止, 错误内容: ", s.text)
                    return false
                }

                document.body.appendChild(s)

                // 如果是 module 则等待其完成
                // eslint-disable-next-line no-await-in-loop
                if (isModule) await Promise.resolve()
            }
        }

        // 等待所有非阻塞的外链脚本完成加载
        if (loadPromises.length > 0) {
            const results = await Promise.allSettled(loadPromises)
            for (const r of results) {
                // 有任何一个加载失败则视为失败
                if (r.status === "rejected") return false
            }
        }

        // 清理临时容器
        container.remove()
        return true
    } catch (err) {
        console.error(err)

        // 清理临时容器
        try {
            container.remove()
        } catch {
            // 忽略容器清理异常.
        }
        return false
    }
}

/**
 * 为脚本节点附加自定义属性, 便于后续查询或清理.
 *
 * @param scriptElement 需要附加属性的脚本节点.
 * @param attributes 自定义属性集合.
 * @returns void.
 */
function applyScriptAttributes(scriptElement: HTMLScriptElement, attributes?: Record<string, string>): void {
    if (!attributes) {
        return
    }

    for (const [name, value] of Object.entries(attributes)) {
        scriptElement.setAttribute(name, value)
    }
}

// 在处理内联脚本前，先验证语法
function isValidJavaScript(code: string): boolean {
    try {
        // 使用 new Function 而非 eval 来验证语法，避免执行代码
        const fn = new Function(code)
        void fn
        return true
    } catch {
        return false
    }
}

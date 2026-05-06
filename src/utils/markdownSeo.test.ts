/**
 * FilePath    : blog-client\src\utils\markdownSeo.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : markdownSeo 相关工具函数的单元测试
 */

import { describe, expect, it } from "vitest"

import { extractSeoDescriptionFromMarkdown } from "./markdownSeo"

describe("extractSeoDescriptionFromMarkdown - 提取 SEO 纯文本描述", () => {
    it("跳过 fenced code block, 不把代码内容和复制按钮文案写入 SEO 描述", () => {
        const markdown = [
            "## 安装步骤",
            "",
            "1. 在 windows 终端使用 PowerShell 中输入如下命令：",
            "",
            "    ```powershell",
            "    wsl.exe --install --no-distribution",
            "    ```",
            "",
            "    ![description](https://example.com/a.png)",
            "",
            "3. 根据网络情况不同，大约在两三分钟即可安装完毕。安装完成以后，提示需要重启系统；此时执行重启。",
            "",
            "4. windows 重启后，再次打开终端输入如下命令：",
            "",
            "    ```powershell",
            "    wsl --list --online",
            "    ```",
            "",
            "    可以看到支持安装有效的分发列表，其中包括需要的 Debian。",
        ].join("\n")

        const result = extractSeoDescriptionFromMarkdown(markdown, 200)

        expect(result).toContain("安装步骤")
        expect(result).toContain("在 windows 终端使用 PowerShell 中输入如下命令：")
        expect(result).toContain("根据网络情况不同")
        expect(result).toContain("可以看到支持安装有效的分发列表")
        expect(result).not.toContain("wsl.exe --install --no-distribution")
        expect(result).not.toContain("wsl --list --online")
        expect(result).not.toContain("POWERSHELL")
        expect(result).not.toContain("description")
    })

    it("保留链接文本和内联强调文本, 但跳过图片 alt 文本", () => {
        const markdown = "欢迎阅读 [安装文档](https://example.com), 这里有 **重点** 和 `命令示例`, 还有 ![示意图](https://example.com/demo.png)"

        const result = extractSeoDescriptionFromMarkdown(markdown, 200)

        expect(result).toBe("欢迎阅读 安装文档, 这里有 重点 和 命令示例, 还有")
    })

    it("提取原始 HTML 中可见文本, 并过滤 pre/code/script 等节点", () => {
        const markdown = [
            "<details><summary>点击展开</summary><p>这里是正文</p></details>",
            "<pre><code>const hidden = true</code></pre>",
            "<script>window.alert('ignore')</script>",
            "<pay-read>会员可见说明</pay-read>",
        ].join("\n")

        const result = extractSeoDescriptionFromMarkdown(markdown, 200)

        expect(result).toBe("点击展开 这里是正文 会员可见说明")
    })

    it("按 code point 截断文本, 避免 emoji 被截坏", () => {
        const markdown = "第一段🙂第二段"

        const result = extractSeoDescriptionFromMarkdown(markdown, 4)

        expect(result).toBe("第一段🙂")
    })

    it("提取 customElementsMount 自定义标签正文时保留 inline code, 但忽略属性值与空壳标签", () => {
        const markdown = [
            "<login-view><p>登录后可见 `npm install` 示例</p></login-view>",
            '<wechat-captcha name="焦棚子" codeurl="https://example.com/qrcode.png" key="1120" reply="demo148"><p>扫码后回复 `验证码` 获取内容</p></wechat-captcha>',
            "<pay-read><p>付费阅读里的 `kubectl get pods` 示例</p></pay-read>",
            '<pay-video><p>视频合集说明 `ffmpeg -i input.mp4`</p><video-player video-type="hls" id="m-13"></video-player></pay-video>',
            '<pay-key id="key-1" title="账号密钥" description="不应进入摘要"></pay-key>',
            "<pay-membership></pay-membership>",
            '<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor="#ffffff"></power-bi>',
        ].join("\n")

        const result = extractSeoDescriptionFromMarkdown(markdown, 400)

        expect(result).toContain("登录后可见 npm install 示例")
        expect(result).toContain("扫码后回复 验证码 获取内容")
        expect(result).toContain("付费阅读里的 kubectl get pods 示例")
        expect(result).toContain("视频合集说明 ffmpeg -i input.mp4")
        expect(result).not.toContain("https://example.com/qrcode.png")
        expect(result).not.toContain("demo148")
        expect(result).not.toContain("账号密钥")
        expect(result).not.toContain("不应进入摘要")
        expect(result).not.toContain("abc123")
        expect(result).not.toContain("#ffffff")
        expect(result).not.toContain("m-13")
    })
})

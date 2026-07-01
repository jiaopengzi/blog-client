import { describe, expect, it } from "vitest"

import createMarked from "./new-marked"

describe("createMarked 函数", () => {
    it("应返回同一个共享 Marked 实例", () => {
        const markedA = createMarked()
        const markedB = createMarked()

        expect(markedA).toBe(markedB)
    })

    it("应保持 Markdown 解析能力", () => {
        const html = createMarked().parse("# 标题\n\n`code`").toString()

        expect(html).toContain("<h1")
        expect(html).toContain("标题")
        expect(html).toContain("<code>code</code>")
    })

    it("应保留 shell 语言标识, 并保留空行与逐行 code 节点", () => {
        const html = createMarked()
            .parse(
                [
                    "```shell",
                    "# 下载",
                    "curl -fsSL -o blog-tool.sh https://example.com/tool.sh",
                    "",
                    "# 下载",
                    "sudo bash blog-tool.sh --auto \\",
                    " --domain=example.com",
                    "```",
                ].join("\n"),
            )
            .toString()

        expect(html).toContain('class="copy-button"> SHELL</button>')
        expect(html).toContain('data-lang=" shell"')
        expect(html).toContain('<code><span class="hljs-meta prompt_">#&nbsp;</span><span class="language-bash">下载</span></code>')
        expect(html).toContain('<code data-empty-line="true">&nbsp;</code>')
        expect(html).toContain("<code>sudo&nbsp;bash&nbsp;blog-tool.sh&nbsp;--auto&nbsp;\\</code>")
    })

    it("应保留 shell 高亮的原始语言标识, 并将跨行 span 拆成逐行 code 节点", () => {
        const html = createMarked()
            .parse(
                [
                    "```shell",
                    "# 下载",
                    "curl -fsSL -o blog-tool.sh https://example.com/tool.sh",
                    "",
                    "# 下载",
                    "sudo bash blog-tool.sh --auto \\",
                    " --domain=example.com \\",
                    " --project_name=blog-server",
                    "```",
                ].join("\n"),
            )
            .toString()

        expect(html).toContain('class="pre-code pre-code_nowrap  language-shell"')
        expect(html).toContain('<code><span class="hljs-meta prompt_">#&nbsp;</span><span class="language-bash">下载</span></code>')
        expect(html).toContain('<code data-empty-line="true">&nbsp;</code>')
        expect(html).toContain("<code>sudo&nbsp;bash&nbsp;blog-tool.sh&nbsp;--auto&nbsp;\\</code>")
        expect(html).toContain("<code>&nbsp;--domain=example.com&nbsp;\\</code>")
    })

    it("应将 tip 提示块中的列表与行内 code 渲染在 markdown-alert-tip 容器内", () => {
        const html = createMarked()
            .parse(
                [
                    "> [!TIP]",
                    "> 系列说明：本文是『自建博客系统教程』系列第 5 篇，配套教程共 13 篇，详见文末导航。",
                    ">",
                    "> 这一篇带您把**博客系统**真正跑起来。",
                    ">",
                    ">  三个项目澄清：",
                    ">",
                    '>  - **blog-server**（后端，闭源镜像）+ **blog-client**（前端，MIT 开源）= 您最终用的"博客"',
                    ">  - **blog-tool**（部署工具，MIT 开源）= 帮您把上面两个东西装到服务器上的脚本",
                    ">",
                    ">  普通博主只需要用 `blog-tool` 即可，**不必关心前后端怎么实现**。",
                ].join("\n"),
            )
            .toString()

        expect(html).toContain('class="markdown-alert markdown-alert-tip"')
        expect(html).toContain("<ul>")
        expect(html).toContain("<strong>blog-server</strong>")
        expect(html).toContain("<code>blog-tool</code>")
    })
})

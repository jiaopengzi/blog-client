import { describe, expect, it } from "vitest"

import { scopeCssToSelector, scopeCustomThemeCss } from "./style"

describe("scopeCustomThemeCss", () => {
    it("将默认 light 和 dark 根选择器限制到预设 id", () => {
        const css = `
html.light {
    --jpz-color-primary: #111111;
}

html.dark {
    --jpz-color-primary: #222222;
}
`

        const result = scopeCustomThemeCss(css)

        expect(result).toContain('html[data-theme="light"]')
        expect(result).toContain('html[data-theme="dark"]')
        expect(result).not.toContain("html.light")
        expect(result).not.toContain("html.dark")
    })

    it("将默认 html 根选择器扩展为 light 和 dark 默认预设", () => {
        const css = `
html {
    --jpz-bg-color: #ffffff;
}
`

        const result = scopeCustomThemeCss(css)

        expect(result).toContain('html[data-theme="light"], html[data-theme="dark"]')
        expect(result).not.toContain("html {")
    })

    it("保留非主题选择器, 避免误改文章样式", () => {
        const css = `
#preview h1 {
    color: red;
}
`

        const result = scopeCustomThemeCss(css)

        expect(result).toContain("#preview h1")
        expect(result).toContain("color: red;")
    })

    it("递归处理媒体查询中的默认主题根选择器", () => {
        const css = `
@media (max-width: 768px) {
    html {
        --jpz-bg-color: #ffffff;
    }
}
`

        const result = scopeCustomThemeCss(css)

        expect(result).toContain("@media (max-width: 768px)")
        expect(result).toContain('html[data-theme="light"], html[data-theme="dark"]')
    })
})

describe("scopeCssToSelector", () => {
    it("将 #preview 根选择器改写到指定作用域", () => {
        const css = `
#preview h1 {
    color: red;
}
`

        const result = scopeCssToSelector(css, ".md-page-preview")

        expect(result).toContain(".md-page-preview h1")
        expect(result).not.toContain("#preview h1")
    })

    it("保留媒体查询并递归限制内部选择器", () => {
        const css = `
@media (max-width: 768px) {
    p {
        font-size: 14px;
    }
}
`

        const result = scopeCssToSelector(css, ".md-page-preview")

        expect(result).toContain("@media (max-width: 768px)")
        expect(result).toContain(".md-page-preview p")
    })

    it("保留 keyframes 定义, 避免错误改写百分比选择器", () => {
        const css = `
@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
`

        const result = scopeCssToSelector(css, ".md-page-preview")

        expect(result).toContain("@keyframes fade-in")
        expect(result).toContain("from {")
        expect(result).toContain("to {")
        expect(result).not.toContain(".md-page-preview from")
    })
})

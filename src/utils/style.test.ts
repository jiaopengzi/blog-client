import { describe, expect, it } from "vitest"

import { scopeCustomThemeCss } from "./style"

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

import { defineConfig } from "oxlint"

export default defineConfig({
    // 启用的插件列表, 当前保持为空并使用内置规则集.
    plugins: [],
    categories: {
        // correctness: 正确性相关规则分组, 关注潜在逻辑错误.
        correctness: "warn",
        // suspicious: 可疑代码模式分组, 关注高风险写法.
        suspicious: "warn",
        // perf: 性能相关规则分组, 提醒可能的性能问题.
        perf: "warn",
    },
    rules: {
        // 禁止未使用变量, 用于及时发现无效参数或无效导入.
        "eslint/no-unused-vars": "error",
        // 允许 console 输出, 便于开发调试.
        "no-console": "off",
        // 禁止 debugger 语句, 防止调试断点进入生产代码.
        "no-debugger": "error",
        // 强制使用全等/非全等比较, 避免隐式类型转换.
        eqeqeq: "error",
        // 禁止使用 var, 统一使用 let/const.
        "no-var": "error",
        // 空代码块告警, 提醒补充处理逻辑或说明.
        "no-empty": "warn",
        // 禁止恒定条件表达式, 避免无效分支或死循环.
        "no-constant-condition": "error",
        // 禁止 switch 中重复 case, 防止分支覆盖.
        "no-duplicate-case": "error",
        // 禁止 case 穿透, 避免遗漏 break 导致逻辑错误.
        "no-fallthrough": "error",
        // 禁止与自身比较, 避免无意义判断.
        "no-self-compare": "error",
        // 普通字符串中模板占位符告警, 避免误写 ${}.
        "no-template-curly-in-string": "warn",
        // 禁止不可达代码, 避免冗余逻辑残留.
        "no-unreachable": "error",
        // 禁止不安全的取反操作, 避免优先级陷阱.
        "no-unsafe-negation": "error",
        // 强制正确使用 isNaN, 避免 NaN 判断错误.
        "use-isnan": "error",
        // 强制 typeof 比较合法值, 避免拼写错误.
        "valid-typeof": "error",
    },
    env: {
        // 启用内置全局环境变量集合.
        builtin: true,
    },
    globals: {
        // 浏览器全局对象, 仅允许读取.
        window: "readonly",
        // 文档对象模型入口, 仅允许读取.
        document: "readonly",
        // 网络请求 API, 仅允许读取.
        fetch: "readonly",
        // 本地持久存储, 仅允许读取.
        localStorage: "readonly",
        // 会话存储, 仅允许读取.
        sessionStorage: "readonly",
        // 表单数据构造器, 仅允许读取.
        FormData: "readonly",
        // URL 查询参数构造器, 仅允许读取.
        URLSearchParams: "readonly",
        // 浏览器提示框 API, 仅允许读取.
        alert: "readonly",
        // 浏览器确认框 API, 仅允许读取.
        confirm: "readonly",
    },
    // 忽略匹配路径, 避免对依赖与产物文件进行 lint.
    ignorePatterns: ["node_modules/", "dist/", "*.min.js"],
})

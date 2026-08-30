/*
 * FilePath    : blog-client-nuxt\oxlint.config.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : oxlint 代码检查配置
 */

/*
 * 补充说明:
 * categories 的 correctness / suspicious / perf 为分组开关, 会整组启用对应分类下全部规则;
 * pedantic / style / restriction / nursery 默认关闭, 其中高价值且当前零命中的规则在 rules
 * 中逐条启用(260830-02 补齐), 便于在不引入存量告警的前提下扩大检查面。
 */

import { defineConfig } from "oxlint"

export default defineConfig({
    // 启用的插件列表.
    plugins: ["unicorn", "typescript", "oxc", "vue", "eslint"],

    categories: {
        // correctness: 正确性相关规则分组, 关注潜在逻辑错误.
        correctness: "warn",
        // suspicious: 可疑代码模式分组, 关注高风险写法.
        suspicious: "warn",
        // perf: 性能相关规则分组, 提醒可能的性能问题.
        perf: "warn",
        // pedantic: 细节相关规则分组, 提醒代码风格和最佳实践.
        pedantic: "off",
    },
    rules: {
        // 禁止未使用变量, 用于及时发现无效参数或无效导入.
        "eslint/no-unused-vars": "warn",
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
        // 关闭变量声明与外部作用域同名的规则, 允许合理的变量遮蔽.
        "no-shadow": "off",
        // ofetch 的 FetchResponse/FetchError 内部字段 _data 按官方 API 使用, 允许下划线.
        "no-underscore-dangle": ["warn", { allow: ["_data"] }],

        // ---------- eslint: pedantic ----------
        // 只写不读的 getter 需配套 setter, 避免属性赋值静默失败.
        "eslint/accessor-pairs": "warn",
        // 限制回调嵌套层数, 嵌套过深应拆分或改用 async/await.
        "eslint/max-nested-callbacks": "warn",
        // 禁止 new Array() 构造数组, 统一用字面量避免单参歧义.
        "eslint/no-array-constructor": "warn",
        // 构造函数不返回值, 返回值会被 new 表达式忽略.
        "eslint/no-constructor-return": "warn",
        // 函数声明不写在嵌套块内, 避免提升语义与浏览器差异.
        "eslint/no-inner-declarations": "warn",
        // 循环内定义的函数不引用会变化的循环变量, 闭包捕获易出错.
        "eslint/no-loop-func": "warn",
        // 禁止 new String/Number/Boolean 包装对象, 避免 typeof 判断失准.
        "eslint/no-new-wrappers": "warn",
        // 禁止 new Object() 构造对象, 统一用字面量.
        "eslint/no-object-constructor": "warn",
        // 抛出的一定是 Error 实例, 否则拿不到堆栈.
        "eslint/no-throw-literal": "warn",
        // reject 时传递 Error 实例, 便于调用方捕获堆栈.
        "eslint/prefer-promise-reject-errors": "warn",
        // Symbol 描述必须显式传入, 便于调试时辨识.
        "eslint/symbol-description": "warn",

        // ---------- eslint: style ----------
        // switch 的 default 分支放在最后, 保持阅读顺序一致.
        "eslint/default-case-last": "warn",
        // 函数/方法名与赋值的变量名保持一致, 便于堆栈定位.
        "eslint/func-name-matching": "warn",
        // 同类访问器 (get/set) 写在一起, 避免遗漏配对.
        "eslint/grouped-accessor-pairs": "warn",
        // 禁止多余的独立代码块, 通常是重构残留.
        "eslint/no-lone-blocks": "warn",
        // 禁止链式赋值, 中间变量易被误改且可读性差.
        "eslint/no-multi-assign": "warn",
        // 禁止多行字符串的隐式拼接, 统一用模板字符串.
        "eslint/no-multi-str": "warn",
        // 禁止在 return 中赋值, 副作用难以察觉.
        "eslint/no-return-assign": "warn",
        // 禁止恒定的计算属性名, 直接用字面量即可.
        "eslint/no-useless-computed-key": "warn",
        // 不再重新赋值的变量用 const 声明, 明确不可变语义.
        "eslint/prefer-const": "warn",
        // 进制数用字面量 (0b/0o/0x) 书写, 不用 parseInt 转换.
        "eslint/prefer-numeric-literals": "warn",
        // 静态正则用字面量, 避免每次执行重新编译.
        "eslint/prefer-regex-literals": "warn",
        // 用剩余参数替代 arguments, 类型是真数组且可读.
        "eslint/prefer-rest-params": "warn",
        // 用扩展运算符替代 apply 调用.
        "eslint/prefer-spread": "warn",
        // 常量写在比较左侧 (yoda 风格之外), 保持自然语序.
        "eslint/yoda": "warn",

        // ---------- eslint: restriction ----------
        // 禁止 alert/confirm/prompt, 交互统一走 Element Plus 组件.
        "eslint/no-alert": "warn",
        // 禁止 == null 的宽松比较, 用 === 显式区分 null 与 undefined.
        "eslint/no-eq-null": "warn",
        // 禁止隐式创建全局变量, 变量必须先声明.
        "eslint/no-implicit-globals": "warn",
        // 禁止使用 __proto__, 用 Object.getPrototypeOf 替代.
        "eslint/no-proto": "warn",
        // 正则中多个空格用 {n} 计数, 避免被格式化吞掉.
        "eslint/no-regex-spaces": "warn",
        // 禁止逗号表达式, 拆成独立语句更清晰.
        "eslint/no-sequences": "warn",
        // 源文件不带 BOM, 避免解析出不可见字符.
        "eslint/unicode-bom": "warn",

        // ---------- oxc: restriction ----------
        // 禁止可疑的位运算符用法 (如 & 写成 &&).
        "oxc/bad-bitwise-operator": "warn",
        // 禁止 const enum, 非isolatedModules 场景下行为不一致.
        "oxc/no-const-enum": "warn",

        // ---------- typescript: pedantic ----------
        // 禁止 @ts-ignore, 需说明原因时用 @ts-expect-error.
        "typescript/ban-ts-comment": "warn",
        // 禁止使用已标记为 @deprecated 的 API.
        "typescript/no-deprecated": "warn",
        // 禁止混用数字枚举与字符串枚举, 语义不一致.
        "typescript/no-mixed-enums": "warn",
        // 只抛出 Error 及其子类, 保证 catch 到的是错误对象.
        "typescript/only-throw-error": "warn",
        // 判断元素存在用 includes, 不用 indexOf 比较下标.
        "typescript/prefer-includes": "warn",
        // 默认值用 ?? 表达, 避免 || 吞掉 0 与空字符串.
        "typescript/prefer-nullish-coalescing": "warn",
        // Promise.reject 传入 Error 实例, 便于调用方捕获堆栈.
        "typescript/prefer-promise-reject-errors": "warn",
        // 类型错误断言用 @ts-expect-error, 类型恢复后会自动报错提醒清理.
        "typescript/prefer-ts-expect-error": "warn",
        // getter/setter 成对出现且类型一致.
        "typescript/related-getter-setter-pairs": "warn",
        // async 函数内必须有 await, 否则无需声明为 async.
        "typescript/require-await": "warn",
        // async 函数中返回 Promise 时用 return await, 保留完整堆栈.
        "typescript/return-await": "warn",
        // 联合类型上的 switch 必须穷尽所有分支.
        "typescript/switch-exhaustiveness-check": "warn",

        // ---------- typescript: style ----------
        // 同名重载的声明紧邻放置, 便于对照.
        "typescript/adjacent-overload-signatures": "warn",
        // 禁止残留的 tslint 注释.
        "typescript/ban-tslint-comment": "warn",
        // 类型断言风格统一用 as, 不用尖括号.
        "typescript/consistent-type-assertions": "warn",
        // 类型导出统一用 export type, 避免运行时残留导入.
        "typescript/consistent-type-exports": "warn",
        // 能用点号访问就不用下标字符串, 便于重命名与类型检查.
        "typescript/dot-notation": "warn",
        // 已在作用域内的类型不重复写命名空间前缀.
        "typescript/no-unnecessary-qualifier": "warn",
        // 取首个匹配项用 find, 不用 filter(...)[0].
        "typescript/prefer-find": "warn",
        // 未被重新赋值的私有成员声明为 readonly.
        "typescript/prefer-readonly": "warn",
        // reduce 显式声明累加器类型, 避免推导成 never.
        "typescript/prefer-reduce-type-parameter": "warn",
        // 取全部匹配用 matchAll/regexp.exec, 不用带 /g 的 String.match.
        "typescript/prefer-regexp-exec": "warn",
        // 链式调用返回 this 的方法显式标注 this 类型, 保证子类链不断裂.
        "typescript/prefer-return-this-type": "warn",

        // ---------- typescript: restriction ----------
        // 空对象类型用 Record<string, unknown> 等明确写法表达.
        "typescript/no-empty-object-type": "warn",
        // 禁止 namespace, 统一用 ES 模块.
        "typescript/no-namespace": "warn",
        // 已非空断言的值不再接 ??, 语义重复.
        "typescript/no-non-null-asserted-nullish-coalescing": "warn",
        // 禁止 require() 导入, 统一用 import.
        "typescript/no-require-imports": "warn",
        // 禁止 const x = require(), 统一用 import.
        "typescript/no-var-requires": "warn",
        // 缩小类型的断言用括号形式, 不用后置非空断言.
        "typescript/non-nullable-type-assertion-style": "warn",
        // 枚举成员值用字面量, 不用计算表达式.
        "typescript/prefer-literal-enum-member": "warn",
        // catch 回调参数类型为 unknown, 使用前先收窄.
        "typescript/use-unknown-in-catch-callback-variable": "warn",

        // ---------- unicorn: pedantic ----------
        // assert 的断言条件与错误信息保持对应.
        "unicorn/consistent-assert": "warn",
        // 空数组展开统一写法, 避免 [...[]] 这类冗余.
        "unicorn/consistent-empty-array-spread": "warn",
        // 转义用 \u 形式, 不用十六进制 \x.
        "unicorn/no-hex-escape": "warn",
        // 判断数组用 Array.isArray, instanceof 跨 realm 会失效.
        "unicorn/no-instanceof-array": "warn",
        // 不等判断放在肯定分支, 减少双重否定.
        "unicorn/no-negation-in-equality-check": "warn",
        // 禁止 new Buffer(), 已废弃且不安全.
        "unicorn/no-new-buffer": "warn",
        // 只有静态成员的类改用普通对象.
        "unicorn/no-static-only-class": "warn",
        // 不把 this 赋值给变量, 用箭头函数保留上下文.
        "unicorn/no-this-assignment": "warn",
        // flat() 的深度参数不超过实际嵌套层数.
        "unicorn/no-unnecessary-array-flat-depth": "warn",
        // splice 的删除个数参数不写多余的 Infinity/超大值.
        "unicorn/no-unnecessary-array-splice-count": "warn",
        // slice 的结束下标不写多余的数组长度.
        "unicorn/no-unnecessary-slice-end": "warn",
        // IIFE 的调用括号写在包裹括号内, 提升可读性.
        "unicorn/no-unreadable-iife": "warn",
        // 空 case 不写成 fallthrough, 直接并列 case.
        "unicorn/no-useless-switch-case": "warn",
        // 二维数组拍平用 flat(), 不用 reduce 拼接.
        "unicorn/prefer-array-flat": "warn",
        // 判断存在性用 some, 不用 filter().length > 0.
        "unicorn/prefer-array-some": "warn",
        // 用 import.meta.url/dirname 等标准属性替代手工解析.
        "unicorn/prefer-import-meta-properties": "warn",
        // 取整用 Math.trunc, 语义比位运算清晰.
        "unicorn/prefer-math-trunc": "warn",
        // 调用原型方法用实例方法, 不绕 Object.prototype.
        "unicorn/prefer-prototype-methods": "warn",
        // toFixed 显式传入小数位数, 避免依赖默认值.
        "unicorn/require-number-to-fixed-digits-argument": "warn",

        // ---------- unicorn: style ----------
        // 自定义错误类必须传 name, 便于错误类型辨识.
        "unicorn/custom-error-definition": "warn",
        // new Error 必须传入错误信息.
        "unicorn/error-message": "warn",
        // setTimeout/setInterval 显式传入延迟时间.
        "unicorn/explicit-timer-delay": "warn",
        // 大整数用 0n 字面量, 不用 BigInt() 调用.
        "unicorn/prefer-bigint-literals": "warn",
        // 构造函数中赋值的成员用类字段声明, 不在构造器里挂属性.
        "unicorn/prefer-class-fields": "warn",
        // 切换 class 用 classList.toggle, 不用 add/remove 组合.
        "unicorn/prefer-classlist-toggle": "warn",
        // 键盘判断用 event.key, 不用已废弃的 keyCode.
        "unicorn/prefer-keyboard-event-key": "warn",
        // 取末尾元素用 at(-1), 不用 arr[arr.length - 1].
        "unicorn/prefer-negative-index": "warn",
        // 键值对数组转对象用 Object.fromEntries, 不用 reduce.
        "unicorn/prefer-object-from-entries": "warn",
        // 去空格用 trimStart/trimEnd, 不用非标准的 trimLeft/trimRight.
        "unicorn/prefer-string-trim-start-end": "warn",
        // join 显式传入分隔符, 避免依赖默认逗号.
        "unicorn/require-array-join-separator": "warn",
        // switch 的 break 缩进位置统一.
        "unicorn/switch-case-break-position": "warn",
        // 抛错必须带 new, 否则 Error 不会记录堆栈.
        "unicorn/throw-new-error": "warn",

        // ---------- unicorn: restriction ----------
        // 默认导出需具名, 便于调试与重构时定位.
        "unicorn/no-anonymous-default-export": "warn",
        // 禁止直接读写 document.cookie, 统一走封装.
        "unicorn/no-document-cookie": "warn",
        // slice 的结束下标不用数组长度, 省略即可.
        "unicorn/no-length-as-slice-end": "warn",
        // flat 的深度参数用具体数字, 不用 Infinity 这类魔法值.
        "unicorn/no-magic-array-flat-depth": "warn",
        // 禁止 process.exit(), 用返回码或抛错让调用方决定.
        "unicorn/no-process-exit": "warn",
        // 用现代 Math API (如 Math.hypot/cbrt) 替代手工计算.
        "unicorn/prefer-modern-math-apis": "warn",
        // 统一用 ESM 语法, 不用 CommonJS 的 module.exports.
        "unicorn/prefer-module": "warn",
        // 内置模块导入带 node: 协议前缀.
        "unicorn/prefer-node-protocol": "warn",

        // ---------- vue: style ----------
        // defineProps 声明风格统一, 避免数组与对象形式混用.
        "vue/define-props-declaration": "warn",
        // props 命名统一小驼峰, 模板里再用短横线形式.
        "vue/prop-name-casing": "warn",
        // 组件导出必须是直接声明, 便于静态分析.
        "vue/require-direct-export": "warn",
        // props 必须显式声明类型, 便于运行时校验与类型推导.
        "vue/require-prop-types": "warn",

        // ---------- vue: restriction ----------
        // 不在组件内导入编译器宏, 宏由编译期注入.
        "vue/no-import-compiler-macros": "warn",
        // 不使用多参数插槽 API, Vue 3 已改为单对象参数.
        "vue/no-multiple-slot-args": "warn",
    },
    env: {
        es6: true,
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
    ignorePatterns: ["node_modules/", "dist/", ".nuxt/", ".output/", "*.min.js", "src/components/common/icons/assets/"],
})

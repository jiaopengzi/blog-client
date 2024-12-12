/*
 * @File           :   blog-client\.prettierrc.js
 * @Description    :   Prettier配置文件
 */

export default {
    $schema: "https://json.schemastore.org/prettierrc",
    semi: false, // 不使用分号
    tabWidth: 4, // 使用4个空格缩进
    singleQuote: false, // 使用单引号
    printWidth: 100, // 每行最大长度为100个字符
    trailingComma: "all", // 保留尾随逗号
    useTabs: false, // 制表符使用空格
    endOfLine: "auto", // 结尾换行符
    bracketSpacing: true, // 对象大括号带空格
    arrowParens: "always", // 箭头符号参数始终带括号
}

/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 09:39:15
 * @FilePath     : \blog-client\eslint.config.js
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import pluginVue from "eslint-plugin-vue"
import vueTsEslintConfig from "@vue/eslint-config-typescript"
import pluginVitest from "@vitest/eslint-plugin"
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting"

export default [
    {
        name: "app/files-to-lint",
        files: ["**/*.{ts,mts,tsx,vue}"],
    },

    {
        name: "app/files-to-ignore",
        ignores: [
            "**/dist/**",
            "**/dist-ssr/**",
            "**/coverage/**",
            "**/node_modules/**",
            "**/src/components/common/icons/assets/**",
        ],
    },

    ...pluginVue.configs["flat/essential"],
    ...vueTsEslintConfig(),

    {
        ...pluginVitest.configs.recommended,
        files: ["src/**/__tests__/*"],
    },
    skipFormatting,

    {
        rules: {
            "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
            // "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
]

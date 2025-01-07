import pluginVitest from "@vitest/eslint-plugin"
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting"
import vueTsEslintConfig from "@vue/eslint-config-typescript"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import pluginVue from "eslint-plugin-vue"

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
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
            // "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
]

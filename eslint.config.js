import pluginVue from "eslint-plugin-vue"
import vueTsEslintConfig from "@vue/eslint-config-typescript"
import pluginVitest from "@vitest/eslint-plugin"
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting"

export default [
    {
        ignores: [
            "**/package.json",
            "dist/*",
            "node_modules/*",
            "src/components/common/icons/assets/*",
        ],
    },

    {
        name: "app/files-to-lint",
        files: ["**/*.{ts,mts,tsx,vue}"],
    },

    {
        name: "app/files-to-ignore",
        ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
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
        },
    },
]

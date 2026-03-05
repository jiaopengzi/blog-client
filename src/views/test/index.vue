<template>
    <!-- 编辑器 -->
    <div class="content">
        <EditorCodemirror ref="codemirrorRef" doc="这是一个测试内容" height="400px" :theme="mdLightTheme" />
    </div>
</template>
<script setup lang="ts">
defineOptions({ name: "MyTest" })
import EditorCodemirror from "@/components/editor/components/codemirror"
import { getTheme, Theme, ThemeMode } from "@/pkg/codemirror/extension/theme"

const mdLightTheme = getTheme(Theme.MD, ThemeMode.Light)
</script>

<style scoped lang="scss">
.content {
    padding: 20px;
}
</style>

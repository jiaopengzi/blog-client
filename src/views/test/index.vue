<!--
 * FilePath    : blog-client-dev\src\views\test\index.vue
-->
<template>
    <div id="preview-test"></div>
</template>
<script setup lang="ts">
defineOptions({ name: "MyTest" })
import { isValidCSS } from "@/utils/cssValidator"

/* 用户自定义 CSS */
const userCSSString = `
html ::-webkit-scrollbar-thumb {
  background-color: #cccccc;
}

@media (min-width: 1220px) {
  html ::-webkit-scrollbar {
    width: 10px;
    height: 12px;
  }
}

.md-toc h4:hover,
.md-toc h5:hover,
.md-toc h6:hover {
  text-decoration: underline;
}
`

const { isValid, errors } = isValidCSS(userCSSString)
if (isValid) {
    console.info("good css")
} else {
    console.error("Errors:", "\n" + errors.join("\n"))
}
</script>

<style scoped lang="scss">
#preview-test {
    width: 300px;
    height: 200px;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

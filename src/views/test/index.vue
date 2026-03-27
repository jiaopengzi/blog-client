<!--
 * FilePath    : blog-client-dev\src\views\test\index.vue
 * Description : 
-->
<template>
    <JEditor :state-manager="stateManager" :is-enable-copy-cache="false" />
</template>
<script lang="ts" setup>
import { EditorStateManager } from "@/components/editor"
import JEditor from "@/components/editor/index.vue"

defineOptions({ name: "DemoTest" })

const stateManager = new EditorStateManager()
</script>

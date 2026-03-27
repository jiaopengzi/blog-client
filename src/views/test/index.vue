<!--
 * FilePath    : blog-client\src\components\common\post-upsert\index.vue
-->
<template>
    <JEditor :state-manager="stateManager" :is-enable-copy-cache="true" :is-admin-video="true" />
</template>
<script lang="ts" setup>
import { EditorStateManager } from "@/components/editor"
import JEditor from "@/components/editor/index.vue"

defineOptions({ name: "PostUpsert" })

const stateManager = new EditorStateManager()
</script>

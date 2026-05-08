<!--
 * FilePath    : blog-client\src\views\test\index.vue
 * Description : 
-->
<template>
    <JEditor :state-manager="stateManager" :is-enable-copy-cache="false" />

    <FooterStatistics v-if="optionsStore.isShowFooterStatistics" />
</template>
<script lang="ts" setup>
import { EditorStateManager } from "@/components/editor"
import FooterStatistics from "@/components/layout/footer-statistics"
import { useOptionsStore } from "@/stores/options"
import JEditor from "@/components/editor/index.vue"

defineOptions({ name: "DemoTest" })

const optionsStore = useOptionsStore()
const stateManager = new EditorStateManager()
</script>

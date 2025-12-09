<!--
 * FilePath    : blog-client-dev\src\views\test\index.vue
-->
<template>
    <div id="preview-test">
        <VolumeBar :volume="50" />
    </div>
</template>
<script setup lang="ts">
defineOptions({ name: "MyTest" })
import VolumeBar from "@/components/player/components/volume-bar"
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

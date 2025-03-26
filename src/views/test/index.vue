<template>
    <div>
        <TestProvide />
    </div>
</template>
<script setup lang="ts">
import { inject, watch } from "vue"

import TestProvide from "./provide.vue"
defineOptions({ name: "MyTest" })
const isTestProvide = inject<boolean>("TestProvideKey")
watch(
    () => isTestProvide,
    (newVal: boolean | undefined) => {
        console.log("============>", newVal)
    },
    { immediate: true },
)
</script>

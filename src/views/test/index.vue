<template>
    <div class="selects">
        <IconInput v-model="icon" />
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue"

import IconInput from "@/components/common/icon-input"
import { checkIconKeys } from "@/components/common/icons"
defineOptions({ name: "MyTest" })
const icon = ref("")
watch(
    () => icon.value,
    (newVal) => {
        const isIconKey = checkIconKeys(newVal)
        console.log("===========>is", isIconKey)
    },
)
</script>

<style scoped lang="scss">
// .select {
//     width: 200px;
//     height: 200px;
// }
</style>

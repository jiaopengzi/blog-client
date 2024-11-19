<template>
    <div class="range-selector">
        <label for="min-value">最小值:</label>
        <input
            type="number"
            id="min-value"
            v-model.number="minValue"
            :min="minRange"
            :max="maxRange"
            @input="validateMinValue"
        />

        <label for="max-value">最大值:</label>
        <input
            type="number"
            id="max-value"
            v-model.number="maxValue"
            :min="minRange"
            :max="maxRange"
            @input="validateMaxValue"
        />

        <div class="range-value">选择的区间: {{ minValue }} - {{ maxValue }}</div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

// 定义最小和最大范围
const minRange = ref(100)
const maxRange = ref(1000)

// 定义当前选择的最小值和最大值
const minValue = ref(minRange.value)
const maxValue = ref(maxRange.value)

// 验证最小值
const validateMinValue = () => {
    if (minValue.value < minRange.value) {
        minValue.value = minRange.value
    }
    if (minValue.value > maxValue.value) {
        minValue.value = maxValue.value
    }
}

// 验证最大值
const validateMaxValue = () => {
    if (maxValue.value > maxRange.value) {
        maxValue.value = maxRange.value
    }
    if (maxValue.value < minValue.value) {
        maxValue.value = minValue.value
    }
}
</script>

<style scoped lang="scss">
.range-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;

    label {
        margin-top: 10px;
        font-size: 1.2em;
    }

    input[type="number"] {
        width: 100px;
        margin-bottom: 10px;
        text-align: center;
    }

    .range-value {
        margin-top: 20px;
        font-size: 1.2em;
        color: #333;
    }
}
</style>

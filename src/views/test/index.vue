<template>
    <chart-bar-basic :title="title" :data="data" :width="width" :height="height" />
</template>
<script setup lang="ts">
import ChartBarBasic from "@/components/common/chart-bar-basic"
defineOptions({ name: "MyTest" })

const title = "当月"
const data = [
    { label: "01", value: 80 },
    { label: "02", value: 65 },
    { label: "03", value: 90 },
    { label: "04", value: 45 },
    { label: "05", value: 70 },
    { label: "06", value: 100 },
    { label: "07", value: 55 },
    // { label: "08", value: 75 },
    // { label: "09", value: 85 },
    // { label: "10", value: 60 },
    // { label: "11", value: 95 },
    // { label: "12", value: 50 },
    // { label: "13", value: 50 },
    // { label: "14", value: 80 },
    // { label: "15", value: 40 },
    // { label: "16", value: 70 },
    // { label: "17", value: 90 },
    // { label: "18", value: 60 },
    // { label: "19", value: 100 },
    // { label: "20", value: 55 },
    // { label: "21", value: 75 },
    // { label: "22", value: 85 },
    // { label: "23", value: 60 },
    // { label: "24", value: 95 },
    // { label: "25", value: 50 },
    // { label: "26", value: 80 },
    // { label: "27", value: 65 },
    // { label: "28", value: 90 },
    // { label: "29", value: 45 },
    // { label: "30", value: 70 },
    // { label: "31", value: 100 },
]
const width = 1000
const height = 200
</script>

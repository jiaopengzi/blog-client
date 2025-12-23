<template>
    <div class="my-test">
        <RadioGroup v-model="selectedValue" :options="options" title="字幕" />
        <RadioGroup v-model="selectedValue1" :options="options1" title="倍速" />
        <RadioGroup v-model="selectedValue2" :options="options2" title="清晰度" />
        <RadioGroup v-model="selectedValue3" :options="options3" title="播放" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

import RadioGroup from "@/components/player/components/setting/radio-group"

defineOptions({ name: "MyTest" })

const selectedValue = ref<string | number>("zh-CN")

const options = [
    { label: "简体中文", value: "zh-CN" },
    { label: "English(US)", value: "en-US" },
    { label: "Français", value: "fr-FR" },
    // { label: "Deutsch", value: "de-DE" },
    // { label: "Español", value: "es-ES" },
    // { label: "Italiano", value: "it-IT" },
    // { label: "日本語", value: "ja-JP" },
    // { label: "한국어", value: "ko-KR" },
    // { label: "Русский", value: "ru-RU" },
    // { label: "Português", value: "pt-PT" },
    // { label: "Nederlands", value: "nl-NL" },
    // { label: "Svenska", value: "sv-SE" },
    // { label: "Dansk", value: "da-DK" },
    // { label: "Suomi", value: "fi-FI" },
    // { label: "Norsk", value: "no-NO" },
    // { label: "Polski", value: "pl-PL" },
    // { label: "Türkçe", value: "tr-TR" },
    // { label: "Čeština", value: "cs-CZ" },
    // { label: "Magyar", value: "hu-HU" },
    // { label: "Ελληνικά", value: "el-GR" },
    // { label: "עברית", value: "he-IL" },
    // { label: "العربية", value: "ar-SA" },
    // { label: "Tiếng Việt", value: "vi-VN" },
    // { label: "Bahasa Indonesia", value: "id-ID" },
    { label: "禁用", value: "disabled" },
]

const selectedValue1 = ref<string | number>("1.0")

const options1 = [
    { label: "0.25", value: "0.25" },
    { label: "0.5", value: "0.5" },
    { label: "0.75", value: "0.75" },
    { label: "1.0", value: "1.0" },
    { label: "1.25", value: "1.25" },
    { label: "1.5", value: "1.5" },
    { label: "2.0", value: "2.0" },
]
const selectedValue2 = ref<string | number>("1080p")
const options2 = [
    { label: "144p", value: "144p" },
    { label: "240p", value: "240p" },
    { label: "360p", value: "360p" },
    { label: "480p", value: "480p" },
    { label: "720p", value: "720p" },
    { label: "1080p", value: "1080p" },
    { label: "2K", value: "2K" },
    { label: "4K", value: "4K" },
]
const selectedValue3 = ref<string | number>("play")
const options3 = [
    { label: "单曲", value: "pause" },
    { label: "循环", value: "play" },
]
</script>

<style scoped lang="scss">
.my-test {
    padding: 20px;
    width: 200px;
    height: 200px;
    // 自动显示滚动条
    overflow: auto;
}
</style>

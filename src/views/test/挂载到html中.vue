<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-23 15:33:23
 * @FilePath     : \blog-client\src\views\test\挂载到html中.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div id="preview" v-html="myHtml"></div>
</template>

<script setup lang="ts">
import "@/assets/scss/preview.scss"
import "@/assets/scss/highlight.js.jpz.scss"
import "katex/dist/katex.min.css" // katex 样式

import { createApp, h, nextTick, onMounted, ref } from "vue"

import Icon from "@/components/common/icons" // 引用自定义的全局图标
import { PlayerStateManager } from "@/components/player"
import VideoPlayer from "@/components/player"

defineOptions({ name: "MyTest" })

const myHtml = ref(`
<h1>这是一个标题</h1>
<video-player id="m-14-8e72860c"/>
<p>这是一个段落</p>
`)

const videoState = new PlayerStateManager()
videoState.setSrc("m-14-8e72860c")
const state = videoState.getState()

const App = {
    render() {
        return h(VideoPlayer, { playerState: state })
    },
}

const app = createApp(App)
app.component("Icon", Icon) // 使用 'Icon' 作为全局组件名

onMounted(() => {
    nextTick(() => {
        app.mount("#m-14-8e72860c")
    })
})

// onMounted(() => {
//     nextTick(() => {
//         // 确保 DOM 已经更新
//         const targetElement = document.getElementById("m-14-8e72860c")
//         if (targetElement) {
//             app.mount(targetElement)
//         }
//     })
// })

// 定义 markdown 中的 组件对应的自定义 html 标签

// 根据 上述的标签，定义挂载函数

// 根据 上述自定义的html 设置markdown编辑命令

// 思考通用的 markdown 编辑命令对应的组件挂载函数
</script>

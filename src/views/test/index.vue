<template>MyTest</template>
<script setup lang="ts">
import { parseHtmlToContentParts } from "@/customElements/parseHtml"
defineOptions({ name: "MyTest" })

const htmlString = `
<h1 id="idx0-content-of-the-first-post3">Content of the first post3</h1>
<p>普通内容</p>
<pay-read>
付费阅读 1
测试内容很多
</pay-read>

<pay-read>
  付费阅读  2

  测试很多内容
</pay-read>

<pay-download>
付费下载  1
测试内容很多
</pay-download>

<p>普通内容1</p>
<p>普通内容2</p>
<p>普通内容3</p>
<p>普通内容4</p>
<p>普通内容5</p>

<pay-video>
包含内容  
</pay-video>

<p>测试内</p>
<p><pay-membership></pay-membership></p>
<p><video-player video-type="hls" id="m-1-c19424aa"></video-player></p>
<p><video-player video-type="hls" id="m-1-c19424aa"></video-player></p>
<p><pay-key id="27" title="账号密钥2" description="测试说明"></pay-key></p>
`

const result = parseHtmlToContentParts(htmlString)
console.log(result)
</script>

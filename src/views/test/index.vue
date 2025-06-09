<template>
    <div class="friendly-links">
        <ul>
            <li v-for="(link, index) in links" :key="index">
                <!-- 自动获取favicon -->
                <img :src="`https://www.google.com/s2/favicons?sz=64&domain_url=${trimProtocol(link)}`" alt="favicon" class="favicon" />
                <a :href="link" target="_blank" rel="noopener noreferrer">{{ link }}</a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

defineOptions({ name: "EditorCodemirror" })
/**
 * 将 https:// 或 http:// 这些协议部分去除
 * 仅保留域名及后续路径，便于对接 Google S2 Favicon
 */
function trimProtocol(url: string) {
    return url.replace(/^https?:\/\//, "")
}

// 这里仅演示一个地址，可根据实际情况替换为任意多个
const links = ref<string[]>(["https://pbihub.cn/"])
</script>

<style scoped lang="scss">
.friendly-links {
    ul {
        list-style: none;
        padding: 0;
    }

    li {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;

        .favicon {
            width: 20px;
            height: 20px;
            margin-right: 0.5rem;
            /* 根据实际需要进行尺寸或样式调整 */
        }

        a {
            text-decoration: none;
            color: #42b983;
            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>

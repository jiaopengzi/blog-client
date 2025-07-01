<template>
    <div class="friendly-links">test</div>
</template>

<script lang="ts" setup>
defineOptions({ name: "EditorCodemirror" })
/**
 * 将 https:// 或 http:// 这些协议部分去除
 * 仅保留域名及后续路径，便于对接 Google S2 Favicon
 */
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

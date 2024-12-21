<template>
    <div class="article-box">
        <div class="badge" :class="badgeType"></div>
        <h2>{{ title }}</h2>
        <p>{{ content }}</p>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue"

interface Props {
    title: string
    content: string
    badgeType: "hot" | "new" | ""
}

const props = defineProps<Props>()
</script>

<style scoped lang="scss">
.article-box {
    position: relative;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .badge {
        position: absolute;
        top: 0;
        right: 0;
        width: 80px; /* Adjust the size as needed */
        height: 80px; /* Adjust the size as needed */
        transform: rotate(45deg) translate(25%, -25%);
        transform-origin: top right;
        font-size: 0.75rem;
        font-weight: bold;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        &.hot {
            background-color: #e74c3c;
            &::before {
                content: "HOT";
            }
        }
        &.new {
            background-color: #3498db;
            &::before {
                content: "NEW";
            }
        }
    }
}
</style>

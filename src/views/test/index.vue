<template>
    <!-- 标题 -->
    <h2 class="title-row">
        <span class="pinned" v-if="true">置顶</span>
        <span class="title"
            >测试私密自己的文章测试私密自己的文章测试私密自己的文章很长测试私密自己的文章测试私密自己的文章测试私密自己的文章很长测试私密自己的文章测试私密自己的文章测试私密自己的文章很长</span
        >
    </h2>
</template>
<script setup lang="ts">
defineOptions({ name: "MyTest" })
</script>

<style lang="scss" scoped>
.title-row {
    display: flex;
    align-items: center;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    border: 0;
    padding: 0;
    line-height: 1.5em;
    overflow: hidden;
}

.title {
    background-color: red;
    cursor: pointer;
    // 使标题占据剩余空间
    flex: 1;
    // display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // 让 flex 子项能真正被截断
    min-width: 0;
    color: var(--jpz-text-color-primary);

    // 当鼠标移动到 .title 上时, .title 的颜色变为 var(--jpz-color-primary)
    &:hover {
        color: var(--jpz-color-primary);
    }
}

.pinned {
    padding: 0 6px;
    margin-right: 5px;
    background-color: var(--jpz-color-secondary);
    color: var(--jpz-text-color-primary);
    border-radius: 2px;
    font-size: 1em;
    font-weight: 700;
}
</style>

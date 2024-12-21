<template>
    <div class="conBg">
        <div class="tag">补货补货</div>
    </div>
</template>

<script lang="ts" setup>
// 这里可以引入任何需要的TypeScript代码或Vue的组合式API
</script>

<style scoped lang="scss">
.conBg {
    width: 400px;
    height: 200px;
    background-color: #fff;
    margin: 10px 0;
    overflow: hidden;
    position: relative;
    border: 1px solid lightgray;
    border-radius: 4px;
}

.tag {
    background-color: lightgray;
    color: white;
    height: 25px;
    line-height: 25px;
    text-align: center;
    position: absolute;
    padding: 0 40px;
    min-width: 80px;
    transform: rotate(45deg); /* 修改旋转角度 */
    top: 25px; /* 保持不变 */
    right: -45px; /* 从左侧改为右侧 */
}
</style>

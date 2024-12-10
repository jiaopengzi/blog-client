<template>
    <div>
        <el-scrollbar height="calc(100vh - 100px)" class="scroll-container">
            <p v-for="item in 200" :key="item" class="scrollbar-demo-item">{{ item }}</p>
        </el-scrollbar>
    </div>
</template>

<style scoped lang="scss">
.header {
    width: 100vw;
    height: 100px;
    position: sticky;
    top: 0;
    left: 0;
    background-color: red;
    z-index: 1; /* 确保 header 在滚动内容上方 */
}
</style>

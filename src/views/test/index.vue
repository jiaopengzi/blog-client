<template>
    <div class="page">
        <el-scrollbar height="calc(100vh - 100px)" class="scroll-container">
            <p v-for="item in 200" :key="item" class="scrollbar-demo-item">{{ item }}</p>
        </el-scrollbar>
    </div>
</template>

<style scoped lang="scss">
.page {
    width: 100vw;
    height: 100vh;
    background-color: var(--jpz-bg-color);
}

p {
    width: 500px;
    background-color: var(--jpz-bg-color-page);
}
</style>

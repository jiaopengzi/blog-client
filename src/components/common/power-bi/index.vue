<template>
    <div class="power-bi-card" ref="containerRef">
        <div v-if="src" class="power-bi-wrapper">
            <iframe :src="src" class="power-bi-iframe" frameborder="0" allowFullScreen></iframe>
            <button class="power-bi-fullscreen-btn" @click="enterFullscreen">
                <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
            </button>
        </div>
        <div v-else class="power-bi-placeholder">
            <span>Power BI 组件：未提供 src</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

defineProps<{
    src?: string
}>()

const containerRef = ref<HTMLElement | null>(null)

const enterFullscreen = () => {
    if (containerRef.value) {
        if (containerRef.value.requestFullscreen) {
            containerRef.value.requestFullscreen()
        }
    }
}
</script>

<style scoped>
.power-bi-card {
    width: 100%;
    height: 100%;
    min-height: 400px;
    background-color: #f3f4f6;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.power-bi-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
}

.power-bi-iframe {
    width: 100%;
    height: 100%;
    border: none;
    flex: 1;
}

.power-bi-fullscreen-btn {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #374151;
    transition:
        background-color 0.2s,
        color 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.power-bi-fullscreen-btn:hover {
    background-color: #ffffff;
    color: #111827;
}

.power-bi-placeholder {
    width: 100%;
    height: 100%;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 14px;
    background-color: #f9fafb;
    border: 1px dashed #d1d5db;
    border-radius: inherit;
}
</style>

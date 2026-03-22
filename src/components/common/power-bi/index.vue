<template>
    <div class="power-bi-card" ref="containerRef" :class="{ 'power-bi-card-fullscreen': isFullscreen }">
        <div v-if="isValid" class="power-bi-wrapper">
            <iframe :src="normalizedSrc" class="power-bi-iframe" frameborder="0" tabindex="-1"></iframe>
            <div class="power-bi-mask"></div>
            <button type="button" v-if="!isFullscreen" class="power-bi-fullscreen-btn" @click="enterFullscreen">
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
            <span>{{ feedbackMessage }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

import { resolvePowerBiUrl } from "./url"

const props = defineProps<{
    src?: string
}>()

const containerRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

/**
 * @description: 根据当前容器同步浏览器全屏状态, 用于控制按钮显示.
 * @return void.
 */
const syncFullscreenState = (): void => {
    isFullscreen.value =
        document.fullscreenElement === containerRef.value ||
        !!(containerRef.value && document.fullscreenElement && containerRef.value.contains(document.fullscreenElement))
}

const resolvedState = computed(() => resolvePowerBiUrl(props.src))
const isValid = computed(() => resolvedState.value.isValid)
const normalizedSrc = computed(() => resolvedState.value.normalizedSrc)
const feedbackMessage = computed(() => resolvedState.value.message)

onMounted(() => {
    document.addEventListener("fullscreenchange", syncFullscreenState)
})

onBeforeUnmount(() => {
    document.removeEventListener("fullscreenchange", syncFullscreenState)
})

/**
 * @description: 让当前 Power BI 容器进入浏览器原生全屏模式.
 * @return Promise<void>.
 */
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
    min-height: 320px;
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
    min-height: 0;
}

.power-bi-iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: none;
    flex: 1;
    min-height: 0;
    position: relative;
    z-index: 0;
}

.power-bi-mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 28px;
    background: linear-gradient(180deg, rgba(204, 204, 204, 0), rgba(204, 204, 204, 0.6));
    pointer-events: none;
    z-index: 10;
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
    z-index: 12;
}

.power-bi-fullscreen-btn:hover {
    background-color: #ffffff;
    color: #111827;
}

.power-bi-placeholder {
    width: 100%;
    height: 100%;
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 14px;
    background-color: #f9fafb;
    border: 1px dashed #d1d5db;
    border-radius: inherit;
    padding: 24px;
    text-align: center;
}

.power-bi-card-fullscreen {
    background-color: #ffffff;
    border-radius: 0;
}
</style>

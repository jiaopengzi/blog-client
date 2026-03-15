<template>
    <div class="font-debug-page">
        <header class="page-header">
            <p class="eyebrow">JPZ-Debug / Font Lab</p>
            <h1>手机端标题字体独立实验</h1>
            <p class="page-desc">这个页面只测试字体家族与字重, 不复用 preview 和 post-meta 的复杂样式.</p>
        </header>

        <section class="env-panel">
            <h2>环境信息</h2>
            <div class="env-grid">
                <div class="env-item">
                    <span class="env-label">UA</span>
                    <span class="env-value">{{ envInfo.userAgent }}</span>
                </div>
                <div class="env-item">
                    <span class="env-label">Viewport</span>
                    <span class="env-value">{{ envInfo.viewport }}</span>
                </div>
                <div class="env-item">
                    <span class="env-label">DPR</span>
                    <span class="env-value">{{ envInfo.dpr }}</span>
                </div>
                <div class="env-item">
                    <span class="env-label">Platform</span>
                    <span class="env-value">{{ envInfo.platform }}</span>
                </div>
                <div class="env-item">
                    <span class="env-label">Touch Points</span>
                    <span class="env-value">{{ envInfo.touchPoints }}</span>
                </div>
            </div>
            <button class="refresh-btn" type="button" @click="refreshDebugInfo">重新读取计算样式</button>
        </section>

        <section class="matrix-panel">
            <h2>对照样本</h2>
            <p class="panel-desc">观察 400 与 700 是否在真机上出现可见差异, 并对照下方的计算样式输出.</p>

            <div class="sample-list">
                <article v-for="sample in samples" :key="sample.id" class="sample-card">
                    <div class="sample-head">
                        <h3>{{ sample.title }}</h3>
                        <span class="sample-badge">{{ sample.group }}</span>
                    </div>

                    <p class="sample-desc">{{ sample.desc }}</p>

                    <div :ref="(el) => setSampleRef(sample.id, el)" class="sample-text" :style="sample.style">中文标题字体测试 ABC 123 焦棚子 字重对照</div>

                    <dl class="sample-meta">
                        <div class="sample-meta-row">
                            <dt>configured</dt>
                            <dd>{{ sample.style.fontFamily }} / {{ sample.style.fontWeight }}</dd>
                        </div>
                        <div class="sample-meta-row">
                            <dt>computed family</dt>
                            <dd>{{ sampleResults[sample.id]?.fontFamily || "-" }}</dd>
                        </div>
                        <div class="sample-meta-row">
                            <dt>computed weight</dt>
                            <dd>{{ sampleResults[sample.id]?.fontWeight || "-" }}</dd>
                        </div>
                        <div class="sample-meta-row">
                            <dt>font size</dt>
                            <dd>{{ sampleResults[sample.id]?.fontSize || "-" }}</dd>
                        </div>
                    </dl>
                </article>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, type CSSProperties, type ComponentPublicInstance } from "vue"

defineOptions({ name: "MyTest" })

interface SampleStyle {
    fontFamily: string
    fontWeight: string
    fontSize?: string
}

interface FontSample {
    id: string
    title: string
    group: string
    desc: string
    style: CSSProperties & SampleStyle
}

interface SampleComputedStyle {
    fontFamily: string
    fontWeight: string
    fontSize: string
}

const samples: FontSample[] = [
    {
        id: "inherit-400",
        title: "A 组: 浏览器默认 400",
        group: "基线",
        desc: "不指定手机标题字体, 仅观察默认文字渲染.",
        style: {
            fontFamily: "inherit",
            fontWeight: "400",
        },
    },
    {
        id: "inherit-700",
        title: "A 组: 浏览器默认 700",
        group: "基线",
        desc: "与默认 400 对照, 只改字重.",
        style: {
            fontFamily: "inherit",
            fontWeight: "700",
        },
    },
    {
        id: "system-400",
        title: "B 组: system-ui 400",
        group: "系统字体",
        desc: "只使用系统默认字体族, 观察真机是否能稳定命中.",
        style: {
            fontFamily: "system-ui, sans-serif",
            fontWeight: "400",
        },
    },
    {
        id: "system-700",
        title: "B 组: system-ui 700",
        group: "系统字体",
        desc: "与 system-ui 400 对照, 只改字重.",
        style: {
            fontFamily: "system-ui, sans-serif",
            fontWeight: "700",
        },
    },
    {
        id: "mobile-chain-400",
        title: "C 组: 移动端系统链 400",
        group: "移动链路",
        desc: "模拟手机标题常见回退链, 但不叠加任何补偿样式.",
        style: {
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Roboto", "Droid Sans", "Droid Sans Fallback", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: "400",
        },
    },
    {
        id: "mobile-chain-700",
        title: "C 组: 移动端系统链 700",
        group: "移动链路",
        desc: "与移动链 400 对照, 只改字重.",
        style: {
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Roboto", "Droid Sans", "Droid Sans Fallback", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: "700",
        },
    },
    {
        id: "formal-size-400",
        title: "D 组: 正式页等效 18px / 400",
        group: "字号对照",
        desc: "使用 A 组默认字体链, 但把字号压到正式页手机端的 18px.",
        style: {
            fontFamily: "inherit",
            fontWeight: "400",
            fontSize: "18px",
        },
    },
    {
        id: "formal-size-700",
        title: "D 组: 正式页等效 18px / 700",
        group: "字号对照",
        desc: "与上一个样本只差字重, 用于判断真机在 18px 下是否仍有明显粗体差异.",
        style: {
            fontFamily: "inherit",
            fontWeight: "700",
            fontSize: "18px",
        },
    },
]

const sampleElements = new Map<string, HTMLElement>()

const sampleResults = reactive<Record<string, SampleComputedStyle>>({})

const envInfo = reactive({
    userAgent: "-",
    viewport: "-",
    dpr: "-",
    platform: "-",
    touchPoints: "-",
})

/**
 * 记录每个样本对应的 DOM 引用, 用于读取真实计算样式.
 * @param id 样本标识.
 * @param el 样本元素.
 * @return void.
 */
const setSampleRef = (id: string, el: Element | ComponentPublicInstance | null): void => {
    if (el instanceof HTMLElement) {
        sampleElements.set(id, el)
        return
    }

    sampleElements.delete(id)
}

/**
 * 读取环境信息与样本的计算样式, 用于区分样式命中与真机渲染问题.
 * @return void.
 */
const refreshDebugInfo = (): void => {
    envInfo.userAgent = navigator.userAgent || "-"
    envInfo.viewport = `${window.innerWidth} x ${window.innerHeight}`
    envInfo.dpr = `${window.devicePixelRatio || 1}`
    envInfo.platform = navigator.platform || "-"
    envInfo.touchPoints = `${navigator.maxTouchPoints || 0}`

    sampleElements.forEach((element, id) => {
        const style = window.getComputedStyle(element)
        sampleResults[id] = {
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            fontSize: style.fontSize,
        }
    })
}

/**
 * 在 DOM 渲染完成后刷新调试信息, 保证读取到的是最终计算样式.
 * @return Promise<void>.
 */
const syncDebugInfo = async (): Promise<void> => {
    await nextTick()
    refreshDebugInfo()
}

onMounted(() => {
    syncDebugInfo().catch((err) => console.warn("同步字体调试信息失败:", err))
    window.addEventListener("resize", refreshDebugInfo)
})

onUnmounted(() => {
    window.removeEventListener("resize", refreshDebugInfo)
})
</script>

<style scoped lang="scss">
.font-debug-page {
    min-height: 100vh;
    padding: 24px;
    background: radial-gradient(circle at top left, rgb(255 244 214 / 90%), transparent 28%), linear-gradient(180deg, #fffdf7 0%, #f3efe3 100%);
    color: #2d261b;
}

.page-header,
.env-panel,
.matrix-panel {
    width: min(960px, 100%);
    margin: 0 auto;
}

.page-header {
    margin-bottom: 24px;

    h1 {
        margin: 0;
        font-size: 32px;
        line-height: 1.2;
        color: #241a0f;
    }
}

.eyebrow {
    margin: 0 0 8px;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #8f5d28;
}

.page-desc,
.panel-desc {
    margin: 10px 0 0;
    color: #5f5344;
    line-height: 1.7;
}

.env-panel,
.matrix-panel {
    padding: 20px;
    border: 1px solid rgb(127 92 40 / 12%);
    border-radius: 18px;
    background: rgb(255 255 255 / 74%);
    backdrop-filter: blur(10px);
}

.env-panel {
    margin-bottom: 20px;
}

.env-grid {
    display: grid;
    gap: 12px;
    margin-top: 12px;
}

.env-item {
    display: grid;
    gap: 4px;
    padding: 12px;
    border-radius: 12px;
    background: rgb(245 239 226 / 90%);
}

.env-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8a7a63;
}

.env-value {
    word-break: break-all;
    line-height: 1.6;
}

.refresh-btn {
    margin-top: 16px;
    border: none;
    border-radius: 999px;
    padding: 10px 16px;
    background: #2d261b;
    color: #fffaf0;
    cursor: pointer;
}

.sample-list {
    display: grid;
    gap: 16px;
    margin-top: 16px;
}

.sample-card {
    padding: 18px;
    border-radius: 16px;
    background: #fffdf8;
    border: 1px solid rgb(127 92 40 / 10%);
}

.sample-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;

    h3 {
        margin: 0;
        font-size: 18px;
    }
}

.sample-badge {
    flex-shrink: 0;
    padding: 4px 10px;
    border-radius: 999px;
    background: #efe2c6;
    color: #6c4a1c;
    font-size: 12px;
}

.sample-desc {
    margin: 10px 0 14px;
    color: #665948;
    line-height: 1.6;
}

.sample-text {
    padding: 16px;
    border-radius: 14px;
    background: #f6f0e4;
    font-size: 28px;
    line-height: 1.4;
    color: #1f1a14;
}

.sample-meta {
    display: grid;
    gap: 8px;
    margin: 14px 0 0;
}

.sample-meta-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 8px;
    font-size: 14px;

    dt {
        color: #7f735f;
    }

    dd {
        margin: 0;
        word-break: break-all;
        color: #312719;
    }
}

@include respond-to("phone") {
    .font-debug-page {
        padding: 16px;
    }

    .page-header {
        h1 {
            font-size: 24px;
        }
    }

    .sample-text {
        font-size: 24px;
    }

    .sample-meta-row {
        grid-template-columns: 1fr;
    }
}
</style>

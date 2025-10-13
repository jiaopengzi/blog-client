<template>
    <div class="pay-video-container">
        <!-- 视频播放器 -->
        <div class="video-player-section">
            <VideoPlayer :player-state="state" :key="state.videoID" />
        </div>

        <!-- 控制按钮和内容区域 -->
        <div class="video-controls-section">
            <!-- 切换目录按钮 -->
            <button class="toggle-toc-btn" @click="toggleTocVisibility">
                <i :class="tocVisible ? 'icon-chevron-up' : 'icon-chevron-down'"></i>
                {{ tocVisible ? "隐藏目录" : "显示目录" }}
            </button>

            <!-- 付费提示 -->
            <div class="paid-tip" v-if="!isPaid">
                <span class="tip-icon">🔒</span>
                <span>此视频为付费内容，请购买后观看完整内容</span>
            </div>
        </div>

        <!-- 目录树和剧集列表（默认隐藏） -->
        <Transition name="slide-down">
            <div v-show="tocVisible" class="video-content-section">
                <!-- 剧集列表 -->
                <VideoEpisode :is-paid="isPaid" :episode-list="toc!" :current-video-order="currentVideoOrder" @video-select="handleSelect" />

                <!-- 目录树 -->
                <div class="toc-tree-wrapper">
                    <h3 class="toc-title">目录导航</h3>
                    <VideoTocTreeBase :tree-list="toc" :draggable="false" :show-btns="false" :is-edit="false" @video-select="handleSelect" />
                </div>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import VideoPlayer from "@/components/player"
import { fenToYuan } from "@/utils/amount"

import VideoEpisode from "../video-episode"
import VideoTocTreeBase, { type Data } from "../video-toc-tree-base"
import { usePayVideo } from "./hooks"
import { type PayVideoProps } from "./types.ts"

defineOptions({ name: "PayVideo" })

// 定义 props
const { postId, toc } = defineProps<PayVideoProps>()
const localPostId = ref<string>(postId)
const localTreeList = ref<PostVideoTocTree[]>(toc || [])

// hooks
const {
    localMapByFileIdHash,
    localMapByOrder,
    localVideoOrders,
    localFileIdHashList,
    covertToMap,
    state,
    updateVideosIsFree,
    setCurrentVideoProgress,
    switchVideoProgress,
    currentVideoOrder,
} = usePayVideo(localTreeList, localPostId)

// 计算是否已付费（这里假设如果当前视频是免费的或者有付费逻辑，你需要根据实际情况调整）
const isPaid = computed(() => {
    // 这里需要根据你的业务逻辑判断是否已付费
    // 暂时返回 true，你需要根据实际情况修改
    return true
})

// 控制目录树显示/隐藏
const tocVisible = ref(false)

// 切换目录树显示状态
const toggleTocVisibility = () => {
    tocVisible.value = !tocVisible.value
}

// 用户选择视频
const handleSelect = (val: Data) => {
    switchVideoProgress(val.file_id_hash)
}

onMounted(async () => {
    if (!((toc && toc.length > 0) || !postId)) return

    // 转换为 map 结构
    const { mapByFileIdHash, mapByOrder, videoOrders, fileIdHashList } = covertToMap(localTreeList.value)

    // 设置本地数据
    localMapByFileIdHash.value = mapByFileIdHash
    localMapByOrder.value = mapByOrder
    localVideoOrders.value = videoOrders
    localFileIdHashList.value = fileIdHashList

    // 更新视频是否免费
    await updateVideosIsFree()

    // 设置视频和进度
    await setCurrentVideoProgress(postId)
})
</script>

<style scoped lang="scss">
.pay-video-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    .video-player-section {
        position: relative;
        width: 100%;
        background: #000000;

        :deep(.video-player) {
            width: 100%;
            height: 400px;

            // 如果你的 VideoPlayer 组件有特定的类名，请相应调整
            .video-js,
            video {
                width: 100% !important;
                height: 100% !important;
            }
        }
    }

    .video-controls-section {
        padding: 20px 24px;
        background: #ffffff;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;

        .toggle-toc-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
            }

            &:active {
                transform: translateY(0);
            }

            .icon-chevron-up,
            .icon-chevron-down {
                font-size: 12px;
                transition: transform 0.3s ease;
            }
        }

        .paid-tip {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #fff7e6;
            color: #fa8c16;
            border: 1px solid #ffd591;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 400;

            .tip-icon {
                font-size: 14px;
            }
        }
    }

    .video-content-section {
        padding: 24px;

        .toc-title {
            margin: 0 0 16px 0;
            padding-bottom: 8px;
            font-size: 16px;
            font-weight: 600;
            color: #262626;
            border-bottom: 2px solid #f0f0f0;
        }

        .toc-tree-wrapper {
            margin-top: 20px;
            padding: 16px;
            background: #fafafa;
            border-radius: 8px;
            border: 1px solid #f0f0f0;

            :deep(.video-toc-tree-base) {
                // 如果有特定的样式需要覆盖，可以在这里添加
            }
        }
    }
}

// 动画效果
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.slide-down-enter-from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
}

.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
}

// 响应式设计
@media (max-width: 768px) {
    .pay-video-container {
        margin: 0;
        border-radius: 0;

        .video-controls-section {
            padding: 16px 20px;
            flex-direction: column;
            align-items: stretch;

            .toggle-toc-btn {
                align-self: center;
                justify-self: center;
            }

            .paid-tip {
                align-self: center;
                text-align: center;
            }
        }

        .video-content-section {
            padding: 20px;

            .video-content-section {
                .toc-tree-wrapper {
                    padding: 12px;
                }
            }
        }
    }
}

@media (max-width: 480px) {
    .pay-video-container {
        .video-player-section {
            :deep(.video-player) {
                height: 250px;
            }
        }

        .video-controls-section {
            padding: 12px 16px;
        }

        .video-content-section {
            padding: 16px;
        }
    }
}
</style>

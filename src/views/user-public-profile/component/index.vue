<template>
    <div class="content">
        <el-skeleton v-if="loading" animated :rows="5" />

        <div v-else class="profile-shell">
            <section class="hero-panel">
                <div class="hero-overview">
                    <div class="avatar-panel">
                        <AvatarInitials :name="userInfo.user_display_name || userInfo.user_name" :avatar="userInfo.user_avatar" :size="88" />
                    </div>

                    <div class="profile-info">
                        <span class="eyebrow">PUBLIC PROFILE</span>
                        <h1 class="display-name">{{ userInfo.user_display_name || userInfo.user_name }}</h1>
                        <span class="username">{{ userInfo.user_name }}</span>

                        <div class="tags">
                            <el-tag v-if="userInfo.role" size="small" effect="plain" type="info">{{ userInfo.role }}</el-tag>
                            <el-tag v-if="userInfo.sex" size="small" effect="plain">{{ userInfo.sex }}</el-tag>
                        </div>
                    </div>
                </div>

                <div class="hero-stats">
                    <div class="stat-item">
                        <span class="stat-label">文章</span>
                        <span class="stat-value">{{ userInfo.post || 0 }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">加入时间</span>
                        <span class="stat-value stat-value-date">{{ formatTime(userInfo.created_at, "Asia/Shanghai", "YYYY-MM-DD") }}</span>
                    </div>
                </div>
            </section>

            <section class="info-grid">
                <article class="info-card">
                    <div class="card-title-group">
                        <span class="card-eyebrow">PERSONAL NOTE</span>
                        <h2 class="card-title">个人简介</h2>
                    </div>

                    <p class="story-content">{{ userInfo.description || "这个用户很懒, 还没有留下公开简介。" }}</p>
                </article>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { handleResErr, ResponseCode } from "@/api/response"
import { getUserPublicInfoByUserNameAPI, type UserPublicInfo } from "@/api/user/getUserPublicInfoByUserName"
import AvatarInitials from "@/components/common/avatar-initials"
import { RouteNames } from "@/router/types"
import { formatTime } from "@/utils/dateTime"

defineOptions({ name: "UserPublicProfileComponent" })

const route = useRoute()
const router = useRouter()
const username = route.params.username as string

const loading = ref(true)
const userInfo = ref<UserPublicInfo>({
    id: "",
    created_at: "",
    user_name: "",
    user_display_name: "",
    user_avatar: "",
    post: 0,
    role: "",
    description: "",
    sex: "",
})

/**
 * loadUserPublicProfile 加载公开资料。
 * 根据用户名请求接口, 若用户不存在或请求失败则跳转到 404 页面。
 * 返回值 Promise<void>, 仅用于更新当前页面状态。
 */
const loadUserPublicProfile = async (): Promise<void> => {
    try {
        const res = await getUserPublicInfoByUserNameAPI({ user_name: username })
        if (res.data.code === ResponseCode.UserPublicInfoGetSuccess) {
            userInfo.value = res.data.data
        } else {
            await router.push({ name: RouteNames.NotFound })
        }
    } catch {
        await router.push({ name: RouteNames.NotFound })
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    void loadUserPublicProfile()
})
</script>

<style scoped lang="scss">
.content {
    margin: 0 auto;
    padding: 24px 20px 40px;
    box-sizing: border-box;

    @include respond-to("pc") {
        width: pc.$width-page-main;
        min-height: calc(100vh - pc.$height-header - pc.$height-footer);
    }

    @include respond-to("pad") {
        width: 100%;
        min-height: calc(100vh - pad.$height-header - pad.$height-footer);
    }

    @include respond-to("phone") {
        width: 100%;
        min-height: calc(100vh - phone.$height-header - phone.$height-footer);
    }
}

.profile-shell {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.hero-panel,
.info-card {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 32%), var(--jpz-bg-color);
    border: 1px solid var(--jpz-border-color);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
}

.hero-panel {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(240px, 0.8fr);
    gap: 24px;
    padding: 28px;
    border-radius: 28px;
    overflow: hidden;
}

.hero-overview {
    display: flex;
    align-items: center;
    gap: 20px;
    min-width: 0;
}

.avatar-panel {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 116px;
    height: 116px;
    border-radius: 32px;
    background: radial-gradient(circle at top, rgba(64, 158, 255, 0.18), transparent 60%), var(--jpz-bg-color-page);
    border: 1px solid rgba(64, 158, 255, 0.14);
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
}

.eyebrow,
.card-eyebrow {
    font-size: 12px;
    letter-spacing: 0.18em;
    color: var(--jpz-text-color-secondary);
}

.display-name,
.card-title {
    margin: 0;
    color: var(--jpz-text-color);
}

.display-name {
    font-size: 30px;
    font-weight: 700;
    line-height: 1.15;
}

.username {
    font-size: 15px;
    color: var(--jpz-text-color-secondary);
    word-break: break-word;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.hero-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    align-content: stretch;
}

.stat-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
    min-height: 132px;
    padding: 18px;
    border-radius: 20px;
    background: var(--jpz-bg-color-page);
    border: 1px solid var(--jpz-border-color-lighter);
}

.stat-label {
    font-size: 12px;
    letter-spacing: 0.12em;
    color: var(--jpz-text-color-secondary);
}

.stat-value {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.2;
    color: var(--jpz-text-color);
}

.stat-value-date {
    font-size: 18px;
}

.info-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
}

.info-card {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    border-radius: 24px;
}

.card-title-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.card-title {
    font-size: 22px;
    font-weight: 600;
}

.story-content {
    margin: 0;
    color: var(--jpz-text-color);
    line-height: 1.85;
    font-size: 14px;
    white-space: pre-wrap;
}

@include respond-to("pc") {
    .profile-shell {
        gap: 28px;
    }
}

@include respond-to("pad") {
    .content {
        padding: 20px 16px 32px;
    }

    .hero-panel {
        grid-template-columns: minmax(0, 1fr);
    }

    .hero-panel {
        padding: 24px;
        border-radius: 24px;
    }
}

@include respond-to("phone") {
    .content {
        padding: 16px 12px 28px;
    }

    .profile-shell {
        gap: 16px;
    }

    .hero-panel {
        grid-template-columns: minmax(0, 1fr);
        gap: 16px;
    }

    .hero-panel,
    .info-card {
        padding: 18px;
        border-radius: 20px;
    }

    .hero-overview {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
    }

    .profile-info {
        width: 100%;
    }

    .avatar-panel {
        width: 96px;
        height: 96px;
        border-radius: 24px;
    }

    .display-name {
        font-size: 24px;
    }

    .hero-stats {
        grid-template-columns: minmax(0, 1fr);
    }

    .tags {
        gap: 6px;
    }

    .stat-item {
        min-height: auto;
        gap: 12px;
        padding: 16px;
    }

    .stat-value {
        font-size: 24px;
    }

    .stat-value-date {
        font-size: 16px;
    }

    .card-title {
        font-size: 20px;
    }
}
</style>

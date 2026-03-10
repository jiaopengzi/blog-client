<template>
    <div class="content">
        <el-skeleton v-if="loading" animated :rows="5" />
        <div v-else class="profile-card">
            <div class="profile-header">
                <AvatarInitials
                    :name="userInfo.user_display_name || userInfo.user_name"
                    :avatar="userInfo.user_avatar"
                    :size="80"
                />
                <div class="profile-info">
                    <h1 class="display-name">{{ userInfo.user_display_name || userInfo.user_name }}</h1>
                    <span class="username">@{{ userInfo.user_name }}</span>
                    <div class="tags">
                        <el-tag v-if="userInfo.role" size="small" type="info">{{ userInfo.role }}</el-tag>
                    </div>
                </div>
            </div>

            <div class="profile-bio">
                <p>{{ userInfo.description || "这个用户很懒..." }}</p>
            </div>

            <div class="profile-detail">
                <div v-if="userInfo.sex" class="detail-item">
                    <span class="detail-label">性别</span>
                    <span class="detail-value">{{ userInfo.sex }}</span>
                </div>
            </div>

            <div class="profile-stats">
                <div class="stat-item">
                    <span class="stat-value">{{ userInfo.post || 0 }}</span>
                    <span class="stat-label">文章</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">{{ formatDate(userInfo.created_at) }}</span>
                    <span class="stat-label">加入时间</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { getUserPublicInfoByUserNameAPI, type UserPublicInfo } from "@/api/user/getUserPublicInfoByUserName"
import AvatarInitials from "@/components/common/avatar-initials"
import { RouteNames } from "@/router/types"

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

const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("zh-CN")
}

onMounted(async () => {
    try {
        const res = await getUserPublicInfoByUserNameAPI({ user_name: username })
        if (res.data.data) {
            userInfo.value = res.data.data
        } else {
            router.push({ name: RouteNames.NotFound })
        }
    } catch {
        router.push({ name: RouteNames.NotFound })
    } finally {
        loading.value = false
    }
})
</script>

<style scoped lang="scss">
.content {
    margin: 0 auto;
    padding: 20px;

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

.profile-card {
    background-color: var(--jpz-bg-color);
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid var(--jpz-border-color);
    max-width: 800px;
    margin: 0 auto;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.display-name {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--jpz-text-color);
}

.username {
    font-size: 14px;
    color: var(--jpz-text-color-secondary);
}

.tags {
    display: flex;
    gap: 8px;
    margin-top: 4px;
}

.profile-bio {
    margin-bottom: 24px;
    padding: 16px;
    background-color: var(--jpz-bg-color);
    border-radius: 6px;
    border: 1px solid var(--jpz-border-color);

    p {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: var(--jpz-text-color);
    }
}

.profile-detail {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.detail-label {
    font-size: 13px;
    color: var(--jpz-text-color-secondary);
}

.detail-value {
    font-size: 14px;
    font-weight: 500;
    color: var(--jpz-text-color);
}

.profile-stats {
    display: flex;
    gap: 32px;
    border-top: 1px solid var(--jpz-border-color);
    padding-top: 24px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stat-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--jpz-text-color);
}

.stat-label {
    font-size: 12px;
    color: var(--jpz-text-color-secondary);
}
</style>
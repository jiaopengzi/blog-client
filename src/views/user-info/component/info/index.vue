<!--
 * FilePath    : blog-client\src\views\user-info\component\info\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用户信息组件 信息
-->
<template>
    <div class="container">
        <div class="my-info">
            <el-descriptions title="基础信息" :column="descriptionCols" size="large" border>
                <el-descriptions-item label="注册时间">{{ formatRegisterTime }}</el-descriptions-item>
                <el-descriptions-item label="角色">{{ userSysRole }}</el-descriptions-item>
                <el-descriptions-item label="会员" v-if="userMembershipRole">{{ userMembershipRole }}</el-descriptions-item>
            </el-descriptions>
        </div>

        <div class="social-info">
            <el-descriptions title="社交信息" :column="descriptionCols" size="large" border>
                <el-descriptions-item :label="SocialLoginDisplay.QQ">
                    <el-button class="btns" type="primary" plain size="small" v-if="!showQQ" @click="bindSocial(SocialLoginType.QQ)">
                        绑定{{ SocialLoginDisplay.QQ }}
                    </el-button>
                    <span class="social-nickname">{{ socialNickname("user_qq", "nickname") }}</span>
                    <el-button class="btns" type="primary" plain size="small" v-if="showQQ && isBindEmail" @click="unBindSocial(SocialLoginType.QQ)">
                        解绑{{ SocialLoginDisplay.QQ }}
                    </el-button>
                </el-descriptions-item>

                <el-descriptions-item :label="SocialLoginDisplay.WeChat">
                    <el-button class="btns" type="primary" plain size="small" v-if="!showWeChat" @click="bindSocial(SocialLoginType.WeChat)">
                        绑定{{ SocialLoginDisplay.WeChat }}
                    </el-button>
                    <span class="social-nickname">{{ socialNickname("user_wechat", "nickname") }}</span>
                    <el-button class="btns" type="primary" plain size="small" v-if="showWeChat && isBindEmail" @click="unBindSocial(SocialLoginType.WeChat)">
                        解绑{{ SocialLoginDisplay.WeChat }}
                    </el-button>
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <div class="edit-avatar-info">
            <div class="edit-avatar">
                <AvatarInitials :name="userData.user.user_display_name" :avatar="avatar" />
            </div>
            <div class="edit-avatar-btn">
                <AvatarUpload @avatar-upload-url="updateAvatarToDB" />
            </div>
        </div>

        <div class="my-info-edit">
            <el-form
                :label-position="labelPosition"
                label-width="100px"
                ref="editFormRef"
                :model="editForm"
                :rules="rules"
                class="edit-form"
                :size="formSize"
                status-icon
            >
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="editForm.userName" :disabled="userNameDisabled" />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="email" disabled />
                </el-form-item>

                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="editForm.nickName" />
                </el-form-item>

                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio value="男">男</el-radio>
                        <el-radio value="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="简介" prop="description">
                    <el-input v-model="editForm.description" type="textarea" :rows="5" placeholder="这个人很懒,什么也没有留下。" />
                </el-form-item>
                <div class="btn-submit">
                    <el-button type="primary" @click="submitForm(editFormRef)">保存修改</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script setup lang="ts">
import { SocialLoginDisplay, SocialLoginType } from "@/api/common"
import AvatarInitials from "@/components/common/avatar-initials"
import AvatarUpload from "@/components/common/avatar-upload"
import { useInfo } from "@/views/user-info/component/info/hooks"

import { useUserInfo } from "../hook"

defineOptions({ name: "UserInfoInfo" })

const { descriptionCols } = useUserInfo()

const {
    editFormRef,
    labelPosition,
    formSize,
    userData,
    avatar,
    isBindEmail,
    formatRegisterTime,
    editForm,
    rules,
    submitForm,
    showQQ,
    showWeChat,
    socialNickname,
    bindSocial,
    unBindSocial,
    userNameDisabled,
    email,
    updateAvatarToDB,
    userSysRole,
    userMembershipRole,
} = useInfo()
</script>
<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.social-info {
    margin-top: 20px;
}

.my-info-edit {
    border-top: 1px solid var(--jpz-border-color);
    padding-top: 40px;
}

.edit-avatar-info {
    // border-top: 2px solid #ebebeb;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.edit-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px 40px 40px 0;
}

.social-nickname {
    margin-left: 5px;
    margin-right: 10px;
}

.btns {
    width: 60px;
}

.btn-submit {
    display: flex;
    justify-content: center;
}

@include respond-to("pc") {
    .my-info-edit {
        padding-right: 50%;
    }
}

@include respond-to("pad") {
    .my-info-edit {
        width: 100%;
    }
}

@include respond-to("phone") {
    .my-info-edit {
        width: 100%;
    }
}
</style>

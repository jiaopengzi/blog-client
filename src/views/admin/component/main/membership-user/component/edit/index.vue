<!--
 * FilePath    : blog-client\src\views\admin\component\main\membership-user\component\edit\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 人工处理会员状态
-->

<template>
    <div class="membership-user-adjust-page">
        <el-form ref="formRef" :model="formData" :rules="rules" label-position="left" label-width="110px" class="adjust-form" status-icon>
            <section class="summary-panel">
                <div>
                    <p class="panel-eyebrow">MEMBERSHIP LIFECYCLE</p>
                    <h3 class="panel-title">人工处理会员状态</h3>
                </div>
                <div class="summary-meta">
                    <span class="meta-chip">{{ formData.role || "未识别会员" }}</span>
                    <span class="meta-subtle">用户: {{ formData.userName || "--" }}</span>
                    <span class="meta-subtle">明细ID: {{ formData.id || "--" }}</span>
                </div>
            </section>

            <el-form-item label="当前状态">
                <div class="status-block">
                    <span class="status-text">{{ formData.expireStatus }}</span>
                    <span class="status-subtle">到期时间: {{ formData.expireTimeDisplay }}</span>
                </div>
            </el-form-item>

            <el-form-item label="处理动作" prop="action">
                <el-radio-group v-model="formData.action">
                    <el-radio v-for="item in actionOptions" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item v-if="formData.action === MembershipUserAdjustAction.Extend" label="延长天数" prop="durationDays">
                <div class="duration-field">
                    <el-input-number v-model="formData.durationDays" :min="1" :max="99999999" />
                    <div class="quick-days">
                        <el-button v-for="day in quickDays" :key="day" size="small" @click="formData.durationDays = day">{{ day }}天</el-button>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="处理备注" prop="remark">
                <el-input
                    v-model="formData.remark"
                    type="textarea"
                    :rows="4"
                    maxlength="200"
                    show-word-limit
                    placeholder="必填；单次人工记录会自动拼接时间、管理员 ID 和动作，且整条记录不超过 200 字。"
                />
            </el-form-item>

            <el-form-item label="历史备注">
                <el-input v-model="formData.historyRemark" type="textarea" :rows="8" readonly placeholder="暂无历史备注" />
            </el-form-item>

            <div class="form-actions">
                <el-button type="primary" :loading="btnLoading" @click="submitForm(formRef as FormInstance)">提交处理</el-button>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, ref, useTemplateRef, watch } from "vue"

import { getMembershipUserAdjustActionOptions, MembershipUserAdjustAction } from "@/api/membership/common"
import { membershipUserAdjustAPI, type MembershipUserAdjustRequest } from "@/api/membership/userAdjust"
import { ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

defineOptions({ name: "EditMembershipUserAdjust" })

interface EditMembershipUserForm {
    id: string
    role: string
    userName: string
    expireTimeDisplay: string
    expireStatus: string
    historyRemark: string
    action: MembershipUserAdjustAction
    durationDays: number
    remark: string
}

const emit = defineEmits<{
    (event: "edit-status", value: boolean): void
}>()

const { editData } = defineProps<{
    editData: EditMembershipUserForm
}>()

const formRef = useTemplateRef<FormInstance>("formRef")
const btnLoading = ref(false)
const actionOptions = getMembershipUserAdjustActionOptions()
const quickDays = [1, 7, 30, 90]

const formData = reactive<EditMembershipUserForm>({
    id: "",
    role: "",
    userName: "",
    expireTimeDisplay: "永久有效",
    expireStatus: "✅未过期",
    historyRemark: "",
    action: MembershipUserAdjustAction.Extend,
    durationDays: 7,
    remark: "",
})

const rules = reactive<FormRules<EditMembershipUserForm>>({
    action: [{ required: true, message: "请选择处理动作", trigger: "change" }],
    durationDays: [
        {
            validator: (_rule, value, callback) => {
                if (formData.action !== MembershipUserAdjustAction.Extend) {
                    callback()
                    return
                }

                if (!value || value <= 0) {
                    callback(new Error("请输入大于 0 的延长天数"))
                    return
                }

                callback()
            },
            trigger: "change",
        },
    ],
    remark: [
        { required: true, message: "请输入处理备注", trigger: "change" },
        {
            validator: (_rule, value, callback) => {
                const trimmedValue = value?.trim()

                if (!trimmedValue) {
                    callback(new Error("请输入处理备注"))
                    return
                }

                if (trimmedValue.length > 200) {
                    callback(new Error("处理备注不能超过 200 个字符"))
                    return
                }

                callback()
            },
            trigger: ["blur", "change"],
        },
    ],
})

/**
 * syncEditData 同步外部编辑数据到表单.
 */
const syncEditData = (data: EditMembershipUserForm) => {
    formData.id = data.id
    formData.role = data.role
    formData.userName = data.userName
    formData.expireTimeDisplay = data.expireTimeDisplay
    formData.expireStatus = data.expireStatus
    formData.historyRemark = data.historyRemark || ""
    formData.action = MembershipUserAdjustAction.Extend
    formData.durationDays = 7
    formData.remark = ""
}

watch(
    () => editData,
    (newVal) => {
        syncEditData(newVal)
    },
    { deep: true, immediate: true },
)

watch(
    () => formData.action,
    () => {
        formRef.value?.clearValidate(["durationDays", "remark"])
    },
)

/**
 * submitForm 提交人工处理会员请求.
 */
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) {
        return
    }

    btnLoading.value = true

    try {
        const valid = await formEl
            .validate()
            .then(() => true)
            .catch(() => false)

        if (!valid) {
            return
        }

        const req: MembershipUserAdjustRequest = {
            id: formData.id,
            action: formData.action,
            remark: formData.remark.trim(),
        }

        if (formData.action === MembershipUserAdjustAction.Extend) {
            req.duration_seconds = formData.durationDays * 24 * 60 * 60
        }

        const { data } = await membershipUserAdjustAPI(req)

        if (data.code === ResponseCode.MembershipUserAdjustSuccess) {
            emit("edit-status", true)
            MessageUtil.success(data.msg, 6000)
            return
        }

        MessageUtil.error(data.msg, 0)
    } finally {
        btnLoading.value = false
    }
}
</script>

<style scoped lang="scss">
.membership-user-adjust-page {
    width: 100%;
}

.adjust-form {
    width: 100%;
}

.summary-panel {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px 18px;
    margin-bottom: 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(24, 85, 150, 0.08), rgba(18, 161, 132, 0.12));
}

.panel-eyebrow {
    margin: 0 0 6px;
    font-size: 12px;
    letter-spacing: 0.12em;
    color: var(--jpz-text-color-secondary);
}

.panel-title {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: var(--jpz-text-color-primary);
}

.summary-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}

.meta-chip {
    padding: 6px 12px;
    border-radius: 999px;
    background-color: rgba(24, 85, 150, 0.14);
    color: var(--jpz-text-color-primary);
    font-weight: 600;
}

.meta-subtle {
    color: var(--jpz-text-color-secondary);
    font-size: 13px;
}

.status-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.status-text {
    font-weight: 700;
    color: var(--jpz-text-color-primary);
}

.status-subtle {
    color: var(--jpz-text-color-secondary);
}

.duration-field {
    width: 100%;
}

.quick-days {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}

.form-actions {
    display: flex;
    justify-content: center;
    margin-top: 28px;
}

@media (max-width: 768px) {
    .summary-panel {
        flex-direction: column;
        gap: 12px;
    }

    .summary-meta {
        align-items: flex-start;
    }
}
</style>

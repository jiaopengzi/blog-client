/*
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心 hooks
 */

import { ref } from "vue"

import type { BillingCenterAccountRes } from "@/api/billingCenter/common"
import { TransactionType, TransactionTypeDisplay } from "@/api/billingCenter/common"
import { fenToYuan } from "@/utils/amount"
import { billingCenterGetAccountAPI } from "@/api/billingCenter/getAccount"
import { ResponseCode } from "@/api/response"
import type { TableData } from "@/components/common/base-table"

/**
 * domainHint 域名输入框提示信息, 注册和重置证书共用。
 */
export const domainHint = `1、域名必须以 .com、.net、.org 等常见顶级域名结尾，且不包含协议部分（如 http:// 或 https://）例如：example.com。
2、域名作为计费中心校验用户网站合法性的依据，请确保输入的域名正确且可访问。
3、若输入的域名无法访问，计费中心将注销您的账号，请谨慎输入。
`

/**
 * useBillingCenter 计费中心业务 hook。
 * 提供账号信息获取, 金额格式化, 交易类型格式化等功能。
 * @returns 账号信息及格式化工具函数。
 */
export function useBillingCenter() {
    // 账号信息
    const accountInfo = ref<BillingCenterAccountRes | null>(null)

    // 是否已注册
    const isRegistered = ref(false)

    // 账户是否被禁用
    const isForbidden = ref(false)

    // 加载状态
    const accountLoading = ref(false)

    /**
     * getAccountInfo 获取计费中心账号信息。
     */
    async function getAccountInfo() {
        accountLoading.value = true
        try {
            const res = await billingCenterGetAccountAPI()
            if (res.data.code === ResponseCode.BillingCenterGetAccountSuccess) {
                accountInfo.value = res.data.data
                isRegistered.value = true
                isForbidden.value = false
            } else if (res.data.code === ResponseCode.BillingCenterAccountNotExists) {
                isRegistered.value = false
                accountInfo.value = null
                isForbidden.value = false
            } else if (res.data.code === ResponseCode.BillingCenterAccountForbidden) {
                isRegistered.value = false
                accountInfo.value = null
                isForbidden.value = true
            }
        } finally {
            accountLoading.value = false
        }
    }

    /**
     * formatAmount 格式化金额(分转元)。
     * @param amount - 金额(分)。
     * @returns 格式化后的金额字符串。
     */
    const formatAmount = (amount: number): string => {
        return fenToYuan(amount).toString()
    }

    /**
     * formatAmountColumn 创建表格列金额格式化函数(分转元)。
     * @param prop - 列属性名。
     * @returns 格式化函数。
     */
    const formatAmountColumn = (prop: string) => {
        return (row: TableData) => {
            if (prop in row) {
                return fenToYuan(Number(row[prop as keyof TableData])).toString()
            }
            return "-"
        }
    }

    /**
     * formatTransactionType 格式化交易流水类型, 根据 value 使用 TransactionTypeDisplay 显示。
     * @param row - 表格行数据。
     * @returns 带符号的交易类型显示文本。
     */
    const formatTransactionType = (row: TableData) => {
        if ("type" in row && row.type && typeof row.type === "object") {
            const value = (row.type as { value: number; label: string }).value as TransactionType
            return TransactionTypeDisplay[value] || "-"
        }
        return "-"
    }

    /**
     * formatRelatedId 格式化关联ID, 值为 "0" 时不展示。
     * @param row - 表格行数据。
     * @returns 关联ID或空字符串。
     */
    const formatRelatedId = (row: TableData) => {
        if ("related_id" in row) {
            const val = row.related_id as string
            return val === "0" ? "-" : val
        }
        return "-"
    }

    return {
        accountInfo,
        isRegistered,
        isForbidden,
        accountLoading,
        getAccountInfo,
        formatAmount,
        formatAmountColumn,
        formatTransactionType,
        formatRelatedId,
    }
}

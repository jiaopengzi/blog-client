/*
 * FilePath    : blog-client\src\components\common\order-remark\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单备注
 */

import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { type Ref, ref } from "vue"

import { updateOrderAdminAPI, type UpdateOrderAdminRequest } from "@/api/order/updateAdmin"
import { handleResErr, ResponseCode } from "@/api/response"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"

export function useOrderRemark(formRef: Ref<FormInstance | null>, formRemark: Ref<UpdateOrderAdminRequest>) {
    const isRemarkBtnLoading = ref(false)

    // 执行备注更新
    const runRemark = async () => {
        isRemarkBtnLoading.value = true // 禁用按钮
        if (!formRef || !formRef.value) {
            isRemarkBtnLoading.value = false // 启用按钮
            return
        }

        await formRef.value.validate(async (valid) => {
            if (valid) {
                const req: UpdateOrderAdminRequest = {
                    id: formRemark.value.id,
                    remark: formRemark.value.remark,
                    remark_admin: formRemark.value.remark_admin,
                }

                // 调用API
                const res = await updateOrderAdminAPI(req)
                if (res.data.code === ResponseCode.OrderUpdateRemarkSuccess) {
                    MessageUtil.success("备注已保存，请耐心等待后端处理。", 3000)
                    // 轮询后端是否完成
                    await pollingGetStreamIDsStatus(res.data.data.stream_items)
                } else {
                    const msg = handleResErr(res)
                    MessageUtil.error(msg, 3000)
                }

                isRemarkBtnLoading.value = false // 启用按钮
            } else {
                isRemarkBtnLoading.value = false // 启用按钮
                return
            }
        })
    }

    return {
        isRemarkBtnLoading,
        runRemark,
    }
}

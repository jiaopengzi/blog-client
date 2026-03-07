/*
 * FilePath    : blog-client\src\api\membership\userView.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看会员用户
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import { nullPgSqlDateTime } from "@/api/common"
import { type Pagination, type Res, ResponseCode, type ResPromise } from "@/api/response"
import { ImgFit } from "@/components/common"
import { formatTime } from "@/utils/dateTime"

import type { MembershipUserInfo, MembershipUserRes } from "./common"

export interface ViewMembershipUserRequest extends PaginationRequest {
    user_id?: string
}

function formatMembershipUserInfo(userInfo: MembershipUserInfo, width: number, height: number, imgFit: ImgFit): MembershipUserInfo {
    const formattedUser: MembershipUserInfo = {
        id: userInfo.id,
        user_name: userInfo.user_name || "",
        user_display_name: userInfo.user_display_name || "",
        user_email: userInfo.user_email || "",
        user_avatar: userInfo.user_avatar || "",
        subscribe_status: userInfo.subscribe_status,
        created_at: "",
        role: "",
        post: 0,
        disable_expires_at: nullPgSqlDateTime(),
    }

    if (formattedUser.user_avatar) {
        formattedUser.img = {
            url: formattedUser.user_avatar,
            width,
            height,
            imgFit,
        }
    }

    return formattedUser
}

export async function viewMembershipUserAPI(
    requestData: ViewMembershipUserRequest = { current_page: 1, page_size: 10 },
    width: number = 30,
    height: number = 30,
    imgFit: ImgFit = ImgFit.Cover,
): ResPromise<Res<Pagination<MembershipUserRes>>> {
    const urlStr = routerGroup + "/membership/user-view"
    const response = await request({
        url: urlStr,
        method: "post",
        data: requestData,
    })

    if (response.data.code === ResponseCode.MembershipUserViewSuccess) {
        response.data.data.records = response.data.data.records.map((item: MembershipUserRes) => formatMembershipUser(item, width, height, imgFit))
        return response
    }

    response.data.data = emptyMembershipUsers()
    return response
}

export function formatMembershipUser({ user_info, created_at, ...item }: MembershipUserRes, width: number, height: number, imgFit: ImgFit): MembershipUserRes {
    const formattedUser = formatMembershipUserInfo(user_info, width, height, imgFit)
    const formattedItem: MembershipUserRes = {
        ...item,
        created_at: formatTime(created_at),
        user_info: formattedUser,
    }

    return formattedItem
}

export function emptyMembershipUsers(): Pagination<MembershipUserRes> {
    return {
        total: 0,
        current_page: 1,
        page_size: 10,
        page_count: 1,
        page_sizes: [10],
        records: [],
    }
}

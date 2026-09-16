/**
 * FilePath    : blog-client\src\components\common\slide-verify-manage\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 滑动验证图片管理
 */

export interface SlideVerifyManageFormRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    formDataResult: SlideVerifyImgItem[]
}

export interface SlideVerifyImgItem {
    imageUrl: string // 图片地址
}

/**
 * @FilePath     : \blog-client\src\components\common\media-edit\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import { type MediaShowProps } from "./media-show"

export interface EditMediaProps extends MediaShowProps {
    editDialogVisible?: boolean // 编辑弹窗是否显示
}

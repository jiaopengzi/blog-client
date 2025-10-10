/*
 * FilePath    : blog-client\src\components\common\video-episode\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频集数类型
 */

import { type PostVideoTocTree } from "@/api/post/common"

export interface VideoEpisodeProps {
    isPaid: boolean // 是否付费
    episodeList: PostVideoTocTree[]
    currentVideoId?: number
}

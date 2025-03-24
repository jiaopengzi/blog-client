/*
 * FilePath    : blog-client\src\components\layout\header-nav\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 头部导航工具
 */

import { IconKeys } from "@/components/common/icons" // 图标名称枚举

import { type HomeMenuItemMapWithIndex } from "./types"

export const homeMenuItemMapWithIndex: HomeMenuItemMapWithIndex = {
    post4: {
        index: "post4",
        text: "文章的名",
        icon: {
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
        },
    },
    "post2-sdfsd": {
        index: "post2",
        text: "文章",
        icon: {
            name: IconKeys.Post,
            class: "icon-menu",
        },
    },
    post: {
        index: "post3",
        text: "文章的名字很长很长这怎么办呢",
        icon: {
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
        },
    },
    test1: {
        index: "test1",
        text: "仪表板",
        icon: {
            name: IconKeys.Dashboard,
            class: "icon-menu",
        },
    },
    post22: {
        index: "post22",
        text: "文章",
        icon: {
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
        },
        parentIndex: "post2",
    },
    post221: {
        index: "post221",
        text: "文章",
        icon: {
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
        },
        parentIndex: "post2",
    },
    post444: {
        index: "post444",
        text: "文章",
        icon: {
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
        },
        parentIndex: "post22",
    },
    post555: {
        index: "post555",
        text: "文章",
        icon: {
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
        },
        parentIndex: "post22",
    },
}

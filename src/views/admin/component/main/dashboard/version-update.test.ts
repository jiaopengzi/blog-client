/**
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\version-update.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 面板版本更新状态工具测试
 */

import { describe, expect, it } from "vitest"

import { RemoteVersionSource, type RemoteVersionOverviewRes } from "@/api/dashboard/version"

import { buildDashboardVersionUpdateState } from "./version-update"

describe("buildDashboardVersionUpdateState - 构建面板版本更新状态", () => {
    it("当远端版本高于当前版本时应标记有更新", () => {
        const remoteOverview: RemoteVersionOverviewRes = {
            preferred_source: "",
            server: { version: "v2.0.0", date: "2026-05-14", source: RemoteVersionSource.Gitee },
            client: { version: "v3.0.0", date: "2026-05-14", source: RemoteVersionSource.Gitee },
        }

        const got = buildDashboardVersionUpdateState(remoteOverview, "v1.0.0", "v2.0.0")

        expect(got.hasUpdateServer).toBe(true)
        expect(got.hasUpdateClient).toBe(true)
        expect(got.updateVersionServer?.version).toBe("v2.0.0")
        expect(got.updateVersionClient?.version).toBe("v3.0.0")
    })

    it("当远端版本等于当前版本时不应标记更新", () => {
        const remoteOverview: RemoteVersionOverviewRes = {
            preferred_source: "",
            server: { version: "v1.0.0", date: "2026-05-14", source: RemoteVersionSource.GitHub },
            client: { version: "v2.0.0", date: "2026-05-14", source: RemoteVersionSource.GitHub },
        }

        const got = buildDashboardVersionUpdateState(remoteOverview, "v1.0.0", "v2.0.0")

        expect(got.hasUpdateServer).toBe(false)
        expect(got.hasUpdateClient).toBe(false)
    })

    it("当远端接口部分失败时应保留可用结果并忽略空值", () => {
        const remoteOverview: RemoteVersionOverviewRes = {
            preferred_source: "",
            server: null,
            client: { version: "v2.1.0", date: "2026-05-14", source: RemoteVersionSource.GitHub },
        }

        const got = buildDashboardVersionUpdateState(remoteOverview, "v1.0.0", "v2.0.0")

        expect(got.hasUpdateServer).toBe(false)
        expect(got.updateVersionServer).toBeNull()
        expect(got.hasUpdateClient).toBe(true)
        expect(got.updateVersionClient?.version).toBe("v2.1.0")
    })

    it("当当前服务端版本尚未返回时不应误判服务端有更新", () => {
        const remoteOverview: RemoteVersionOverviewRes = {
            preferred_source: "",
            server: { version: "v9.9.9", date: "2026-05-21", source: RemoteVersionSource.GitHub },
            client: { version: "v2.1.0", date: "2026-05-14", source: RemoteVersionSource.GitHub },
        }

        const got = buildDashboardVersionUpdateState(remoteOverview, "", "v2.0.0")

        expect(got.hasUpdateServer).toBe(false)
        expect(got.updateVersionServer?.version).toBe("v9.9.9")
        expect(got.hasUpdateClient).toBe(true)
    })
})

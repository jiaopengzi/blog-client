/*
 * FilePath    : blog-client\src\components\common\pay-video\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : hooks
 */

import { nextTick, type Ref, ref } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { getUserPostVideoProgressAPI, type GetUserPostVideoProgressRequest, type GetUserPostVideoProgressResponse } from "@/api/video/getUserPostVideoProgress"
import { getUserVideoProgressAPI, type GetUserVideoProgressRequest, type GetUserVideoProgressResponse } from "@/api/video/getUserVideoProgress"
import { getVideosIsFreeAPI, type GetVideosIsFreeRequest, type GetVideosIsFreeResponse } from "@/api/video/getVideosIsFree"
import { upsertUserPostVideoProgressAPI, type UpsertUserPostVideoProgressRequest } from "@/api/video/upsertUserPostVideoProgress"
import { MediaTypes, PlayerStateManager } from "@/components/player"
import { useUserStore } from "@/stores/user"

import type { VideoTocMapByFileIdHash, VideoTocMapByOrder } from "../video-toc-tree-base"
import { useVideoTocTree } from "../video-toc-tree-base"

export function usePayVideo(localTreeList: Ref<PostVideoTocTree[]>, postId: Ref<string>) {
    const localMapByFileIdHash = ref<VideoTocMapByFileIdHash>({}) // 目录树映射, key 为节点 fileIdHash
    const localMapByOrder = ref<VideoTocMapByOrder>({}) // 目录树映射, key 为节点 videoOrder
    const localVideoOrders = ref<number[]>([]) // 当前目录树中所有视频的 videoOrder 列表
    const localFileIdHashList = ref<string[]>([]) // 当前目录树中所有视频的 fileIdHash 列表
    const currentVideoOrder = ref<number>(0) // 当前视频的集数序号

    // hooks
    const { videoTotal, covertToMap } = useVideoTocTree(localTreeList)

    const manager = new PlayerStateManager()
    const state = manager.getState()

    // 更新视频是否免费
    async function updateVideosIsFree() {
        // 如果没有视频, 则不处理
        if (localFileIdHashList.value.length === 0) {
            return
        }

        // 构造请求数据
        const reqData: GetVideosIsFreeRequest = {
            file_id_hash_list: localFileIdHashList.value,
        }

        // 请求接口
        const res = await getVideosIsFreeAPI(reqData)

        if (res.data.code === ResponseCode.GetVideosIsFreeSuccess) {
            const isFreeData = res.data.data
            updateTreeIsFree(isFreeData)
        }
    }

    // 更新目录树的是否免费状态
    function updateTreeIsFree(isFreeData: GetVideosIsFreeResponse[]) {
        // 转换为 map 结构
        const isFreeMap: { [key: string]: boolean } = {}
        for (const item of isFreeData) {
            isFreeMap[item.file_id_hash] = item.is_free
        }

        // 递归更新 localTreeList
        function updateNodeList(nodeList: PostVideoTocTree[]) {
            for (const node of nodeList) {
                if (node.file_id_hash && node.file_id_hash in isFreeMap) {
                    node.is_free = isFreeMap[node.file_id_hash]
                }
                if (node.children && node.children.length > 0) {
                    updateNodeList(node.children)
                }
            }
        }

        updateNodeList(localTreeList.value)
    }

    // 根据 fileIdHash 和 currentTime 设置当前视频和播放进度
    async function setVideoAndProgress(fileIdHash: string, currentTime: number) {
        // 从映射中获取视频信息
        const video = localMapByFileIdHash.value[fileIdHash]

        // 更新当前视频集数
        currentVideoOrder.value = localMapByFileIdHash.value[fileIdHash]?.video_order || 1

        // 设置播放器状态
        if (video && video.file_id_hash) {
            // 设置视频 ID
            manager.setVideoID(video.file_id_hash)

            // 设置媒体类型
            manager.setMediaType(video.video_type || MediaTypes.HLS)

            // 设置视频源
            if (video.video_src) {
                manager.setSrc(video.video_src)
            }

            //**注意这里需要设置用户输入, 保证进度有效设置**
            manager.setUserInput(false)

            // 等待下一个 DOM 更新周期后设置播放进度，确保视频元素已加载
            await nextTick(() => {
                manager.setCurrentTime(currentTime)
                console.log("============>order", video.video_order)
                console.log("============>currentTime", currentTime)
            })
        }
    }

    // 设置默认视频和进度
    async function setDefaultVideoAndProgress() {
        if (localVideoOrders.value.length > 0 && localVideoOrders.value[0] && localMapByOrder.value && localMapByOrder.value[localVideoOrders.value[0]]) {
            const firstVideo = localMapByOrder.value[localVideoOrders.value[0]]
            await setVideoAndProgress(firstVideo?.file_id_hash || "", 0)
        }
    }

    // 设置当前视频播放进度
    async function setCurrentVideoProgress(postID: string) {
        // 构造请求数据
        const reqData: GetUserPostVideoProgressRequest = {
            post_id: postID,
        }

        // 请求接口
        const res = await getUserPostVideoProgressAPI(reqData)

        // 处理响应
        if (res.data.code === ResponseCode.GetUserPostVideoProgressSuccess) {
            const data: GetUserPostVideoProgressResponse = res.data.data
            // 设置视频集的当前视频和进度
            await setVideoAndProgress(data.last_watch_file_id_hash, data.last_watch_time_at)
        } else {
            // 设置默认视频
            await setDefaultVideoAndProgress()
        }
    }

    // 切换当前视频播放进度
    async function switchVideoProgress(fileIdHash: string) {
        // 构造请求数据
        const reqData: GetUserVideoProgressRequest = {
            file_id_hash: fileIdHash,
        }

        // 请求接口
        const res = await getUserVideoProgressAPI(reqData)

        // 处理响应
        if (res.data.code === ResponseCode.GetUserVideoProgressSuccess) {
            const data: GetUserVideoProgressResponse = res.data.data

            // 设置当前视频和进度
            await setVideoAndProgress(data.file_id_hash, data.last_watch_time_at)
        } else {
            // 设置开始位置
            await setVideoAndProgress(fileIdHash, 0)
        }
    }

    // 上一次记录的播放时间, 用于节流防止频繁更新
    const LastCurrentTime = ref(0)

    const updateProgress = async () => {
        // 如果播放时间小于 5 秒则不处理
        if (state.playProgress.currentTime < 5) {
            return
        }

        // 如果播放时间大于总时间则不处理
        if (state.playProgress.currentTime >= state.playProgress.duration) {
            return
        }

        // 如果距离上次记录的播放时间小于 5 秒则不处理
        if (Math.abs(state.playProgress.currentTime - LastCurrentTime.value) < 5) {
            return
        }

        // 更新上次记录的播放时间
        LastCurrentTime.value = state.playProgress.currentTime

        // 构造请求数据
        const req: UpsertUserPostVideoProgressRequest = {
            post_id: postId.value,
            last_watch_file_id_hash: state.videoID,
            last_watch_time_at: Math.floor(state.playProgress.currentTime),
            progress_percent: Math.floor((state.playProgress.currentTime / state.playProgress.duration) * 100),
        }

        // 请求接口
        const res = await upsertUserPostVideoProgressAPI(req)

        // 更新失败后台打印警告
        if (res.data.code !== ResponseCode.UpsertUserPostVideoProgressSuccess) {
            console.warn("更新用户视频播放进度失败", handleResErr(res))
        }
    }

    const userStore = useUserStore()
    // 当前用户登录则启动定时器, 记录用户观看进度
    if (userStore.isLogin) {
        manager.startTimer(updateProgress)
    }

    return {
        localMapByFileIdHash,
        localMapByOrder,
        localVideoOrders,
        localFileIdHashList,
        videoTotal,
        covertToMap,
        manager,
        state,
        updateVideosIsFree,
        setVideoAndProgress,
        setCurrentVideoProgress,
        switchVideoProgress,
        currentVideoOrder,
    }
}

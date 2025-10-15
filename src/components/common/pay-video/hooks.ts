/*
 * FilePath    : blog-client\src\components\common\pay-video\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : hooks
 */

import { storeToRefs } from "pinia"
import { computed, type Ref, ref } from "vue"

import { type PostVideoTocTree } from "@/api/post/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { getUserPostVideoProgressAPI, type GetUserPostVideoProgressRequest, type GetUserPostVideoProgressResponse } from "@/api/video/getUserPostVideoProgress"
import { getUserVideoProgressAPI, type GetUserVideoProgressRequest, type GetUserVideoProgressResponse } from "@/api/video/getUserVideoProgress"
import { getVideosIsFreeAPI, type GetVideosIsFreeRequest, type GetVideosIsFreeResponse } from "@/api/video/getVideosIsFree"
import { upsertUserPostVideoProgressAPI, type UpsertUserPostVideoProgressRequest } from "@/api/video/upsertUserPostVideoProgress"
import { MediaTypes, PlayerStateManager, type TextWatermark } from "@/components/player"
import { useUserStore } from "@/stores/user"

import type { VideoTocMapByFileIdHash, VideoTocMapByOrder } from "../video-toc-tree-base"
import { useVideoTocTree } from "../video-toc-tree-base"

export function usePayVideo(localTreeList: Ref<PostVideoTocTree[]>, postId: Ref<string>) {
    const userStore = useUserStore()

    const localMapByFileIdHash = ref<VideoTocMapByFileIdHash>({}) // 目录树映射, key 为节点 fileIdHash
    const localMapByOrder = ref<VideoTocMapByOrder>({}) // 目录树映射, key 为节点 videoOrder
    const localVideoOrders = ref<number[]>([]) // 当前目录树中所有视频的 videoOrder 列表
    const localFileIdHashList = ref<string[]>([]) // 当前目录树中所有视频的 fileIdHash 列表
    const currentVideoOrder = ref<number>(0) // 当前视频的集数序号
    const currentTreeId = ref<number>(0) // 当前选中节点的 ID

    // hooks
    const { videoTotal, covertToMap } = useVideoTocTree(localTreeList)

    // 是否显示集数列表
    const isShowEpisode = computed(() => {
        return videoTotal.value > 1
    })

    // 是否显示目录树
    const isShowToc = computed(() => {
        return videoTotal.value > 1
    })

    // 实例化播放器状态管理器
    const manager = new PlayerStateManager()

    // 拿到用户名, 设置文字水印
    const { data: userInfo } = storeToRefs(userStore)
    const textWatermark: TextWatermark = {
        content: userInfo.value?.user.user_name || "jiaopengzi.com",
        style: {
            color: "red",
            fontSize: "12px",
        },
    }
    manager.setTextWatermark(textWatermark)

    // 获取播放器状态
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
        currentTreeId.value = localMapByFileIdHash.value[fileIdHash]?.id || 0

        // 设置播放器状态
        if (video && video.file_id_hash) {
            // 设置封面
            if (video.poster) {
                manager.setPoster(video.poster)
            }

            // 设置视频 ID
            manager.setVideoID(video.file_id_hash)

            // 设置媒体类型
            manager.setMediaType(video.video_type || MediaTypes.HLS)

            // 设置视频源
            if (video.video_src) {
                manager.setSrc(video.video_src)
            }

            //**注意这里需要设置用户输入, 保证进度有效设置**
            manager.setUserInput(true)

            // 设置播放进度
            manager.setCurrentTime(currentTime)

            // 状态设置为暂停播放
            manager.pause()

            // 将错误展示隐藏
            manager.setShowError(false)
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

            // 如果当前视频在当前目录树中则设置, 否则设置默认视频
            if (!localMapByFileIdHash.value[data.last_watch_file_id_hash]) {
                await setDefaultVideoAndProgress()
                return
            }

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

        // 处理响应, 取出上次记录的播放时间
        let startTime = 0
        if (res.data.code === ResponseCode.GetUserVideoProgressSuccess) {
            const data: GetUserVideoProgressResponse = res.data.data
            if (data && data.file_id_hash === fileIdHash) {
                startTime = data.last_watch_time_at
            }
        }

        // 设置当前视频和进度（成功取到则使用记录时间，否则从0开始）
        await setVideoAndProgress(fileIdHash, startTime)
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

    // 当前用户登录则启动定时器, 记录用户观看进度
    if (userStore.isLogin) {
        manager.startTimer(updateProgress)
    }

    // 获取当前视频和进度
    const fetchData = async () => {
        if (!((localTreeList.value && localTreeList.value.length > 0) || !postId.value)) return

        // 转换为 map 结构
        const { mapByFileIdHash, mapByOrder, videoOrders, fileIdHashList } = covertToMap(localTreeList.value)

        // 设置本地数据
        localMapByFileIdHash.value = mapByFileIdHash
        localMapByOrder.value = mapByOrder
        localVideoOrders.value = videoOrders
        localFileIdHashList.value = fileIdHashList

        // 更新视频是否免费
        await updateVideosIsFree()

        // 设置视频和进度
        await setCurrentVideoProgress(postId.value)
    }

    return {
        localMapByFileIdHash,
        localMapByOrder,
        localVideoOrders,
        localFileIdHashList,
        videoTotal,
        covertToMap,
        isShowEpisode,
        isShowToc,
        manager,
        state,
        updateVideosIsFree,
        setVideoAndProgress,
        setCurrentVideoProgress,
        switchVideoProgress,
        currentVideoOrder,
        currentTreeId,
        fetchData,
    }
}

/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-08 20:13:30
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-08 23:29:07
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\imgupload.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { EditorView } from '@codemirror/view'
import type { Extension } from '@codemirror/state'
import { uploadAvatar } from '@/api/utils/uploadAvatar'
import { ShowMsgTip } from '@/utils/message'
import { useUserStore } from '@/stores/user'
import { UploadCode } from '@/api/responseCode'

// 自定义键盘事件
const handlePasteImage: Extension = EditorView.domEventHandlers({
  paste: (event, view) => {
    if (!event.clipboardData || !event.clipboardData.items) return
    // 获取剪切板中的图片文件
    let file = null
    for (const item of event.clipboardData.items) {
      if (item.type.indexOf('image') === 0) {
        file = item.getAsFile()
        break
      }
    }

    // 没有找到图片，则不处理
    if (!file) return
    console.log('图片上传开始', new Date().toISOString())
    uploadImage(file, view)
    // 上传图片并插入编辑器

    // 阻止默认事件
    return true
  },
})

async function uploadImage(file: any, view: EditorView) {
  const formData = new FormData()
  formData.append('avatar', file, 'avatar.png')
  const userStore = useUserStore()
  // 调用 uploadAvatar 函数
  uploadAvatar(formData)
    .then((response) => {
      if (response.data.code === UploadCode.AvatarSuccess) {
        // 处理返回数据，并更新头像等信息
        console.log('图片上传成功', new Date().toISOString())
        const imageUrl = response.data.data
        userStore.getUserInfoByToken(true) // 强制更新用户信息
        const imageMarkdown = `![description](${imageUrl})\n`
        console.log('开始更新state', new Date().toISOString())
        view.dispatch({
          changes: { from: view.state.selection.main.from, insert: imageMarkdown },
        })
        // 将光标移动指定位置 cursorPosMove 处 更新状态
        console.log('更新完毕state', new Date().toISOString())
        ShowMsgTip(ShowMsgTip.MsgType.success, response.data.msg, 2000)
      } else {
        ShowMsgTip(ShowMsgTip.MsgType.error, response.data.msg)
      }
    })
    .catch(() => {
      ShowMsgTip(ShowMsgTip.MsgType.error, '上传失败，请重试')
    })
}

// 自定义键盘事件
const handleDropImage: Extension = EditorView.domEventHandlers({
  drop: (event, view) => {
    if (!event.dataTransfer || !event.dataTransfer.items) return

    // 获取拖拽的图片文件
    let file = null
    for (const item of event.dataTransfer.items) {
      if (item.kind === 'file' && item.type.indexOf('image') === 0) {
        file = item.getAsFile()
        break
      }
    }

    // 没有找到图片，则使用默认拖拽行为
    if (!file) return

    // 阻止默认事件以处理图片上传
    event.preventDefault()
    console.log('图片上传开始', new Date().toISOString())
    uploadImage(file, view)

    return true
  },
})

export { handlePasteImage, handleDropImage }

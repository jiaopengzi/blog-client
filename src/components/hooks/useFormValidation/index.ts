/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-16 15:53:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-16 21:58:49
 * @FilePath     : \blog-client\src\components\hooks\useFormValidation\index.ts
 * @Description  : 用户表单校验
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// useFormValidation.ts
import { type Ref } from 'vue'
import type { CheckUserNameRequest } from '@/api/user/checkUserName'
import { checkUserNameByJosn } from '@/api/user/checkUserName'
import type { CheckEmailRequest } from '@/api/user/checkEmail'
import { CheckEmailByJosn } from '@/api/user/checkEmail'
import type { CaptchaSendRequest } from '@/api/captcha/send'
import { captchaSendByJosn } from '@/api/captcha/send'
import { getPublicIp } from '@/utils/ip'
import type { CaptchaCheckRequest } from '@/api/captcha/check'
import { captchaCheckByJosn } from '@/api/captcha/check'
import { ResponseCode, CaptchaPurpose } from '@/api/responseCode'

interface FormValidationOptions {
  FormUserName?: Ref<string>
  FormEmail?: Ref<string>
  FormCaptcha?: Ref<string>
  FormPassword?: Ref<string>
  FormRePassword?: Ref<string>
  FormAcceptedTerms?: Ref<boolean>
}

export function useFormValidation(options: FormValidationOptions = {}) {
  const {
    FormUserName = '',
    FormEmail = '',
    FormCaptcha = '',
    FormPassword = '',
    FormRePassword = '',
    FormAcceptedTerms = false,
  } = options

  /**
   * @description:校验确认密码是否与密码一致
   * @param password 密码
   * @param rePassword 确认密码
   * @return  void
   */
  async function checkRePassword(password: string, rePassword: string): Promise<void> {
    try {
      if (rePassword === '') {
        throw new Error('请再次输入密码')
      } else if (rePassword !== password) {
        throw new Error('两次输入的密码不一致')
      }
    } catch (err: unknown) {
      console.log(err)
      throw err
    }
  }

  /**
   * @description: 确认密码 Validator
   * @return  void
   */
  function rePasswordValidator(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
  ): void {
    // 在这里处理异步验证逻辑

    const formPassword = options.FormPassword?.value || ''
    const formRePassword = options.FormRePassword?.value || ''

    if (FormPassword === undefined) {
      callback('请输入密码')
      return
    }
    if (FormRePassword === undefined) {
      callback('请输入确认密码')
      return
    }
    checkRePassword(formPassword, formRePassword)
      .then(() => {
        callback() // 校验成功
      })
      .catch((err: Error) => {
        callback(err.message)
      })
  }

  /**
   * @description: 检查是否同意服务条款
   */
  async function checkAcceptedTerms(acceptedTerms: boolean): Promise<void> {
    try {
      if (acceptedTerms === false) {
        throw new Error('请勾选同意服务条款')
      }
    } catch (err: unknown) {
      console.log(err)
      throw err
    }
  }

  /**
   * @description: 是否同意 Validator
   * @return  void
   */
  function acceptedTermsValidator(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
  ): void {
    if (FormAcceptedTerms === undefined) {
      callback('请勾选同意服务条款')
      return
    }
    const formAcceptedTerms = options.FormAcceptedTerms?.value || false
    checkAcceptedTerms(formAcceptedTerms)
      .then(() => {
        callback() // 校验成功
      })
      .catch((err: Error) => {
        callback(err.message)
      })
  }

  /**
   * @description: 验证码发送 异步函数
   * @return Promise<void> 验证码错误返回 Promise.reject()，否则返回 Promise.resolve()
   */
  async function checkSendCaptcha(email: string): Promise<void> {
    try {
      // 创建请求对象 加密内容
      const req: CaptchaSendRequest = {
        email: email,
        ip: await getPublicIp(),
        purpose: CaptchaPurpose.Register,
      }
      console.log('==========>发送验证码')

      const { data } = await captchaSendByJosn(req) // 将 resStr 转换为对象

      if (data.code !== ResponseCode.CaptchaSendSuccess && data.data !== null) {
        // 历遍 data 中的错误信息 并抛出第一个key错误信息 停止循环
        for (const key in data.data) {
          if (Object.prototype.hasOwnProperty.call(data.data, key)) {
            throw new Error(data.data[key]) // 抛出错误信息
          }
        }
      }
      if (data.code !== ResponseCode.CaptchaSendSuccess && data.data === null) {
        throw new Error(data.msg) // 抛出错误信息
      }
    } catch (err: unknown) {
      console.log(err)
      throw err
    }
  }

  /**
   * @description: 用户名查重 异步函数
   * @return  Promise<void> 用户名存在返回 Promise.reject()，否则返回 Promise.resolve()
   */
  async function checkUserName(userName: string): Promise<void> {
    try {
      // 创建请求对象 加密内容
      const req: CheckUserNameRequest = {
        user_name: userName,
      }

      const { data } = await checkUserNameByJosn(req)

      if (data.code === ResponseCode.UserNameExist) {
        throw new Error(data.msg)
      }
    } catch (err: unknown) {
      console.log(err)
      throw err
    }
  }

  /**
   * @description: 用户名查重 Validator
   * @param rule 无用参数
   * @param value 无用参数
   * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
   */
  function checkUserNameValidator(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
  ): void {
    // 在这里处理异步验证逻辑
    if (FormUserName === undefined) {
      callback('请输入用户名')
      return
    }
    const formUserName = options.FormUserName?.value || ''
    checkUserName(formUserName)
      .then(() => {
        callback() // 校验成功
      })
      .catch((err: Error) => {
        callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
      })
  }

  /**
   * @description: 邮箱查重 异步函数
   * @return
   */
  async function checkEmail(eamil: string): Promise<void> {
    // 创建请求对象 加密内容
    const req: CheckEmailRequest = {
      email: eamil,
    }

    try {
      const { data } = await CheckEmailByJosn(req)

      if (data.code === ResponseCode.UserEmailExist) {
        throw new Error(data.msg)
      }
    } catch (err: unknown) {
      console.log(err)
      throw err
    }
  }

  /**
   * @description: 用户名查重 Validator
   * @param rule 无用参数
   * @param value 无用参数
   * @param callback 回调函数，如果用户名存在，则传入错误提示字符串
   */
  function checkEmailValidator(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
  ): void {
    // 在这里处理异步验证逻辑
    if (FormEmail === undefined) {
      callback('请输入邮箱')
      return
    }
    const formEmail = options.FormEmail?.value || ''
    checkEmail(formEmail)
      .then(() => {
        callback() // 校验成功
      })
      .catch((err: Error) => {
        callback(err.message) // 如果失败（邮箱已经存在），则传入错误提示字符串
      })
  }

  // 验证码校验 异步函数
  async function checkCaptcha(eamil: string, captcha: string): Promise<void> {
    try {
      // 创建请求对象 加密内容
      const req: CaptchaCheckRequest = {
        ip: await getPublicIp(),
        email: eamil,
        captcha: captcha,
        purpose: CaptchaPurpose.Register,
      }
      const { data } = await captchaCheckByJosn(req)

      if (data.code !== ResponseCode.CaptchaCheckSuccess) {
        throw new Error(data.msg)
      }
    } catch (err: unknown) {
      console.log(err)
      throw err
    }
  }

  // 校验验证码 Validator
  function checkCaptchaValidator(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
  ): void {
    // 在这里处理异步验证逻辑
    if (FormEmail === undefined) {
      callback('请输入邮箱')
      return
    }
    if (FormCaptcha === undefined) {
      callback('请输入验证码')
      return
    }

    const formEmail = options.FormEmail?.value || ''
    const formCaptcha = options.FormCaptcha?.value || ''
    checkCaptcha(formEmail, formCaptcha)
      .then(() => {
        callback() // 校验成功
      })
      .catch((err: Error) => {
        callback(err.message) // 如果失败（用户名已经存在），则传入错误提示字符串
      })
  }

  return {
    checkUserName,
    checkUserNameValidator,
    checkEmail,
    checkEmailValidator,
    checkCaptcha,
    checkCaptchaValidator,
    checkSendCaptcha,
    checkRePassword,
    rePasswordValidator,
    checkAcceptedTerms,
    acceptedTermsValidator,
  }
}

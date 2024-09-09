/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-09 17:27:31
 * @FilePath     : \blog-client\src\utils\encrypt.ts
 * @Description  : 加密解密工具类
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// 1.安装库：npm install crypto-js --save
// 2.安装类型声明文件： npm install @types/crypto-js --save-dev

import CryptoJS from 'crypto-js'

const keyStrBase = import.meta.env.VITE_APP_SECRET_KEY
const ivStrBase = import.meta.env.VITE_APP_SECRET_IV

/**
 * @description: 加密函数
 * @param plainText 明文
 * @param keyStr 密钥
 * @param ivStr 偏移量
 * @return 密文
 */
export function encryptData(
  plainText: string,
  keyStr: string = keyStrBase,
  ivStr: string = ivStrBase,
): string {
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const iv = CryptoJS.enc.Utf8.parse(ivStr)

  const encryptedData = CryptoJS.AES.encrypt(plainText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  return CryptoJS.enc.Base64.stringify(encryptedData.ciphertext)
}

/**
 * @description: 解密函数
 * @param encryptedData 密文
 * @param keyStr 密钥
 * @param ivStr 偏移量
 * @return  明文
 */
export function decryptData(
  encryptedData: string,
  keyStr: string = keyStrBase,
  ivStr: string = ivStrBase,
): string {
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const iv = CryptoJS.enc.Utf8.parse(ivStr)

  const ciphertext = CryptoJS.enc.Base64.parse(encryptedData)
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertext,
  })

  const decryptedData = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  return decryptedData.toString(CryptoJS.enc.Utf8)
}

/**
 * @description: 字符串反转
 * @param str 源字符串
 * @return  反转后的字符串
 */
export function reverseString(str: string): string {
  return str.split('').reverse().join('')
}

export function playKeyDecryptAES2Bin(playKeyEncrypt: string): Uint8Array {
  // 获取 playKeyEncrypt 字符长度
  const playKeyEncryptLen = playKeyEncrypt.length

  // 获取 playKeyKey 从 playKeyEncryptAES2Base64 中从左至右截取 32 长度的字符串并逆序排列
  const playKeyKey = reverseString(playKeyEncrypt.substr(0, 32))

  // 获取 iv 从 playKeyEncryptAES2Base64 中从右至左截取 16 长度的字符串,并逆序排列
  const iv = reverseString(playKeyEncrypt.substr(playKeyEncryptLen - 16, 16))

  // 获取 encryptedPlayKeyBase64 从 playKeyEncrypt 中从 32 开始到 l-16 的字符串
  const encryptedPlayKeyBase64 = playKeyEncrypt.substr(32, playKeyEncryptLen - 32 - 16)

  // 使用 AES 解密算法用 encryptKey 解密 playKey 生成解密后的密钥 encryptPlayKey 16进制字符串
  const encryptPlayKey = decryptData(encryptedPlayKeyBase64, playKeyKey, iv)

  // 将 encryptPlayKey 转换为 ArrayBuffer 类型
  const playKeyDecryptBin = new Uint8Array(
    encryptPlayKey.match(/[\da-f]{2}/gi)!.map(function (h) {
      return parseInt(h, 16)
    }),
  )
  return playKeyDecryptBin
}

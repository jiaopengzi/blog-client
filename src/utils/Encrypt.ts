/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-04 20:52:27
 * @FilePath     : \blog-client\src\utils\Encrypt.ts
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
  ivStr: string = ivStrBase
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
  ivStr: string = ivStrBase
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

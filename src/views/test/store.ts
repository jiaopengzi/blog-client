/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-14 18:51:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-14 18:51:31
 * @FilePath     : \blog-client\src\views\test\store.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
// store.ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    drmChallenge: null as ArrayBuffer | null,
    license: null as ArrayBuffer | null,
  }),
  actions: {
    setDrmChallenge(challenge: ArrayBuffer) {
      this.drmChallenge = challenge
    },
    setLicense(license: ArrayBuffer) {
      this.license = license
    },
  },
})

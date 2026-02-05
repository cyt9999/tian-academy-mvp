import { reactive, ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Oidc from 'oidc-client'
import config from '@/plugins/oidc/config'

const initManager = () => {
  Oidc.Log.logger = console
  // 設定 => DEBUG 可以看記錄情況 , NONE 不印出任何 DEBUG 訊息
  Oidc.Log.level = Oidc.Log.NONE

  return new Oidc.UserManager(config)
}

export default defineStore('token', () => {
  const tokens = reactive({})
  const manager = ref(null)
  const getManager = computed(() => manager.value)
  const getUserTokens = computed(() => manager.value?.getUser())

  function updateToken(newTokens) {
    Object.assign(tokens, newTokens)
  }

  function initialOidc() {
    const oidcManager = initManager()

    // Set up event handlers
    // oidc-client refresh_token => get latest tokens
    oidcManager.events.addUserLoaded(async (response) => {
      const userRenewTokens = {
        at: response.access_token,
        idt: response.id_token,
        rt: response.refresh_token,
      }
      Object.assign(tokens, userRenewTokens)
    })

    const handleSilentRenewError = () => {
      oidcManager.removeUser()
      oidcManager.signinSilent()
    }

    // oidc-client 登出事件處理
    oidcManager.events.addUserSignedOut(() => {
      oidcManager
        .removeUser()
        .then(() =>
          oidcManager.signinSilent().then(() => console.log('new idp user')),
        )
    })

    // oidc-client access_token 過期 則 先嘗試刷新 token
    oidcManager.events.addAccessTokenExpired(() => {
      oidcManager.signinSilent().catch(() => {
        handleSilentRenewError()
      })
    })

    // oidc-client 刷新token錯誤事件處理
    oidcManager.events.addSilentRenewError(() => {
      handleSilentRenewError()
    })

    manager.value = oidcManager
  }

  // 清除不完整授權的請求
  function clearIncompleteAuthorize() {
    getManager.value.clearStaleState()
  }

  // 登入轉導至統一登入頁面
  function loginRedirectUnityPage() {
    // 先刪除使用者紀錄，防止有重複使用者紀錄的可能
    getManager.value.removeUser()
    getManager.value.signinRedirect()
  }

  // 登入後授權回來換使用者的token
  async function loginRedirectCallback() {
    const res = await getManager.value.signinRedirectCallback()
    const { access_token: at, id_token: idt, refresh_token: rt } = res

    updateToken({ at, idt, rt })
  }

  // 登入後授權回來換使用者的token
  async function idpRefreshCallback() {
    getManager.value.signinSilentCallback()
  }

  // 登出轉導至統一登入頁面
  function logoutRedirectUnityPage() {
    localStorage.removeItem('cmToken')
    getManager.value.signoutRedirect()
  }

  // 刪除local端登入的使用者
  function removeLocalUser() {
    getManager.value.removeUser()
  }

  // 確認IDP是否為登入狀態
  async function checkIDPIsLogin() {
    const mgr = getManager.value
    mgr.signinSilent().catch((err) => {
      console.log(err)
    })
  }

  return {
    tokens,
    manager,
    getManager,
    getUserTokens,
    updateToken,
    initialOidc,
    clearIncompleteAuthorize,
    loginRedirectUnityPage,
    loginRedirectCallback,
    idpRefreshCallback,
    logoutRedirectUnityPage,
    removeLocalUser,
    checkIDPIsLogin,
  }
})

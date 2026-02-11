import { jwtDecode } from 'jwt-decode'
import useTokenStore from '@/stores/token'

export default async () => {
  const tokenStore = useTokenStore()

  // 先清除在localStorage中不完整授權的請求
  tokenStore.clearIncompleteAuthorize()
  // 取得local端的使用者
  const userData = await tokenStore.getUserTokens

  // local端有使用者的話 & 現在時間在有效時間內的話
  if (userData) {
    // 到期時間
    const expTime = jwtDecode(userData.access_token).exp * 1000

    if (Date.now() <= expTime) {
      const userToken = {
        at: userData.access_token,
        idt: userData.id_token,
        rt: userData.refresh_token,
      }
      tokenStore.updateToken(userToken)
      localStorage.setItem(
        `${import.meta.env.VITE_CLIENT_ID}-token`,
        userToken.at,
      )
    }
  } else {
    // 刪除使用者紀錄，防止有重複使用者紀錄的可能
    tokenStore.removeLocalUser()
    // 跳轉統一登入頁登入
    tokenStore.loginRedirectUnityPage()
  }
}

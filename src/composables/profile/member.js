import { reactive } from 'vue'
import api from '@/plugins/axios'

const authHost = import.meta.env.VITE_AUTH_HOST

const state = reactive({
  data: null,
  hasLoading: false,
  error: null,
})

async function setInit() {
  if (state.hasLoading) return

  state.hasLoading = true
  state.error = null

  const fields =
    '{ email isBindingCellphone pCoin nickname signupDate signupUnixTimeMs bio contactEmail image levelInfo{exp level levelExp levelExpToNext} badges{badgeId isEquipped hasRead achievedCount}}'

  try {
    const res = await api.POST(`${authHost}/Profile/graphql/query/member`, {
      fields,
    })

    state.data = res
  } catch (err) {
    state.error = '失敗: 使用者個人資訊'
    state.data = null
  } finally {
    state.hasLoading = false
  }
}

export default {
  state,
  setInit,
}

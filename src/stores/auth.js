import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export default defineStore('auth', () => {
  const isLogin = ref(false)
  const getIsLogin = computed(() => isLogin.value)

  function setLoginState(val) {
    isLogin.value = val
  }

  return {
    getIsLogin,
    setLoginState,
  }
})

<script setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useTokenStore from '@/stores/token'
import useAuthStore from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const tokenStore = useTokenStore()
const authStore = useAuthStore()

onBeforeMount(async () => {
  const isLoginReturn =
    route.query.code && route.query.state && route.query.session_state

  if (!isLoginReturn) return

  await tokenStore.loginRedirectCallback()
  const userData = await tokenStore.getUserTokens

  localStorage.setItem('cmToken', userData.access_token)

  if (userData) {
    authStore.setLoginState(true)
    router.push('/')
  }
})
</script>

<template>
  <div>登入，轉導中...</div>
</template>

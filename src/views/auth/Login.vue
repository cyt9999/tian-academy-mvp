<script setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useTokenStore from '@/stores/token'

const route = useRoute()
const router = useRouter()
const tokenStore = useTokenStore()

onBeforeMount(async () => {
  const isLoginReturn =
    route.query.code && route.query.state && route.query.session_state

  if (!isLoginReturn) return

  await tokenStore.loginRedirectCallback()
  const userData = await tokenStore.getUserTokens

  localStorage.setItem('cmToken', userData.access_token)

  if (userData) {
    router.push('/')
  }
})
</script>

<template>
  <div>登入，轉導中...</div>
</template>

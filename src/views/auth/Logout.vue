<script setup>
import { onBeforeMount } from 'vue'
import useTokenStore from '@/stores/token'
import useAuthStore from '@/stores/auth'

const tokenStore = useTokenStore()
const authStore = useAuthStore()

onBeforeMount(() => {
  tokenStore.logoutRedirectUnityPage()
  authStore.setLoginState(false)
})
</script>

<template>
  <div>登出，轉導中...</div>
</template>

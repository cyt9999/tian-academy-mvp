<script setup>
import { onBeforeMount } from 'vue'
import useTokenStore from '@/stores/token'

const tokenStore = useTokenStore()
onBeforeMount(() => {
  tokenStore.logoutRedirectUnityPage()
})
</script>

<template>
  <div class="flex justify-center items-center h-screen">登出，轉導中...</div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import useTokenStore from '@/stores/token'

const tokenStore = useTokenStore()

onBeforeMount(async () => {
  await tokenStore.idpRefreshCallback()
})
</script>

<template>
  <div class="flex justify-center items-center h-screen">更新，轉導中...</div>
</template>

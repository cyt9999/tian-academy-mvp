<script setup>
import { watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import useProfileMember from '@/composables/profile/member'
import useAuthStore from '@/stores/auth'

const authStore = useAuthStore()
const { state, setInit } = useProfileMember

watch(
  () => authStore.getIsLogin,
  async (status) => {
    if (status) {
      await setInit()
    }
  },
)
</script>

<template>
  <div v-if="state.error" class="text-rose-400 text-xs">{{ state.error }}</div>
  <Loader2
    v-else-if="state.hasLoading"
    class="animate-spin text-slate-400"
    :size="20"
  />
  <template v-else-if="state.data">
    <span class="text-sm text-slate-300 hidden lg:inline">{{ state.data?.nickname }}</span>
    <img
      :src="state.data?.image"
      :alt="state.data?.nickname"
      class="w-8 h-8 rounded-full border border-slate-700 hover:border-emerald-500 transition-all object-cover"
    />
    <router-link
      to="/logout"
      class="text-xs text-slate-500 hover:text-rose-400 transition-colors"
    >登出</router-link>
  </template>
</template>

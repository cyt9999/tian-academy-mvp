<script setup>
import { watch } from 'vue'
import { Loader2, Mail, Calendar, User } from 'lucide-vue-next'
import useProfileMember from '@/composables/profile/member'
import useAuthStore from '@/stores/auth'

const authStore = useAuthStore()
const { state, setInit } = useProfileMember

// Trigger fetch if already logged in (profile may already be loaded by UserInfo)
if (authStore.getIsLogin && !state.data && !state.hasLoading) {
  setInit()
}

// Also watch for login state changes
watch(
  () => authStore.getIsLogin,
  (status) => {
    if (status && !state.data && !state.hasLoading) {
      setInit()
    }
  },
)
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-black tracking-tight mb-6">個人檔案</h1>

    <div v-if="state.error" class="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
      {{ state.error }}
    </div>

    <div v-else-if="state.hasLoading" class="flex items-center justify-center py-20">
      <Loader2 class="animate-spin text-slate-400" :size="32" />
    </div>

    <div v-else-if="state.data" class="space-y-6">
      <!-- Avatar + Name -->
      <div class="flex items-center space-x-5 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
        <img
          v-if="state.data.image"
          :src="state.data.image"
          :alt="state.data.nickname"
          class="w-20 h-20 rounded-full border-2 border-slate-700 object-cover"
        />
        <div v-else class="w-20 h-20 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center">
          <User :size="32" class="text-slate-500" />
        </div>
        <div>
          <h2 class="text-xl font-bold">{{ state.data.nickname }}</h2>
          <p v-if="state.data.bio" class="text-sm text-slate-400 mt-1">{{ state.data.bio }}</p>
        </div>
      </div>

      <!-- Info Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <div class="flex items-center space-x-2 text-slate-500 mb-1">
            <Mail :size="14" />
            <span class="text-xs font-bold uppercase tracking-wider">Email</span>
          </div>
          <p class="text-sm text-slate-300">{{ state.data.email || '未設定' }}</p>
        </div>

        <div class="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <div class="flex items-center space-x-2 text-slate-500 mb-1">
            <Calendar :size="14" />
            <span class="text-xs font-bold uppercase tracking-wider">註冊日期</span>
          </div>
          <p class="text-sm text-slate-300">{{ state.data.signupDate || '未知' }}</p>
        </div>
      </div>

      <!-- Level Info -->
      <div v-if="state.data.levelInfo" class="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">等級資訊</p>
        <div class="flex items-center space-x-4">
          <span class="text-2xl font-black text-emerald-400">Lv.{{ state.data.levelInfo.level }}</span>
          <div class="flex-1">
            <div class="flex justify-between text-xs text-slate-400 mb-1">
              <span>EXP {{ state.data.levelInfo.levelExp }}</span>
              <span>{{ state.data.levelInfo.levelExpToNext }} to next</span>
            </div>
            <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all"
                :style="{ width: state.data.levelInfo.levelExpToNext > 0 ? (state.data.levelInfo.levelExp / (state.data.levelInfo.levelExp + state.data.levelInfo.levelExpToNext) * 100) + '%' : '100%' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

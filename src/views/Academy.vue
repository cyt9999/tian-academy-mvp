<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Video, Radio, Database, Archive, ShieldAlert } from 'lucide-vue-next'

const route = useRoute()

const isLessonDetail = computed(() => route.path.includes('/academy/lesson/'))

const currentTab = computed(() => {
  const parts = route.path.split('/')
  return parts[parts.length - 1] || 'lessons'
})

const tabs = [
  { id: 'lessons', label: '課程影片', icon: 'Video', path: '/academy' },
  { id: 'live', label: '線上直播', icon: 'Radio', path: '/academy/live' },
  { id: 'knowledge', label: '天哥知識庫', icon: 'Database', path: '/academy/knowledge' },
  { id: 'resources', label: '相關資源', icon: 'Archive', path: '/academy/resources' },
]

const isTabActive = (tab: typeof tabs[0]) => {
  if (tab.id === 'lessons' && (route.path === '/academy' || route.path === '/academy/')) return true
  return currentTab.value === tab.id
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6 animate-up">
    <!-- Only show header if NOT in lesson detail -->
    <header
      v-if="!isLessonDetail"
      class="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-xl backdrop-blur-md"
    >
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight">智慧教學中心</h1>
        <p class="text-sm text-slate-400">系統化、圖卡化，天哥帶你一步步建立複利思維。</p>
      </div>

      <div class="flex bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl w-full lg:w-auto overflow-x-auto shadow-inner">
        <router-link
          v-for="tab in tabs"
          :key="tab.id"
          :to="tab.path"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap',
            isTabActive(tab)
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'text-slate-500 hover:text-slate-300'
          ]"
        >
          <Video v-if="tab.icon === 'Video'" :size="18" />
          <Radio v-if="tab.icon === 'Radio'" :size="18" />
          <Database v-if="tab.icon === 'Database'" :size="18" />
          <Archive v-if="tab.icon === 'Archive'" :size="18" />
          {{ tab.label }}
        </router-link>
      </div>
    </header>

    <div class="min-h-[500px]">
      <router-view />
    </div>

    <div
      v-if="!isLessonDetail"
      class="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-center gap-3 text-amber-500/80"
    >
      <ShieldAlert :size="18" class="flex-shrink-0" />
      <p class="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
        版權聲明：本學院所有影音內容僅供付費學員學習使用，嚴禁私自錄屏傳播，違者必究。
      </p>
    </div>
  </div>
</template>

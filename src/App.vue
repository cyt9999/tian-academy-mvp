<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  PiggyBank,
  Library,
  BookMarked,
  Bot
} from 'lucide-vue-next'
import SidebarLink from './components/SidebarLink.vue'
import Navbar from './components/Navbar.vue'
import MobileNav from './components/MobileNav.vue'
import FloatingAI from './components/FloatingAI.vue'

const route = useRoute()
const isCollapsed = ref(false)

// Auto-collapse sidebar when viewing a lesson
watch(() => route.path, (currentPath) => {
  const isLessonDetail = currentPath.includes('/academy/lesson/')
  if (isLessonDetail && !isCollapsed.value) {
    isCollapsed.value = true
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
    <!-- Desktop Sidebar -->
    <aside
      :class="[
        'hidden md:flex flex-col h-screen border-r border-slate-800 bg-slate-950 sticky top-0 transition-all duration-500 ease-in-out flex-shrink-0 z-40',
        isCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      <div class="p-4 h-full flex flex-col">
        <div class="mt-8 space-y-1">
          <SidebarLink to="/" label="首頁儀表板" :active="route.path === '/'" :collapsed="isCollapsed">
            <template #icon><LayoutDashboard :size="20" /></template>
          </SidebarLink>
          <SidebarLink to="/academy" label="複利學院" :active="route.path.startsWith('/academy')" :collapsed="isCollapsed">
            <template #icon><BookOpen :size="20" /></template>
          </SidebarLink>
          <SidebarLink to="/lab" label="策略實驗室" :active="route.path === '/lab'" :collapsed="isCollapsed">
            <template #icon><FlaskConical :size="20" /></template>
          </SidebarLink>
          <SidebarLink to="/calculator" label="退休計算機" :active="route.path === '/calculator'" :collapsed="isCollapsed">
            <template #icon><PiggyBank :size="20" /></template>
          </SidebarLink>
          <SidebarLink to="/strategies" label="策略圖書館" :active="route.path === '/strategies'" :collapsed="isCollapsed">
            <template #icon><Library :size="20" /></template>
          </SidebarLink>
          <SidebarLink to="/glossary" label="期權辭典" :active="route.path === '/glossary'" :collapsed="isCollapsed">
            <template #icon><BookMarked :size="20" /></template>
          </SidebarLink>
          <SidebarLink to="/assignments" label="實戰與作業" :active="route.path === '/assignments'" :collapsed="isCollapsed">
            <template #icon><ClipboardCheck :size="20" /></template>
          </SidebarLink>
          <SidebarLink to="/ai" label="天哥AI" :active="route.path === '/ai'" :collapsed="isCollapsed">
            <template #icon><Bot :size="20" /></template>
          </SidebarLink>
        </div>

        <div class="mt-auto space-y-4">
          <div v-if="!isCollapsed" class="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
            <p class="text-[10px] text-slate-500 leading-relaxed uppercase tracking-[0.2em] font-black mb-1">教育模式</p>
            <p class="text-[10px] text-slate-600 font-medium">非即時報價，僅供模擬教學使用。請遵守天哥複利心法。</p>
          </div>

          <button
            @click="isCollapsed = !isCollapsed"
            class="w-full flex items-center justify-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500 hover:text-white hover:border-slate-600 transition-all group"
          >
            <ChevronRight v-if="isCollapsed" :size="18" class="group-hover:scale-110" />
            <ChevronLeft v-else :size="18" class="group-hover:scale-110" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 relative">
      <Navbar />
      <main class="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-12 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent)]">
        <router-view />
      </main>
      <FloatingAI />
      <MobileNav />
    </div>
  </div>
</template>

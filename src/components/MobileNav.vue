<script setup lang="ts">
import { useRoute } from 'vue-router'
import { LayoutDashboard, BookOpen, FlaskConical, PiggyBank, ClipboardCheck, Bot, User } from 'lucide-vue-next'
import MobileNavLink from './MobileNavLink.vue'

const route = useRoute()
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 px-2 py-1 pb-safe flex items-center justify-around z-50">
    <MobileNavLink to="/" label="儀表板" :active="route.path === '/'">
      <template #icon><LayoutDashboard :size="20" /></template>
    </MobileNavLink>
    <MobileNavLink to="/academy" label="學院" :active="route.path.startsWith('/academy')">
      <template #icon><BookOpen :size="20" /></template>
    </MobileNavLink>
    <MobileNavLink to="/lab" label="實驗室" :active="route.path === '/lab'">
      <template #icon><FlaskConical :size="20" /></template>
    </MobileNavLink>
    <MobileNavLink to="/calculator" label="計算機" :active="route.path === '/calculator'">
      <template #icon><PiggyBank :size="20" /></template>
    </MobileNavLink>
    <MobileNavLink to="/assignments" label="作業" :active="route.path === '/assignments'">
      <template #icon><ClipboardCheck :size="20" /></template>
    </MobileNavLink>
    <MobileNavLink to="/ai" label="AI" :active="route.path === '/ai'">
      <template #icon><Bot :size="20" /></template>
    </MobileNavLink>
    <MobileNavLink to="/profile" label="檔案" :active="route.path === '/profile'">
      <template #icon><User :size="20" /></template>
    </MobileNavLink>
  </nav>
</template>

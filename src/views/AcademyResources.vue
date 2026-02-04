<script setup lang="ts">
import { Archive } from 'lucide-vue-next'

const resources = ['Delta 概率對照表.pdf', '新手 CSP 紀錄表.xlsx', '複利成長追蹤器.app', '倉位計算工具.exe']
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-for="(item, i) in resources"
      :key="i"
      class="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg"
    >
      <span class="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{{ item }}</span>
      <Archive :size="18" class="text-slate-600 group-hover:text-emerald-500" />
    </div>
  </div>
</template>

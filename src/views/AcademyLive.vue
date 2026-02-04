<script setup lang="ts">
import { Radio } from 'lucide-vue-next'
</script>

<template>
  <div class="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-500 shadow-2xl">
    <div class="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
      <Radio :size="40" class="text-rose-500 animate-pulse" />
    </div>
    <h2 class="text-lg font-bold text-slate-300">目前 YouTube 頻道暫無直播</h2>
    <p class="text-sm mt-2 max-w-sm mx-auto leading-relaxed">請留意 YouTube 訂閱通知與 Discord 頻道快訊。天哥通常在美股開盤前後進行實戰解析。</p>
    <button class="mt-8 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all">前往天哥 YouTube 頻道</button>
  </div>
</template>
